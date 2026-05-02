"use client";
import styles from "../styles/centerpanel.module.scss";
import {ViewType} from "../types/ViewType";
import Notebook from "./Notebook";
import NewNotebook from "./NewNotebook";
import {useEffect, useState} from "react";
import {useUser} from '../context/UserContext';
import {useRouter} from "next/navigation";
import {supabase} from "../lib/supabaseClient";

type CenterPanelProps = {
    currentView: ViewType;
}

type NotebookType = {
    notebook_id: string;
    title: string;
    note_counter: number;
}

export default function CenterPanel({currentView} : CenterPanelProps) {
    const {user} = useUser();
    const [username, setUsername] = useState<string | null>(null);
    const [notebooks, setNotebooks] = useState<NotebookType[]>([]);
    const router = useRouter();

    const fetchProfile = async () => {
        if (!user) return;
        const {data, error} = await supabase
            .from("Profiles")
            .select("username")
            .eq("id", user.id)
            .single();
        if (error) {
            console.error("Error fetching profile:", error.message);
            return;
        }
        setUsername(data.username);
    };

    const fetchNotebooks = async () => {
        if (!user) return;
        const {data, error} = await supabase
            .from("Notebooks")
            .select("notebook_id, title, note_counter")
            .eq("author_id", user.id);
        if (error) {
            console.error("Error fetching notebooks:", error.message);
            return;
        }
        setNotebooks(data);
    }

    useEffect(() => {
        fetchProfile();
        fetchNotebooks();
    }, [user]);

    //render different views based on the currentView prop that is passed in
    const renderView = () => {
        switch (currentView) {
            case ViewType.NOTEBOOK:
                return (<div className={styles.pageContainer}>
                    <div className={styles.topContainer}>
                        <h1 className={styles.notebookTitle}>my <span>notebooks.</span></h1>
                        <hr className={styles.divider}/>
                    </div>
                    <div className={styles.notebookContainer}>
                        {notebooks.map((notebook) => (
                            <Notebook
                                key={notebook.notebook_id} //reserved key React prop
                                id={notebook.notebook_id} //database notebook_id value
                                title={notebook.title}
                                noteCount={notebook.note_counter}
                                onOpen={() => router.push(`notes/${notebook.notebook_id}`)}
                            />
                        ))}
                        <NewNotebook onNotebookCreated={fetchNotebooks}/>
                    </div>
                </div>
                );
            case ViewType.UPLOAD_NOTE:
                return (<div className={styles.pageContainer}>

                </div>);
        }
    }

    return <>{renderView()}</>
}