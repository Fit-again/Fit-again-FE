import Modal from "@/components/common/Modal";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";

const ModalFixture = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button type="button" onClick={() => setOpen(true)}>
                안내 열기
            </button>
            <Modal open={open} title="안내" onClose={() => setOpen(false)}>
                <p>안내 내용입니다.</p>
            </Modal>
        </>
    );
};

describe("Modal", () => {
    it("모달을 열고 닫을 수 있다", async () => {
        const user = userEvent.setup();
        render(<ModalFixture />);

        await user.click(screen.getByRole("button", { name: "안내 열기" }));
        expect(
            screen.getByRole("dialog", { name: "안내" })
        ).toBeInTheDocument();

        await user.click(screen.getByText("닫기", { selector: "button" }));
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
});
