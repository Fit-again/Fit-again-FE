export type DiagnosisStatus = "PENDING" | "DIAGNOSING" | "DIAGNOSED" | "FAILED";

export type DiagnosisResult = {
    allImages: string[];
    productType: string;
    externalStructure: string[];
    damageState: string[];
    currentPurpose: string;
    mainInconvenience: string[];
    areasForImprovement: string[];
    color: string;
    size: "small" | "medium" | "large" | string;
    pattern: string;
};

export type DiagnosisStatusResult = {
    status: DiagnosisStatus;
    diagnosisResult: DiagnosisResult | null;
    errorMessage?: string | null;
};

export type ImageAnalysisResult = {
    frontImageUrl: string;
    detailImageUrls: string[];
    isValid: boolean;
    message: string;
};

export type AnalysisPhoto = {
    file: File | string;
    label: string;
};
