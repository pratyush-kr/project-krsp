import React, { useContext, useEffect, useState } from "react";
import { IconButton, Button, Theme } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import styles from "@/styles/ChatApp.module.css";
import ChatScreen from "./pages/ChatScreen";
import { SelectChat } from "@/components/ChatApp/pages/SelectChat";
import { makeStyles } from "@mui/styles";
import { People } from "@/types/People";
import { PeopleContext } from "@/contexts/PeopleContext";

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
  const people: People = useContext(PeopleContext);
  const [open, setOpen] = useState(false);
  const muiStyles = useStyles();
  const [renderScreen, setRenderScreen] = useState<React.ReactNode>();
  const renderChats = (): React.ReactNode => {
    if (!people.peopleSelected) {
      return <SelectChat />;
    } else {
      return <ChatScreen />;
    }
  };
  useEffect(() => {
    setRenderScreen(renderChats());
  }, [people.peopleSelected]);
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
            <h3>{!people.peopleSelected ? "Let's Chat" : people.name}</h3>
            <IconButton onClick={() => setOpen(!open)}>
              <CloseIcon />
            </IconButton>
          </div>
          <div className={styles.ChatBtnContainer}>
            <Button
              disableElevation={false}
              variant="outlined"
              className={`${muiStyles.btnContainer} ${muiStyles.rightBorder} ${
                !people.peopleSelected ? muiStyles.selected : ""
              }`}
              onClick={() => people.unSelect()}
            >
              People
            </Button>
            <Button
              disableElevation={false}
              variant="outlined"
              className={`${muiStyles.btnContainer} ${people.peopleSelected ? muiStyles.selected : ""}`}
              disabled={people.room_id === null}
              onClick={() => people.select()}
            >
              Chats
            </Button>
          </div>
          {renderScreen}
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
