import { Room as RoomType } from "@/types/ChatRoom";
import { Config } from "@/types/Config";
import axios, { AxiosError } from "axios";
import { User } from "./User";
import { User as UserType } from "@/types/User";
import { JwtCookie } from "@/types/JwtCookie";
import { People } from "@/types/People";
import React from "react";
import router from "next/router";
import io from "socket.io-client";

interface Data {
  name: string;
  message: string;
  date: string;
  time: string;
}

export class Rooms {
  static loadRooms = async (userContext: UserType): Promise<People[]> => {
    var rooms: People[] = [];
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

  static chatWithBot = async (
    message: string,
    openChatWith: People,
    setMessage: React.Dispatch<React.SetStateAction<string>>,
    setData: React.Dispatch<React.SetStateAction<Data[]>>,
    userContext: UserType
  ) => {
    const date = new Date();
    const new_message = {
      message: message,
      room_id: openChatWith.room_id,
      date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
      time: `${date.getHours()}:${date.getMinutes()}`,
      name: "You",
    };
    setMessage((prevMessage: string) => "");
    setData((data) => {
      return [...data, new_message];
    });
    const user: User = new User();
    const validToken: boolean = await user.verifyToken();
    if (!validToken) {
      userContext.logout();
      localStorage.removeItem("user_info");
    }
    const jwtCookie: JwtCookie = user.getCookieJson();
    const config = {
      headers: {
        Authorization: `Bearer ${jwtCookie.jwt}`,
      },
    };
    try {
      const response = await axios.post(
        axios.defaults.baseURL + "/krsp/chat/chat_with_bot/",
        new_message,
        config
      );
      setData((data) => [...data, response.data]);
    } catch (err: any) {
      if (err.response?.status === 401) {
        userContext.logout();
        localStorage.removeItem("user_info");
        sessionStorage.removeItem("guest_info");
        router.push("/Login");
      }
    }
  };

  static sendMessage = async (
    message: string,
    openChatWith: People,
    setMessage: React.Dispatch<React.SetStateAction<string>>,
    setData: React.Dispatch<React.SetStateAction<Data[]>>,
    userContext: UserType
  ) => {
    const date = new Date();
    const new_message = {
      message: message,
      room_id: openChatWith.room_id,
      date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
      time: `${date.getHours()}:${date.getMinutes()}`,
      name: "You",
    };
    setMessage((prevMessage: string) => "");
    setData((data) => {
      return [...data, new_message];
    });
    const user: User = new User();
    const validToken: boolean = await user.verifyToken();
    if (!validToken) {
      userContext.logout();
      localStorage.removeItem("user_info");
    }
    const jwtCookie: JwtCookie = user.getCookieJson();
    const config = {
      headers: {
        Authorization: `Bearer ${jwtCookie.jwt}`,
      },
    };
    try {
      const response = await axios.post(
        axios.defaults.baseURL + "/krsp/chat/send_message/",
        new_message,
        config
      );
      setData((data) => [...data, response.data]);
    } catch (err: any) {
      if (err.response?.status === 401) {
        userContext.logout();
        localStorage.removeItem("user_info");
        sessionStorage.removeItem("guest_info");
        router.push("/Login");
      }
    }
  };
}
