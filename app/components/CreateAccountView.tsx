"use client";
import Link from "next/link";
import styles from "../styles/createaccountview.module.scss";
import Image from "next/image";
import FormField from "./FormField";
import FormButton from "./FormButton";
import Form from "next/form";

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
            <Form
                id="create-account-form"
                action="/search"
                className={styles.createAccountForm}
            >
                <FormField
                    type="email"
                    id="create-account-email"
                    name="create-account-email"
                    required={true}
                    placeholder="Email"
                />
                <FormField
                    type="username"
                    id="create-account-username"
                    name="create-account-username"
                    required={true}
                    placeholder="Choose a username"
                />
                <FormField
                    type="password"
                    id="create-account-password"
                    name="create-account-password"
                    required={true}
                    placeholder="Enter password"
                />
                <FormField
                    type="password"
                    id="create-account-reenter-password"
                    name="create-account-reenter-password"
                    required={true}
                    placeholder="Re-enter password"
                />
                <FormButton
                    value="Join!"
                    name="create-account-button"
                    form="create-account-form"
                />
            </Form>
        </div>
    </div>
}
