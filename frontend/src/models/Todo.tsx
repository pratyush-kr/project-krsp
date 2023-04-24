import { Todo as TodoType } from "@/types/Todo";
import { User } from "./User";
import { User as UserType } from "@/types/User";
import { JwtCookie } from "@/types/JwtCookie";
import axios from "axios";
import { Config } from "@/types/Config";

export class Todo {
  static cancel = async (
    todo: TodoType[],
    id: string,
    userContext: UserType,
    name: string,
    setTodo: (value: TodoType[]) => void,
    setHistory: (value: TodoType[]) => void
  ) => {
    todo.map(async (todoData: TodoType) => {
      if (todoData.id + "" === id) {
        todoData.is_canceled = true;
        const user: User = new User();
        const isValid: boolean = await user.verifyToken();
        if (!isValid) {
          userContext.logout();
          user.getAndSaveGuestToken();
        }
        const cookie: JwtCookie = user.getCookieJson();
        const config = {
          headers: {
            Authorization: `Bearer ${cookie.jwt}`,
          },
        };
        try {
          const response = await axios.post(
            axios.defaults.baseURL + "/krsp/appointments/cancel_appointment/",
            { appointment_id: todoData.id, is_canceled: todoData.is_canceled },
            config
          );

          if (name === "Todo next") {
            setTodo(response.data.todo);
            setHistory(response.data.history);
          } else if (name === "History") {
            setTodo(response.data.history);
            setHistory(response.data.todo);
          }
        } catch (error: any) {
          return [];
        }
      }
    });
  };

  static done = (
    todo: TodoType[],
    id: string,
    userContext: UserType,
    name: string,
    setTodo: (value: TodoType[]) => void,
    setHistory: (value: TodoType[]) => void
  ) => {
    var history_array = [];
    todo.map(async (todoData) => {
      if (todoData.id + "" === id) {
        if (name === "Todo next") {
          todoData.done = true;
        } else {
          todoData.done = false;
        }
        const user: User = new User();
        const isValid: boolean = await user.verifyToken();
        if (!isValid) {
          localStorage.removeItem("user_info");
          userContext.logout();
          user.getAndSaveGuestToken();
        }
        const cookie: JwtCookie = user.getCookieJson();
        const config: Config = {
          headers: {
            Authorization: `Bearer ${cookie.jwt}`,
          },
        };
        const update_response = await axios.post(
          axios.defaults.baseURL + "/krsp/appointments/update_appointments/",
          { appointment_id: todoData.id, appointment_status: todoData.done },
          config
        );
        if (name === "Todo next") {
          setTodo(update_response.data.todo);
          setHistory(update_response.data.history);
        } else if (name === "History") {
          setTodo(update_response.data.history);
          setHistory(update_response.data.todo);
        }
      }
      return [];
    });
    // const list_array = todo.filter((todoData) => {
    //   if (todoData.id + "" === id) {
    //     return [];
    //   }
    //   return todoData;
    // });
    // setTodo(list_array);
  };
}
