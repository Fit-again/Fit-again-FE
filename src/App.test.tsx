import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "@/App";

describe("App", () => {
    it("제품 등록 공통 레이아웃을 보여준다", () => {
        render(<App />);

        expect(
            screen.getByRole("heading", { name: "제품 등록", level: 1 })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("navigation", { name: "서비스 진행 단계" })
        ).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "토트백" })).toHaveAttribute(
            "aria-pressed",
            "true"
        );
    });

    it("제품 유형을 선택할 수 있다", async () => {
        const user = userEvent.setup();
        render(<App />);

        const shoulderBag = screen.getByRole("button", { name: "숄더백" });
        await user.click(shoulderBag);

        expect(shoulderBag).toHaveAttribute("aria-pressed", "true");
    });

    it("테스트용 컴포넌트 확인 영역을 노출하지 않는다", () => {
        render(<App />);

        expect(
            screen.queryByText("공통 컴포넌트 확인")
        ).not.toBeInTheDocument();
    });
});
