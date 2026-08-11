import { act, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AIAnalysisPage from "@/pages/AIAnalysis/AIAnalysisPage";
import SolutionRecommendPage from "@/pages/SolutionRecommend/SolutionRecommendPage";
import { ROUTES } from "@/routes/paths";

const renderPage = () =>
    render(
        <MemoryRouter initialEntries={[ROUTES.aiAnalysis]}>
            <Routes>
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
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("AI 분석 공통 레이아웃과 첫 분석 단계를 보여준다", () => {
        renderPage();

        expect(
            screen.getByRole("heading", { name: "AI 분석", level: 1 })
        ).toBeInTheDocument();
        expect(screen.getByText("제품 정보 확인 중")).toBeInTheDocument();
        expect(
            screen.getByRole("progressbar", { name: "AI 분석 진행률" })
        ).toHaveAttribute("aria-valuenow", "0");
    });

    it("시간이 지날수록 분석 단계가 순차적으로 진행된다", () => {
        renderPage();

        act(() => {
            vi.advanceTimersByTime(1200);
        });
        expect(
            screen.getByRole("progressbar", { name: "AI 분석 진행률" })
        ).toHaveAttribute("aria-valuenow", "33");

        act(() => {
            vi.advanceTimersByTime(1200);
        });
        expect(
            screen.getByRole("progressbar", { name: "AI 분석 진행률" })
        ).toHaveAttribute("aria-valuenow", "67");
    });

    it("분석이 모두 끝나면 추천 화면으로 자동 이동한다", () => {
        renderPage();

        act(() => {
            vi.advanceTimersByTime(1200);
        });
        act(() => {
            vi.advanceTimersByTime(1200);
        });
        act(() => {
            vi.advanceTimersByTime(1200);
        });
        expect(
            screen.getByText("분석이 완료됐어요. 추천 화면으로 이동할게요.")
        ).toBeInTheDocument();

        act(() => {
            vi.advanceTimersByTime(700);
        });
        expect(
            screen.getByRole("heading", { name: "추천", level: 1 })
        ).toBeInTheDocument();
    });
});
