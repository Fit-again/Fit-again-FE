import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import App from "@/App";

describe("App 라우팅", () => {
    it("루트 경로에서 홈 화면을 보여준다", () => {
        render(
            <MemoryRouter initialEntries={["/"]}>
                <App />
            </MemoryRouter>
        );

        expect(
            screen.getByRole("heading", { name: "Fit:again" })
        ).toBeInTheDocument();
    });

    it("/product-register 경로에서 제품 등록 화면을 보여준다", () => {
        render(
            <MemoryRouter initialEntries={["/product-register"]}>
                <App />
            </MemoryRouter>
        );

        expect(
            screen.getByRole("heading", { name: "제품 등록", level: 1 })
        ).toBeInTheDocument();
    });

    it("정의되지 않은 경로에서 404 화면을 보여준다", () => {
        render(
            <MemoryRouter initialEntries={["/unknown"]}>
                <App />
            </MemoryRouter>
        );

        expect(
            screen.getByRole("heading", { name: "404" })
        ).toBeInTheDocument();
    });
});
