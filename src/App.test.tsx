import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { appRoutes } from "@/router";
import { createMemoryRouter, RouterProvider } from "react-router-dom";

const renderPath = (path: string) => {
    const router = createMemoryRouter(appRoutes, {
        initialEntries: [path],
    });

    return render(<RouterProvider router={router} />);
};

describe("App 라우팅", () => {
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
});
