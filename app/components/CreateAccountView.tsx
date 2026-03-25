"use client";
import Link from "next/link";
import styles from "../styles/createaccountview.module.scss";
import Image from "next/image";

export default function CreateAccountView() {
    return <div className={styles.pageContainer}>
        <Image 
            src="/assets/mumunote-logo-long.png"
            alt="MuMuNote logo"
            height = {90}
            width = {250}
            draggable={false}
        />
        <div className={styles.popup}>
            <h1 className={styles.createAccountTitle}>
                Create Account
            </h1>
            <h3 className={styles.haveAccountLogin}>
                Have an account already?&nbsp;
                <Link
                    href="/login"
                    className={styles.loginLink}
                >
                    Login.
                </Link>
            </h3>
        </div>
    </div>
}
