import { Config } from "@/types/Config";
import { Doctors as DoctorType } from "@/types/Doctors";
import axios from "axios";
import { User } from "./User";
import { JwtCookie } from "@/types/JwtCookie";

export class Doctor implements DoctorType {
  id = "";
  name = "";
  image = "";
  experience = "";
  ratings = 0;
  constructor() {
    this.id = "";
    this.name = "";
  }
  public static getDoctors = async (): Promise<[DoctorType]> => {
    const user: User = new User();
    const jwtToken: JwtCookie = user.getCookieJson();
    const config: Config = {
      headers: {
        Authorization: `Bearer ${jwtToken.jwt}`,
      },
    };
    const res = await axios.get(axios.defaults.baseURL + "/krsp/doctors/get_doctors/", config);
    return res.data.users;
  };
}
