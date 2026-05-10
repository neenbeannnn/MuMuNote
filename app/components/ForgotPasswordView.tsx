"use client";
import styles from "../styles/forgotpasswordview.module.scss";
import FormField from "./FormField";
import FormButton from "./FormButton";
import Image from "next/image";
import ArrowBack from '@mui/icons-material/ArrowBack';
import Link from 'next/link';
import Form from "next/form";
import {useState} from "react";
import {supabase} from "../lib/supabaseClient";

export default function ForgotPasswordView() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleResetPassword = async () => {
        if (!email) return;
        setIsLoading(true);
        setError(null);
        setMessage(null);

        const {error} = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/resetpassword`,
        });

        if (error) {
            setError("Something went wrong. Please try again.");
        } else {
            setMessage("Password reset link sent! Check your email.");
        }

        setIsLoading(false);
    }

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
                    value = {email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                {message && <p className={styles.successText}>{message}</p>}
                {error && <p className={styles.errorText}>{error}</p>}
                <FormButton
                    value={isLoading ? "Sending...": "Send reset link"}
                    name="send-email-button"
                    form="forgot-password-form"
                    onClick={handleResetPassword}
                    disabled={isLoading}
                />    
            </Form>
        </div>
    </div>
}
