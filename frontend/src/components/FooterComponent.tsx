import React from "react";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import GoogleIcon from "@mui/icons-material/Google";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import { SvgIcon } from "@mui/material";
import styles from "@/styles/FooterComponent.module.css";
import Link from "next/link";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div>
        <div className={styles.icons}>
          <a href="#!">
            <SvgIcon className="facebook">
              <FacebookIcon color="action" />
            </SvgIcon>
          </a>
          <a href="#!">
            <SvgIcon className="twitter">
              <TwitterIcon color="action" />
            </SvgIcon>
          </a>
          <a href="#!">
            <SvgIcon className="google">
              <GoogleIcon color="action" />
            </SvgIcon>
          </a>
          <a href="#!">
            <SvgIcon className="instagram">
              <InstagramIcon color="action" />
            </SvgIcon>
          </a>
          <a href="#!">
            <SvgIcon className="linkedin">
              <LinkedInIcon color="action" />
            </SvgIcon>
          </a>
          <a href="#!">
            <SvgIcon className="github">
              <GitHubIcon color="action" />
            </SvgIcon>
          </a>
        </div>
      </div>
      <div className="ftr-body">
        © 2023 Copyright:
        <Link href="/TnC/">Krsp Solutions</Link>
      </div>
    </footer>
  );
}
