"use client";
import Link from "next/link";
import styles from "../styles/createaccountview.module.scss";
import Image from "next/image";
import FormField from "./FormField";
import FormButton from "./FormButton";
import {useState} from "react";
import {supabase} from "../lib/supabaseClient";

export default function CreateAccountView() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [reenterPassword, setReenterPassword] = useState("");
    const [error, setError] = useState("");

    const handleCreateAccount = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        //check if passwords match
        if (password !== reenterPassword) {
            setError("Passwords do not match.");
            return;
        }

        //check that password includes uppercase, lowercase, number, and a special character
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|<>?,./`~]).+$/;

        if (!passwordRegex.test(password)) {
            setError("Password must include uppercase, lowercase, a number, and a special character,");
            return;
        }        

        const {data, error} = await supabase.auth.signUp({
            email, 
            password,
            options: {
                data: {username},
            },
        });
        
        
        //if supabase has an error
        if (error) {
            setError(error.message ?? "An error occurred on our end. Try again.");
        } else {
            alert("Account created! Check your email to confirm your account.")
        }
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
            <form
                id="create-account-form"
                onSubmit={handleCreateAccount}
                className={styles.createAccountForm}
            >
                <FormField
                    type="email"
                    id="create-account-email"
                    name="create-account-email"
                    required={true}
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <FormField
                    type="username"
                    id="create-account-username"
                    name="create-account-username"
                    required={true}
                    placeholder="Choose a username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <FormField
                    type="password"
                    id="create-account-password"
                    name="create-account-password"
                    required={true}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <FormField
                    type="password"
                    id="create-account-reenter-password"
                    name="create-account-reenter-password"
                    required={true}
                    placeholder="Re-enter password"
                    value={reenterPassword}
                    onChange={(e) => setReenterPassword(e.target.value)}
                />
                <p style={{ color: "#f59aff", minHeight: "1.25rem" }}>
                    {error}
                </p>
                <FormButton
                    value="Join!"
                    name="create-account-button"
                    form="create-account-form"
                />
            </form>
        </div>
    </div>
}
