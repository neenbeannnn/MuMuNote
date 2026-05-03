//define the different stage of document upload => ocr extraction
export enum UploadStageType {
    UPLOADING = "uploading",
    EXTRACTING = "extracting",
    ANALYZING = "analyzing",
    SAVING = "saving",
    DONE = "done"
}

//specific messages for each stage
export const UploadStageMessages: Record<UploadStageType, string> = {
    [UploadStageType.UPLOADING]: "Uploading your file...",
    [UploadStageType.EXTRACTING]: "Extracting meaningful content...",
    [UploadStageType.ANALYZING]: "Scanning for key concepts and vocabulary...",
    [UploadStageType.SAVING]: "Saving analysis...",
    [UploadStageType.DONE]: "Lecture analysis done!"
};