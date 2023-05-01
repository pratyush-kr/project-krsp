import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import GoogleIcon from "@mui/icons-material/Google";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import { SvgIcon } from "@mui/material";
import { motion } from "framer-motion";
import { SocialMediaContactUrls } from "@/types/SocialMediaContactUrls";
import styles from "@/styles/Member.module.css";

const links_array1 = [
  { icon: <FacebookIcon />, name: "facebook" },
  { icon: <TwitterIcon />, name: "twitter" },
  { icon: <GoogleIcon />, name: "google" },
];
const links_array2 = [
  { icon: <InstagramIcon />, name: "instagram" },
  { icon: <LinkedInIcon />, name: "linkedIn" },
  { icon: <GitHubIcon />, name: "github" },
];

interface Props {
  name: string;
  bio: string;
  imgSrc: string;
  urls: SocialMediaContactUrls<string>;
  index: number;
}
const Member: React.FC<Props> = ({ name, bio, imgSrc, urls, index }) => {
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
        delay: 0.5 * index,
        duration: 0.75,
        ease: "easeOut",
      }}
      className={styles.member}
    >
      <img src={imgSrc} alt={name} />
      <h3>{name}</h3>
      <p>{bio}</p>
      <div className={styles.icons}>
        <div className={styles.container}>
          {links_array1.map((item) => {
            return (
              <a href={urls[item.name]} target="_blank" rel="noreferrer">
                <SvgIcon className={styles.icon} color="action">
                  {item.icon}
                </SvgIcon>
              </a>
            );
          })}
        </div>
        <div className={styles.container}>
          {links_array2.map((item) => {
            return (
              <a href={urls[item.name]} target="_blank" rel="noreferrer">
                <SvgIcon className={styles.icon} color="action">
                  {item.icon}
                </SvgIcon>
              </a>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
export default Member;
