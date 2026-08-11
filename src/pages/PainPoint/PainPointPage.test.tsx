import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import AIAnalysisPage from "@/pages/AIAnalysis/AIAnalysisPage";
import PainPointPage from "@/pages/PainPoint/PainPointPage";
import ProductRegisterPage from "@/pages/ProductRegister/ProductRegisterPage";
import { ROUTES } from "@/routes/paths";

const renderPage = () =>
    render(
        <MemoryRouter initialEntries={[ROUTES.painPoint]}>
            <Routes>
                <Route
                    path={ROUTES.productRegister}
                    element={<ProductRegisterPage />}
                />
                <Route path={ROUTES.painPoint} element={<PainPointPage />} />
                <Route path={ROUTES.aiAnalysis} element={<AIAnalysisPage />} />
            </Routes>
        </MemoryRouter>
    );

describe("PainPointPage", () => {
    it("불편 입력 공통 레이아웃을 보여준다", () => {
        renderPage();

        expect(
            screen.getByRole("heading", { name: "불편 입력", level: 1 })
        ).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "무거움" })).toHaveAttribute(
            "aria-pressed",
            "false"
        );
    });

    it("불편 키워드를 복수 선택하고 다시 선택 해제할 수 있다", async () => {
        const user = userEvent.setup();
        renderPage();

        const heavy = screen.getByRole("button", { name: "무거움" });
        const shoulderPain = screen.getByRole("button", {
            name: "어깨가 아픔",
        });

        await user.click(heavy);
        await user.click(shoulderPain);

        expect(heavy).toHaveAttribute("aria-pressed", "true");
        expect(shoulderPain).toHaveAttribute("aria-pressed", "true");

        await user.click(heavy);

        expect(heavy).toHaveAttribute("aria-pressed", "false");
    });

    it("키워드를 선택하지 않고 다음 단계를 누르면 에러를 보여주고 이동하지 않는다", async () => {
        const user = userEvent.setup();
        renderPage();

        await user.click(screen.getByRole("button", { name: "AI 분석 시작" }));

        expect(
            screen.getByText("불편 키워드를 1개 이상 선택해주세요")
        ).toBeInTheDocument();
        expect(
            screen.queryByRole("heading", { name: "AI 분석" })
        ).not.toBeInTheDocument();
    });

    it("이전 단계를 누르면 제품 등록 화면으로 이동한다", async () => {
        const user = userEvent.setup();
        renderPage();

        await user.click(screen.getByRole("button", { name: "이전 단계" }));

        expect(
            screen.getByRole("heading", { name: "제품 등록" })
        ).toBeInTheDocument();
    });

    it("키워드를 선택하고 다음 단계를 누르면 AI 분석 화면으로 이동한다", async () => {
        const user = userEvent.setup();
        renderPage();

        await user.click(screen.getByRole("button", { name: "무거움" }));
        await user.click(screen.getByRole("button", { name: "AI 분석 시작" }));

        expect(
            screen.getByRole("heading", { name: "AI 분석" })
        ).toBeInTheDocument();
    });

    it("추가 설명을 자유롭게 입력할 수 있다", async () => {
        const user = userEvent.setup();
        renderPage();

        const textarea = screen.getByLabelText("추가 설명 입력");
        await user.type(textarea, "스트랩이 너무 짧아요.");

        expect(textarea).toHaveValue("스트랩이 너무 짧아요.");
    });
});
