import React, { useContext, useEffect, useState } from "react";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PaidIcon from "@mui/icons-material/Paid";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import { SvgIcon } from "@mui/material";
import { SchemeContext } from "@/contexts/SchemeContext";
import { motion } from "framer-motion";
import { Scheme } from "@/types/Scheme";
import styles from "@/styles/SchemeCard.module.css";
import { SelectedContext } from "@/contexts/SelectedContext";

interface Props {
  scheme: Scheme;
  index: number;
}

const SchemeCard: React.FC<Props> = ({ scheme, index }) => {
  const scheme_context = useContext(SchemeContext);
  const selected_scheme_context = useContext(SelectedContext);
  const [constantDelay, setConstantDelay] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setConstantDelay(true);
    }, 100);
  });
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    const id = event.currentTarget.id;
    if (id === "normalCare") {
      selected_scheme_context.set({
        normalCare: "selected",
        vipCare: "",
        premiumCare: "",
        set: selected_scheme_context.set,
        get: selected_scheme_context.get,
      });
    } else if (id === "vipCare") {
      selected_scheme_context.set({
        normalCare: "",
        vipCare: "selected",
        premiumCare: "",
        set: selected_scheme_context.set,
        get: selected_scheme_context.get,
      });
    } else if (id === "premiumCare") {
      selected_scheme_context.set({
        normalCare: "",
        vipCare: "",
        premiumCare: "selected",
        set: selected_scheme_context.set,
        get: selected_scheme_context.get,
      });
    }
    scheme_context.set(scheme);
  };
  return (
    <motion.div
      animate={{
        x: 0,
        y: 0,
        opacity: 1,
      }}
      initial={{
        opacity: 0,
        x: -100,
      }}
      transition={{
        type: "spring",
        delay: !constantDelay ? 0.5 * index : 0.1,
        duration: 0.75,
        ease: "easeOut",
      }}
      className={`${styles.option} ${styles[selected_scheme_context.get(scheme.name)]}`}
      id={scheme.name}
      whileHover={{
        scale: 1.1,
      }}
    >
      <div className={`${styles.content}`} id={scheme.name} onClick={handleClick}>
        <div className={`${styles.card}`}>
          <SvgIcon fontSize="large">
            <AccessTimeIcon />
          </SvgIcon>
          <div className={`${styles.scheme}`}>{scheme.time}</div>
        </div>
        <div className={`${styles.card}`}>
          <SvgIcon fontSize="large">
            <PaidIcon />
          </SvgIcon>
          <div className={`${styles.scheme}`}>{scheme.cost}</div>
        </div>
        <div className={`${styles.card}`}>
          <SvgIcon fontSize="large">
            <LocalHospitalIcon />
          </SvgIcon>
          <div className={`${styles.scheme}`}>{scheme.message}</div>
        </div>
      </div>
    </motion.div>
  );
};

export default SchemeCard;
