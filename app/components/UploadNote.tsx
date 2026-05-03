import styles from "../styles/uploadnote.module.scss";
import {UploadStageType, UploadStageMessages} from "../types/UploadStageType";
import {useUser} from "../context/UserContext";
import {supabase} from "../lib/supabaseClient";
import {useState, useRef, DragEvent, ChangeEvent} from "react";
import {useParams, useRouter} from "next/navigation";
import Upload from "@mui/icons-material/Upload";
import FormButton from "./FormButton";
import * as pdfjsLib from "pdfjs-dist";
import {createWorker} from "tesseract.js";
import { KeyboardReturnOutlined } from "@mui/icons-material";

export default function UploadNote() {
    const [isDraggingFile, setIsDraggingFile] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [uploadStage, setUploadStage] = useState<UploadStageType | null>(null);
    const [error, setError] = useState<string | null>(null);
    const {user} = useUser(); //grab user info
    const {notebookId} = useParams(); //grab notebookId to upload note to
    
    const inputRef = useRef<HTMLInputElement>(null);

    const acceptedFileTypes = [
        "application/pdf", //TODO add in ppt and pptx support
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

    //use pdfjs library to render each page to a canvas and store in images
    const extractPDFContent = async (file: File): Promise<string[]> => {
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

        const arrayBuffer = await file.arrayBuffer(); //converts File to raw binary format
        const pdf = await pdfjsLib.getDocument({data: arrayBuffer}).promise; //uses pdfjsLib to parse the PDF and returns a PDFDocumentProxy object
        const images: string[] = [];

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({scale: 2});
            const canvas = document.createElement("canvas");
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const context = canvas.getContext("2d");
            if (!context) throw new Error(`Could not get canvas context for page ${i}`);
            await page.render({canvasContext: context, viewport, canvas}).promise;
            images.push(canvas.toDataURL("image"))
        }
        
        return images;
    };

    //run tesseract OCR on each page image in order to extract the text from it
    const ocrPages = async (images: string[]): Promise<string[]> => {
        const worker = await createWorker("eng");
        const result: string[] = [];
        for (const image of images) {
            const {data: {text}} = await worker.recognize(image);
            result.push(text);
        }
        await worker.terminate();
        console.log(result);
        return result;
    };

    //call the Claude API to extract the key concepts and vocab
    const analyzeWithClaude = async (ocrText: string) => {
        const response = await fetch("/api/claudeAnalyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ocrText})
        });
        return await response.json();
    }

    const handleFileUpload = async () => {
        if (!file || !user || !notebookId) return;
        setError(null);

        try {
            //Upload file to Supabase Storage
            setUploadStage(UploadStageType.UPLOADING);
            const storagePath = `${user.id}/${Date.now()}_${file.name}`;
            const {error: storageError} = await supabase.storage
                .from("UploadedLectures")
                .upload(storagePath, file);
            if (storageError) throw new Error(storageError.message);

            //Insert PDF into NotePDFs database
            const {data: pdfData, error: pdfError} = await supabase
                .from("NotePDFs")
                .insert({
                    author_id: user.id,
                    file_name: file.name,
                    storage_path: storagePath,
                })
                .select("pdf_id")
                .single();
            if (pdfError) throw new Error(pdfError.message);
            const pdf_id = pdfData.pdf_id;

            //Insert and create a new Note for the PDF
            const {data: noteData, error: noteError} = await supabase
                .from("Notes")
                .insert({
                    author_id: user.id,
                    notebook_id: notebookId,
                    pdf_id: pdf_id,
                    title: file.name.replace(/\.[^/.]+$/, ""),
                })
                .select("note_id")
                .single();
            if (noteError) throw new Error(noteError.message);
            const note_id = noteData.note_id;

            //Perform OCR on each page using extractPDFContent()
            setUploadStage(UploadStageType.EXTRACTING);
            const images = await extractPDFContent(file);
            const ocrText = await ocrPages(images);

            //Analyze each page with Claude and save to NoteAnalyses
            const analyses = [];
            setUploadStage(UploadStageType.ANALYZING);
            for (let i = 0; i < ocrText.length; i ++) {
                const analysis = await analyzeWithClaude(ocrText[i]);
                analyses.push({
                    page_number: i+1,
                    key_concepts: analysis.key_concepts,
                    vocabulary: analysis.vocabulary,
                    included: analysis.included
                })
                
            }

            //save all note analyses to NoteAnalyses
            setUploadStage(UploadStageType.SAVING);
            await supabase.from("NoteAnalyses").insert({
                pdf_id,
                author_id: user.id,
                analysis: analyses,
            });

            //TODO navigate to the note
        } catch (err: any) {
            console.error(err);
            setError("Something went wrong. Please try again.");
            setUploadStage(null);
        }
        setUploadStage(UploadStageType.DONE);
    }

    return <div className={styles.popup}>
        <h1 className={styles.title}>Upload your slides</h1>
        <h3 className={styles.fileTypeText}>Only file type accepted is .pdf</h3>
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
                accept=".pdf"
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
        {uploadStage && (
            <div className={styles.uploadStageContainer}>
                <h3 className={styles.uploadStageText}>{UploadStageMessages[uploadStage]}</h3>
            </div>
        )}
        {error && <h3 className={styles.errorText}>{error}</h3>}
        {!uploadStage && <h3 className={styles.blankNoteText}>
            No notes?&nbsp;
            <span className={styles.blankNoteUnderline}>
                Create a blank note
            </span>
            &nbsp;instead!
        </h3>}
        {!uploadStage && <FormButton
            value="Upload"
            name="upload-file-button"
            form="upload-file-form"
            onClick={handleFileUpload}
        />}
        {uploadStage == "done" &&
            <FormButton 
                value="Start taking notes!"
                name="go-to-notes-button"
                form="upload-file-form"
            />
        }
    </div>
}