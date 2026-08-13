import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import HomePage from "@/pages/Home/HomePage";
import ReformSimulationPage from "@/pages/ReformSimulation/ReformSimulationPage";
import ResultConfirmPage from "@/pages/ResultConfirm/ResultConfirmPage";
import { ROUTES } from "@/routes/paths";

vi.mock("html2canvas-pro", () => ({
    default: vi.fn().mockResolvedValue({
        width: 800,
        height: 600,
        toDataURL: () => "data:image/png;base64,mock",
    }),
}));

vi.mock("jspdf", () => ({
    default: vi.fn().mockImplementation(function MockJsPDF() {
        return {
            internal: {
                pageSize: { getWidth: () => 595, getHeight: () => 842 },
            },
            addImage: vi.fn(),
            addPage: vi.fn(),
            save: vi.fn(),
        };
    }),
}));

const renderPage = () =>
    render(
        <MemoryRouter initialEntries={[ROUTES.resultConfirm]}>
            <Routes>
                <Route path={ROUTES.home} element={<HomePage />} />
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

describe("ResultConfirmPage", () => {
    it("AI 리폼 리포트와 공식 상담 신청 폼을 보여준다", () => {
        renderPage();

        expect(
            screen.getByRole("heading", { name: "결과 확인", level: 1 })
        ).toBeInTheDocument();
        expect(screen.getByText("AI 리폼 리포트")).toBeInTheDocument();
        expect(screen.getByText("공식 상담 신청")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "(보기)" })).toBeEnabled();
    });

    it("필수값을 채우지 않고 상담 신청하기를 누르면 항목별 에러를 보여준다", async () => {
        const user = userEvent.setup();
        renderPage();

        await user.click(screen.getByRole("button", { name: "상담 신청하기" }));

        expect(screen.getByText("성명을 입력해주세요")).toBeInTheDocument();
        expect(screen.getByText("연락처를 입력해주세요")).toBeInTheDocument();
        expect(
            screen.getByText("개인정보 수집 및 이용에 동의해주세요")
        ).toBeInTheDocument();
    });

    it("올바르지 않은 연락처 형식을 입력하면 형식 오류를 보여준다", async () => {
        const user = userEvent.setup();
        renderPage();

        await user.type(screen.getByLabelText(/^성명/), "홍길동");
        await user.type(screen.getByLabelText(/^연락처/), "12345");
        await user.click(screen.getByRole("button", { name: "상담 신청하기" }));

        expect(
            screen.getByText("올바른 연락처 형식이 아닙니다")
        ).toBeInTheDocument();
    });

    it("필수값을 모두 채우고 동의하면 상담 신청이 접수된다", async () => {
        const user = userEvent.setup();
        renderPage();

        await user.type(screen.getByLabelText(/^성명/), "홍길동");
        await user.type(screen.getByLabelText(/^연락처/), "010-1234-5678");
        await user.click(screen.getByLabelText(/개인정보 수집 및 이용에 동의/));
        await user.click(screen.getByRole("button", { name: "상담 신청하기" }));

        expect(
            screen.getByRole("dialog", { name: "공식 상담 신청 완료" })
        ).toBeInTheDocument();
    });

    it("개인정보 수집 및 이용 내용을 모달로 보여준다", async () => {
        const user = userEvent.setup();
        renderPage();

        await user.click(screen.getByRole("button", { name: "(보기)" }));

        expect(
            screen.getByRole("dialog", { name: "개인정보 수집 및 이용 동의" })
        ).toBeInTheDocument();
        expect(screen.getByText("1. 수집 및 이용 목적")).toBeInTheDocument();
    });

    it("리포트 저장 버튼을 누르면 PDF를 생성하고 저장 완료 메시지를 보여준다", async () => {
        const user = userEvent.setup();
        renderPage();

        await user.click(
            screen.getByRole("button", { name: "AI 리폼 리포트 저장" })
        );

        expect(
            await screen.findByText("PDF로 저장되었습니다.")
        ).toBeInTheDocument();
    });

    it("홈으로 버튼을 누르면 홈 화면으로 이동한다", async () => {
        const user = userEvent.setup();
        renderPage();

        await user.click(screen.getByRole("button", { name: "홈으로" }));

        expect(
            screen.getByRole("button", { name: "시작하기" })
        ).toBeInTheDocument();
    });
});
