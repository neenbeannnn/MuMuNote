"use client";
import {useParams} from "next/navigation";
import PDFNote from "../../../../components/PDFNoteView";

export default function NotePage() {
    const {notebookId, noteId} = useParams();

    return <PDFNote
        notebookId={notebookId as string}
        noteId={noteId as string}
    />;
}