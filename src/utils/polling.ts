import { ApiError } from "@/types/api";

export const POLLING_INTERVAL_MS = 2_000;
export const POLLING_TIMEOUT_MS = 180_000;

const wait = (duration: number, signal?: AbortSignal) =>
    new Promise<void>((resolve, reject) => {
        const handleAbort = () => {
            window.clearTimeout(timeout);
            reject(new DOMException("요청이 취소되었습니다.", "AbortError"));
        };
        const timeout = window.setTimeout(() => {
            signal?.removeEventListener("abort", handleAbort);
            resolve();
        }, duration);
        signal?.addEventListener("abort", handleAbort, { once: true });
    });

export const pollUntil = async <T>({
    load,
    isComplete,
    isFailed,
    getFailureMessage,
    signal,
}: {
    load: () => Promise<T>;
    isComplete: (value: T) => boolean;
    isFailed: (value: T) => boolean;
    getFailureMessage?: (value: T) => string | null | undefined;
    signal?: AbortSignal;
}) => {
    const startedAt = Date.now();

    while (Date.now() - startedAt < POLLING_TIMEOUT_MS) {
        if (signal?.aborted) {
            throw new DOMException("요청이 취소되었습니다.", "AbortError");
        }

        const value = await load();
        if (isComplete(value)) return value;
        if (isFailed(value)) {
            throw new ApiError(
                getFailureMessage?.(value) ?? "AI 작업 처리에 실패했습니다."
            );
        }

        await wait(POLLING_INTERVAL_MS, signal);
    }

    throw new ApiError(
        "AI 처리 시간이 초과되었습니다. 잠시 후 다시 시도해주세요."
    );
};
