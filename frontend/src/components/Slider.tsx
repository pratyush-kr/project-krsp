import React, { useState, useEffect } from "react";
import styles from "@/styles/Slider.module.css";
import { IconButton, Button } from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { SliderData } from "@/types/SliderData";
import { useRouter } from "next/router";

interface SliderProps {
    slides: SliderData[];
    autoplay: boolean;
    intervalTime?: number;
}

const defaultProps: SliderProps = {
    slides: [],
    intervalTime: 5000,
    autoplay: false,
};

function Slider({ slides, autoplay, intervalTime }: SliderProps) {
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);
    const handleBookNowClick = () => {
        router.push("/BookNow");
    };

    useEffect(() => {
        let intervalId: any = null;
        if (autoplay !== undefined) {
            intervalId = setInterval(() => {
                setCurrentIndex((currentIndex + 1) % slides.length);
            }, intervalTime || defaultProps.intervalTime);
            return () => clearInterval(intervalId);
        }
    }, [currentIndex, intervalTime, slides]);

    const handleDotClick = (index: number) => {
        setCurrentIndex(index);
    };

    const handleNextClick = () => {
        setCurrentIndex((currentIndex + 1) % slides.length);
    };

    const handlePrevClick = () => {
        setCurrentIndex((currentIndex - 1 + slides.length) % slides.length);
    };

    const renderDots = () => {
        return slides.map((slide, index) => (
            <IconButton
                key={index}
                onClick={() => handleDotClick(index)}
                color="secondary"
                size="small"
                style={{
                    transform: currentIndex === index ? "scale(1.4)" : "scale(1.0)",
                    color: "black",
                    opacity: "0.8",
                    transition: "all 0.2s ease-in-out",
                }}
            >
                <FiberManualRecordIcon />
            </IconButton>
        ));
    };

    return (
        <div>
            <div className={styles.slider}>
                <img className={styles.image} src={slides[currentIndex].url} alt="slider" />
                <div className={styles.navBtn}>
                    <IconButton
                        onClick={handlePrevClick}
                        id="iconBtn"
                        sx={{
                            fontSize: "5rem",
                            color: "white",
                        }}
                    >
                        <img src="/arrow_left.png" alt="arrow_left" className={styles.arrow} />
                    </IconButton>
                    <div className={styles.textBtn}>
                        <p style={{ color: "black" }}>{slides[currentIndex].text}</p>
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
                    <IconButton
                        className={styles.opaque}
                        onClick={handleNextClick}
                        id="iconBtn"
                        sx={{
                            fontSize: "5rem",
                            color: "white",
                        }}
                    >
                        <img src="/arrow_right.png" alt="arrow_right" className={styles.arrow} />
                    </IconButton>
                </div>
            </div>
            <div className={styles.dotsContainer}>{renderDots()}</div>
        </div>
    );
}

export default Slider;
