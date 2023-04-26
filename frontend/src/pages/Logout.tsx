import React, { useContext, useEffect, useState } from "react";
import axios, { Axios, AxiosError } from "axios";
import { UserContext } from "@/contexts/UserContext";
import { useRouter } from "next/router";
import { JwtCookie } from "@/types/JwtCookie";

const Logout = () => {
    const router = useRouter();
    const user = useContext(UserContext);
    useEffect(() => {
        const cookie: string | null = localStorage.getItem("user_info");
        let guestCookie: string | null = sessionStorage.getItem("guest_info");
        if (guestCookie !== null) {
            sessionStorage.removeItem("guest_info");
        }
        if (cookie === null) {
            return;
        }
        let jwt_cookie: JwtCookie = JSON.parse(cookie);
        const config = {
            headers: {
                Authorization: `Bearer ${jwt_cookie.jwt}`,
            },
        };
        axios
            .post(axios.defaults.baseURL + "/krsp/user/logout/", {}, config)
            .then((res) => {
                user.logout();
                if (Array.isArray(res.headers["set-cookie"])) {
                    document.cookie = res.headers["set-cookie"].join("; ");
                }
                localStorage.removeItem("user_info");
                router.push("/Login");
            })
            .catch((err: AxiosError) => {
                user.logout();
                localStorage.removeItem("user_info");
                sessionStorage.removeItem("guest_info");
            })
            .finally(() => {
                router.push("/Login");
            });
    });
    return <div>Logging out</div>;
};

export default Logout;
