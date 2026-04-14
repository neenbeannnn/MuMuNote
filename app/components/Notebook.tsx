import styles from "../styles/notebook.module.scss";

type NotebookProps = {
    id: string,
    title: string,
    noteCount: number
};

export default function Notebook({id, title, noteCount} : NotebookProps) {
    return <div 
        key={id}
        className={styles.notebookContainer}
    >
        <div className={styles.whiteStripe}/>
        <h2 className={styles.notebookTitle}>
            {title}
        </h2>
        <h3 className={styles.noteCounter}>
            {noteCount}
        </h3>
    </div>;
}
