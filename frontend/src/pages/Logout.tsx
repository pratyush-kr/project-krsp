import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "@/contexts/UserContext";
import { useRouter } from "next/router";

const Logout = () => {
    const router = useRouter();
    const user = useContext(UserContext);
    useEffect(() => {
        axios.post(axios.defaults.baseURL + "/krsp/user/logout/").then((res) => {
            user.logout();
            if (Array.isArray(res.headers["set-cookie"])) {
                document.cookie = res.headers["set-cookie"].join("; ");
            }
            localStorage.removeItem("user_info");
            router.push("/Login");
        });
    });
    return <div>Logging out</div>;
};

export default Logout;
