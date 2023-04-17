import { Config } from "@/types/Config";
import { Doctors as DoctorType } from "@/types/Doctors";
import axios from "axios";
import { User } from "./User";
import { JwtCookie } from "@/types/JwtCookie";

export class Doctor implements DoctorType {
    id = "";
    name = "";
    baseUrl = axios.defaults.baseURL;
    config: Config = {
        headers: {
            Authorization: "",
        },
    };
    constructor() {
        this.id = "";
        this.name = "";
    }
    public getDoctors = async (): Promise<[DoctorType]> => {
        const user: User = new User();
        const jwtToken: JwtCookie = user.getCookieJson();
        this.config = {
            headers: {
                Authorization: `Bearer ${jwtToken.jwt}`,
            },
        };
        const res = await axios.get(this.baseUrl + "/krsp/doctors/get_doctors/", this.config);
        return res.data.users;
    };
}
