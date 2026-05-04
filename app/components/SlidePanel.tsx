import styles from "../styles/slidepanel.module.scss";
import Translate from "@mui/icons-material/Translate";
import TranslateOverlay from "./TranslateOverlay";
import {useEffect, useState, useRef} from "react";
import {supabase} from "../lib/supabaseClient";
import {useUser} from "../context/UserContext";

type SelectionBox = {
    x: number; //x and y are for upper left corner
    y: number;
    width: number;
    height: number;
}

type SlideNote = {
    page_number:  number;
    content: any;
}

type SlidePanelProps = {
    noteTitle: string;
    slideImages: string[];
    slides: SlideNote[];
    noteId: string;
    onSlideUpdate: (pageNumber: number, content: any) => void;
    translations: {[slideIndex: number]: {selection: any, text: string} | null};
    onTranslationsChange: (translations: any) => void;
}

export default function SlidePanel({noteTitle, slideImages, slides, noteId, onSlideUpdate, translations : initialTranslations, onTranslationsChange}: SlidePanelProps) {
    const {user} = useUser();
    const [language, setLanguage] = useState<string>("Simplified Chinese"); //default fallback for now TODO add in actual fallback code
    const [isTranslateActive, setIsTranslateActive] = useState(false);
    const [translations, setTranslations] = useState<{[slideIndex: number]: {selection: SelectionBox, text:string} | null}>(initialTranslations ?? {});
    const translationsRef = useRef(translations);

    useEffect(() => {
        translationsRef.current = translations;
    }, [translations]);

    useEffect(() => {
        const fetchLanguage = async () => {
            if (!user) return;
            const {data, error} = await supabase
                .from("Profiles")
                .select("language")
                .eq("id", user.id)
                .single();
            if (!error && data?.language) setLanguage(data.language);
        };
        fetchLanguage();
    }, [user?.id]);

    const saveTranslations = async () => {
        console.log("noteId:", noteId);
        console.log("translations to save:", translationsRef.current);

        const {error} = await supabase
            .from("Notes")
            .update({translations: translationsRef.current})
            .eq("note_id", noteId);
        if (error) {
            console.error("Error saving translations:", error.message);
        } else {
            console.log("Translations saved:", translationsRef.current);
        }
    }

    const handleTranslateToggle = () => {
        if (isTranslateActive) {
            saveTranslations();
        }
        setIsTranslateActive(!isTranslateActive);
    }

    useEffect(() => {
    if (initialTranslations && Object.keys(initialTranslations).length > 0) {
        setTranslations(initialTranslations);
    }
}, [initialTranslations]);

    if (slideImages.length === 0) {
        return <div className={styles.panelContainer}>
            <div className={styles.loadingHeader}>
                <h1 className={styles.loadingText}>Loading slides...</h1>
            </div>
        </div>
    }

    return (
        <div className={styles.panelContainer}>
            <div className={styles.noteHeader}>
                <h1 className={styles.noteTitle}>{noteTitle}</h1>
                <span 
                    className={styles.translateIconContainer}
                    onClick={handleTranslateToggle}
                >
                    <Translate 
                        sx={{fontSize: 20,}}
                    />
                </span>
            </div>
            <div className={styles.slidesContainer}>
                {slideImages.map((img, i) => (
                    <div key={i} className={styles.slideRow}>
                        <TranslateOverlay
                            slideImage={img}
                            language={language}
                            slideIndex={i}
                            isActive={isTranslateActive}
                            existingTranslation={translations[i] ?? null}
                            onTranslationSaved={(translation) => {
                                const updated = {...translations, [i]: translation};
                                setTranslations(updated);
                                onTranslationsChange(updated);
                            }}
                        />
                        <div className={styles.editorContainer}>
                            <p className={styles.editorPlaceholder}>Type your notes here...</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}