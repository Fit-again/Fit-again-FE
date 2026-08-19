import axiosInstance from "@/api/axiosInstance";
import { unwrapApiResponse } from "@/api/response";
import type { ImageAnalysisResult } from "@/types/analysis";
import type { ApiResponse } from "@/types/api";

export const analyzeImagesApi = async (
    frontImage: File,
    detailImages: File[],
    signal?: AbortSignal
) => {
    const body = new FormData();
    body.append("frontImage", frontImage);
    detailImages.forEach((image) => body.append("detailImages", image));

    const response = await axiosInstance.post<ApiResponse<ImageAnalysisResult>>(
        "/images/analyze",
        body,
        { signal }
    );

    return unwrapApiResponse(response.data);
};
