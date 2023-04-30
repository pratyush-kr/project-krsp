import { UserContext, UserContextProvider } from "@/contexts/UserContext";
import { SchemeContextProvider } from "@/contexts/SchemeContext";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SelectedContextProvider } from "@/contexts/SelectedContext";
import axios from "axios";
import { useEffect, useContext } from "react";
import { JwtCookie } from "@/types/JwtCookie";
import ChatApp from "@/components/ChatApp/ChatApp";
import { PeopleContextProvider } from "@/contexts/PeopleContext";

export default function App({ Component, pageProps }: AppProps) {
  axios.defaults.baseURL = "http://localhost:8000";
  const userContext = useContext(UserContext);
  useEffect(() => {
    const cookie: string | null = localStorage.getItem("user_info");
    if (cookie === null) {
      return;
    }
    const jwtCookie: JwtCookie = JSON.parse(cookie);
    userContext.setUsername(jwtCookie.name);
    userContext.login();
  }, []);
  return (
    <UserContextProvider>
      <SchemeContextProvider>
        <SelectedContextProvider>
          <PeopleContextProvider>
            <>
              <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
              <ChatApp />
              <Component {...pageProps} />
            </>
          </PeopleContextProvider>
        </SelectedContextProvider>
      </SchemeContextProvider>
    </UserContextProvider>
  );
}
