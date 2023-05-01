import React, { useState, useEffect } from "react";
import { Header } from "@/components/HeaderComponent";
import { Footer } from "@/components/FooterComponent";
import { Button, TextField } from "@mui/material";
import { useContext } from "react";
import { Autocomplete } from "@mui/material";
import { SchemeContext } from "@/contexts/SchemeContext";
import { Doctors } from "@/types/Doctors";
import { StartPaymentResponse } from "@/types/StartPaymentResponse";
import { JwtCookie } from "@/types/JwtCookie";
import { useRouter } from "next/router";
import styles from "@/styles/PaymentOptions.module.css";
import { UserContext } from "@/contexts/UserContext";
import { User as UserClass } from "@/models/User";
import { Doctor } from "@/models/Doctor";
import { Payment } from "@/models/Payment";
import { HandelPaymentSuccessResponse } from "@/types/HandelPaymentSuccessResponse";

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
  const [doctors, setDoctors] = useState<[Doctors]>([
    { id: "", name: "", experience: "", image: "", ratings: 0 },
  ]);
  const [data, setData] = useState({
    userName: "",
    email: "",
    appointment_date: "",
    contact: "",
    doctor: "",
    appointment_time: "",
    doctor_id: "",
  });
  const userContext = useContext(UserContext);
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
  const handlePaymentSuccess = async (response: StartPaymentResponse) => {
    try {
      let formData = new FormData();
      formData.append("response", JSON.stringify(response));
      formData.append("doctor_id", data.doctor_id);
      const user: UserClass = new UserClass();
      const validToken = user.verifyToken();
      if (!validToken) {
        userContext.logout();
        router.push("/Login");
        return;
      }
      const handlePaymentSuccessResponse: string = await Payment.handlePaymentSuccess(formData, data, router);
      const res: HandelPaymentSuccessResponse = JSON.parse(handlePaymentSuccessResponse);
    } catch (error) {}
  };
  const showRazorPay = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const user: UserClass = new UserClass();
    const validToken: boolean = await user.verifyToken();
    if (!validToken) {
      router.push("/Login");
      return;
    }
    const jwtToken: JwtCookie = user.getCookieJson();
    if (jwtToken.name === "Guest User") router.push("/Login");
    const formData: FormData = Payment.createStartPaymentForm(schemeContext, data);
    const response: string = await Payment.startPayment(formData);
    if (response === null) return;
    const startPaymentResponse: StartPaymentResponse = JSON.parse(response);
    const options = Payment.getOptions(startPaymentResponse, handlePaymentSuccess);
    var rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  useEffect(() => {
    const loader = async () => {
      const user: UserClass = new UserClass();
      const validToken: boolean = await user.verifyToken();
      if (validToken) {
        const jwtToken: JwtCookie = user.getCookieJson();
        if (jwtToken !== null && jwtToken.name === "Guest User") {
          userContext.logout();
          router.push("/Login");
        } else if (jwtToken !== null) {
          if (schemeContext.cost === "") {
            router.push("/BookNow");
          }
          userContext.login();
          setData((data) => {
            return { ...data, userName: jwtToken.name, email: jwtToken.email };
          });
          setDoctors(await Doctor.getDoctors());
        }
      } else {
        const jwtToken: JwtCookie | null = await user.getAndSaveGuestToken();
        router.push("/Login");
      }
    };
    try {
      loader();
    } catch (error) {
      console.log(error);
    }
  }, [!userContext.isAuthenticated]);
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
                  renderInput={(params) => <TextField sx={style} label="Doctor" {...params} />}
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
