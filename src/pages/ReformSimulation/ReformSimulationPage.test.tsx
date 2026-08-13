import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import ReformSimulationPage from "@/pages/ReformSimulation/ReformSimulationPage";
import ResultConfirmPage from "@/pages/ResultConfirm/ResultConfirmPage";
import SolutionRecommendPage from "@/pages/SolutionRecommend/SolutionRecommendPage";
import { ROUTES } from "@/routes/paths";
import { useReformFlowStore } from "@/stores/useReformFlowStore";

const createImageFile = (name = "front.png") =>
    new File(["dummy"], name, { type: "image/png" });

const renderPage = () =>
    render(
        <MemoryRouter initialEntries={[ROUTES.reformSimulation]}>
            <Routes>
                <Route
                    path={ROUTES.solutionRecommend}
                    element={<SolutionRecommendPage />}
                />
                <Route
                    path={ROUTES.reformSimulation}
                    element={<ReformSimulationPage />}
                />
                <Route
                    path={ROUTES.resultConfirm}
                    element={<ResultConfirmPage />}
                />
            </Routes>
        </MemoryRouter>
    );

describe("ReformSimulationPage", () => {
    afterEach(() => {
        vi.useRealTimers();
        useReformFlowStore.setState({
            frontPhoto: null,
            wearPhotos: [],
            painPointKeywordIds: [],
        });
    });

    it("단계별 결과와 Before/After 비교를 보여준다", () => {
        useReformFlowStore.setState({
            frontPhoto: createImageFile(),
            painPointKeywordIds: ["strap-slip", "shoulder-pain"],
        });
        renderPage();

        expect(
            screen.getByRole("heading", { name: "리폼 시뮬레이션", level: 1 })
        ).toBeInTheDocument();
        expect(screen.getByText("경량 스트랩 교체")).toBeInTheDocument();
        expect(screen.getByText("모서리 보수")).toBeInTheDocument();
        expect(screen.getByText("Before")).toBeInTheDocument();
        expect(screen.getByText("After")).toBeInTheDocument();
        expect(screen.getByText("스트랩이 자주 흘러내림")).toBeInTheDocument();
        expect(
            screen.getByText("경량 스트랩으로 착용감 개선")
        ).toBeInTheDocument();
    });

    it("불편 키워드가 없으면 기본 Before/After 문구를 보여준다", () => {
        renderPage();

        expect(
            screen.getByText("모서리 마모로 외관이 손상됨")
        ).toBeInTheDocument();
        expect(
            screen.getByText("기존 디자인을 유지하면서 사용성 향상")
        ).toBeInTheDocument();
    });

    it("이전 단계를 누르면 추천 화면으로 이동한다", async () => {
        renderPage();

        const user = userEvent.setup();
        await user.click(screen.getByRole("button", { name: "이전 단계" }));

        expect(
            screen.getByRole("heading", { name: "AI 추천 결과", level: 1 })
        ).toBeInTheDocument();
    });

    it("결과 보기를 누르면 결과 화면으로 이동한다", async () => {
        vi.useFakeTimers();
        renderPage();

        fireEvent.click(screen.getByRole("button", { name: "결과 보기" }));

        expect(screen.getByText("결과 확인 로딩 중")).toBeInTheDocument();

        await act(async () => {
            await vi.advanceTimersByTimeAsync(1200);
        });

        expect(
            screen.getByRole("heading", { name: "결과 확인", level: 1 })
        ).toBeInTheDocument();
    });
});
