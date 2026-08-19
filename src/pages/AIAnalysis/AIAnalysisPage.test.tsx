import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
    getRecommendationApi,
    requestRecommendationApi,
} from "@/api/recommendationApi";
import AIAnalysisPage from "@/pages/AIAnalysis/AIAnalysisPage";
import PainPointPage from "@/pages/PainPoint/PainPointPage";
import SolutionRecommendPage from "@/pages/SolutionRecommend/SolutionRecommendPage";
import { ROUTES } from "@/routes/paths";
import { useReformFlowStore } from "@/stores/useReformFlowStore";
import {
    diagnosisFixture,
    recommendationRankingsFixture,
    seedApiFlowStore,
} from "@/test/apiFixtures";

vi.mock("@/api/recommendationApi", () => ({
    requestRecommendationApi: vi.fn(),
    getRecommendationApi: vi.fn(),
}));

const renderPage = () =>
    render(
        <MemoryRouter initialEntries={[ROUTES.aiAnalysis]}>
            <Routes>
                <Route path={ROUTES.painPoint} element={<PainPointPage />} />
                <Route path={ROUTES.aiAnalysis} element={<AIAnalysisPage />} />
                <Route
                    path={ROUTES.solutionRecommend}
                    element={<SolutionRecommendPage />}
                />
            </Routes>
        </MemoryRouter>
    );

describe("AIAnalysisPage", () => {
    beforeEach(() => {
        useReformFlowStore.getState().resetFlow();
        useReformFlowStore.setState({
            ...seedApiFlowStore(),
            recommendationRankings: [],
        });
        vi.mocked(requestRecommendationApi).mockResolvedValue({ taskId: 1 });
        vi.mocked(getRecommendationApi).mockResolvedValue({
            status: "RECOMMENDED",
            rankings: recommendationRankingsFixture,
        });
    });

    it("이전 단계 입력을 반영한 분석 결과를 보여준다", () => {
        renderPage();

        expect(
            screen.getByRole("heading", { name: "AI 분석 결과", level: 1 })
        ).toBeInTheDocument();
        expect(screen.getByText("숄더백")).toBeInTheDocument();
        expect(screen.getByText("- 어깨에 부담이 감")).toBeInTheDocument();
        expect(
            screen.getByText("- 스트랩이 자주 흘러내림")
        ).toBeInTheDocument();
        expect(screen.getByAltText("정면 사진")).toBeInTheDocument();
    });

    it("일반 분석 결과는 등록한 사진을 캐러셀로 보여준다", () => {
        renderPage();
        expect(screen.getByAltText("정면 사진")).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "다음 사진" })
        ).toBeInTheDocument();
        expect(screen.getByText("1/2")).toBeInTheDocument();
    });

    it("사용 목적을 추론할 수 없으면 오류 문구와 사진 슬라이드를 보여준다", () => {
        useReformFlowStore.setState({
            diagnosisResult: {
                ...diagnosisFixture,
                currentPurpose: "확인할 수 없음",
            },
        });
        renderPage();

        expect(screen.getByText("확인할 수 없음")).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "다음 사진" })
        ).toBeInTheDocument();
        expect(screen.getByText("1/2")).toBeInTheDocument();
    });

    it("이전 단계를 누르면 불편 입력 화면으로 이동한다", async () => {
        renderPage();
        const user = userEvent.setup();
        await user.click(screen.getByRole("button", { name: "이전 단계" }));

        expect(
            screen.getByRole("heading", { name: "불편 입력", level: 1 })
        ).toBeInTheDocument();
    });

    it("추천이 이미 완료되었으면 POST 없이 추천 화면으로 이동한다", async () => {
        renderPage();
        const user = userEvent.setup();
        await user.click(
            screen.getByRole("button", { name: "추천 결과 보기" })
        );

        await waitFor(() =>
            expect(
                screen.getByRole("heading", {
                    name: "AI 추천 결과",
                    level: 1,
                })
            ).toBeInTheDocument()
        );
        expect(requestRecommendationApi).not.toHaveBeenCalled();
    });

    it("진단만 완료되었으면 추천을 요청하고 결과를 조회한다", async () => {
        vi.mocked(getRecommendationApi)
            .mockResolvedValueOnce({ status: "DIAGNOSED", rankings: null })
            .mockResolvedValueOnce({
                status: "RECOMMENDED",
                rankings: recommendationRankingsFixture,
            });
        renderPage();
        const user = userEvent.setup();
        await user.click(
            screen.getByRole("button", { name: "추천 결과 보기" })
        );

        await waitFor(() =>
            expect(
                screen.getByRole("heading", {
                    name: "AI 추천 결과",
                    level: 1,
                })
            ).toBeInTheDocument()
        );
        expect(requestRecommendationApi).toHaveBeenCalledWith(
            1,
            expect.any(AbortSignal)
        );
    });

    it("추천 POST 응답이 지연되어도 완료 결과 조회를 이어간다", async () => {
        vi.mocked(getRecommendationApi)
            .mockResolvedValueOnce({ status: "DIAGNOSED", rankings: null })
            .mockResolvedValueOnce({
                status: "RECOMMENDED",
                rankings: recommendationRankingsFixture,
            });
        vi.mocked(requestRecommendationApi).mockReturnValue(
            new Promise(() => undefined)
        );
        renderPage();
        const user = userEvent.setup();

        await user.click(
            screen.getByRole("button", { name: "추천 결과 보기" })
        );

        expect(
            await screen.findByRole("heading", {
                name: "AI 추천 결과",
                level: 1,
            })
        ).toBeInTheDocument();
        expect(requestRecommendationApi).toHaveBeenCalledOnce();
        expect(getRecommendationApi).toHaveBeenCalledTimes(2);
    });

    it("추천 생성 중이면 POST 없이 결과 조회를 이어간다", async () => {
        vi.mocked(getRecommendationApi)
            .mockResolvedValueOnce({ status: "RECOMMENDING", rankings: null })
            .mockResolvedValueOnce({
                status: "RECOMMENDED",
                rankings: recommendationRankingsFixture,
            });
        renderPage();
        const user = userEvent.setup();
        await user.click(
            screen.getByRole("button", { name: "추천 결과 보기" })
        );

        await waitFor(() =>
            expect(
                screen.getByRole("heading", {
                    name: "AI 추천 결과",
                    level: 1,
                })
            ).toBeInTheDocument()
        );
        expect(requestRecommendationApi).not.toHaveBeenCalled();
    });

    it("추천 작업이 실패했으면 실패 메시지를 보여준다", async () => {
        vi.mocked(getRecommendationApi).mockResolvedValue({
            status: "FAILED",
            rankings: null,
        });
        renderPage();
        const user = userEvent.setup();
        await user.click(
            screen.getByRole("button", { name: "추천 결과 보기" })
        );

        expect(
            await screen.findByText("AI 작업 처리에 실패했습니다.")
        ).toBeInTheDocument();
        expect(requestRecommendationApi).not.toHaveBeenCalled();
    });

    it("POST 직전에 선행 생성이 완료되면 최신 결과로 이동한다", async () => {
        vi.mocked(getRecommendationApi)
            .mockResolvedValueOnce({ status: "DIAGNOSED", rankings: null })
            .mockResolvedValueOnce({
                status: "RECOMMENDED",
                rankings: recommendationRankingsFixture,
            });
        vi.mocked(requestRecommendationApi).mockRejectedValueOnce(
            new Error("TASK400")
        );
        renderPage();
        const user = userEvent.setup();
        await user.click(
            screen.getByRole("button", { name: "추천 결과 보기" })
        );

        expect(
            await screen.findByRole("heading", {
                name: "AI 추천 결과",
                level: 1,
            })
        ).toBeInTheDocument();
        expect(requestRecommendationApi).toHaveBeenCalledOnce();
        expect(getRecommendationApi).toHaveBeenCalledTimes(2);
    });

    it("POST 충돌 후 추천 생성 중이면 조회를 이어간다", async () => {
        vi.mocked(getRecommendationApi)
            .mockResolvedValueOnce({ status: "DIAGNOSED", rankings: null })
            .mockResolvedValueOnce({ status: "RECOMMENDING", rankings: null })
            .mockResolvedValueOnce({
                status: "RECOMMENDED",
                rankings: recommendationRankingsFixture,
            });
        vi.mocked(requestRecommendationApi).mockRejectedValueOnce(
            new Error("TASK400")
        );
        renderPage();
        const user = userEvent.setup();

        await user.click(
            screen.getByRole("button", { name: "추천 결과 보기" })
        );

        expect(
            await screen.findByRole(
                "heading",
                {
                    name: "AI 추천 결과",
                    level: 1,
                },
                { timeout: 3_000 }
            )
        ).toBeInTheDocument();
        expect(getRecommendationApi).toHaveBeenCalledTimes(3);
    });

    it("추천 완료 응답에 결과가 없으면 오류를 표시한다", async () => {
        vi.mocked(getRecommendationApi).mockResolvedValue({
            status: "RECOMMENDED",
            rankings: null,
        });
        renderPage();
        const user = userEvent.setup();

        await user.click(
            screen.getByRole("button", { name: "추천 결과 보기" })
        );

        expect(
            await screen.findByText("AI 추천 결과를 확인할 수 없습니다.")
        ).toBeInTheDocument();
        expect(requestRecommendationApi).not.toHaveBeenCalled();
    });

    it("POST 실패 후에도 진단 상태라면 원래 서버 오류를 표시한다", async () => {
        vi.mocked(getRecommendationApi).mockResolvedValue({
            status: "DIAGNOSED",
            rankings: null,
        });
        vi.mocked(requestRecommendationApi).mockRejectedValueOnce(
            new Error("추천 요청을 처리할 수 없습니다.")
        );
        renderPage();
        const user = userEvent.setup();

        await user.click(
            screen.getByRole("button", { name: "추천 결과 보기" })
        );

        expect(
            await screen.findByText("추천 요청을 처리할 수 없습니다.")
        ).toBeInTheDocument();
        expect(getRecommendationApi).toHaveBeenCalledTimes(2);
    });
});
