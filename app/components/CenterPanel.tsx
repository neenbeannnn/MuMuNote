"use client";
import styles from "../styles/centerpanel.module.scss";
import Image from "next/image";
import {useEffect, useState} from "react";
import {useUser} from '../context/UserContext';
import {supabase} from "../lib/supabaseClient";

export default function Center() {
    const {user} = useUser();
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;
            const {data, error} = await supabase.from("Profiles").select("username").eq("id", user.id).single();
            if (error) {
                console.error("Error fetching profile:", error.message);
                return;
            }
            setUsername(data.username);
        };

        fetchProfile();
    }, [user]);

    return <div className={styles.pageContainer}>
        <div className={styles.topContainer}>
            <h1 className={styles.notebookTitle}>my <span>notebooks.</span></h1>
            <hr className={styles.divider}/>
        </div>
    </div>;
}