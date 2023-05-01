import React, { useContext, useEffect, useState } from "react";
import { SearchContainer } from "@/components/ChatApp/components/SearchContainer";
import { Rooms } from "@/models/ChatRoom";
import { UserContext } from "@/contexts/UserContext";
import { People } from "@/types/People";
import ChatOption from "../components/ChatOption";
import styles from "@/styles/SelectChat.module.css";

export const SelectChat = () => {
  const userContext = useContext(UserContext);
  const [rooms, setRooms] = useState<People[]>();
  const [options, setOptions] = useState<People[]>([]);
  useEffect(() => {
    const loader = async () => {
      try {
        const rooms = await Rooms.loadRooms(userContext);
        setRooms(rooms);
      } catch (err) {
        console.error("something went wrong");
      }
    };
    loader();
  }, []);
  return (
    <div>
      <SearchContainer setOptions={setOptions} options={options} />
      <div className={styles.chatOptionContainer}>
        {rooms?.map((room, index) => (
          <ChatOption props={{}} key={index} option={room} index={index === 0 ? "zero" : "other"} />
        ))}
      </div>
    </div>
  );
};
