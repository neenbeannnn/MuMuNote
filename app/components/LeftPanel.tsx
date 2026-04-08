"use client";
import styles from "../styles/leftpanel.module.scss";
import Image from "next/image";
import FirstPage from "@mui/icons-material/FirstPage";
import LastPage from "@mui/icons-material/LastPage";
import {useEffect, useState} from "react";
import {useUser} from '../context/UserContext';
import {supabase} from "../lib/supabaseClient";
import {AnimatePresence, motion} from "framer-motion";

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

    return <div className={styles.containerWrapper}>
        <AnimatePresence mode = "wait">
            {isCollapsed ? (
                <motion.div 
                    key="collapsed"
                    className={styles.collapsedContainer} 
                    onClick={() => setIsCollapsed(false)}
                    animate={{x: 0, opacity: 1}}
                    exit={{x: "-100%", opacity: 0}}
                    transition={{duration: 0.3, ease: "easeInOut"}}
                >
                    <LastPage 
                        sx={{fontSize: 30,}}
                    />
                </motion.div>) 
            : 
            (<motion.div
                key="expanded" 
                className={styles.pageContainer}
                initial={{x: "-100%", opacity: 0.3}}
                animate={{x: 0, opacity: 1}}
                exit={{x: "-100%", opacity: 0}}
                transition={{duration: 0.3, ease: "easeInOut"}}
            >
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
                            className={styles.collapseIn}
                        />
                    </div>
                    <h3 className={styles.happyStudyingText}>Happy studying, {username}!</h3>
                    <hr className={styles.divider}/>
                </div>
            </motion.div>
        )}
        </AnimatePresence>
    </div>;
}