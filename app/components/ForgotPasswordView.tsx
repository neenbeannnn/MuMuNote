"use client";
import styles from "../styles/forgotpasswordview.module.scss";
import FormField from "./FormField";
import FormButton from "./FormButton";
import Image from "next/image";
import ArrowBack from '@mui/icons-material/ArrowBack';
import Link from 'next/link';
import Form from "next/form";

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
            <Link href="/login" className={styles.backArrow}>
                <ArrowBack
                    sx={{
                        fontSize: 25,
                    }}
                />
            </Link>
            
            <h1 className={styles.forgotPasswordTitle}>
                Forgot your password?
            </h1>
            <h3 className={styles.forgotPasswordSubtitle}>
                Enter your email and we'll send you a link to reset your password.
            </h3>
            <Form
                id="forgot-password-form"
                action="/search"
                className={styles.forgotPasswordContainer}
            >
                <FormField 
                    type="email"
                    id="forgot-password-email"
                    name="forgot-password-email"
                    required={true}
                    placeholder="Email address"
                />
                <FormButton
                    value="Send reset link"
                    name="send-email-button"
                    form="forgot-password-form"
                />    
            </Form>
        </div>
    </div>
}
