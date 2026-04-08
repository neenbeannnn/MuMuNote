"use client";
import styles from "../styles/loginview.module.scss";
import FormField from "./FormField";
import FormButton from "./FormButton";
import Image from "next/image";
import Link from 'next/link';
import {useState} from "react";
import {supabase} from '../lib/supabaseClient';
import { useRouter } from "next/navigation";

export default function LoginView() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const {data, error} = await supabase.auth.signInWithPassword({email, password});

        //if supabase has an error
        if (error) {
            setError(error.message ?? "An error occurred on our end. Try again.");
        }

        router.push('/mynotebooks');
    };

    return <div className={styles.pageContainer}>
        <Image 
        src="/assets/mumunote-logo-long.png"
        alt="MuMuNote logo"
        height = {90}
        width = {250}
        draggable={false}
      />
      <div className={styles.popup}>
        <h1 className={styles.loginTitle}>
           Login 
        </h1>
        <h3 className={styles.loginNoAccount}>
            Don't have an account yet?&nbsp;
            <Link 
                href="/createaccount"
                className={styles.loginLink}
            >
                Create one!
            </Link>
        </h3>
        <form
            id="login-form"
            onSubmit={handleLogin}
            className={styles.loginFormContainer}
        >
            <FormField
                type="text"
                id="login-email"
                name="login-email"
                required={true}
                placeholder="Email"
        />
        <div>
            <FormField
                type="password"
                id="login-password"
                name="login-password"
                required={true}
                placeholder="Password"
            />
            <Link 
                href="/forgotpassword"
                className={styles.loginLink}
            >
                Forgot your password?
            </Link>
        </div>
        <p style={{ color: "#f59aff", minHeight: "0.5rem" }}>
            {error}
        </p>
        <FormButton
            value="Login"
            name="login-button"
            form="login-form"
        />
        </form>
      </div>
    </div>
}