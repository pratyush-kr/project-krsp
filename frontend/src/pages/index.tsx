import { Header } from "@/components/HeaderComponent";
import styles from "@/styles/Home.module.css";
import { SliderData } from "../components/SliderData";
import HomeCard from "@/components/HomeCard";
import { Footer } from "@/components/FooterComponent";
import { useEffect, useContext } from "react";
import { UserContext } from "@/contexts/UserContext";
import { JwtCookie } from "@/types/JwtCookie";
import Slider from "@/components/Slider";
import { User as UserClass } from "@/models/User";

/*prettier-ignore*/
const images = {
    depression: "https://thumbs.dreamstime.com/b/depression-text-paper-word-depression-piece-paper-concept-image-depression-syndrome-depression-text-paper-word-100125055.jpg",
    anxiety: "https://genesight.com/wp-content/uploads/2022/02/GeneSight-Anxiety-on-Paper-scaled-e1645210438615.jpg",
    stress: "https://www.mentalhealth.org.uk/sites/default/files/2022-05/stress-wording-tile.png",
  }

export default function Home() {
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
  }, []);
  return (
    <div className={styles.page}>
      <Header />
      <div className={styles.body}>
        <Slider slides={SliderData} autoplay={true} />
        <div className={styles.imageContainer}>
          <HomeCard imgUrl={images.depression} name="depression" />
          <HomeCard imgUrl={images.anxiety} name="anxiety" />
          <HomeCard imgUrl={images.stress} name="stress" />
        </div>
        <Footer />
      </div>
    </div>
  );
}
