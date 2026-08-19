import axios from "axios";
import { ApiError, type ApiResponse } from "@/types/api";

export const getApiErrorMessage = (
    error: unknown,
    fallback = "요청 처리 중 오류가 발생했습니다."
) => {
    if (error instanceof ApiError) return error.message;
    if (axios.isAxiosError<ApiResponse<unknown>>(error)) {
        return error.response?.data?.message ?? fallback;
    }
    if (error instanceof Error) return error.message;
    return fallback;
};
