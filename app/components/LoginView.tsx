"use client";
import styles from "../styles/loginview.module.scss";
import FormField from "./FormField";
import FormButton from "./FormButton";
import Image from "next/image";
import Form from "next/form";

export default function LoginView() {
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
            <a className={styles.loginLink}>Create one!</a>
        </h3>
        <Form
            id="login-form"
            action="/search"
            className={styles.loginFormContainer}
        >
            <FormField
            type="text"
            id="login-username"
            name="login-username"
            required={true}
            placeholder="Username"
        />
        <FormField
            type="password"
            id="login-password"
            name="login-password"
            required={true}
            placeholder="Password"
        />
        <FormButton
            value="Login"
            name="login-button"
            form="login-form"
        ></FormButton>
        </Form>
      </div>
    </div>
}