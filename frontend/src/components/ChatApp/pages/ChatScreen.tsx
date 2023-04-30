import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "@/styles/ChatApp.module.css";
import { Button, TextareaAutosize } from "@mui/material";
import { UserContext } from "@/contexts/UserContext";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { People } from "@/types/People";
import { PeopleContext } from "@/contexts/PeopleContext";
import { Rooms } from "@/models/ChatRoom";

const ChatScreen = () => {
  const people: People = useContext(PeopleContext);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const chatContainerRef = useRef<null | HTMLDivElement>(null);
  const [message, setMessage] = useState<string>("");
  const [data, setData] = useState([{ name: "", message: "", date: "", time: "" }]);
  const userContext = useContext(UserContext);

  const sendMessage = async () => {
    if (message !== "") {
      if (people.name === "Assistant") {
        const response = Rooms.chatWithBot(message, people, setData, userContext);
      } else {
        const response = await Rooms.sendMessage(message, people, userContext, socket);
      }
    }
    setMessage("");
  };
  useEffect(() => {
    Rooms.loadChats(people, setData, chatContainerRef, userContext);
  }, [open]);

  useEffect(() => {
    if (chatContainerRef.current !== null) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [open, data]);

  useEffect(() => {
    const chatSocket = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${people.room_id}`);
    chatSocket.onopen = (e) => {
      console.log("The connection was setup successfully !");
    };
    chatSocket.addEventListener("message", (event) => {
      const newMessage = JSON.parse(event.data);
      const date = new Date();
      setData((data) => {
        return [
          ...data,
          {
            message: newMessage.message,
            room_id: people.room_id,
            date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
            time: `${date.getHours()}:${date.getMinutes()}`,
            name: newMessage.name === userContext.name ? "You" : newMessage.name,
          },
        ];
      });
    });
    setSocket(chatSocket);
    return () => {
      chatSocket.close();
    };
  }, []);

  return (
    <div>
      <div className={styles.chat} ref={chatContainerRef}>
        {data.map((msgData) => (
          <div className={msgData.name === "You" ? styles.chatMessage : styles.chatMessageReverse}>
            <div
              className={
                msgData.name === "You"
                  ? `${styles.chatBubble} ${styles.chatBubbleSelf}`
                  : `${styles.chatBubble} ${styles.chatBubbleOther}`
              }
            >
              <div className={styles.chatMessageHeader}>
                {msgData.name === "You" ? null : (
                  <>
                    <span className={styles.chatMessageHeaderName}>{msgData.name}</span>
                    <span className={styles.chatMessageHeaderTimestamp}>{msgData.time}</span>
                  </>
                )}
              </div>
              {msgData.message.split("\n").map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className={styles.chatInputContainer}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className={styles.chatInputContainer}
        >
          <TextareaAutosize
            placeholder="Type a message.."
            className={styles.chatInput}
            minRows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button variant="contained" sx={{ marginLeft: "1vh" }} type="submit">
            Send
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatScreen;
