import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "@/styles/ChatApp.module.css";
import { Button, TextField } from "@mui/material";
import { JwtCookie } from "@/types/JwtCookie";
import axios from "axios";
import { UserContext } from "@/contexts/UserContext";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { People } from "@/types/People";
import { PeopleContext } from "@/contexts/PeopleContext";
import { Rooms } from "@/models/ChatRoom";

const ChatScreen = () => {
  const people: People = useContext(PeopleContext);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const router = useRouter();
  const chatContainerRef = useRef<null | HTMLDivElement>(null);
  const [message, setMessage] = useState("");
  const [data, setData] = useState([{ name: "", message: "", date: "", time: "" }]);
  const [newMessage, setNewMessage] = useState({ name: "", message: "" });
  const userContext = useContext(UserContext);

  const sendMessage = async () => {
    if (people.name === "Assistant") {
      const response = await Rooms.chatWithBot(message, people, setMessage, setData, userContext);
    } else {
      const response = await Rooms.sendMessage(message, people, setMessage, setData, userContext, socket);
    }
  };

  useEffect(() => {
    const cookie: string | null = localStorage.getItem("user_info");
    if (cookie === null) {
      return;
    }
    const jwt_cookie: JwtCookie = JSON.parse(cookie);
    const config = {
      headers: {
        Authorization: `Bearer ${jwt_cookie.jwt}`,
      },
    };
    axios
      .post(axios.defaults.baseURL + "/krsp/chat/load_chats/", { room_id: people.room_id }, config)
      .then((res) => {
        setData(res.data);
      })
      .then(() => {
        if (chatContainerRef !== null && chatContainerRef.current !== null) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      })
      .catch((err: AxiosError) => {
        if (err.response?.status === 401) {
          userContext.logout();
          localStorage.removeItem("user_info");
          sessionStorage.removeItem("guest_info");
          router.push("/Login");
        }
      });
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

    // Listen for messages
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

    // Cleanup
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
              <div className={styles.chatMessageBody}>{msgData.message}</div>
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
          <TextField
            placeholder="Type a message.."
            className={styles.chatInput}
            multiline
            rows="2"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(event: React.KeyboardEvent) => {
              if (event.key === "Enter" && !event.shiftKey) {
                sendMessage();
              } else if (event.key === "Enter" && event.shiftKey) {
                event.preventDefault();
                const target = event.target as HTMLInputElement;
                const cursorPosition: number | null = target.selectionStart;
                if (cursorPosition !== null) {
                  setMessage(
                    (prevMessage) =>
                      prevMessage.slice(0, cursorPosition) + "\n" + prevMessage.slice(cursorPosition)
                  );
                }
              }
            }}
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
