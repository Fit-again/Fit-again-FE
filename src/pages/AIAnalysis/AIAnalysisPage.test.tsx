import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AIAnalysisPage from "@/pages/AIAnalysis/AIAnalysisPage";
import PainPointPage from "@/pages/PainPoint/PainPointPage";
import SolutionRecommendPage from "@/pages/SolutionRecommend/SolutionRecommendPage";
import { ROUTES } from "@/routes/paths";
import { useReformFlowStore } from "@/stores/useReformFlowStore";

const createImageFile = (name = "photo.png") =>
    new File(["dummy"], name, { type: "image/png" });

const seedReformFlowStore = () => {
    useReformFlowStore.setState({
        productType: "shoulder",
        frontPhoto: createImageFile("front.png"),
        wearPhotos: [createImageFile("wear-1.png")],
        painPointKeywordIds: ["shoulder-pain", "strap-slip"],
        description: "스트랩이 자주 흘러내려요.",
    });
};

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
        seedReformFlowStore();
    });

    afterEach(() => {
        vi.useRealTimers();
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

    it("분석 이미지는 한 장씩 보여주고 슬라이드로 넘겨볼 수 있다", async () => {
        renderPage();
        expect(screen.getByAltText("정면 사진")).toBeInTheDocument();
        expect(
            screen.queryByAltText("마모 부위 사진 1")
        ).not.toBeInTheDocument();
        expect(screen.getByText("1/2")).toBeInTheDocument();

        const user = userEvent.setup();
        await user.click(screen.getByRole("button", { name: "다음 사진" }));

        expect(screen.getByAltText("마모 부위 사진 1")).toBeInTheDocument();
        expect(screen.queryByAltText("정면 사진")).not.toBeInTheDocument();
        expect(screen.getByText("2/2")).toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: "다음 사진" }));

        expect(screen.getByAltText("정면 사진")).toBeInTheDocument();
        expect(screen.getByText("1/2")).toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: "이전 사진" }));

        expect(screen.getByAltText("마모 부위 사진 1")).toBeInTheDocument();
    });

    it("이전 단계를 누르면 불편 입력 화면으로 이동한다", async () => {
        renderPage();
        const user = userEvent.setup();
        await user.click(screen.getByRole("button", { name: "이전 단계" }));

        expect(
            screen.getByRole("heading", { name: "불편 입력", level: 1 })
        ).toBeInTheDocument();
    });

    it("추천 결과 보기를 누르면 추천 화면으로 이동한다", async () => {
        vi.useFakeTimers();
        renderPage();
        fireEvent.click(screen.getByRole("button", { name: "추천 결과 보기" }));

        expect(screen.getByText("AI 추천 결과 로딩 중")).toBeInTheDocument();

        await act(async () => {
            await vi.advanceTimersByTimeAsync(1200);
        });

        expect(
            screen.getByRole("heading", { name: "AI 추천 결과", level: 1 })
        ).toBeInTheDocument();
    });
});
