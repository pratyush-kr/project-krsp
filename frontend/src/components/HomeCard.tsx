import React from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { Button } from "@mui/material";
import styles from "@/styles/HomeCard.module.css";
interface HomeCardProps {
    name: string;
    imgUrl: string;
}

const HomeCard: React.FC<HomeCardProps> = (props) => {
    const router = useRouter();
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        localStorage.setItem("page_name", props.name);
        router.push("/know_more");
    };
    return (
        <div>
            <motion.div
                whileInView={{
                    opacity: 1,
                }}
                initial={{
                    opacity: 0,
                }}
                transition={{
                    duration: 1,
                }}
                className={styles.homeCard}
            >
                <a href="#!">
                    <img className={styles.img} src={props.imgUrl} alt="" />
                </a>
                <div className={styles.knowMoreBtnContainer}>
                    <motion.div
                        whileHover={{
                            scale: 1.1,
                        }}
                        whileTap={{
                            scale: 0.9,
                        }}
                    >
                        <Button
                            variant="contained"
                            style={{ backgroundColor: "#8d72e1" }}
                            className={styles.btn}
                            onClick={handleClick}
                        >
                            Know More
                        </Button>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default HomeCard;
