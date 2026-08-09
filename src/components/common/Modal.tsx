import Button from "@/components/common/Button";
import useDialogAccessibility from "@/hooks/useDialogAccessibility";
import { useEffect, useId, type ReactNode } from "react";
import { createPortal } from "react-dom";

type ModalProps = {
    open: boolean;
    title: string;
    children: ReactNode;
    onClose: () => void;
    footer?: ReactNode;
    closeLabel?: string;
};

const Modal = ({
    open,
    title,
    children,
    onClose,
    footer,
    closeLabel = "닫기",
}: ModalProps) => {
    const titleId = useId();
    const dialogRef = useDialogAccessibility<HTMLDivElement>(open, onClose);

    useEffect(() => {
        if (!open) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [open]);

    if (!open) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
            <button
                className="absolute inset-0 cursor-default bg-black/25"
                type="button"
                aria-label="모달 닫기"
                tabIndex={-1}
                onClick={onClose}
            />
            <div
                className="border-line relative max-h-[calc(100vh-40px)] w-full max-w-[700px] overflow-y-auto rounded-[5px] border bg-white p-5 shadow-[5px_7px_4px_rgba(91,58,41,0.14)] sm:p-6"
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                tabIndex={-1}
            >
                <div className="border-line flex items-center justify-between gap-4 border-b pb-[15px]">
                    <h2
                        className="text-primary text-[20px] font-bold sm:text-[25px]"
                        id={titleId}
                    >
                        {title}
                    </h2>
                    <button
                        className="focus-visible:outline-primary text-primary flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-[5px] text-[32px] leading-none focus-visible:outline-3"
                        type="button"
                        aria-label={closeLabel}
                        onClick={onClose}
                        data-dialog-initial-focus
                    >
                        ×
                    </button>
                </div>
                <div className="py-5 text-[18px] leading-relaxed">
                    {children}
                </div>
                <div className="mt-2">
                    {footer ?? (
                        <Button fullWidth onClick={onClose}>
                            {closeLabel}
                        </Button>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default Modal;
