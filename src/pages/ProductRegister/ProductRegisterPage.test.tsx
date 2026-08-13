import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import PainPointPage from "@/pages/PainPoint/PainPointPage";
import ProductRegisterPage from "@/pages/ProductRegister/ProductRegisterPage";
import { ROUTES } from "@/routes/paths";
import { useReformFlowStore } from "@/stores/useReformFlowStore";

const createImageFile = (name = "photo.png") =>
    new File(["dummy"], name, { type: "image/png" });

const renderPage = () =>
    render(
        <MemoryRouter initialEntries={[ROUTES.productRegister]}>
            <Routes>
                <Route
                    path={ROUTES.productRegister}
                    element={<ProductRegisterPage />}
                />
                <Route path={ROUTES.painPoint} element={<PainPointPage />} />
            </Routes>
        </MemoryRouter>
    );

describe("ProductRegisterPage", () => {
    beforeEach(() => {
        useReformFlowStore.getState().resetFlow();
    });

    it("제품 등록 공통 레이아웃을 보여준다", () => {
        renderPage();

        expect(
            screen.getByRole("heading", { name: "제품 등록", level: 1 })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("navigation", { name: "서비스 진행 단계" })
        ).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "토트백" })).toHaveAttribute(
            "aria-pressed",
            "false"
        );
    });

    it("제품 유형을 선택할 수 있다", async () => {
        const user = userEvent.setup();
        renderPage();

        const shoulderBag = screen.getByRole("button", { name: "숄더백" });
        await user.click(shoulderBag);

        expect(shoulderBag).toHaveAttribute("aria-pressed", "true");
    });

    it("이전에 저장한 제품 정보를 다시 화면에 표시한다", () => {
        const frontPhoto = createImageFile("saved-front.png");
        useReformFlowStore.setState({
            productType: "shoulder",
            frontPhoto,
            detailPhotos: [createImageFile("saved-detail.png")],
            wearPhotos: [createImageFile("saved-wear.png")],
        });

        renderPage();

        expect(screen.getByRole("button", { name: "숄더백" })).toHaveAttribute(
            "aria-pressed",
            "true"
        );
        expect(screen.getByText("saved-front.png")).toBeInTheDocument();
        expect(screen.getByAltText("디테일 사진 1")).toBeInTheDocument();
        expect(screen.getByAltText("마모 부위 사진 1")).toBeInTheDocument();
    });

    it("테스트용 컴포넌트 확인 영역을 노출하지 않는다", () => {
        renderPage();

        expect(
            screen.queryByText("공통 컴포넌트 확인")
        ).not.toBeInTheDocument();
    });

    it("필수값을 채우지 않고 다음 단계를 누르면 항목별 에러를 보여주고 이동하지 않는다", async () => {
        const user = userEvent.setup();
        renderPage();

        await user.click(screen.getByRole("button", { name: "다음 단계" }));

        expect(
            screen.getByText("제품 유형을 선택해주세요")
        ).toBeInTheDocument();
        expect(
            screen.getByText("정면 사진을 업로드해주세요")
        ).toBeInTheDocument();
        expect(
            screen.queryByText("마모 부위 사진을 업로드해주세요")
        ).not.toBeInTheDocument();
        expect(
            screen.queryByRole("heading", { name: "불편 입력" })
        ).not.toBeInTheDocument();
    });

    it("마모 부위 사진 없이도 다음 단계로 이동할 수 있다", async () => {
        const user = userEvent.setup();
        renderPage();

        await user.click(screen.getByRole("button", { name: "토트백" }));
        await user.upload(
            screen.getByLabelText(/정면 사진을 선택해주세요/),
            createImageFile("front.png")
        );
        await user.click(screen.getByRole("button", { name: "다음 단계" }));

        expect(
            await screen.findByRole("heading", { name: "불편 입력" })
        ).toBeInTheDocument();
    });

    it("정면 사진을 업로드하면 파일명을 보여준다", async () => {
        const user = userEvent.setup();
        renderPage();

        const input = screen.getByLabelText(/정면 사진을 선택해주세요/);
        await user.upload(input, createImageFile("front.png"));

        expect(screen.getByText("front.png")).toBeInTheDocument();
    });

    it("이미지가 아닌 파일을 정면 사진으로 올리면 올바른 제품이 아니라는 에러를 보여준다", async () => {
        const user = userEvent.setup({ applyAccept: false });
        renderPage();

        const input = screen.getByLabelText(/정면 사진을 선택해주세요/);
        await user.upload(
            input,
            new File(["dummy"], "front.txt", { type: "text/plain" })
        );
        await user.click(screen.getByRole("button", { name: "다음 단계" }));

        expect(screen.getByText("올바른 제품이 아닙니다")).toBeInTheDocument();
    });

    it("마모 부위 사진을 업로드하고 개별 삭제할 수 있다", async () => {
        const user = userEvent.setup();
        renderPage();

        const addInput = screen.getByLabelText("마모 부위 사진 추가");
        await user.upload(addInput, createImageFile("wear.png"));

        expect(screen.getByAltText("마모 부위 사진 1")).toBeInTheDocument();

        await user.click(
            screen.getByRole("button", { name: "마모 부위 사진 1 삭제" })
        );

        expect(
            screen.queryByAltText("마모 부위 사진 1")
        ).not.toBeInTheDocument();
        expect(
            screen.getByLabelText("마모 부위 사진 추가")
        ).toBeInTheDocument();
    });

    it("디테일 사진을 업로드하고 개별 삭제할 수 있다", async () => {
        const user = userEvent.setup();
        renderPage();

        await user.upload(
            screen.getByLabelText("디테일 사진 추가"),
            createImageFile("detail.png")
        );

        expect(screen.getByAltText("디테일 사진 1")).toBeInTheDocument();

        await user.click(
            screen.getByRole("button", { name: "디테일 사진 1 삭제" })
        );

        expect(screen.queryByAltText("디테일 사진 1")).not.toBeInTheDocument();
    });

    it("모든 필수값을 채우고 다음 단계를 누르면 다음 화면으로 이동한다", async () => {
        const user = userEvent.setup();
        renderPage();

        await user.click(screen.getByRole("button", { name: "토트백" }));
        await user.upload(
            screen.getByLabelText(/정면 사진을 선택해주세요/),
            createImageFile("front.png")
        );
        await user.upload(
            screen.getByLabelText("마모 부위 사진 추가"),
            createImageFile("wear.png")
        );
        await user.click(screen.getByRole("button", { name: "다음 단계" }));

        expect(
            await screen.findByRole("heading", { name: "불편 입력" })
        ).toBeInTheDocument();
    });
});
