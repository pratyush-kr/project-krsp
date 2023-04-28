import React from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { Button } from "@mui/material";
import styles from "@/styles/HomeCard.module.css";
import Link from "next/link";

interface HomeCardProps {
  name: string;
  imgUrl: string;
}

const HomeCard: React.FC<HomeCardProps> = (props) => {
  const router = useRouter();
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    localStorage.setItem("page_name", props.name);
    router.push("/KnowMore");
  };
  return (
    <div className={styles.homeCards}>
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
        <Link href="/KnowMore" onClick={handleClick}>
          <img className={styles.img} src={props.imgUrl} alt="" />
        </Link>
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
