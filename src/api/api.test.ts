import axiosInstance from "@/api/axiosInstance";
import { analyzeImagesApi } from "@/api/imageApi";
import { getRecommendationApi } from "@/api/recommendationApi";
import { createTaskApi } from "@/api/taskApi";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/api/axiosInstance", () => ({
    default: {
        post: vi.fn(),
        get: vi.fn(),
    },
}));

const success = <T>(result: T) => ({
    data: {
        isSuccess: true,
        code: "COMMON200",
        message: "성공",
        result,
    },
});

describe("API 요청 매핑", () => {
    beforeEach(() => vi.clearAllMocks());

    it("분석 이미지를 Swagger 필드명으로 전송한다", async () => {
        const frontImage = new File(["front"], "front.png", {
            type: "image/png",
        });
        const detailImages = [
            new File(["detail-1"], "detail-1.png", { type: "image/png" }),
            new File(["detail-2"], "detail-2.png", { type: "image/png" }),
        ];
        vi.mocked(axiosInstance.post).mockResolvedValue(
            success({
                frontImageUrl: "front-url",
                detailImageUrls: ["detail-url-1", "detail-url-2"],
                isValid: true,
                message: "분석 가능",
            })
        );

        await analyzeImagesApi(frontImage, detailImages);

        const body = vi.mocked(axiosInstance.post).mock.calls[0]?.[1];
        expect(body).toBeInstanceOf(FormData);
        expect((body as FormData).get("frontImage")).toBe(frontImage);
        expect((body as FormData).getAll("detailImages")).toEqual(detailImages);
    });

    it("작업 생성의 배열 값을 같은 필드명으로 반복 전송한다", async () => {
        const damageImages = [
            new File(["damage"], "damage.png", { type: "image/png" }),
        ];
        vi.mocked(axiosInstance.post).mockResolvedValue(success({ taskId: 7 }));

        await createTaskApi({
            productType: "숄더백",
            frontImageUrl: "front-url",
            detailImageUrls: ["detail-url-1", "detail-url-2"],
            damageImages,
            keywords: ["무거움", "어깨가 아픔"],
            description: "가볍게 바꾸고 싶어요.",
        });

        const body = vi.mocked(axiosInstance.post).mock.calls[0]?.[1];
        expect(body).toBeInstanceOf(FormData);
        expect((body as FormData).get("productType")).toBe("숄더백");
        expect((body as FormData).getAll("detailImageUrls")).toEqual([
            "detail-url-1",
            "detail-url-2",
        ]);
        expect((body as FormData).getAll("damageImages")).toEqual(damageImages);
        expect((body as FormData).getAll("keywords")).toEqual([
            "무거움",
            "어깨가 아픔",
        ]);
    });

    it("Swagger의 소문자 마커 좌표를 내부 camelCase로 정규화한다", async () => {
        vi.mocked(axiosInstance.get).mockResolvedValue(
            success({
                status: "RECOMMENDED",
                rankings: [
                    {
                        rank: 1,
                        recommendationType: "REFORM",
                        reasons: [],
                        frontImageUrl: "front-url",
                        recommendedWorks: [],
                        simulation: {
                            steps: [],
                            beforeAfter: {
                                before: { imageUrl: "", points: [] },
                                after: { imageUrl: "", points: [] },
                            },
                            damageImageUrls: [],
                            damageMarkers: [
                                {
                                    number: 1,
                                    label: "모서리",
                                    xpercent: 32.5,
                                    ypercent: 71,
                                },
                            ],
                        },
                        resultImageUrl: "result-url",
                        summaryComment: "요약",
                        resolvedPains: [],
                        difficulty: "보통",
                    },
                ],
            })
        );

        const response = await getRecommendationApi(7);
        const reform = response.rankings?.[0];

        expect(reform?.recommendationType).toBe("REFORM");
        if (reform?.recommendationType !== "REFORM") return;
        expect(reform.simulation?.damageMarkers[0]).toEqual({
            number: 1,
            label: "모서리",
            xPercent: 32.5,
            yPercent: 71,
        });
    });
});
