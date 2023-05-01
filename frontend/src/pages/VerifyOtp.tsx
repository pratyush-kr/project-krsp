import React, { useContext, useState } from "react";
import { Header } from "@/components/HeaderComponent";
import { Footer } from "@/components/FooterComponent";
import { TextField } from "@mui/material";
import { Button } from "@mui/material";
import { MuiOtpInput } from "mui-one-time-password-input";
import axios from "axios";
import { useRouter } from "next/router";
import { User } from "@/models/User";
import { UserContext } from "@/contexts/UserContext";
import { Config } from "@/types/Config";
import { JwtCookie } from "@/types/JwtCookie";
import styles from "@/styles/VerifyOtp.module.css";

const VerifyOtp = () => {
  const userContext = useContext(UserContext);
  const [otp, setOtp] = React.useState("");
  const handleChange = (newValue: string) => {
    setOtp(newValue);
  };
  const [newPassword, setNewPassword] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();
  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const data = {
      otp: otp,
      email: localStorage.getItem("email"),
    };
    const user: User = new User();
    const validToken: boolean = await user.verifyToken();
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
    const res = await axios.post(axios.defaults.baseURL + "/krsp/user/verify_otp/", data, config);
    if (res.data.otp === "verified") {
      if (newPassword === password) {
        const newData = {
          email: localStorage.getItem("email"),
          otp: otp,
          password: password,
        };
        const response = await axios.post(
          axios.defaults.baseURL + "/krsp/user/update_password/",
          newData,
          config
        );
        if (response.data["msg"] === "password changed") {
          router.push("/Login");
        }
      }
    }
  };
  return (
    <div className={styles.body}>
      <Header />
      <div className={styles.box}>
        <span className={`${styles.watermark} ${styles.disableSelect}`}>Created By Team Effort</span>
        <div className={styles.container}>
          <MuiOtpInput placeholder="0" className={styles.input} value={otp} onChange={handleChange} />
          <TextField
            className={styles.input}
            label="New password"
            value={newPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.currentTarget.value)}
            type="password"
          />
          <TextField
            className={styles.input}
            label="Retype password"
            type="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.currentTarget.value)}
          />
          <div className={`${styles.next} ${styles.filler}`}>
            <Button variant="contained" onClick={handleClick}>
              Change Password
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default VerifyOtp;
