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
function Doctors() {
  const [openDialog, setOpenDialog] = useState(false);
  const [page, setPage] = useState(0);
  const [doctorId, setDoctorId] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const user = useContext(UserContext);
  const [doctors, setDoctors] = useState([
    {
      id: "",
      name: "",
      experience: "",
      image: "",
      ratings: 0,
    },
  ]);
  useEffect(() => {
    axios.get(axios.defaults.baseURL + "/krsp/doctors/get_doctors/").then((res) => {
      setDoctors(res.data.users);
      const cookie: string | null = localStorage.getItem("user_info");
      if (cookie === null) {
        return;
      }
      user.login();
    });
  }, []);
  const handleReview = (event: React.MouseEvent) => {
    const id = event.currentTarget.id;
    console.log(id);
    const doctor = doctors.filter((doctor) => `${doctor.id}` === id)[0];
    setDoctorName(doctor.name);
    setOpenDialog(true);
    setDoctorId(id);
  };
  return (
    <div className={styles.body}>
      <Header />
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
      <Footer />
    </div>
  );
}

export default Doctors;
