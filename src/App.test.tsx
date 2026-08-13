import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { appRoutes } from "@/router";
import { ROUTES } from "@/routes/paths";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { useReformFlowStore } from "@/stores/useReformFlowStore";

const renderPath = (path: string) => {
    const router = createMemoryRouter(appRoutes, {
        initialEntries: [path],
    });

    return render(<RouterProvider router={router} />);
};

describe("App 라우팅", () => {
    beforeEach(() => {
        useReformFlowStore.getState().resetFlow();
    });

    it("루트 경로에서 홈 화면을 보여준다", async () => {
        renderPath("/");

        expect(
            await screen.findByRole("heading", { name: "Fit:again" })
        ).toBeInTheDocument();
    });

    it("/product-register 경로에서 제품 등록 화면을 보여준다", async () => {
        renderPath("/product-register");

        expect(
            await screen.findByRole("heading", {
                name: "제품 등록",
                level: 1,
            })
        ).toBeInTheDocument();
    });

    it("정의되지 않은 경로에서 404 화면을 보여준다", async () => {
        renderPath("/unknown");

        expect(
            await screen.findByRole("heading", { name: "404" })
        ).toBeInTheDocument();
    });

    it("제품 정보 없이 후속 단계에 접근하면 제품 등록으로 이동한다", async () => {
        renderPath(ROUTES.aiAnalysis);

        expect(
            await screen.findByRole("heading", {
                name: "제품 등록",
                level: 1,
            })
        ).toBeInTheDocument();
    });

    it("불편 정보 없이 분석 단계에 접근하면 불편 입력으로 이동한다", async () => {
        useReformFlowStore.setState({
            productType: "tote",
            frontPhoto: new File(["dummy"], "front.png", {
                type: "image/png",
            }),
        });

        renderPath(ROUTES.aiAnalysis);

        expect(
            await screen.findByRole("heading", {
                name: "불편 입력",
                level: 1,
            })
        ).toBeInTheDocument();
    });

    it("단계 화면의 로고로 이동할 때 입력 상태를 유지한다", async () => {
        const user = userEvent.setup();
        const frontPhoto = new File(["dummy"], "front.png", {
            type: "image/png",
        });
        useReformFlowStore.setState({
            productType: "tote",
            frontPhoto,
        });

        renderPath(ROUTES.painPoint);
        await user.click(
            await screen.findByRole("link", { name: "Fit Again 홈" })
        );

        expect(
            await screen.findByRole("heading", { name: "Fit:again" })
        ).toBeInTheDocument();
        expect(useReformFlowStore.getState().frontPhoto).toBe(frontPhoto);
    });

    it("홈에서 새로 시작하면 이전 입력 상태를 초기화한다", async () => {
        const user = userEvent.setup();
        useReformFlowStore.setState({
            productType: "tote",
            frontPhoto: new File(["dummy"], "front.png", {
                type: "image/png",
            }),
            painPointKeywordIds: ["heavy"],
            selectedSolution: "resell",
            selectedUpcycleProduct: "pouch",
        });

        renderPath(ROUTES.home);
        await user.click(
            await screen.findByRole("button", { name: "시작하기" })
        );

        expect(
            await screen.findByRole("heading", {
                name: "제품 등록",
                level: 1,
            })
        ).toBeInTheDocument();
        expect(useReformFlowStore.getState().productType).toBeNull();
        expect(useReformFlowStore.getState().frontPhoto).toBeNull();
        expect(useReformFlowStore.getState().detailPhotos).toEqual([]);
        expect(useReformFlowStore.getState().painPointKeywordIds).toEqual([]);
        expect(useReformFlowStore.getState().selectedSolution).toBe("reform");
        expect(useReformFlowStore.getState().selectedUpcycleProduct).toBe(
            "mini-crossbag"
        );
    });
});
