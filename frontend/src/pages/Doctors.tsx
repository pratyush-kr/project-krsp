import React from "react";
import { Header } from "@/components/HeaderComponent";
import { Footer } from "@/components/FooterComponent";
import { useState } from "react";
import { IconButton } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useEffect } from "react";
import axios, { AxiosError } from "axios";
import ReviewDialog from "@/components/ReviewDialog";
import StarRatings from "react-star-ratings";
import { UserContext } from "@/contexts/UserContext";
import { useContext } from "react";
import styles from "@/styles/Doctors.module.css";
import { JwtCookie } from "@/types/JwtCookie";
import { useRouter } from "next/router";
function Doctors() {
    const router = useRouter();
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
        // Doctors page logic
        const cookie: string | null = localStorage.getItem("user_info"); // get auth cookie from local storage
        // Guest cookie is to be used to access all the apis that can be accessed by an unauthenticated user
        let guestCookie: string | null = sessionStorage.getItem("guest_info"); // get guestCookie from sessionStorage
        if (cookie !== null) {
            // if there are a auth cookie delete session cookie
            // as all the apis can be accessed using auth cookie also
            sessionStorage.removeItem("guest_info");
        }
        if (cookie === null && guestCookie === null) {
            /*
            if cookie and guest cookie is not set
            then we have to get a guest token and set it            
            */
            axios.get(axios.defaults.baseURL + "/krsp/user/get_token/").then((res) => {
                sessionStorage.setItem("guest_info", JSON.stringify(res.data));
            });
        }
        // get an empty jwt cookie object
        let jwt_cookie: JwtCookie = {
            email: "",
            is_doctor: false,
            jwt: "",
            name: "",
            profile_picture: "",
        };
        /*
        since we have defined that cookie and guest cookie can
        both be null we have to check about them
        */
        if (cookie !== null) {
            jwt_cookie = JSON.parse(cookie);
        } else if (guestCookie !== null) {
            jwt_cookie = JSON.parse(guestCookie);
        }
        // config headers
        const config = {
            headers: {
                Authorization: `Bearer ${jwt_cookie.jwt}`,
            },
        };
        /*
        get_doctor
        using config bearer token
        if there are no bearer token set in
        config then the axios will throw 401 error
        */
        axios
            .get(axios.defaults.baseURL + "/krsp/doctors/get_doctors/", config)
            .then((res) => {
                setDoctors(res.data.users);
            })
            .catch((err: AxiosError) => {
                if (err.response?.status === 401) {
                    /*
                    if we have an un auth error make sure that
                    user is logged out, then delete localStorage cookie,
                    and sessionStorage cookie
                    */
                    user.logout();
                    localStorage.removeItem("user_info");
                    sessionStorage.removeItem("guest_info");
                    axios.get(axios.defaults.baseURL + "/krsp/user/get_token/").then((res) => {
                        sessionStorage.setItem("guest_info", JSON.stringify(res.data));
                        /*
                        when session cookie is set then make sure,
                        that reload the page so that the doctor api can be called and
                        all the doctors are loaded
                        */
                        window.location.reload();
                    });
                }
            });
        if (cookie === null) {
            // if we don't have any auth cookie set we don't set user is logged
            // and return
            return;
        }
        user.login();
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
