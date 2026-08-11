import { act, render, screen } from "@testing-library/react";
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

const finishAnalysis = async () => {
    for (let i = 0; i < 3; i += 1) {
        await act(async () => {
            await vi.advanceTimersByTimeAsync(1200);
        });
    }
    vi.useRealTimers();
};

describe("AIAnalysisPage", () => {
    beforeEach(() => {
        seedReformFlowStore();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("분석 진행 중에는 단계별 체크리스트와 진행률을 보여준다", async () => {
        renderPage();

        expect(
            screen.getByRole("heading", { name: "AI 분석", level: 1 })
        ).toBeInTheDocument();
        expect(screen.getByText("제품 정보 확인 중...")).toBeInTheDocument();
        expect(
            screen.getByRole("progressbar", { name: "AI 분석 진행률" })
        ).toHaveAttribute("aria-valuenow", "0");

        await act(async () => {
            await vi.advanceTimersByTimeAsync(1200);
        });

        expect(
            screen.getByRole("progressbar", { name: "AI 분석 진행률" })
        ).toHaveAttribute("aria-valuenow", "33");
    });

    it("분석이 끝나면 이전 단계 입력을 반영한 분석 결과를 보여준다", async () => {
        renderPage();

        await finishAnalysis();

        expect(
            screen.getByRole("heading", { name: "AI 분석 결과", level: 1 })
        ).toBeInTheDocument();
        expect(screen.getByText("숄더백")).toBeInTheDocument();
        expect(screen.getByText("- 어깨에 부담이 감")).toBeInTheDocument();
        expect(
            screen.getByText("- 스트랩이 자주 흘러내림")
        ).toBeInTheDocument();
        expect(screen.getByAltText("정면 사진")).toBeInTheDocument();
        expect(screen.getByAltText("마모 부위 사진 1")).toBeInTheDocument();
    });

    it("이전 단계를 누르면 불편 입력 화면으로 이동한다", async () => {
        renderPage();
        await finishAnalysis();

        const user = userEvent.setup();
        await user.click(screen.getByRole("button", { name: "이전 단계" }));

        expect(
            screen.getByRole("heading", { name: "불편 입력", level: 1 })
        ).toBeInTheDocument();
    });

    it("추천 결과 보기를 누르면 추천 화면으로 이동한다", async () => {
        renderPage();
        await finishAnalysis();

        const user = userEvent.setup();
        await user.click(
            screen.getByRole("button", { name: "추천 결과 보기" })
        );

        expect(
            screen.getByRole("heading", { name: "추천", level: 1 })
        ).toBeInTheDocument();
    });
});
