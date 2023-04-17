import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "@/styles/ChatApp.module.css";
import { Button, TextField } from "@mui/material";
import { JwtCookie } from "@/types/JwtCookie";
import axios from "axios";
import { UserContext } from "@/contexts/UserContext";
import { AxiosError } from "axios";
import { useRouter } from "next/router";

const ChatScreen = () => {
    const router = useRouter();
    const chatContainerRef = useRef<null | HTMLDivElement>(null);
    const [message, setMessage] = useState("");
    const [data, setData] = useState([{ name: "", message: "", date: "", time: "" }]);
    const userContext = useContext(UserContext);

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
        axios
            .post(axios.defaults.baseURL + "/krsp/chat/chat_with_bot/", new_message, config)
            .then((res) => {
                setData((data) => [...data, res.data]);
            })
            .catch((err: AxiosError) => {
                if (err.response?.status === 401) {
                    userContext.logout();
                    localStorage.removeItem("user_info");
                    sessionStorage.removeItem("guest_info");
                    router.push("/Login");
                }
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
                                        <span className={styles.chatMessageHeaderTimestamp}>
                                            {msgData.time}
                                        </span>
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
                                        prevMessage.slice(0, cursorPosition) +
                                        "\n" +
                                        prevMessage.slice(cursorPosition)
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
    );
};

export default ChatScreen;
