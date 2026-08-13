import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import AIAnalysisPage from "@/pages/AIAnalysis/AIAnalysisPage";
import ReformSimulationPage from "@/pages/ReformSimulation/ReformSimulationPage";
import ResellPreviewPage from "@/pages/ResellPreview/ResellPreviewPage";
import SolutionRecommendPage from "@/pages/SolutionRecommend/SolutionRecommendPage";
import UpcyclePreviewPage from "@/pages/UpcyclePreview/UpcyclePreviewPage";
import { ROUTES } from "@/routes/paths";
import { useReformFlowStore } from "@/stores/useReformFlowStore";

const createImageFile = (name = "front.png") =>
    new File(["dummy"], name, { type: "image/png" });

const renderPage = () =>
    render(
        <MemoryRouter initialEntries={[ROUTES.solutionRecommend]}>
            <Routes>
                <Route path={ROUTES.aiAnalysis} element={<AIAnalysisPage />} />
                <Route
                    path={ROUTES.solutionRecommend}
                    element={<SolutionRecommendPage />}
                />
                <Route
                    path={ROUTES.reformSimulation}
                    element={<ReformSimulationPage />}
                />
                <Route
                    path={ROUTES.resellPreview}
                    element={<ResellPreviewPage />}
                />
                <Route
                    path={ROUTES.upcyclePreview}
                    element={<UpcyclePreviewPage />}
                />
            </Routes>
        </MemoryRouter>
    );

describe("SolutionRecommendPage", () => {
    afterEach(() => {
        vi.useRealTimers();
        useReformFlowStore.getState().resetFlow();
    });

    it("AI 추천 결과 레이아웃을 보여준다", () => {
        useReformFlowStore.setState({ frontPhoto: createImageFile() });
        renderPage();

        expect(
            screen.getByRole("heading", { name: "AI 추천 결과", level: 1 })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("heading", { name: "리폼 (Reform)" })
        ).toBeInTheDocument();
        expect(screen.getByText("경량 스트랩 교체")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /리셀/ })).toBeEnabled();
        expect(
            screen.getByRole("button", { name: /업사이클링/ })
        ).toBeEnabled();
        expect(screen.getByAltText("추천 제품 사진")).toBeInTheDocument();
    });

    it("다른 활용 방법을 선택하면 추천 내용과 CTA를 변경한다", async () => {
        const user = userEvent.setup();
        renderPage();

        await user.click(screen.getByRole("button", { name: /리셀/ }));

        expect(
            screen.getByRole("heading", { name: "리셀 (Resell)" })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "리셀 미리보기" })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /리폼.*AI 추천/ })
        ).toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: /업사이클링/ }));

        expect(
            screen.getByRole("heading", { name: "업사이클링 (Upcycling)" })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "업사이클링 미리보기" })
        ).toBeInTheDocument();
    });

    it("리셀 미리보기를 누르면 리셀 미리보기 화면으로 이동한다", async () => {
        vi.useFakeTimers();
        useReformFlowStore.setState({ selectedSolution: "resell" });
        renderPage();

        fireEvent.click(screen.getByRole("button", { name: "리셀 미리보기" }));

        expect(screen.getByText("리셀 미리보기 로딩 중")).toBeInTheDocument();

        await act(async () => {
            await vi.advanceTimersByTimeAsync(1200);
        });

        expect(
            screen.getByRole("heading", { name: "리셀 미리보기", level: 1 })
        ).toBeInTheDocument();
    });

    it("이전 단계를 누르면 AI 분석 화면으로 이동한다", async () => {
        renderPage();

        const user = userEvent.setup();
        await user.click(screen.getByRole("button", { name: "이전 단계" }));

        expect(
            screen.getByRole("heading", { name: "AI 분석 결과", level: 1 })
        ).toBeInTheDocument();
    });

    it("시뮬레이션 보기를 누르면 시뮬레이션 화면으로 이동한다", async () => {
        vi.useFakeTimers();
        renderPage();

        fireEvent.click(
            screen.getByRole("button", { name: "시뮬레이션 보기" })
        );

        expect(screen.getByText("리폼 시뮬레이션 로딩 중")).toBeInTheDocument();

        await act(async () => {
            await vi.advanceTimersByTimeAsync(1200);
        });

        expect(
            screen.getByRole("heading", { name: "리폼 시뮬레이션", level: 1 })
        ).toBeInTheDocument();
    });
});
