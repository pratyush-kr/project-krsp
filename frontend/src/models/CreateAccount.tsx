import axios from "axios";
import { NextRouter } from "next/router";

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
  static createUserRequest = async (
    formData: FormData,
    setId: (value: string) => void,
    setLoading: (value: boolean) => void,
    router: NextRouter
  ) => {
    try {
      const response = await axios.post(axios.defaults.baseURL + "/krsp/user/create_user/", formData);
      setId(response.data.id);
      setLoading(false);
      router.push("/Login");
    } catch (err: any) {}
  };
}
