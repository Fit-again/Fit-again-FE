import type { InputHTMLAttributes, ReactNode } from "react";

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
    label: ReactNode;
    invalid?: boolean;
};

const Checkbox = ({
    label,
    invalid = false,
    className = "",
    id,
    ...rest
}: CheckboxProps) => (
    <label
        className={`inline-flex cursor-pointer items-start gap-2 text-[16px] ${className}`}
        htmlFor={id}
    >
        <input id={id} type="checkbox" className="peer sr-only" {...rest} />
        <span
            className={`peer-checked:border-primary peer-checked:bg-primary peer-focus-visible:outline-primary mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-[4px] border bg-white transition-colors peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 ${invalid ? "border-danger" : "border-line"}`}
            aria-hidden="true"
        >
            <svg className="size-3 text-white" viewBox="0 0 12 12" fill="none">
                <path
                    d="M2 6l2.5 2.5L10 3"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </span>
        <span className="text-text-body">{label}</span>
    </label>
);

export default Checkbox;
