import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
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

const finishResultGeneration = async () => {
    for (let i = 0; i < 3; i += 1) {
        await act(async () => {
            await vi.advanceTimersByTimeAsync(1200);
        });
    }
    vi.useRealTimers();
};

describe("ResultConfirmPage", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("결과 생성 중에는 단계별 체크리스트와 진행률을 보여준다", async () => {
        renderPage();

        expect(
            screen.getByRole("heading", { name: "결과", level: 1 })
        ).toBeInTheDocument();
        expect(
            screen.getByText("리폼 결과 데이터 정리 중...")
        ).toBeInTheDocument();
        expect(
            screen.getByRole("progressbar", { name: "결과 생성 진행률" })
        ).toHaveAttribute("aria-valuenow", "0");
    });

    it("결과 생성이 끝나면 AI 리폼 리포트와 공식 상담 신청 폼을 보여준다", async () => {
        renderPage();
        await finishResultGeneration();

        expect(
            screen.getByRole("heading", { name: "결과 확인", level: 1 })
        ).toBeInTheDocument();
        expect(screen.getByText("AI 리폼 리포트")).toBeInTheDocument();
        expect(screen.getByText("공식 상담 신청")).toBeInTheDocument();
        expect(
            screen.getByRole("button", {
                name: "개인정보 수집 및 이용 내용 보기 기능 준비 중",
            })
        ).toBeDisabled();
    });

    it("필수값을 채우지 않고 상담 신청하기를 누르면 항목별 에러를 보여준다", async () => {
        const user = userEvent.setup();
        renderPage();
        await finishResultGeneration();

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
        await finishResultGeneration();

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
        await finishResultGeneration();

        await user.type(screen.getByLabelText(/^성명/), "홍길동");
        await user.type(screen.getByLabelText(/^연락처/), "010-1234-5678");
        await user.click(screen.getByLabelText(/개인정보 수집 및 이용에 동의/));
        await user.click(screen.getByRole("button", { name: "상담 신청하기" }));

        expect(
            screen.getByText(/상담 신청이 접수되었습니다/)
        ).toBeInTheDocument();
    });

    it("리포트 저장 버튼을 누르면 PDF를 생성하고 저장 완료 메시지를 보여준다", async () => {
        const user = userEvent.setup();
        renderPage();
        await finishResultGeneration();

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
        await finishResultGeneration();

        await user.click(screen.getByRole("button", { name: "홈으로" }));

        expect(
            screen.getByRole("button", { name: "시작하기" })
        ).toBeInTheDocument();
    });
});
