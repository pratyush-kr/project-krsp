import React, { useContext, useEffect } from "react";
import { Header } from "@/components/HeaderComponent";
import { Footer } from "@/components/FooterComponent";
import Member from "@/components/Member";
import styles from "@/styles/AboutUs.module.css";
import { UserContext } from "@/contexts/UserContext";
import axios from "axios";
import { User as UserClass } from "@/models/User";
import { JwtCookie } from "@/types/JwtCookie";

const members = [
    {
        name: "Kislay Kaushik",
        bio: "The quick brown fox jumps over the lazy dog.Lorem ipsum dolor sit amet, consectetur adipiscing elit.A stitch in time saves nine.",
        imgSrc: "/profile/profile.jpeg",
        urls: {
            facebook: "https://fackebook.com/kislay",
            twitter: "https://twitter.com/kislay",
            google: "https://google.com/kislay",
            instagram: "https://instagram.com/kislay",
            linkedIn: "https://linkedin.com/kislay",
            github: "https://github.com/kislay",
        },
    },
    {
        name: "Raju Kumar",
        bio: "The quick brown fox jumps over the lazy dog.Lorem ipsum dolor sit amet, consectetur adipiscing elit.A stitch in time saves nine.",
        imgSrc: "/profile/Raju_profile.jpg",
        urls: {
            facebook: "https://fackebook.com/Raju",
            twitter: "https://twitter.com/Raju",
            google: "https://google.com/Raju",
            instagram: "https://instagram.com/Raju",
            linkedIn: "https://linkedin.com/Raju",
            github: "https://github.com/Raju",
        },
    },
    {
        name: "Stuti Pathak",
        bio: "The quick brown fox jumps over the lazy dog.Lorem ipsum dolor sit amet, consectetur adipiscing elit.A stitch in time saves nine.",
        imgSrc: "/profile/profile.jpeg",
        urls: {
            facebook: "https://fackebook.com/Stuti",
            twitter: "https://twitter.com/Stuti",
            google: "https://google.com/Stuti",
            instagram: "https://instagram.com/Stuti",
            linkedIn: "https://linkedin.com/Stuti",
            github: "https://github.com/Stuti",
        },
    },
    {
        name: "Pratyush Kumar",
        bio: "The quick brown fox jumps over the lazy dog.Lorem ipsum dolor sit amet, consectetur adipiscing elit.A stitch in time saves nine.",
        imgSrc: "/profile/pratyush_profile.jpg",
        urls: {
            facebook: "https://www.facebook.com/pratyushkr321/",
            twitter: "https://twitter.com/_pratyushkr",
            google: "mailto:pratyush151198@gmail.com",
            instagram: "https://www.instagram.com/_its_me_pratyush/",
            linkedIn: "https://www.linkedin.com/in/pratyush-kumar-jaiswal/",
            github: "https://github.com/pratyush-kr",
        },
    },
    {
        name: "Udit Utsav",
        bio: "The quick brown fox jumps over the lazy dog.Lorem ipsum dolor sit amet, consectetur adipiscing elit.A stitch in time saves nine.",
        imgSrc: "/profile/profile.jpeg",
        urls: {
            facebook: "https://fackebook.com/Udit",
            twitter: "https://twitter.com/Udit",
            google: "https://google.com/Udit",
            instagram: "https://instagram.com/Udit",
            linkedIn: "https://linkedin.com/Udit",
            github: "https://github.com/Udit",
        },
    },
    {
        name: "Neeraj Singh",
        bio: "The quick brown fox jumps over the lazy dog.Lorem ipsum dolor sit amet, consectetur adipiscing elit.A stitch in time saves nine.",
        imgSrc: "/profile/profile.jpeg",
        urls: {
            facebook: "https://fackebook.com/Neeraj",
            twitter: "https://twitter.com/Neeraj",
            google: "https://google.com/Neeraj",
            instagram: "https://instagram.com/Neeraj",
            linkedIn: "https://linkedin.com/Neeraj",
            github: "https://github.com/Neeraj",
        },
    },
];

const AboutUs = () => {
    const userContext = useContext(UserContext);
    useEffect(() => {
        const loader = async () => {
            const user: UserClass = new UserClass();
            const validToken: boolean = await user.verifyToken();
            if (!validToken) {
                userContext.logout();
                localStorage.removeItem("user_info");
                user.getAndSaveGuestToken();
            } else {
                const jwtToken: JwtCookie = user.getCookieJson();
                if (jwtToken.name !== "Guest User") {
                    userContext.login();
                }
            }
        };
        loader();
    });
    return (
        <div style={{ backgroundColor: "white" }}>
            <Header />
            <div className={styles.body}>
                <div className={styles.members}>
                    {members.map((member, index) => (
                        <Member
                            key={index}
                            index={index}
                            name={member.name}
                            bio={member.bio}
                            imgSrc={member.imgSrc}
                            urls={member.urls}
                        />
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default AboutUs;
