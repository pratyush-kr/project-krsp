import React, { useState } from "react";
import { IconButton, Button, Theme } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import styles from "@/styles/ChatApp.module.css";
import ChatScreen from "./ChatScreen";
import { SelectChat } from "@/components/SelectChat";
import { makeStyles } from "@mui/styles";
import { People } from "@/types/People";

const useStyles = makeStyles((theme: Theme) => ({
    btnContainer: {
        width: "50%",
        borderRadius: 0,
        border: 0,
        backgroundColor: "#eee",
        borderBottom: `1px solid #eee`,
        color: "#a9a9a9",
        "&:hover": {
            backgroundColor: "transparent",
            border: `0 solid #eee`,
        },
    },
    rightBorder: {
        borderRight: `1px solid #eee`,
    },

    selected: {
        borderBottom: 0,
        backgroundColor: "white",
    },
}));

const ChatApp = () => {
    const [open, setOpen] = useState(false);
    const [room, setRoom] = useState<number>(0);
    const [roomName, setRoomName] = useState<string>("");
    const muiStyles = useStyles();
    const [peopleSelected, setPeopleSelected] = useState(true);
    const [openChatWith, setOpenChatWith] = useState<People>({
        user_id: "",
        name: "",
        last_message: "",
        profile_picture: "/no_img",
        room_id: "1",
    });
    const renderChats = (room: number): React.ReactNode => {
        if (peopleSelected) {
            return (
                <SelectChat
                    selectRoom={setRoom}
                    setPeopleSelected={setPeopleSelected}
                    setName={setRoomName}
                    openChatWith={openChatWith}
                    setOpenChatWith={setOpenChatWith}
                />
            );
        }
        if (!peopleSelected && room !== 0) {
            return <ChatScreen openChatWith={openChatWith} />;
        }
    };
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
                        <h3>{roomName === "" ? "Let's Chat" : roomName}</h3>
                        <IconButton onClick={() => setOpen(!open)}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                    <div className={styles.ChatBtnContainer}>
                        <Button
                            disableElevation={false}
                            variant="outlined"
                            className={`${muiStyles.btnContainer} ${muiStyles.rightBorder} ${
                                peopleSelected ? muiStyles.selected : ""
                            }`}
                            onClick={() => {
                                setPeopleSelected(true);
                                setRoomName("");
                            }}
                        >
                            People
                        </Button>
                        <Button
                            disableElevation={false}
                            variant="outlined"
                            className={`${muiStyles.btnContainer} ${
                                !peopleSelected ? muiStyles.selected : ""
                            }`}
                            disabled={room === 0}
                            onClick={() => setPeopleSelected(false)}
                        >
                            Chats
                        </Button>
                    </div>
                    {renderChats(room)}
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
