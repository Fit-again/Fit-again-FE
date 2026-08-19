import axiosInstance from "@/api/axiosInstance";
import { unwrapApiResponse } from "@/api/response";
import type { ApiResponse } from "@/types/api";

export type ConsultationRequest = {
    userName: string;
    phoneNumber: string;
    desiredUpcyclingProducts?: string[];
    importantAspect?: string;
    additionalRequest?: string;
    privacyAgreed: boolean;
};

export const createConsultationApi = async (
    taskId: number,
    body: ConsultationRequest
) => {
    const response = await axiosInstance.post<
        ApiResponse<{ consultationId: number }>
    >(`/tasks/${taskId}/consultations`, body);

    return unwrapApiResponse(response.data);
};
