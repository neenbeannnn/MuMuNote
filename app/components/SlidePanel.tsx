import styles from "../styles/slidepanel.module.scss";
import Translate from "@mui/icons-material/Translate";

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
}

export default function SlidePanel({noteTitle, slideImages, slides, noteId, onSlideUpdate}: SlidePanelProps) {

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
                <span className={styles.translateIconContainer}>
                    <Translate 
                        sx={{fontSize: 20,}}
                    />
                </span>
            </div>
            <div className={styles.slidesContainer}>
                {slideImages.map((img, i) => (
                    <div key={i} className={styles.slideRow}>
                        <img
                            src={img}
                            className={styles.slideImage}
                            alt={`Slide ${i + 1}`}
                            draggable={false}
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