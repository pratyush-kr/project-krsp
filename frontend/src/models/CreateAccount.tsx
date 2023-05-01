import { Config } from "@/types/Config";
import axios from "axios";
import { NextRouter } from "next/router";
import { User } from "@/models/User";
import { Doctors } from "@/types/Doctors";

export const defaultCreateUser = {
  first_name: "",
  last_name: "",
  username: "",
  email: "",
  phone: "",
  dob: "",
  gender: "",
  userType: "",
  password: "",
};
export interface CreateUser {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  userType: string;
  password: string;
}
export class CreateAccount {
  static insertIsDoctor = (jsonData: Object) => {
    const formData: FormData = new FormData();
    for (const [key, value] of Object.entries(jsonData)) {
      if (key !== "userType") {
        formData.append(key, value);
      } else {
        formData.append("is_doctor", `${value === "doctor"}`);
      }
      formData.append(key, value);
    }
    return formData;
  };
  static createUserRequest = async (formData: FormData) => {
    try {
      const user = new User();
      const validToken: boolean = await user.verifyToken();
      if (!validToken) {
        user.getAndSaveGuestToken();
      }
      const cookie = user.getCookieJson();
      const config: Config = {
        headers: {
          Authorization: `Bearer ${cookie.jwt}`,
        },
      };
      const response = await axios.post(axios.defaults.baseURL + "/krsp/user/create_user/", formData, config);
      return response.data.id;
    } catch (err: any) {}
  };

  static createSpecializedUser = async (
    data: { userType: string },
    id: string,
    today: string,
    time: string
  ) => {
    let response: any;
    const user = new User();
    const validToken: boolean = await user.verifyToken();
    if (!validToken) {
      user.getAndSaveGuestToken();
    }
    const cookie = user.getCookieJson();
    const config: Config = {
      headers: {
        Authorization: `Bearer ${cookie.jwt}`,
      },
    };
    if (data.userType === "doctor") {
      const doctor_data = {
        fk_user: id,
        create_date: today,
        create_time: time,
      };
      response = await axios.post(axios.defaults.baseURL + "/krsp/doctors/", doctor_data, config);
    } else if (data.userType === "patient") {
      const patient_data = {
        fk_user: id,
        create_date: today,
        create_time: time,
      };
      response = await axios.post(axios.defaults.baseURL + "/krsp/patient/", patient_data, config);
    }
    return response?.data;
  };
}
