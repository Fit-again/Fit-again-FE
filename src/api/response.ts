import { ApiError, type ApiResponse } from "@/types/api";

export const unwrapApiResponse = <T>(response: ApiResponse<T>): T => {
    if (!response.isSuccess || response.result == null) {
        throw new ApiError(response.message, response.code);
    }

    return response.result;
};
