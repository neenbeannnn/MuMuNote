"use client";
import styles from '../styles/mynotebooksview.module.scss';
import {ViewType} from "../types/ViewType";
import {useEffect, useState} from "react";
import {useUser} from '../context/UserContext';
import {supabase} from "../lib/supabaseClient";
import LeftPanel from './LeftPanel';
import CenterPanel from './CenterPanel';

export default function MyNotebooksView() {
    const {user} = useUser();
    const [username, setUsername] = useState<string | null>(null);

    //uses the enum ViewType
    const [currentView, setCurrentView] = useState<ViewType>(ViewType.NOTEBOOK);   

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
        <div className={styles.bodyContainer}>
            <LeftPanel
                view="notebooks"
            />
            <CenterPanel 
                currentView={currentView}
                setCurrentView={setCurrentView}
            />
        </div>
    </div>;
}