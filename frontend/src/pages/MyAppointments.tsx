import React, { useEffect, useState } from "react";
import { Header } from "@/components/HeaderComponent";
import { Footer } from "@/components/FooterComponent";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import CalendarPicker from "@mui/x-date-pickers/CalendarPicker";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { TextField } from "@mui/material";
import axios from "axios";
import { JwtCookie } from "@/types/JwtCookie";
import { useRouter } from "next/router";
import { Todo } from "@/types/Todo";
import styles from "@/styles/MyAppointments.module.css";

const today = new Date();

const AppointmentDetails = () => {
  const router = useRouter();
  const [date, setDate] = useState<string>(
    `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
  );
  console.log(today.getMonth());
  const [value, setValue] = useState(null);
  const [todo, setTodo] = useState<Todo[]>([]);

  useEffect(() => {
    const cookie: string | null = localStorage.getItem("user_info");
    if (cookie === null) {
      router.push("/Login");
      return;
    }
    const jwt_cookie: JwtCookie = JSON.parse(cookie);
    const config = {
      headers: {
        Authorization: `Bearer ${jwt_cookie.jwt}`,
      },
    };
    axios
      .post(axios.defaults.baseURL + "/krsp/appointments/get_appointments_by_date/", { date: date }, config)
      .then((res) => {
        const todoList: Todo[] = [];
        const historyList: Todo[] = [];
        const data: Todo[] = res.data;
        data.forEach((item) => {
          if (!item["done"]) todoList.push(item);
          else historyList.push(item);
        });
        setTodo(todoList);
      });
  }, [date]);
  return (
    <div className={styles.body}>
      <Header />
      <div className={styles.appointmentsPage}>
        <div className={styles.appointmentView}>
          <div className={styles.detailedView}>
            <div className={`${styles.calendar} ${styles.desktop}`}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <CalendarPicker date={date} onChange={(newDate: string) => setDate(newDate)} />
              </LocalizationProvider>
            </div>
            <div className={`${styles.calendar} ${styles.mobile}`}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Pick a date"
                  value={value}
                  // renderInput={(params: any) => <TextField {...params} />}
                  onChange={(newValue) => {
                    setValue(newValue);
                  }}
                />
              </LocalizationProvider>
            </div>
            <div className={styles.details}>
              {todo.map((data) => {
                return (
                  <div className={styles.todo}>
                    <span>{data.message}</span>
                    <span>{data.start_time}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AppointmentDetails;
