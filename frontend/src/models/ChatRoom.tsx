import { Config } from "@/types/Config";
import axios from "axios";
import { User } from "./User";
import { User as UserType } from "@/types/User";
import { JwtCookie } from "@/types/JwtCookie";
import { People } from "@/types/People";
import React from "react";
import router from "next/router";

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
    userContext: UserType,
    socket: WebSocket | null
  ) => {
    const date = new Date();
    const new_message = {
      message: message,
      room_id: openChatWith.room_id,
      date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
      time: `${date.getHours()}:${date.getMinutes()}`,
      name: "You",
    };
    const user: User = new User();
    const validToken: boolean = await user.verifyToken();
    if (!validToken) {
      userContext.logout();
      localStorage.removeItem("user_info");
      return;
    }
    const jwtCookie: JwtCookie = user.getCookieJson();
    const config: Config = {
      headers: {
        Authorization: `Bearer ${jwtCookie.jwt}`,
      },
    };
    try {
      await axios.post(axios.defaults.baseURL + "/krsp/chat/send_message/", new_message, config);
      socket?.send(JSON.stringify({ ...new_message, token: jwtCookie.jwt }));
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 401) {
        userContext.logout();
        localStorage.removeItem("user_info");
        sessionStorage.removeItem("guest_info");
        router.push("/Login");
      }
    }
  };

  static loadChats = async (
    people: People,
    setData: (value: any) => void,
    chatContainerRef: React.MutableRefObject<HTMLDivElement | null>,
    userContext: UserType
  ) => {
    const user: User = new User();
    const validToken: boolean = await user.verifyToken();
    if (!validToken) {
      router.push("/Login");
      user.getAndSaveGuestToken();
      user.logout();
      return;
    }
    const cookie = user.getCookieJson();
    const config: Config = {
      headers: {
        Authorization: `Bearer ${cookie.jwt}`,
      },
    };
    try {
      const response = await axios.post(
        axios.defaults.baseURL + "/krsp/chat/load_chats/",
        { room_id: people.room_id },
        config
      );
      await setData(response.data);
      if (chatContainerRef !== null && chatContainerRef.current !== null) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        userContext.logout();
        localStorage.removeItem("user_info");
        sessionStorage.removeItem("guest_info");
        router.push("/Login");
      }
    }
  };
}
