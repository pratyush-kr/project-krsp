import React, { useState, useEffect } from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import { Button, SvgIcon } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import EditIcon from "@mui/icons-material/Edit";
import { TextField } from "@mui/material";
import axios from "axios";
import ProfileIcon from "@/components/ProfileIcon";
import { Todo as TodoType } from "@/types/Todo";
import { JwtCookie } from "@/types/JwtCookie";
import { User } from "@/models/User";
import Todo from "@/components/Todo";
import styles from "@/styles/Profile.module.css";
import Link from "next/link";
import { IconButton } from "@mui/material";
import { useRouter } from "next/router";

const Profile = () => {
  const settings = ["Profile", "My Appointments", "Logout"];
  const [profile, setProfile] = useState<string>("");
  const [showMoreDetails, setShowMoreDetails] = useState<boolean>(false);
  const [showAppointments, setShowAppointments] = useState<boolean>(false);
  const [editable, setEditable] = useState<boolean>(false);
  const [user, setUser] = useState({
    email: "",
    phone: "",
    dob: "",
    name: "",
  });
  const [email, setEmail] = useState<string>(user.email);
  const [phone, setPhone] = useState<string>(user.phone);
  const [dob, setDob] = useState<string>(user.dob);
  const [name, setName] = useState<string>(user.name);
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    var data = {
      email: email,
      phone: phone,
      dob: dob,
      name: name,
    };
    const user: User = new User();
    const cookie: JwtCookie = user.getCookieJson();
    const config = {
      headers: {
        Authorization: `Bearer ${cookie.jwt}`,
      },
    };
    axios.post(axios.defaults.baseURL + "/krsp/user/update_user/", data, config);
    setUser(data);
    setEmail(data.email);
    setPhone(data.phone);
    setDob(data.dob);
    setEditable(!editable);
  };
  const handleEditClick = () => {
    setEditable(!editable);
    setShowAppointments(false);
  };
  const handleDetailsClick = () => {
    setShowMoreDetails(!showMoreDetails);
  };
  const handleAppointmentClick = () => {
    setEditable(false);
    setShowMoreDetails(false);
    setShowAppointments(!showAppointments);
  };
  const [todo, setTodo] = useState<TodoType[]>([]);
  const [history, setHistory] = useState<TodoType[]>([]);
  useEffect(() => {
    const loader = async () => {
      const user: User = new User();
      const cookie: JwtCookie = user.getCookieJson();
      const config = {
        headers: {
          Authorization: `Bearer ${cookie.jwt}`,
        },
      };
      setProfile(axios.defaults.baseURL + cookie.profile_picture);
      const getUserResponse = await axios.post(axios.defaults.baseURL + "/krsp/user/get_user/", {}, config);
      setUser(getUserResponse.data);
      setName(getUserResponse.data.first_name);
      setEmail(getUserResponse.data.email);
      setPhone(getUserResponse.data.phone);
      setDob(getUserResponse.data.dob);
      const getAppointmentResponse = await axios.post(
        axios.defaults.baseURL + "/krsp/appointments/get_appointments/",
        {},
        config
      );
      setTodo(getAppointmentResponse.data.todo);
      setHistory(getAppointmentResponse.data.history);
    };
    loader();
  }, []);
  const router = useRouter();
  return (
    <div className={styles.body}>
      <div className={styles.shortcuts}>
        <ProfileIcon settings={settings} />
        <IconButton onClick={() => router.push("MyAppointments")}>
          <SvgIcon fontSize="large">
            <CalendarMonthIcon color="secondary" />
          </SvgIcon>
        </IconButton>
        <IconButton className={styles.settingsIcon}>
          <SvgIcon fontSize="large">
            <SettingsIcon color="secondary" />
          </SvgIcon>
        </IconButton>
      </div>
      <div className={styles.box}>
        <div className={`${styles.section} ${styles.details}`}>
          <div>
            <img src={profile} alt={"Jon Doe"} className={styles.profilePic} />
            <h3 className={styles.name}>{name}</h3>
          </div>
          <div className={`${styles.text} ${styles.details}`}>
            <h2>
              <Button
                onClick={handleDetailsClick}
                style={{ padding: "0", marginLeft: "-3vw" }}
                endIcon={!showMoreDetails ? <ExpandMoreIcon /> : <ExpandLessIcon />}
              />
              Personal Details
              {showMoreDetails && (
                <Button
                  style={{ padding: "0", marginLeft: "-2vw" }}
                  startIcon={<EditIcon />}
                  hidden={true}
                  onClick={handleEditClick}
                  sx={{ display: "inline" }}
                />
              )}
            </h2>
            {showMoreDetails && (
              <div>
                {!editable && (
                  <>
                    <div className={styles.text}>
                      Email
                      <a href={"mailto:" + user.email}>{user.email}</a>
                    </div>
                    <div className={styles.text}>
                      Phone
                      <a href={"tel:" + user.phone}>{user.phone}</a>
                    </div>
                    <div className={styles.text}>
                      Date of Birth
                      <span>{user.dob}</span>
                    </div>
                  </>
                )}
                {editable && (
                  <form
                    onSubmit={handleSubmit}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      margin: "auto",
                      marginLeft: "0",
                      width: "15vw",
                    }}
                  >
                    <TextField
                      label="Email"
                      className={styles.textInput}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                      label="Phone"
                      className={styles.textInput}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    <TextField
                      type="date"
                      className={styles.textInput}
                      value={dob}
                      label="Date of birth"
                      InputLabelProps={{
                        shrink: true,
                        required: true,
                      }}
                      onChange={(e) => setDob(e.target.value)}
                    />
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        marginTop: "1vh",
                      }}
                    >
                      <Button
                        variant="contained"
                        style={{
                          width: "45%",
                          margin: "auto",
                        }}
                        type="submit"
                      >
                        Save
                      </Button>
                      <Button
                        variant="contained"
                        style={{
                          width: "45%",
                          margin: "auto",
                        }}
                        onClick={() => setEditable(!editable)}
                      >
                        CANCEL
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
          <div className={`${styles.text} ${styles.details}`}>
            <h2>
              <Button
                onClick={handleAppointmentClick}
                endIcon={!showAppointments ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                style={{ marginLeft: "-3vw", padding: "0" }}
              />
              Appointments
            </h2>
            {showAppointments && (
              <div className={`${styles.appointment} ${styles.card}`}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum numquam officia unde totam error
                ipsa, incidunt quia excepturi expedita iusto optio ea officiis quasi distinctio suscipit
                commodi perferendis provident doloribus.
              </div>
            )}
          </div>
        </div>
        <div className={`${styles.section} ${styles.todo}`}>
          <Todo name="Todo next" todo={todo} setTodo={setTodo} history={history} setHistory={setHistory} />
          <Todo name="History" todo={history} setTodo={setHistory} history={todo} setHistory={setTodo} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
