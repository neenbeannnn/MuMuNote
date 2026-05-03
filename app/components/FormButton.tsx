"use client";
import styles from '../styles/formbutton.module.scss';

type FormButtonProps = {
    value: string;
    name: string;
    disabled?: boolean;
    form: string;
    onClick?: () => void;
}

export default function FormButton({
    value,
    name,
    disabled,
    form,
    onClick
}: FormButtonProps) {
    return (
    <input
        className={styles.formButton}
        type="submit"
        value={value}
        name={name}
        disabled={disabled}
        form={form}
        onClick={onClick}
    >
    </input>);
}