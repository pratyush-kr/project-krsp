import React, { useState, useEffect } from "react";
import styles from "@/styles/Slider.module.css";
import { IconButton } from "@mui/material";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";

interface SliderProps {
    slides: string[];
    intervalTime?: number;
    autoplay?: boolean;
}

const defaultProps: SliderProps = {
    slides: [""],
    intervalTime: 5000,
    autoplay: false,
};

function Slider(props: SliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        let intervalId: any = null;
        if (props.autoplay !== undefined) {
            intervalId = setInterval(() => {
                setCurrentIndex((currentIndex + 1) % props.slides.length);
            }, props.intervalTime || defaultProps.intervalTime);
            return () => clearInterval(intervalId);
        }
    }, [currentIndex, props.intervalTime, props.slides.length]);

    const handleDotClick = (index: number) => {
        setCurrentIndex(index);
    };

    const handleNextClick = () => {
        setCurrentIndex((currentIndex + 1) % props.slides.length);
    };

    const handlePrevClick = () => {
        setCurrentIndex((currentIndex - 1 + props.slides.length) % props.slides.length);
    };

    const renderDots = () => {
        return props.slides.map((slide, index) => (
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
                <img className={styles.image} src={props.slides[currentIndex]} alt="slider" />
                <div className={styles.navBtn}>
                    <IconButton
                        onClick={handlePrevClick}
                        sx={{
                            fontSize: "5rem",
                            color: "white",
                        }}
                    >
                        <img src="/arrow_left.png" alt="arrow_left" className={styles.arrow} />
                    </IconButton>
                    <IconButton
                        onClick={handleNextClick}
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
