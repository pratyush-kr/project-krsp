import React, { useContext, useState } from "react";
import { Header } from "@/components/HeaderComponent";
import { Footer } from "@/components/FooterComponent";
import { TextField } from "@mui/material";
import { Button } from "@mui/material";
import axios from "axios";
import styles from "@/styles/ForgotPassword.module.css";
import { Config } from "@/types/Config";
import { User } from "@/models/User";
import { UserContext } from "@/contexts/UserContext";
import { JwtCookie } from "@/types/JwtCookie";
import { useRouter } from "next/router";

const ForgotPassword = () => {
  const userContext = useContext(UserContext);
  const [message, setMessage] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const router = useRouter();
  const handleClick = async () => {
    localStorage.setItem("email", email);
    const user: User = new User();
    const validToken = await user.verifyToken();
    if (!validToken) {
      userContext.logout();
      user.getAndSaveGuestToken();
      return;
    }
    const cookie: JwtCookie = user.getCookieJson();
    const config: Config = {
      headers: {
        Authorization: `Bearer ${cookie.jwt}`,
      },
    };
    try {
      const response = await axios
        .post(
          axios.defaults.baseURL + "/krsp/user/send_otp_to_email/",
          {
            email: email,
          },
          config
        )
        .catch((err: any) => {
          setMessage(err?.response.data.msg);
          return { data: { redirect: false } };
        });
      if (response.data.redirect) router.push("VerifyOtp");
    } catch (err: any) {
      setMessage(err?.response.data.msg);
    }
  };
  return (
    <div className={styles.body}>
      <Header />
      <div className={styles.box}>
        <span className={`${styles.watermark} ${styles.disableSelect}`}>Created By Team Effort</span>
        <div className={styles.container}>
          <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          {message !== null && <p style={{ color: "red" }}>{message}</p>}
          <div className={`${styles.next} ${styles.filler}`}>
            <div className={styles.filler} />
            <div className={styles.filler} />
            <Button variant="contained" onClick={handleClick}>
              Next
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ForgotPassword;
