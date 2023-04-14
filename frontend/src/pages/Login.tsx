import React, { useContext, useState, useEffect } from "react";
import { Header } from "@/components/HeaderComponent";
import { Footer } from "@/components/FooterComponent";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from "axios";
import { UserContext } from "@/contexts/UserContext";
import { motion } from "framer-motion";
import { FadeLoading } from "@/components/Spinners";
import { useRouter } from "next/router";
import styles from "@/styles/Login.module.css";
import { User } from "@/types/User";
import { JwtCookie } from "@/types/JwtCookie";
const Login = () => {
  const router = useRouter();
  useEffect(() => {
    const cookie: string | null = localStorage.getItem("user_info");
    let guestCookie: string | null = sessionStorage.getItem("guest_info");
    if (cookie !== null) {
      router.push("/");
    }
    if (cookie === null && guestCookie === null) {
      axios.get(axios.defaults.baseURL + "/krsp/user/get_token/").then((res) => {
        sessionStorage.setItem("guest_info", JSON.stringify(res.data));
      });
    }
  }, []);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const user = useContext(UserContext);
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    setLoading(() => true);
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    axios.defaults.withCredentials = true;
    const guestCookie: string | null = sessionStorage.getItem("guest_info");
    if (guestCookie === null) {
      setLoading(() => false);
      return;
    }
    const jwt_cookie: JwtCookie = JSON.parse(guestCookie);
    const config = {
      headers: {
        Authorization: `Bearer ${jwt_cookie.jwt}`,
      },
    };
    axios
      .post(axios.defaults.baseURL + "/krsp/user/login/", data, config)
      .then((res) => {
        user.login();
        const resData: User = res.data;
        localStorage.setItem("user_info", JSON.stringify(resData));
        user.setUsername(res.data["name"]);
        setLoading(false);
        router.push("/");
      })
      .catch((err) => {
        setLoading(false);
        const msg = err.response.data.msg;
        setMsg(msg);
      });
  };
  return (
    <div className={styles.body}>
      <Header />
      <div className={styles.page}>
        <div className={styles.form}>
          <div
            style={{
              position: "relative",
              alignContent: "center",
              marginTop: "7rem",
            }}
          >
            <motion.div
              animate={{
                opacity: loading ? 0.7 : 1,
              }}
              initial={{
                opacity: 0,
              }}
              transition={{
                duration: 2,
              }}
            >
              <form onSubmit={handleSubmit}>
                <TextField
                  name="email"
                  type="email"
                  label="Email"
                  style={{
                    marginBottom: "0.3rem",
                    backgroundColor: "white",
                  }}
                />
                <TextField
                  name="password"
                  type="password"
                  label="Password"
                  style={{
                    marginTop: "0.3rem",
                    backgroundColor: "white",
                    marginBottom: "1vh",
                  }}
                />
                <div className={styles.accountOptions}>
                  <div className={styles.forgot} />
                  <a href="http://localhost:3000/forgot_password" className={styles.forgot}>
                    forgot password
                  </a>
                </div>
                <Button
                  variant="contained"
                  type="submit"
                  style={{
                    marginTop: "1vh",
                    backgroundColor: "green",
                  }}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  style={{
                    marginTop: "1vh",
                  }}
                  href="/create_account"
                  type="submit"
                >
                  Sign Up
                </Button>
              </form>
            </motion.div>
            {msg !== "" && <p style={{ color: "red" }}>{msg}</p>}
            {loading ? (
              <div
                style={{
                  zIndex: "10000",
                  opacity: "0.9",
                  left: "47%",
                  top: "30%",
                  position: "absolute",
                }}
              >
                <FadeLoading />
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default Login;
