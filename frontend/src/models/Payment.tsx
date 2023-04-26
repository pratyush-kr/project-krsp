import { JwtCookie } from "@/types/JwtCookie";
import { Scheme } from "@/types/Scheme";
import { StartPaymentResponse } from "@/types/StartPaymentResponse";
import axios from "axios";
import { User } from "./User";
import { Config } from "@/types/Config";
import emailjs from "emailjs-com";
import { NextRouter } from "next/router";

interface Options {
  key: string;
  amount: number;
  order_id: string;
  currency: string;
  name: string;
  handler: (response: StartPaymentResponse) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
}

interface Data {
  userName: string;
  email: string;
  appointment_date: string;
  contact: string;
  doctor: string;
  appointment_time: string;
  doctor_id: string;
}

export class Payment {
  static baseUrl = axios.defaults.baseURL;
  static createStartPaymentForm = (schemeContext: Scheme, data: Data): FormData => {
    let bodyData = new FormData();
    bodyData.append("amount", schemeContext.cost);
    bodyData.append("userName", data.userName);
    bodyData.append("email", data.email);
    bodyData.append("appointment_date", data.appointment_date);
    bodyData.append("appointment_time", data.appointment_time);
    bodyData.append("doctor", data.doctor);
    bodyData.append("contact", data.contact);
    return bodyData;
  };

  static startPayment = async (formData: FormData): Promise<string> => {
    const user: User = new User();
    const jwtToken: JwtCookie = user.getCookieJson();
    const config: Config = {
      headers: {
        Authorization: `Bearer ${jwtToken.jwt}`,
      },
    };
    const response = await axios.post(
      axios.defaults.baseURL + "/krsp/order/start_payment/",
      formData,
      config
    );
    return JSON.stringify(response.data);
  };

  static getOptions = (
    response: StartPaymentResponse,
    handlePaymentSuccess: (response: StartPaymentResponse) => void
  ): Options => {
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
    return options;
  };

  static handlePaymentSuccess = async (
    formData: FormData,
    data: Data,
    router: NextRouter
  ): Promise<string> => {
    const jwtToken: JwtCookie = new User().getCookieJson();
    const config: Config = {
      headers: {
        Authorization: `Bearer ${jwtToken.jwt}`,
      },
    };
    const response = await axios.post(
      axios.defaults.baseURL + "/krsp/order/handle_payment_success/",
      formData,
      config
    );
    if (response.status === 401) {
      alert("payment not done");
      return response.data.error;
    } else if (response.status === 200) {
      Payment.sendEmail(router, data);
    }
    return JSON.stringify(response.data);
  };

  static sendEmail = async (router: NextRouter, data: Data) => {
    var emailContenet = {
      to_name: data.email,
      from_name: "krsp",
      message: "Thank You For choosing krsp",
    };
    try {
      const response = await emailjs.send(
        "service_egxiqir",
        "template_flwdrrp",
        emailContenet,
        "zLmIanEcHUGX8V3gR"
      );
      alert("email is sent to your email id");
      router.push("/MyAppointments");
    } catch (error: any) {
      throw Error("SOMETHING WENT WRONG");
    }
  };
}

// const handlePaymentSuccess = (response: StartPaymentResponse) => {
//     try {
//         let bodyData = new FormData();
//         // we will send the response we've got from razorpay to the backend to validate the payment
//         bodyData.append("response", JSON.stringify(response));
//         bodyData.append("doctor_id", data.doctor_id);
//         const cookie = localStorage.getItem("user_info");
//         if (cookie === null) {
//             return;
//         }
//         const jwt_cookie: JwtCookie = JSON.parse(cookie);
//         const config = {
//             headers: {
//                 Authorization: `Bearer ${jwt_cookie.jwt}`,
//             },
//         };
//         axios
//             .post(axios.defaults.baseURL + "/krsp/order/handle_payment_success/", bodyData, config)
//             .then((res) => {
//                 if (res.data.error === "Something went wrong") {
//                     alert("payment not done");
//                     return;
//                 }
//                 var emailContenet = {
//                     to_name: data.email,
//                     from_name: "krsp",
//                     message: "Thank You For choosing krsp",
//                 };
//                 emailjs.send("service_egxiqir", "template_flwdrrp", emailContenet, "zLmIanEcHUGX8V3gR").then(
//                     (result) => {
//                         alert("email is sent to your email id");
//                         router.push("/my_appointments");
//                     },
//                     (error) => {}
//                 );
//             })
//             .catch((err) => {});
//     } catch (error) {}
// };
