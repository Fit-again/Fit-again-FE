import { ApiError } from "@/types/api";
import {
    POLLING_INTERVAL_MS,
    POLLING_TIMEOUT_MS,
    pollUntil,
} from "@/utils/polling";
import { describe, expect, it, vi } from "vitest";

describe("pollUntil", () => {
    it("2초 간격과 최대 3분 정책을 사용한다", () => {
        expect(POLLING_INTERVAL_MS).toBe(2_000);
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
});
