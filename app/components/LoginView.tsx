"use client";
import styles from "../styles/loginview.module.scss";
import Image from "next/image";

export default function LoginView() {
    return <div className={styles.pageContainer}>
        <Image 
        src="/assets/mumunote-logo-long.png"
        alt="MuMuNote logo"
        height = {90}
        width = {250}
      />
      <div className={styles.popup}>
        <h1 className={styles.loginTitle}>
           Login 
        </h1>
        <h3 className={styles.loginNoAccount}>
            Don't have an account yet?&nbsp;
            <a className={styles.loginLink}>Create one!</a>
        </h3>
      </div>
    </div>
}