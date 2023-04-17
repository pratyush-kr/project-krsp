import React, { useState } from "react";
import { IconButton, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import styles from "@/styles/ChatApp.module.css";
import ChatScreen from "./ChatScreen";
import SelectChat from "./SelectChat";

const ChatApp = () => {
    const [open, setOpen] = useState(false);
    const [room, setRoom] = useState<string | null>(null);
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
                    <SelectChat />
                    <ChatScreen />
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
