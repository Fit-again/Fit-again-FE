import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { analyzeImagesApi } from "@/api/imageApi";
import { createTaskApi, getDiagnosisApi } from "@/api/taskApi";
import AIAnalysisPage from "@/pages/AIAnalysis/AIAnalysisPage";
import PainPointPage from "@/pages/PainPoint/PainPointPage";
import ProductRegisterPage from "@/pages/ProductRegister/ProductRegisterPage";
import { ROUTES } from "@/routes/paths";
import { useReformFlowStore } from "@/stores/useReformFlowStore";
import { diagnosisFixture } from "@/test/apiFixtures";

vi.mock("@/api/imageApi", () => ({ analyzeImagesApi: vi.fn() }));
vi.mock("@/api/taskApi", () => ({
    createTaskApi: vi.fn(),
    getDiagnosisApi: vi.fn(),
}));

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
    beforeEach(() => {
        useReformFlowStore.getState().resetFlow();
        useReformFlowStore.setState({
            productType: "shoulder",
            frontPhoto: new File(["dummy"], "front.png", {
                type: "image/png",
            }),
            wearPhotos: [
                new File(["dummy"], "wear.png", { type: "image/png" }),
            ],
        });
        vi.mocked(analyzeImagesApi).mockResolvedValue({
            frontImageUrl: "https://example.com/front.png",
            detailImageUrls: [],
            isValid: true,
            message: "분석 가능한 이미지입니다.",
        });
        vi.mocked(createTaskApi).mockResolvedValue({ taskId: 1 });
        vi.mocked(getDiagnosisApi).mockResolvedValue({
            status: "DIAGNOSED",
            diagnosisResult: diagnosisFixture,
        });
    });

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

    it("이전에 저장한 불편 정보를 다시 화면에 표시한다", () => {
        useReformFlowStore.setState({
            painPointKeywordIds: ["heavy", "shoulder-pain"],
            description: "이전에 작성한 설명",
        });

        renderPage();

        expect(screen.getByRole("button", { name: "무거움" })).toHaveAttribute(
            "aria-pressed",
            "true"
        );
        expect(screen.getByLabelText("추가 설명 입력")).toHaveValue(
            "이전에 작성한 설명"
        );
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
        renderPage();
        const user = userEvent.setup();

        await user.click(screen.getByRole("button", { name: "무거움" }));
        await user.click(screen.getByRole("button", { name: "AI 분석 시작" }));

        expect(screen.getByText("AI 분석 결과 로딩 중")).toBeInTheDocument();
        await waitFor(() =>
            expect(
                screen.getByRole("heading", { name: "AI 분석 결과" })
            ).toBeInTheDocument()
        );
        expect(createTaskApi).toHaveBeenCalledWith(
            expect.objectContaining({
                productType: "숄더백",
                keywords: ["무거움"],
            }),
            expect.any(AbortSignal)
        );
    });

    it.each(["RECOMMENDING", "RECOMMENDED"] as const)(
        "진단 결과가 있으면 추천 상태가 %s여도 AI 분석 화면으로 이동한다",
        async (status) => {
            vi.mocked(getDiagnosisApi).mockResolvedValue({
                status,
                diagnosisResult: diagnosisFixture,
            });
            renderPage();
            const user = userEvent.setup();

            await user.click(screen.getByRole("button", { name: "무거움" }));
            await user.click(
                screen.getByRole("button", { name: "AI 분석 시작" })
            );

            await waitFor(() =>
                expect(
                    screen.getByRole("heading", { name: "AI 분석 결과" })
                ).toBeInTheDocument()
            );
        }
    );

    it("추천 생성만 실패하고 진단 결과가 남아 있으면 AI 분석 화면으로 이동한다", async () => {
        vi.mocked(getDiagnosisApi).mockResolvedValue({
            status: "FAILED",
            diagnosisResult: diagnosisFixture,
            errorMessage: "추천 생성에 실패했습니다.",
        });
        renderPage();
        const user = userEvent.setup();

        await user.click(screen.getByRole("button", { name: "무거움" }));
        await user.click(screen.getByRole("button", { name: "AI 분석 시작" }));

        await waitFor(() =>
            expect(
                screen.getByRole("heading", { name: "AI 분석 결과" })
            ).toBeInTheDocument()
        );
    });

    it("진단 결과 없이 작업이 실패하면 서버 오류를 표시한다", async () => {
        vi.mocked(getDiagnosisApi).mockResolvedValue({
            status: "FAILED",
            diagnosisResult: null,
            errorMessage: "진단 생성에 실패했습니다.",
        });
        renderPage();
        const user = userEvent.setup();

        await user.click(screen.getByRole("button", { name: "무거움" }));
        await user.click(screen.getByRole("button", { name: "AI 분석 시작" }));

        expect(
            await screen.findByText("진단 생성에 실패했습니다.")
        ).toBeInTheDocument();
        expect(
            screen.queryByRole("heading", { name: "AI 분석 결과" })
        ).not.toBeInTheDocument();
    });

    it("추가 설명을 자유롭게 입력할 수 있다", async () => {
        const user = userEvent.setup();
        renderPage();

        const textarea = screen.getByLabelText("추가 설명 입력");
        await user.type(textarea, "스트랩이 너무 짧아요.");

        expect(textarea).toHaveValue("스트랩이 너무 짧아요.");
    });
});
