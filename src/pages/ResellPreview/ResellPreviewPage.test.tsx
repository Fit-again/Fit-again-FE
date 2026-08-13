import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import ResellPreviewPage from "@/pages/ResellPreview/ResellPreviewPage";
import SolutionRecommendPage from "@/pages/SolutionRecommend/SolutionRecommendPage";
import { ROUTES } from "@/routes/paths";
import { useReformFlowStore } from "@/stores/useReformFlowStore";

const renderPage = () =>
    render(
        <MemoryRouter initialEntries={[ROUTES.resellPreview]}>
            <Routes>
                <Route
                    path={ROUTES.solutionRecommend}
                    element={<SolutionRecommendPage />}
                />
                <Route
                    path={ROUTES.resellPreview}
                    element={<ResellPreviewPage />}
                />
            </Routes>
        </MemoryRouter>
    );

describe("ResellPreviewPage", () => {
    afterEach(() => useReformFlowStore.getState().resetFlow());

    it("리셀 대상 사용자와 가치 요소를 보여준다", () => {
        renderPage();

        expect(
            screen.getByRole("heading", { name: "리셀 미리보기", level: 1 })
        ).toBeInTheDocument();
        expect(
            screen.getByText("이 제품과 잘 맞을 수 있는 사용자")
        ).toBeInTheDocument();
        expect(
            screen.getByText("리셀 가치에 영향을 주는 요소")
        ).toBeInTheDocument();
    });

    it("이전 단계를 누르면 추천 화면으로 이동한다", async () => {
        const user = userEvent.setup();
        renderPage();

        await user.click(screen.getByRole("button", { name: "이전 단계" }));

        expect(
            screen.getByRole("heading", { name: "AI 추천 결과", level: 1 })
        ).toBeInTheDocument();
    });
});
