"use client";
import Link from "next/link";
import styles from "../styles/createaccountview.module.scss";
import Image from "next/image";

export default function ForgotPasswordView() {
    return <div className={styles.pageContainer}>
        <Image 
            src="/assets/mumunote-logo-long.png"
            alt="MuMuNote logo"
            height = {90}
            width = {250}
            draggable={false}
        />
        <div className={styles.popup}>
            <h1 className={styles.forgotPasswordTitle}>
                Forgot your password?
            </h1>
        </div>
    </div>
}
