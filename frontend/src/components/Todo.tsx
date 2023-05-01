import Checkbox from "@mui/material/Checkbox";
import React, { useContext, useState } from "react";
import { Button } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Todo } from "@/types/Todo";
import { Todo as TodoClass } from "@/models/Todo";
import { UserContext } from "@/contexts/UserContext";
import styles from "@/styles/Todo.module.css";

interface Props {
  name: string;
  todo: Todo[];
  setTodo: (value: Todo[]) => void;
  history: Todo[];
  setHistory: (value: Todo[]) => void;
}

const Todo = ({ name, todo, setTodo, history, setHistory }: Props) => {
  const userContext = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const handlePopupOpen = (event: React.MouseEvent) => {
    event.preventDefault();
    setOpen(true);
  };
  const handlePopupClose = () => {
    setOpen(false);
  };
  const handleCancel = (event: React.MouseEvent<HTMLButtonElement>) => {
    const id = event.currentTarget.value;
    setOpen(false);
    TodoClass.cancel(todo, id, userContext, name, setTodo, setHistory);
  };
  const handleCheckBoxClick = (event: any) => {
    const id = event.target.id;
    TodoClass.done(todo, id, userContext, name, setTodo, setHistory);
  };
  return (
    <div>
      <div className={styles.list}>
        <div className={styles.title}>{name}</div>
        <form>
          {todo.map((todoData) => {
            return (
              <div className={styles.todoNext} key={todoData.id}>
                <Checkbox id={"" + todoData.id} onClick={handleCheckBoxClick} checked={todoData.done} />
                <div className={styles.text}>
                  <span className={styles.chip}>{todoData.message}</span>
                  <span className={styles.chip}>
                    {todoData.start_time} {todoData.start_date}
                  </span>
                </div>
                <Button
                  disabled={name === "History"}
                  size="small"
                  variant="contained"
                  style={{
                    display: todoData["user_type"] === "patient" ? "none" : "inline block",
                    margin: "auto",
                    backgroundColor: "red",
                  }}
                  onClick={handlePopupOpen}
                >
                  cancel
                </Button>
                <Dialog open={open} onClose={handlePopupClose}>
                  <DialogTitle>Are you sure?</DialogTitle>
                  <DialogContent id="btn-container">
                    <DialogContentText>
                      You are deleting the {todoData.message} at {todoData.start_time} {todoData.start_date}
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      id="btn-yes"
                      value={todoData.id}
                      variant="contained"
                      color="secondary"
                      onClick={handleCancel}
                    >
                      Yes
                    </Button>
                    <Button id="btn-no" variant="contained" onClick={handlePopupClose}>
                      No
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
            );
          })}
        </form>
      </div>
    </div>
  );
};

export default Todo;
