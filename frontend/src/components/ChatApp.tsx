import React, { useState } from "react";
import { IconButton, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import { TextField } from "@mui/material";
import { useEffect, useRef } from "react";
import axios from "axios";
import { JwtCookie } from "@/types/JwtCookie";
import styles from "@/styles/ChatApp.module.css";

const ChatApp = () => {
  const chatContainerRef = useRef<null | HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([{ name: "", message: "", date: "", time: "" }]);
  const [message, setMessage] = useState("");
  const sendMessage = () => {
    const date = new Date();
    const new_message = {
      message: message,
      room_id: "1",
      date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
      time: `${date.getHours()}:${date.getMinutes()}`,
      name: "You",
    };
    setMessage((prevMessage: string) => "");
    setData((data) => {
      return [...data, new_message];
    });
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

    axios.post(axios.defaults.baseURL + "/krsp/chat/chat_with_bot/", new_message, config).then((res) => {
      setData((data) => [...data, res.data]);
    });
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
      .post(axios.defaults.baseURL + "/krsp/chat/load_chats/", { room_id: "1" }, config)
      .then((res) => {
        setData(res.data);
      })
      .then(() => {
        if (chatContainerRef !== null && chatContainerRef.current !== null) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      });
  }, [open]);
  useEffect(() => {
    if (chatContainerRef.current !== null) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [open, data]);
  return (
    <div
      className={`${styles.chatApp} ${open ? styles.show : styles.hiding}`}
      style={{
        animationName: open ? "slide-in" : "slide-out",
        width: open ? "30vw" : "0",
        animationDuration: "0.5s",
        height: open ? "80vh" : "0",
      }}
    >
      {open && (
        <div>
          <div className={styles.row}>
            <IconButton>
              <ArrowBackIcon />
            </IconButton>
            <h3>Chat</h3>
            <IconButton onClick={() => setOpen(!open)}>
              <CloseIcon />
            </IconButton>
          </div>
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
            <TextField
              placeholder="Type a message.."
              className={styles.chatInput}
              multiline
              rows="1"
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
            <Button variant="contained" sx={{ marginLeft: "1vh" }} onClick={sendMessage}>
              Send
            </Button>
          </div>
        </div>
      )}
      {!open && (
        <div className={styles.openChat}>
          <Button onClick={() => setOpen(!open)}>
            <img src="/ChatIcon.png" alt="" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChatApp;
