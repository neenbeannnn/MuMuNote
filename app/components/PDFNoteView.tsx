"use client";
import {useEffect, useState} from "react";
import {supabase} from "../lib/supabaseClient";
import {useUser} from "../context/UserContext";
import styles from "../styles/pdfnoteview.module.scss";
import LeftPanel from "./LeftPanel";
import SlidePanel from "./SlidePanel";

type PDFNoteViewProps = {
    notebookId: string;
    noteId: string;
}

type SlideNote = { //data structure for each slide #'s notes
    page_number: number;
    content: any; //JSON from Slate.js
}

type NoteContent = { //holds information about the note overall
    title: string;
    pdf_id: string | null;
    slides: SlideNote[];
}

//if a slide doesn't have notes associated with it yet
const EMPTY_SLIDE_NOTE = [
    {type: "paragraph", children: [{text: ""}]}
];

type NoteAnalysis = {
    page_number: number;
    key_concepts: {concept: string; explanation: string}[];
    vocabulary: {word: string; definition: string; partOfSpeech: string}[];
}

export default function PDFNoteView({notebookId, noteId}: PDFNoteViewProps) {
    const {user} = useUser();
    const [note, setNote] = useState<NoteContent | null>(null);
    const [slideImages, setSlideImages] = useState<string[]>([]);
    const [analysis, setAnalysis] = useState<NoteAnalysis[]>([]);


    useEffect(() => {
        const fetchNoteData = async() => {
            if (!user || !noteId) return;

            //fetch note from supabase Notes table
            const {data : noteData, error : noteError} = await supabase
                .from("Notes")
                .select("title, pdf_id, content")
                .eq("note_id", noteId)
                .single();
            if (noteError) {
                console.error("Error fetching note:", noteError.message);
                return;
            }
            
            //fetch analysis for this note
            if (noteData?.pdf_id) {
                const {data, error} = await supabase
                    .from("Noteanalyses")
                    .select("analysis")
                    .eq("pdf_id", noteData.pdf_id)
                    .single();
                console.log("Analysis:", data, error);
                if (!error && data) setAnalysis(data.analysis);

                //fetch PDF and render the slides
                const {data : pdfFilePath, error: pdfFilePathError} = await supabase
                    .from("NotePDFs")
                    .select("storage_path")
                    .eq("pdf_id", noteData.pdf_id)
                    .single();
                console.log("pdfFilePath:", pdfFilePath, pdfFilePathError)
                
                if (pdfFilePath) {
                    const {data: pdfFileContent, error: pdfFileContentError} = await supabase.storage
                        .from("UploadedLectures")
                        .download(pdfFilePath.storage_path);
                    console.log("pdfFileContent:", pdfFileContent, pdfFileContentError);
                    
                    if (pdfFileContent) {
                        const pdfjsLib = await import("pdfjs-dist");
                        pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
                        const arrayBuffer = await pdfFileContent.arrayBuffer();
                        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
                        const images: string[] = [];

                        for (let i = 1; i <= pdf.numPages; i++) {
                            const page = await pdf.getPage(i);
                            const viewport = page.getViewport({ scale: 2 });
                            const canvas = document.createElement("canvas");
                            canvas.width = viewport.width;
                            canvas.height = viewport.height;
                            const ctx = canvas.getContext("2d");
                            if (!ctx) continue;
                            await page.render({ canvasContext: ctx, viewport, canvas }).promise;
                            images.push(canvas.toDataURL("image/png"));
                        }

                        setSlideImages(images);

                        //build the slides using the SlideNote content
                        const existingSlides: SlideNote[] = note?.slides ?? [];
                        const slides: SlideNote[] = images.map((_, i) => {
                            const existing = existingSlides.find(s => s.page_number == i + 1);
                            return existing ?? {
                                page_number: i + 1,
                                content: EMPTY_SLIDE_NOTE
                            };
                        });

                        setNote({
                            title: noteData.title,
                            pdf_id: noteData.pdf_id,
                            slides,
                        });
                    }
                }
                }
            }
            fetchNoteData();
        }, [noteId, user?.id]);

        return (
            <div className={styles.pageContainer}>
                <div className={styles.bodyContainer}>
                    <LeftPanel
                        view="notes"
                        notebookId={notebookId}
                    />
                    <SlidePanel
                        noteTitle={note?.title ?? ""}
                        slideImages={slideImages}
                        slides={note?.slides ?? []}
                        noteId={noteId}
                        onSlideUpdate={(pageNumber, content) => {
                            setNote(prev => prev ? {
                                ...prev,
                                slides: prev.slides.map(s =>
                                    s.page_number === pageNumber ? {...s, content} : s
                                )
                            } : prev);
                        }}
                    />
                </div>
            </div>
        );
}