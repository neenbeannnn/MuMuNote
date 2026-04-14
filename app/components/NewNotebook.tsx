import styles from "../styles/newnotebook.module.scss";
import AddCircleOutlineOutlined from "@mui/icons-material/AddCircleOutlineOutlined";
import { NotebookTitleField } from "./FormField";
import {useState} from "react";
import {supabase} from "../lib/supabaseClient";
import {useUser} from "../context/UserContext";

type NewNotebookProps = {
    onNotebookCreated: () => void;
}

export default function NewNotebook({onNotebookCreated} : NewNotebookProps) {
    const {user} = useUser();
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState("");

    const handleCreateNotebook = async () => {
        if (!title.trim() || !user) {
            setIsEditing(false);
            return;
        }

        const {error} = await supabase.from("Notebooks").insert({
            title: title,
            author_id: user.id
        });

        if (error) {
            console.error("Error creating notebook:", error.message);
            return;
        }

        setTitle("");
        setIsEditing(false);
        onNotebookCreated(); //triggers CenterPanel updating with the new notebook list
    }

    return <div 
            className={styles.notebookContainer}
            onClick={() => setIsEditing(true)}
            onMouseDown={(e) => e.preventDefault()} //prevent blurring when clicking the notebookContainer
        >
        <div className={styles.whiteStripe}/>
        <div className={styles.notebookContent}>
            <AddCircleOutlineOutlined 
                className={styles.addIcon}
                sx={{ fontSize: 25 }}
            />
            {isEditing ? (
                <NotebookTitleField
                    id="notebook_title"
                    name="notebook_title"
                    onChange={(e) => setTitle(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            handleCreateNotebook();
                        }
                    }}
                    onBlur={() => {
                        setTitle("");
                        setIsEditing(false);
                    }}
                />
            ) : (
                <h2 className={styles.notebookTitle}>
                    Create New Notebook
                </h2>
            )
            }
            
        </div>
    </div>
}