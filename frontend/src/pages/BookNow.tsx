import React, { useEffect } from "react";
import { Header } from "@/components/HeaderComponent";
import { Footer } from "@/components/FooterComponent";
import Button from "@mui/material/Button";
import SchemeCard from "@/components/SchemeCard";
import { useContext } from "react";
import LoginDialog from "@/components/LoginDialogComponent";
import { useRouter } from "next/router";
import { SchemeContext } from "@/contexts/SchemeContext";
import { UserContext } from "@/contexts/UserContext";
import styles from "@/styles/BookNow.module.css";
import { SelectedContext } from "@/contexts/SelectedContext";
import { JwtCookie } from "@/types/JwtCookie";
import { User as UserClass } from "@/models/User";

const schemes = [
  {
    id: 1,
    name: "normalCare",
    cost: "₹150",
    time: "13min",
    message: "Our best doctors available on the next slot available",
  },
  {
    id: 2,
    name: "vipCare",
    cost: "₹250",
    time: "25min",
    message: "Our best doctors available on same day",
  },
  {
    id: 3,
    name: "premiumCare",
    cost: "₹400",
    time: "45min",
    message: "Our best doctors available at your comfortable time",
  },
];

const BookNow = () => {
  const router = useRouter();
  const schemeContext = useContext(SchemeContext);
  const selectedContext = useContext(SelectedContext);
  const handleNextClick = () => {
    router.push("/PaymentOptions");
  };
  const userContext = useContext(UserContext);
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

  return (
    <div>
      <div className={styles.body}>
        <Header />
        <div className={styles.page}>
          <div className={styles.view}>
            <div className={`${styles.options} ${styles}`}>
              {schemes.map((scheme, index) => (
                <SchemeCard scheme={{ ...scheme, set: schemeContext.set }} index={index} key={scheme.id} />
              ))}
            </div>
            <div className={styles.btnContainer}>
              <div className={`${styles.btn} ${styles.mobileOff}"`} />
              <div className={`${styles.btn} ${styles.mobileOff}"`} />
              <Button
                className={styles.btn}
                variant="contained"
                sx={{
                  filter: "drop-shadow(10px 10px 10px grey);",
                }}
                disabled={schemeContext.name === ""}
                onClick={handleNextClick}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
      <LoginDialog isOpen={!userContext.isAuthenticated} />
      <Footer />
    </div>
  );
};

export default BookNow;
