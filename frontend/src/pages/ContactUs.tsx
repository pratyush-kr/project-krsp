import React, { useContext, useEffect } from "react";
import { Header } from "@/components/HeaderComponent";
import { Footer } from "@/components/FooterComponent";
import styles from "@/styles/ContactUs.module.css";
import { UserContext } from "@/contexts/UserContext";
import axios from "axios";
import { User as UserClass } from "@/models/User";
import { JwtCookie } from "@/types/JwtCookie";

const ContactUs = () => {
  const userContext = useContext(UserContext);
  useEffect(() => {
    const loader = async () => {
      const user: UserClass = new UserClass();
      const validToken: boolean = await user.verifyToken();
      if (!validToken) {
        userContext.logout();
        user.getAndSaveGuestToken();
        localStorage.removeItem("user_info");
        return;
      }
      const cookie: JwtCookie = user.getCookieJson();
      if (cookie.name !== "Guest User") {
        userContext.setUsername(cookie.name);
        userContext.login();
      }
    };
    loader();
  });
  return (
    <div className={`${styles.contactUs} ${styles.body}`}>
      <Header />
      <div className={styles.page}>
        <h2>CONTACT US</h2>
        <div className={styles.view}>
          <div className={styles.divided}>
            <h3>WE ARE HERE FOR YOU</h3>
            <div>
              Best Mental Health Helpline India 24×7 Psychologist Helpline & Support. Krsp is the best online
              counselling and therapy consultation platform in India. Consult Online Psychologist, Counsellor,
              Mental Health Therapist Now.
            </div>
          </div>
          <div className={`${styles.divided} ${styles.box}`}>
            <h3>Our Contacts</h3>
            <div className={styles.contactLinks}>
              <div>
                Email us:
                <a href="mailto:contact@krsp.com">contact@krsp.com</a>
              </div>
              <div>
                Phone No:
                <a href="tel:+919876543210">+919876543210</a>
              </div>
              <div>
                Whatsapp:
                <a href="https://wa.me/+917873893512">+917873893512</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactUs;
