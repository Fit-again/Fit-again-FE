import { ApiError } from "@/types/api";
import {
    getPollingIntervalMs,
    POLLING_FAST_INTERVAL_MS,
    POLLING_NORMAL_INTERVAL_MS,
    POLLING_SLOW_INTERVAL_MS,
    POLLING_TIMEOUT_MS,
    pollUntil,
} from "@/utils/polling";
import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => vi.useRealTimers());

describe("pollUntil", () => {
    it("경과 시간에 따라 2초, 5초, 10초 간격을 사용한다", () => {
        expect(getPollingIntervalMs(0)).toBe(POLLING_FAST_INTERVAL_MS);
        expect(getPollingIntervalMs(19_999)).toBe(POLLING_FAST_INTERVAL_MS);
        expect(getPollingIntervalMs(20_000)).toBe(POLLING_NORMAL_INTERVAL_MS);
        expect(getPollingIntervalMs(59_999)).toBe(POLLING_NORMAL_INTERVAL_MS);
        expect(getPollingIntervalMs(60_000)).toBe(POLLING_SLOW_INTERVAL_MS);
        expect(POLLING_TIMEOUT_MS).toBe(180_000);
    });

    it("완료 상태를 받으면 즉시 반환한다", async () => {
        const load = vi.fn().mockResolvedValue({ status: "DONE" });

        await expect(
            pollUntil<{ status: string }>({
                load,
                isComplete: (value) => value.status === "DONE",
                isFailed: (value) => value.status === "FAILED",
            })
        ).resolves.toEqual({ status: "DONE" });
        expect(load).toHaveBeenCalledOnce();
    });

    it("실패 상태의 서버 메시지를 오류로 전달한다", async () => {
        await expect(
            pollUntil({
                load: async () => ({
                    status: "FAILED",
                    errorMessage: "이미지 분석 실패",
                }),
                isComplete: (value) => value.status === "DONE",
                isFailed: (value) => value.status === "FAILED",
                getFailureMessage: (value) => value.errorMessage,
            })
        ).rejects.toEqual(expect.any(ApiError));
    });

    it("최대 3분 동안 완료되지 않으면 시간 초과 오류를 전달한다", async () => {
        vi.useFakeTimers();
        const load = vi.fn().mockResolvedValue({ status: "PENDING" });
        const result = pollUntil<{ status: string }>({
            load,
            isComplete: (value) => value.status === "DONE",
            isFailed: (value) => value.status === "FAILED",
        });
        const assertion = expect(result).rejects.toMatchObject({
            message:
                "AI 처리 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.",
        });

        await vi.advanceTimersByTimeAsync(POLLING_TIMEOUT_MS);

        await assertion;
        expect(load).toHaveBeenCalledTimes(30);
    });

    it("대기 중 취소되면 다음 조회 없이 AbortError를 전달한다", async () => {
        vi.useFakeTimers();
        const controller = new AbortController();
        const load = vi.fn().mockResolvedValue({ status: "PENDING" });
        const result = pollUntil<{ status: string }>({
            load,
            isComplete: (value) => value.status === "DONE",
            isFailed: (value) => value.status === "FAILED",
            signal: controller.signal,
        });
        const assertion = expect(result).rejects.toMatchObject({
            name: "AbortError",
        });
        await vi.advanceTimersByTimeAsync(0);

        controller.abort();

        await assertion;
        expect(load).toHaveBeenCalledOnce();
    });
});
