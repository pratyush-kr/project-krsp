import React, { useState, useEffect } from "react";
import { Header } from "@/components/HeaderComponent";
import { Footer } from "@/components/FooterComponent";
import { Button, TextField } from "@mui/material";
import axios from "axios";
import emailjs from "emailjs-com";
import { useContext } from "react";
import { Autocomplete } from "@mui/material";
import { SchemeContext } from "@/contexts/SchemeContext";
import { Doctors } from "@/types/Doctors";
import { StartPaymentResponse } from "@/types/StartPaymentResponse";
import { JwtCookie } from "@/types/JwtCookie";
import { useRouter } from "next/router";
import styles from "@/styles/PaymentOptions.module.css";

declare global {
    interface Window {
        Razorpay: any;
    }
}

const style = {
    width: "25vw",
    marginTop: "1.5vh",
};

export default function PaymentOptions() {
    const schemeContext = useContext(SchemeContext);
    const [doctors, setDoctors] = useState<[Doctors]>([{ id: "", name: "" }]);
    const [data, setData] = useState({
        userName: "",
        email: "",
        appointment_date: "",
        contact: "",
        doctor: "",
        appointment_time: "",
        doctor_id: "",
    });
    const router = useRouter();
    const handleChange = (event: any, value: any) => {
        setData((data) => {
            try {
                return {
                    ...data,
                    doctor: event.target.innerText,
                    doctor_id: value.id,
                };
            } catch {
                return {
                    ...data,
                    doctor: event.target.innerText,
                    doctor_id: "",
                };
            }
        });
    };
    const handleDataChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name;
        const value = event.target.value;
        if (name !== null) setData({ ...data, [name]: value });
    };
    console.log(data);
    const handlePaymentSuccess = (response: StartPaymentResponse) => {
        try {
            let bodyData = new FormData();
            // we will send the response we've got from razorpay to the backend to validate the payment
            bodyData.append("response", JSON.stringify(response));
            bodyData.append("doctor_id", data.doctor_id);
            const cookie = localStorage.getItem("user_info");
            if (cookie === null) {
                return;
            }
            const jwt_cookie: JwtCookie = JSON.parse(cookie);
            const config = {
                headers: {
                    Authorization: `Bearer ${jwt_cookie.jwt}`,
                },
            };
            axios
                .post(axios.defaults.baseURL + "/krsp/order/handle_payment_success/", bodyData, config)
                .then((res) => {
                    if (res.data.error === "Something went wrong") {
                        alert("payment not done");
                        return;
                    }
                    var emailContenet = {
                        to_name: data.email,
                        from_name: "krsp",
                        message: "Thank You For choosing krsp",
                    };
                    emailjs
                        .send("service_egxiqir", "template_flwdrrp", emailContenet, "zLmIanEcHUGX8V3gR")
                        .then(
                            (result) => {
                                alert("email is sent to your email id");
                                router.push("/my_appointments");
                            },
                            (error) => {}
                        );
                })
                .catch((err) => {});
        } catch (error) {}
    };
    const showRazorPay = async (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        let bodyData = new FormData();
        bodyData.append("amount", schemeContext.cost);
        bodyData.append("userName", data.userName);
        bodyData.append("email", data.email);
        bodyData.append("appointment_date", data.appointment_date);
        bodyData.append("appointment_time", data.appointment_time);
        bodyData.append("doctor", data.doctor);
        bodyData.append("contact", data.contact);
        let response: StartPaymentResponse | null = null;
        response = await axios({
            url: axios.defaults.baseURL + "/krsp/order/start_payment/",
            method: "POST",
            data: bodyData,
            headers: {
                Accept: "application/json",
                "content-Type": "application/json",
            },
        })
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                return null;
            });
        if (response === null) {
            return;
        }
        const options = {
            key: "rzp_test_8zqflSyFkDEX6n",
            amount: parseInt(response.order.order_amount.replace("₹", "")) * 100,
            order_id: response.payment.id,
            currency: "INR",
            name: response.order.order_user_name,
            handler: function (response: StartPaymentResponse) {
                handlePaymentSuccess(response);
            },
            prefill: {
                name: response.order.order_user_name,
                email: response.order.order_email,
                contact: response.order.order_contact,
            },
        };
        var rzp1 = new window.Razorpay(options);
        rzp1.open();
    };
    const [redirectToLogin, setRedirectToLogin] = useState(false);
    useEffect(() => {
        const cookie: string | null = localStorage.getItem("user_info");
        if (cookie === null) {
            return;
        }
        const jwt_cookie: JwtCookie = JSON.parse(cookie);
        const name = jwt_cookie.name;
        if (name === null) {
            router.push("/login");
        }
        if (schemeContext.name === "") {
            router.push("/BookNow");
        }
        axios
            .get(axios.defaults.baseURL + "/krsp/doctors/get_doctors/")
            .then((res) => setDoctors(res.data.users));
        setData((data) => {
            var proxyData = data;
            proxyData.email = jwt_cookie.email;
            proxyData.userName = jwt_cookie.name;
            return proxyData;
        });
    }, []);

    return (
        <div className={styles.page}>
            <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
            <Header />
            <div className={styles.body}>
                <div className={styles.box}>
                    <div className={styles.options}>
                        <div className={styles.forms}>
                            <div className={styles.part}>
                                <TextField
                                    sx={style}
                                    type="text"
                                    label="Name"
                                    name="userName"
                                    onChange={handleDataChange}
                                    value={data.userName}
                                />
                                <TextField
                                    sx={style}
                                    type="number"
                                    label="Contact"
                                    name="contact"
                                    onChange={handleDataChange}
                                    value={data.contact}
                                />
                                <TextField
                                    sx={style}
                                    type="date"
                                    name="appointment_date"
                                    value={data.appointment_date}
                                    label="Appointment Date"
                                    onChange={handleDataChange}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </div>
                            <div className={styles.part}>
                                <TextField
                                    sx={style}
                                    type="email"
                                    label="Email"
                                    name="email"
                                    value={data.email}
                                    onChange={handleDataChange}
                                />
                                <Autocomplete
                                    options={doctors}
                                    getOptionLabel={(option) => option.name}
                                    renderOption={(props, option) => (
                                        <li {...props} key={option.id}>
                                            {option.name}
                                        </li>
                                    )}
                                    onChange={handleChange}
                                    renderInput={(params) => (
                                        <TextField sx={style} label="Doctor" {...params} />
                                    )}
                                />
                                <TextField
                                    sx={style}
                                    label="Time"
                                    type="time"
                                    name="appointment_time"
                                    value={data.appointment_time}
                                    onChange={handleDataChange}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </div>
                        </div>
                        <Button
                            className={styles.btn}
                            variant="contained"
                            disabled={
                                data.userName === "" ||
                                data.email === "" ||
                                data.appointment_date === "" ||
                                data.doctor === "" ||
                                data.contact === ""
                            }
                            onClick={showRazorPay}
                            sx={style}
                        >
                            Proceed
                        </Button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
