import React, { useContext, useEffect, useState } from "react";
import { SearchContainer } from "@/components/ChatApp/components/SearchContainer";
import { Rooms } from "@/models/ChatRoom";
import { UserContext } from "@/contexts/UserContext";
import { People } from "@/types/People";
import { PeopleContext } from "@/contexts/PeopleContext";
import ChatOption from "../components/ChatOption";

export const SelectChat = () => {
  const people: People = useContext(PeopleContext);
  const userContext = useContext(UserContext);
  const [rooms, setRooms] = useState<People[]>();
  const [options, setOptions] = useState<People[]>([]);
  useEffect(() => {
    const loader = async () => {
      const rooms = await Rooms.loadRooms(userContext);
      setRooms(rooms);
    };
    loader();
  }, []);
  return (
    <div>
      <SearchContainer setOptions={setOptions} options={options} />
      <div>
        {rooms?.map((room, index) => (
          <ChatOption props={{}} option={room} index={index === 0 ? "zero" : "other"} />
        ))}
      </div>
    </div>
  );
};
