import React from "react";
import { Header } from "@/components/HeaderComponent";
import { Footer } from "@/components/FooterComponent";
import { useState } from "react";
import { IconButton } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useEffect } from "react";
import axios from "axios";
import ReviewDialog from "@/components/ReviewDialog";
import StarRatings from "react-star-ratings";
import { UserContext } from "@/contexts/UserContext";
import { useContext } from "react";
import styles from "@/styles/Doctors.module.css";
import { User } from "@/models/User";
import { Doctor } from "@/models/Doctor";
import { motion } from "framer-motion";
import { ClipLoading } from "@/components/Spinners";

function Doctors() {
  const [openDialog, setOpenDialog] = useState(false);
  const [page, setPage] = useState(0);
  const [doctorId, setDoctorId] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const userContext = useContext(UserContext);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    const loader = async () => {
      const user = new User();
      const validToken: boolean = await user.verifyToken();
      if (!validToken) {
        user.getAndSaveGuestToken();
        userContext.logout();
      }
      setLoading(() => true);
      const data = await Doctor.getDoctors();
      await setDoctors(data);
      setLoading(() => false);
    };
    loader();
  }, []);
  const handleReview = (event: React.MouseEvent) => {
    const id = event.currentTarget.id;
    const doctor = doctors.filter((doctor) => `${doctor.id}` === id)[0];
    setDoctorName(doctor.name);
    setOpenDialog(true);
    setDoctorId(id);
  };
  return (
    <div className={styles.body}>
      <Header />
      <motion.div
        animate={{
          opacity: loading ? 0.7 : 1,
        }}
        initial={{
          opacity: 0,
        }}
        transition={{
          duration: 2,
        }}
        className={styles.form}
      >
        <div className={styles.doctorBox}>
          <div className={styles.container}>
            {doctors.slice(page * 4, (page + 1) * 4).map((doctor, index) => (
              <div className={styles.box} key={index} id={doctor.id} onClick={handleReview}>
                <div className={styles.imgContainer}>
                  <img src={`${axios.defaults.baseURL}${doctor.image}`} alt="Doctor" />
                </div>
                <div className={styles.details}>
                  <div className={styles.name}>{doctor.name}</div>
                  <div className={styles.experience}>{doctor.experience}</div>
                  <div>
                    <StarRatings
                      rating={doctor.ratings}
                      starRatedColor="#FFD700"
                      numberOfStars={5}
                      starDimension="40px"
                      name="rating"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className={`${styles.btn} ${styles.fixed}`}>
            <IconButton
              disabled={page < 1}
              onClick={() => {
                setPage((page) => page - 1);
              }}
            >
              <ArrowBackIosIcon />
            </IconButton>
            <IconButton
              onClick={() => {
                setPage((page) => page + 1);
              }}
              disabled={page >= parseInt(doctors.length / 4 + "")}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </div>
        </div>
        <ReviewDialog
          isOpen={openDialog}
          setOpenDialog={setOpenDialog}
          doctorId={doctorId}
          doctorName={doctorName}
        />
      </motion.div>
      <Footer />
      {loading && (
        <div
          style={{
            zIndex: "10000",
            opacity: "1",
            left: "47%",
            top: "45%",
            position: "absolute",
          }}
        >
          <ClipLoading />
        </div>
      )}
    </div>
  );
}

export default Doctors;
