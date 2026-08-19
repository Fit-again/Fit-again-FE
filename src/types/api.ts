export type ApiResponse<T> = {
    isSuccess: boolean;
    code: string;
    message: string;
    result: T | null;
};

export class ApiError extends Error {
    code: string;

    constructor(message: string, code = "UNKNOWN") {
        super(message);
        this.name = "ApiError";
        this.code = code;
    }
}
