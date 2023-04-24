import React from "react";
import { Header } from "@/components/HeaderComponent";
import { Footer } from "@/components/FooterComponent";
import { Button } from "@mui/material";
import styles from "@/styles/TnC.module.css";

function TnC() {
  return (
    <div className={styles.body}>
      <div className={styles.Tnc}>
        <Header />
        <div className={styles.container}>
          <h1 className={styles.hd}> Terms and Conditions</h1>
          <h2>
            Welcome to our Krsp (mental health) application . The App provides information, tools, and
            resources to help you manage your mental health and well-being. By accessing or using the App, you
            agree to the following terms and conditions:
          </h2>
          <h3>Introduction:</h3>
          <p>
            These Terms and Conditions (the “Agreement”) govern the use of the application (the “Application”)
            provided by Krsp (the “Company”). By downloading, accessing, or using the Application, you agree
            to be bound by this Agreement.
          </p>
          <br />
          <h3>Use of the Application:</h3>
          <p>
            The Application is designed to provide mental health information, resources, and support. It is
            not intended to replace professional medical advice or treatment. The Company makes no
            representations or warranties about the accuracy, reliability, completeness, or timeliness of the
            information contained in the Application.
          </p>
          <br />
          <h3>Privacy:</h3>
          <p>
            We take your privacy seriously and will collect, use, and disclose your personal information in
            accordance with our Privacy Policy, which is incorporated by reference into these Terms and
            Conditions. By using the App, you consent to our collection, use, and disclosure of your personal
            information as described in the Privacy Policy.
          </p>
          <br />
          <h3>User Conduct:</h3>
          <p>
            You agree to use the App only for lawful purposes and in a manner that does not infringe the
            rights of, or restrict or inhibit the use and enjoyment of the App by any third party. You agree
            not to use the App in any way that could damage, disable, overburden, or impair the App or
            interfere with any other party's use and enjoyment of the App.
          </p>
          <br />
          <h3>User Account</h3>
          <p>
            To use our App, you must create a user account. You agree to provide accurate and complete
            information when creating your account, and to keep your login credentials confidential. You are
            responsible for all activity that occurs under your account.
          </p>
          <br />
          <h3>Prohibited Conduct:</h3>
          <p>
            You agree not to use the App for any unlawful or prohibited purpose. Prohibited conduct includes,
            but is not limited to: Harassing, threatening, or intimidating other users; Posting content that
            is defamatory, obscene, or discriminatory; Engaging in any fraudulent or deceptive activity;
            Attempting to disrupt or interfere with the App's operations or security; Using automated scripts
            or bots to access the App; Impersonating another user or person; Soliciting personal information
            from other users; Sharing your account credentials with others.
          </p>
          <br />
          <Button variant="contained" style={{ backgroundColor: "#8d72e1" }}>
            Submit
          </Button>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default TnC;
