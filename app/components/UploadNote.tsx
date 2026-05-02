import styles from "../styles/uploadnote.module.scss";
import {useState, useRef, DragEvent, ChangeEvent} from "react";
import Upload from "@mui/icons-material/Upload";
import FormButton from "./FormButton";

export default function UploadNote() {
    const [isDraggingFile, setIsDraggingFile] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const acceptedFileTypes = [
        "application/pdf",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ];

    const handleFile = (f: File) => {
        if (!acceptedFileTypes.includes(f.type)) return;
        setFile(f);
    }

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDraggingFile(true);
    }

    const handleDragLeave = () => setIsDraggingFile(false);

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDraggingFile(false);
        const dropped = e.dataTransfer.files[0];
        if (dropped) handleFile(dropped);
    }

    const handleBrowse = (e: ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) handleFile(selected);
    }

    return <div className={styles.popup}>
        <h1 className={styles.title}>Upload your slides</h1>
        <h3 className={styles.fileTypeText}>File types accepted: .pdf, .ppt, .pptx</h3>
        <div
            className={`${styles.fileDropContainer} ${isDraggingFile ? styles.dragging : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
        >
            <input
                ref={inputRef}
                type="file"
                accept=".pdf, .ppt, .pptx"
                className={styles.hiddenInput}
                onChange={handleBrowse}
            />
            <Upload
                sx={{fontSize: 50}}
                className={styles.uploadFileIcon}
            />
            {
                file ? (
                    <h3 className={styles.fileName}>{file.name}</h3>
                ) : (
                    <>
                        <h3 className={styles.browseText}>Drag & drop your file here or click to browse</h3>
                    </>
                )
            }
        </div>
        <h3 className={styles.blankNoteText}>
            No notes?&nbsp;
            <span className={styles.blankNoteUnderline}>
                Create a blank note
            </span>
            &nbsp;instead!
        </h3>
        <FormButton
            value="Upload"
            name="upload-file-button"
            form="upload-file-form"
        />
    </div>
}