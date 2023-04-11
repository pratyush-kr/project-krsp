import { Header } from "@/components/HeaderComponent";
import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import { SliderData } from "../components/SliderData";
import HomeCard from "@/components/HomeCard";
import { Footer } from "@/components/FooterComponent";
import { useEffect, useContext } from "react";
import { UserContext } from "@/contexts/UserContext";
import { JwtCookie } from "@/types/JwtCookie";
import Slider from "@/components/Slider";

/*prettier-ignore*/
const images = {
    depression: "https://thumbs.dreamstime.com/b/depression-text-paper-word-depression-piece-paper-concept-image-depression-syndrome-depression-text-paper-word-100125055.jpg",
    anxiety: "https://genesight.com/wp-content/uploads/2022/02/GeneSight-Anxiety-on-Paper-scaled-e1645210438615.jpg",
    stress: "https://www.mentalhealth.org.uk/sites/default/files/2022-05/stress-wording-tile.png",
  }

export default function Home() {
    const router = useRouter();
    const handleBookNowClick = (event: React.MouseEvent<HTMLElement>) => {
        router.push("/book_now");
    };
    const userContext = useContext(UserContext);
    useEffect(() => {
        const cookie: string | null = localStorage.getItem("user_info");
        if (cookie === null) {
            return;
        }
        const jwtCookie: JwtCookie = JSON.parse(cookie);
        userContext.setUsername(jwtCookie.name);
        userContext.login();
    }, []);
    return (
        <div className={styles.page}>
            <Header />
            <div className={styles.body}>
                {/* <AwesomeSlider className={styles.slider}>
                    {SliderData.map((slider, index) => (
                        <div key={slider.id} className={styles.container}>
                            <img className={styles.image} src={slider.url} alt="slide" />
                            <div className={styles.textBtn}>
                                <p style={{ color: "white" }}>{slider.text}</p>
                                <div className={styles.btnContainer}>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            backgroundColor: "#8d72e1",
                                            margin: "auto",
                                        }}
                                        onClick={handleBookNowClick}
                                    >
                                        Book Now
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </AwesomeSlider> */}
                <Slider slides={SliderData.map((slide) => slide.url)} autoplay={true} />
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