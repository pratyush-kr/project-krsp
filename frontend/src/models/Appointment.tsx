import axios from "axios";
import { Todo } from "@/types/Todo";
import { Config } from "@/types/Config";
import { User } from "./User";
import { JwtCookie } from "@/types/JwtCookie";
import { NextRouter } from "next/router";

export class Appointment {
  static baseUrl = axios.defaults.baseURL;
  static getAppointments = async (date: string, router: NextRouter): Promise<Todo[] | null> => {
    const user: User = new User();
    const validToken: boolean = await user.verifyToken();
    if (!validToken) {
      user.getAndSaveGuestToken();
      localStorage.removeItem("user_info");
      router.push("/Login");
      return null;
    }
    const jwtToken: JwtCookie = user.getCookieJson();
    const config: Config = {
      headers: {
        Authorization: `Bearer ${jwtToken.jwt}`,
      },
    };
    const response = await axios.post(
      axios.defaults.baseURL + "/krsp/appointments/get_appointments_by_date/",
      { date: date },
      config
    );
    return response.data;
  };
}
