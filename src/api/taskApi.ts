import axiosInstance from "@/api/axiosInstance";
import { unwrapApiResponse } from "@/api/response";
import type { DiagnosisStatusResult } from "@/types/analysis";
import type { ApiResponse } from "@/types/api";

export type CreateTaskRequest = {
    productType: string;
    frontImageUrl: string;
    detailImageUrls: string[];
    damageImages: File[];
    keywords: string[];
    description: string;
};

export const createTaskApi = async (
    request: CreateTaskRequest,
    signal?: AbortSignal
) => {
    const body = new FormData();
    body.append("productType", request.productType);
    body.append("frontImageUrl", request.frontImageUrl);
    request.detailImageUrls.forEach((url) =>
        body.append("detailImageUrls", url)
    );
    request.damageImages.forEach((image) => body.append("damageImages", image));
    request.keywords.forEach((keyword) => body.append("keywords", keyword));
    if (request.description.trim()) {
        body.append("description", request.description);
    }

    const response = await axiosInstance.post<ApiResponse<{ taskId: number }>>(
        "/tasks",
        body,
        { signal }
    );

    return unwrapApiResponse(response.data);
};

export const getDiagnosisApi = async (taskId: number, signal?: AbortSignal) => {
    const response = await axiosInstance.get<
        ApiResponse<DiagnosisStatusResult>
    >(`/tasks/${taskId}/diagnosis`, { signal });

    return unwrapApiResponse(response.data);
};
