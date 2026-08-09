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

    it("다음 단계 버튼으로 안내 모달을 열고 닫는다", async () => {
        const user = userEvent.setup();
        render(<App />);

        await user.click(screen.getByRole("button", { name: "다음 단계" }));
        expect(
            screen.getByRole("dialog", { name: "기본 컴포넌트 준비 완료" })
        ).toBeInTheDocument();

        await user.click(screen.getByText("닫기", { selector: "button" }));
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
});
