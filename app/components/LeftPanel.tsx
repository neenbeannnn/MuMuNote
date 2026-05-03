"use client";
import styles from "../styles/leftpanel.module.scss";
import {ViewType} from "../types/ViewType";
import Image from "next/image";
import FirstPage from "@mui/icons-material/FirstPage";
import LastPage from "@mui/icons-material/LastPage";
import Logout from "@mui/icons-material/Logout";
import LibraryAdd from "@mui/icons-material/LibraryAdd";
import FilterList from "@mui/icons-material/FilterList";
import {useEffect, useState} from "react";
import {useUser} from '../context/UserContext';
import {supabase} from "../lib/supabaseClient";
import {AnimatePresence, motion} from "framer-motion";
import {useRouter} from "next/navigation";

type LeftPanelProps = {
    view?: "notebooks" | "notes";
    notebookId? : string; //notebookId for which notebook the user currently has open
    setCurrentView?: (view: ViewType) => void;
}

export default function LeftPanel({view = "notebooks", notebookId, setCurrentView}: LeftPanelProps) {
    const {user} = useUser();
    const router = useRouter();
    const [username, setUsername] = useState<string | null>(null);
    const [notebookTitle, setNotebookTitle] = useState<string | null>(null);
    const [isCollapsed, setIsCollapsed] = useState(false);

    //fetch the user's profile + username
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
    }, [user?.id]);

    //handle signing out of the current user
    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    }

    //fetch the notebook title
    useEffect(() => {
        const fetchNotebookTitle = async () => {
            if (!notebookId) {
                console.log("notebookID is empty, skipping fetch");
                return;
            }

            const {data, error} = await supabase
                .from("Notebooks")
                .select("title")
                .eq("notebook_id", notebookId)
                .single();
            
            if (error) {
                console.error("Error fetching notebook: ", error.message);
                return;
            }

            setNotebookTitle(data.title);
        };

        fetchNotebookTitle();
    }, [notebookId]);

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
                <div className={styles.middleContainer}>
                    {view === "notebooks" && (
                        <div>
                        
                        </div>
                    )}
                    {view === "notes" && (
                        <div className={styles.noteContainer}>
                            <div className={styles.notebookTitleContainer}>
                                <h2 className={styles.notebookTitle}>{notebookTitle}</h2>
                            </div>
                            <div className={styles.actionContainer}>
                                <FilterList //TODO add functionality for filtering notes
                                    sx={{fontSize: 20,}}
                                    className={styles.filterList}
                                />
                                <LibraryAdd 
                                    sx={{fontSize: 20,}}
                                    className={styles.libraryAdd}
                                    onClick={() => setCurrentView?.(ViewType.UPLOAD_NOTE)}
                                />
                            </div>
                        </div>
                    )}
                </div>
                <div className={styles.footerContainer}>
                    <Logout
                        sx={{fontSize: 30,}}
                        onClick={handleSignOut}
                        className={styles.logoutIcon}
                    />
                </div>
            </motion.div>
        )}
        </AnimatePresence>
    </div>;
}