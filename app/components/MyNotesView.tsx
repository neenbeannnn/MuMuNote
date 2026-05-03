"use client";
import styles from '../styles/mynotebooksview.module.scss';
import {ViewType} from "../types/ViewType";
import {useEffect, useState} from "react";
import {useUser} from '../context/UserContext';
import {supabase} from "../lib/supabaseClient";
import {useParams} from "next/navigation";
import LeftPanel from './LeftPanel';
import CenterPanel from './CenterPanel';

export default function MyNotesView() {
    const params = useParams();

    const {user} = useUser();
    const [username, setUsername] = useState<string | null>(null);

    //get the notebookId from the URL
    const {notebookId} = useParams();

    //uses the enum ViewType
    const [currentView, setCurrentView] = useState<ViewType>(ViewType.NOTE);   

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
                view="notes" 
                notebookId = {notebookId as string}
                setCurrentView={setCurrentView}
            />
            <CenterPanel 
                currentView={currentView}
                setCurrentView={setCurrentView}
            />
        </div>
    </div>;
}