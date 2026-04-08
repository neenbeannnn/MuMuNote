"use client";
import styles from "../styles/leftpanel.module.scss";
import Image from "next/image";
import FirstPage from "@mui/icons-material/FirstPage";
import LastPage from "@mui/icons-material/LastPage";
import {useEffect, useState} from "react";
import {useUser} from '../context/UserContext';
import {supabase} from "../lib/supabaseClient";

export default function LeftPanel() {
    const {user} = useUser();
    const [username, setUsername] = useState<string | null>(null);
    const [isCollapsed, setIsCollapsed] = useState(false);

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

    return <div className={styles.containerWrapper}>{isCollapsed ? (<div className={styles.collapsedContainer}>
            <LastPage 
                sx={{fontSize: 30,}}
                onClick={() => setIsCollapsed(false)}
        />
    </div>) : (
        <div className={styles.pageContainer}>
            <div className={styles.topContainer}>
                <div className={styles.topInnerContainer}>
                    <Image 
                        src="/assets/mumunote-logo.png"
                        alt="MuMuNote logo"
                        height = {64}
                        width = {50}
                        draggable={false}
                        className={styles.mumunoteLogo}
                    />
                    <FirstPage 
                        sx={{fontSize: 30,}}
                        onClick={() => setIsCollapsed(true)}
                    />
                </div>
                <h3 className={styles.happyStudyingText}>Happy studying, {username}!</h3>
                <hr className={styles.divider}/>
            </div>
        </div>)}
    </div>;
}