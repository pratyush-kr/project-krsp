import { Room as RoomType } from "@/types/ChatRoom";
import { Config } from "@/types/Config";
import axios from "axios";
import { User } from "./User";
import { User as UserType } from "@/types/User";
import { JwtCookie } from "@/types/JwtCookie";
import { People } from "@/types/People";

export class Rooms {
    static loadRooms = async (userContext: UserType): Promise<RoomType[]> => {
        var rooms: RoomType[] = [];
        const user: User = new User();
        const validToken: boolean = await user.verifyToken();
        if (!validToken) {
            userContext.logout();
            user.getAndSaveGuestToken();
            return [];
        }
        const jwtToken: JwtCookie = user.getCookieJson();
        const config: Config = {
            headers: {
                Authorization: `Bearer ${jwtToken.jwt}`,
            },
        };
        const response = await axios.post(axios.defaults.baseURL + "/krsp/chat/load_rooms/", {}, config);
        console.log(response.data);
        rooms = response.data;
        return rooms;
    };

    static createRoom = async (openChatWith: People): Promise<string> => {
        const data = {
            name: "room name",
            description: "room desc",
            target_user: openChatWith.user_id,
        };
        const user: User = new User();
        const validToken: boolean = await user.verifyToken();
        if (!validToken) {
            throw new Error("un authenticated");
        }
        const cookie: JwtCookie = user.getCookieJson();
        const config: Config = { headers: { Authorization: `Bearer ${cookie.jwt}` } };
        const response = await axios.post(axios.defaults.baseURL + "/krsp/chat/create_room/", data, config);
        return response.data.room_id;
    };
}
