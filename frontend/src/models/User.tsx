import { JwtCookie } from "@/types/JwtCookie";
import { User as UserType } from "@/types/User";
import axios, { AxiosError } from "axios";
import { Config } from "@/types/Config";

export class User implements UserType {
  isAuthenticated = false;
  name = "";
  baseUrl = axios.defaults.baseURL;
  config: Config = {
    headers: {
      Authorization: "",
    },
  };
  login = () => {
    this.isAuthenticated = true;
  };
  logout = () => {
    this.isAuthenticated = false;
  };
  setUsername = (username: string) => {
    this.name = username;
  };
  constructor(name: string = "") {
    this.name = name;
    this.isAuthenticated = false;
  }

  private static sanitizeAndValidateInput = (email: string | null, password: string | null) => {
    if (!email || !password) {
      throw new Error("Email and password are required fields.");
    }
    const sanitizedEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedEmail)) {
      throw new Error("Invalid email format.");
    }
    const sanitizedPassword = password.trim();
    const minPasswordLength = 8;
    if (sanitizedPassword.length < minPasswordLength) {
      throw new Error(`Password must be at least ${minPasswordLength} characters long.`);
    }
    return {
      sanitizedEmail: sanitizedEmail,
      sanitizedPassword: sanitizedPassword,
    };
  };

  public getAndSaveGuestToken = async (): Promise<JwtCookie | null> => {
    try {
      const res = await axios.get(this.baseUrl + "/krsp/user/get_token/");
      sessionStorage.setItem("guest_info", JSON.stringify(res.data));
      return res.data;
    } catch (err) {
      throw new Error("Error getting guest token.");
    }
  };

  public getCookieJson = (): JwtCookie => {
    const sessionCookie: string | null = sessionStorage.getItem("guest_info");
    const localCookie: string | null = localStorage.getItem("user_info");
    if (localCookie !== null) {
      return JSON.parse(localCookie);
    }

    if (sessionCookie !== null) {
      return JSON.parse(sessionCookie);
    }
    throw new Error("COOKIE NOT FOUND");
  };

  public verifyToken = async (): Promise<boolean> => {
    try {
      let jwt_cookie: JwtCookie | null = this.getCookieJson();
      if (!jwt_cookie) {
        return false;
      }
      this.config = {
        headers: {
          Authorization: `Bearer ${jwt_cookie.jwt}`,
        },
      };
      const res = await axios.post(this.baseUrl + "/krsp/user/verify_token/", {}, this.config);
      if (res.status === 200) {
        return true;
      }
      return false;
    } catch (error: any) {
      return false;
    }
  };

  public loginRequest = async (email: string | null, password: string | null): Promise<string> => {
    const isAuthorized: boolean = await this.verifyToken();
    if (!isAuthorized) {
      const cookie: JwtCookie | null = await this.getAndSaveGuestToken();
      this.config = {
        headers: {
          Authorization: `Bearer ${cookie !== null ? cookie.jwt : ""}`,
        },
      };
    } else {
      const cookie: JwtCookie = this.getCookieJson();
      this.config = {
        headers: {
          Authorization: `Bearer ${cookie.jwt}`,
        },
      };
    }
    const { sanitizedEmail, sanitizedPassword } = User.sanitizeAndValidateInput(email, password);
    const data = {
      email: sanitizedEmail,
      password: sanitizedPassword,
    };
    try {
      const res = await axios.post(this.baseUrl + "/krsp/user/login/", data, this.config);
      return JSON.stringify(res.data);
    } catch (error: any) {
      const msg = error.response.data.msg;
      throw new Error(msg);
    }
  };
}
