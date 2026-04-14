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
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FormField({
    type,
    id,
    name,
    required,
    minLength=undefined,
    maxLength,
    placeholder,
    value,
    onChange,
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
            spellCheck={false}
            value={value}
            onChange={onChange}
        />
    )
};

//Notebook Title Field
export function NotebookTitleField({
    id,
    name,
    value,
    onChange,
    onKeyDown,
    onBlur
}: Omit<FormFieldProps, "required" | "type" | "placeholder" | "minLength" | "maxLength"> & {
    onKeyDown?: (e:React.KeyboardEvent<HTMLInputElement>) => void;
    onBlur?:(e:React.FocusEvent<HTMLInputElement>) => void;
}) {
    return (
        <input
            className={styles.notebookTitleField}
            type="text"
            id={id}
            name={name}
            required={false}
            placeholder="Enter title"
            spellCheck={false}
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            onBlur={onBlur}
            autoFocus
        />
    )
}