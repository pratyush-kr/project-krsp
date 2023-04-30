import { Avatar } from "@mui/material";
import axios from "axios";
import React, { useContext } from "react";
import styles from "@/styles/SearchContainer.module.css";
import { People } from "@/types/People";
import { PeopleContext } from "@/contexts/PeopleContext";
import { Rooms } from "@/models/ChatRoom";

interface Props {
  option: People;
  props: any;
  index: string;
}

const ChatOption: React.FC<Props> = ({ option, props, index }) => {
  const people: People = useContext(PeopleContext);
  const startChat = async () => {
    if (option.room_id === null) {
      const room_id = await Rooms.createRoom(option);
      people.setPeople({ ...option, room_id: room_id });
      people.select();
    } else {
      people.select();
      people.setPeople(option);
    }
  };
  const getShortMessage = (message: string) => {
    let shortMessage = message.slice(0, 40);
    shortMessage += message === shortMessage ? "" : "...";
    return shortMessage;
  };
  return (
    <li {...props} className={`${styles.room} ${styles[index]}`} onClick={startChat}>
      <Avatar src={axios.defaults.baseURL + option.profile_picture} alt={option.name} />
      <div className={styles.text}>
        <span className={styles.name}>{option.name}</span>
        <span className={styles.chat}>{getShortMessage(option.last_message)}</span>
      </div>
    </li>
  );
};

export default ChatOption;
