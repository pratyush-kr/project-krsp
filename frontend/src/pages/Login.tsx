import React, { useContext, useState, useEffect } from "react";
import { Header } from "@/components/HeaderComponent";
import { Footer } from "@/components/FooterComponent";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { UserContext } from "@/contexts/UserContext";
import { motion } from "framer-motion";
import { FadeLoading } from "@/components/Spinners";
import { useRouter } from "next/router";
import styles from "@/styles/Login.module.css";
import { User as UserClass } from "@/models/User";
import { JwtCookie } from "@/types/JwtCookie";
import Link from "next/link";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const userContext = useContext(UserContext);
  const router = useRouter();
  useEffect(() => {
    const loader = async () => {
      const user: UserClass = new UserClass();
      const isTokenValid: boolean = await user.verifyToken();
      if (isTokenValid) {
        const jwtToken: JwtCookie | null = await user.getCookieJson();
        if (jwtToken !== null && jwtToken.name === "Guest User") {
          userContext.logout();
        } else if (jwtToken !== null) {
          userContext.login();
          router.push("/");
        }
      } else {
        const jwtToken: JwtCookie | null = await user.getAndSaveGuestToken();
      }
    };
    try {
      loader();
    } catch (error) {
      console.error(error);
    }
  }, []);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setLoading(() => true);
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const user: UserClass = new UserClass();
    try {
      const response = await user.loginRequest(data.get("email") as string, data.get("password") as string);
      localStorage.setItem("user_info", response);
      userContext.login();
      router.push("/");
    } catch (error: any) {
      setMsg(error.message);
      setLoading(() => false);
    }
  };
  return (
    <div className={styles.body}>
      <Header />
      <div className={styles.page}>
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
          className={styles.form}
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
              <Link href="/ForgotPassword" className={styles.forgot}>
                forgot password
              </Link>
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
              onClick={() => router.push("/CreateAccount")}
            >
              Sign Up
            </Button>
          </form>
        </motion.div>
        {msg !== "" && <p style={{ color: "red" }}>{msg}</p>}
        {loading && (
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
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Login;
