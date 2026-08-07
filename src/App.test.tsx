import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "@/App";

describe("App", () => {
    it("프로젝트 준비 완료 안내를 보여준다", () => {
        render(<App />);

        expect(
            screen.getByRole("heading", { name: "프로젝트 준비 완료" })
        ).toBeInTheDocument();
    });
});
