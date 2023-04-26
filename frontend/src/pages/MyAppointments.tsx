import React, { useContext, useEffect, useState } from "react";
import { Header } from "@/components/HeaderComponent";
import { Footer } from "@/components/FooterComponent";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import axios, { AxiosError } from "axios";
import { JwtCookie } from "@/types/JwtCookie";
import { useRouter } from "next/router";
import { Todo } from "@/types/Todo";
import styles from "@/styles/MyAppointments.module.css";
import { UserContext } from "@/contexts/UserContext";
import { User as UserClass } from "@/models/User";
import { Appointment } from "@/models/Appointment";

const today = new Date();

const AppointmentDetails = () => {
    const router = useRouter();
    const [date, setDate] = useState(new Date());
    const [value, setValue] = useState<string>("");
    const [todo, setTodo] = useState<Todo[]>([]);
    const userContext = useContext(UserContext);
    useEffect(() => {
        const loader = async () => {
            const user: UserClass = new UserClass();
            const validToken: boolean = await user.verifyToken();
            if (!validToken) {
                user.getAndSaveGuestToken();
                userContext.logout();
                router.push("/Login");
            } else {
                const jwtToken: JwtCookie = user.getCookieJson();
                if (jwtToken.name === "Guest User") {
                    userContext.logout();
                    router.push("/Login");
                } else {
                    userContext.login();
                    if (date !== null) {
                        const today: Date = date;
                        const appointments: Todo[] | null = await Appointment.getAppointments(
                            `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`,
                            router
                        );
                        if (appointments !== null) setTodo(appointments);
                    }
                }
            }
        };
        loader();
    }, [date]);
    return (
        <div className={styles.body}>
            <Header />
            <div className={styles.appointmentsPage}>
                <div className={styles.appointmentView}>
                    <div className={styles.detailedView}>
                        <div className={`${styles.calendar} ${styles.desktop}`}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateCalendar
                                    onChange={(newDate: Date | null) => {
                                        if (newDate != null) setDate(new Date(newDate));
                                    }}
                                />
                            </LocalizationProvider>
                        </div>
                        <div className={`${styles.calendar} ${styles.mobile}`}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Pick a date"
                                    value={value}
                                    // renderInput={(params: any) => <TextField {...params} />}
                                    onChange={(newValue) => {
                                        setValue(newValue as string);
                                    }}
                                />
                            </LocalizationProvider>
                        </div>
                        <div className={styles.details}>
                            {todo.map((data, index) => {
                                return (
                                    <div key={index} className={styles.todo}>
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
