"use client";
import {useRef, useState, useEffect, MouseEvent} from "react";
import styles from "../styles/translateoverlay.module.scss";

type SelectionBox = {
    x: number; //x and y are for upper left corner
    y: number;
    width: number;
    height: number;
}

type TranslateOverlayProps = {
    slideImage: string; //base64 image of the slide
    language: string;   //target language from user profile
    slideIndex: number;
    isActive: boolean;
    existingTranslation: {selection: SelectionBox, text: string} | null;
    onTranslationSaved: (translation: {selection: SelectionBox, text: string} | null) => void;
};

export default function TranslateOverlay({slideImage, language, slideIndex, isActive, existingTranslation, onTranslationSaved}: TranslateOverlayProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [selection, setSelection] = useState<SelectionBox | null>(null);
    const [startPoint, setStartPoint] = useState<{x: number, y: number} | null>(null);
    const [translation, setTranslation] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);

    // Load existing translations first
    useEffect(() => {
        if (existingTranslation) {
            setTranslation(existingTranslation.text);
            setSelection(existingTranslation.selection);
        }
    }, [existingTranslation]);

    const getRelativeCoords = (e: MouseEvent) => {
        const rect = containerRef.current!.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        }
    };

    const handleMouseDown = (e: MouseEvent) => {
        if (!isActive) return;
        const coords = getRelativeCoords(e);
        setStartPoint(coords);
        setSelection(null);
        setTranslation(null);
        setIsDragging(true);
    };

    const handleMouseMove = (e:MouseEvent) => {
        if (!isDragging || !startPoint) return;
        const coords = getRelativeCoords(e);
        setSelection({
            x: Math.min(coords.x, startPoint.x),
            y: Math.min(coords.y, startPoint.y),
            width: Math.abs(coords.x - startPoint.x),
            height: Math.abs(coords.y - startPoint.y),
        });
    };

    const handleMouseUp = async (e: MouseEvent) => {
        if (!isDragging || !selection || !imgRef.current) return;
        setIsDragging(false);

        //need to capture the selection before the async work is done
        const currentSelection = selection;

        if (selection.width < 10 || selection.height < 10) return; //minimum size requirements

        //crop the region from the slide image
        const img = imgRef.current;
        const scaleX = img.naturalWidth / img.clientWidth;
        const scaleY = img.naturalHeight / img.clientHeight;

        const canvas = document.createElement("canvas");
        canvas.width = selection.width * scaleX;
        canvas.height = selection.height * scaleY;
        const context = canvas.getContext("2d")!;

        const imgE1 = new Image();
        imgE1.src = slideImage;
        await new Promise(res => imgE1.onload = res);

        context.drawImage(
            imgE1,
            selection.x * scaleX,
            selection.y * scaleY,
            selection.width * scaleX,
            selection.height * scaleY,
            0, 0,
            canvas.width,
            canvas.height
        );

        const croppedBase64 = canvas.toDataURL("image/png").split(",")[1];

        //process using Claude API translateImage
        setIsLoading(true);
        try {
            const response = await fetch("/api/translate", {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify({imageBase64: croppedBase64, language})
            });
            const data = await response.json();
            setTranslation(data.translate);
            onTranslationSaved({selection: currentSelection, text: data.translate});
            setSelection(currentSelection);
        } catch (err) {
            console.error("Translation error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div 
            ref={containerRef}
            className={`${styles.imageContainer} ${isActive ? styles.selecting : ""}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            <img
                ref={imgRef}
                src={slideImage}
                className={styles.slideImage}
                draggable={false}
            />

            {/*The selection box*/}
            {selection && (
                <div
                    className={styles.selectionBox}
                    style={{
                        left: selection.x,
                        top: selection.y,
                        width: selection.width,
                        height: selection.height,
                    }}
                />
            )}

            {/*The translation overlay*/}
            {translation && selection && (
                <div
                    className={styles.translationOverlay}
                    style={{
                        left: selection.x,
                        top: selection.y - 50,
                    }}
                >
                    <p className={styles.translationText}>{translation}</p>
                </div>
            )}
        </div>
    );
}