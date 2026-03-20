"use client";
import styles from "../styles/formfield.module.scss";

type FormFieldProps = {
    type: string;
    id: string;
    name: string;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    placeholder?: string;
}

export default function FormField({
    type,
    id,
    name,
    required,
    minLength=undefined,
    maxLength,
    placeholder,
}: FormFieldProps) {
    return (
        <input 
            className={styles.formField}
            type={type}
            id={id}
            name={name}
            required={required}
            minLength={minLength}
            maxLength={maxLength}
            placeholder={placeholder}
        />
    )
};