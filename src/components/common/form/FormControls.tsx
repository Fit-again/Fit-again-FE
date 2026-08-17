import type {
    InputHTMLAttributes,
    ReactNode,
    TextareaHTMLAttributes,
} from "react";

export const Field = ({
    label,
    htmlFor,
    required = false,
    optional = false,
    description,
    error,
    children,
    className = "",
}: {
    label: string;
    htmlFor: string;
    required?: boolean;
    optional?: boolean;
    description?: string;
    error?: string;
    children: ReactNode;
    className?: string;
}) => (
    <div className={`space-y-2 ${className}`}>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <label
                className="text-text-strong text-[18px] font-medium"
                htmlFor={htmlFor}
            >
                {label}
                {required && !error && (
                    <span className="text-danger ml-1" aria-label="필수">
                        *
                    </span>
                )}
            </label>
            {optional && (
                <span className="text-text-secondary text-[15px]">(선택)</span>
            )}
            {error && (
                <ErrorMessage id={`${htmlFor}-error`}>{error}</ErrorMessage>
            )}
        </div>
        {description && (
            <p className="text-text-secondary text-[15px]">{description}</p>
        )}
        {children}
    </div>
);

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
    invalid?: boolean;
};

export const Input = ({
    invalid = false,
    className = "",
    ...rest
}: InputProps) => (
    <input
        className={`focus:border-primary focus-visible:outline-primary placeholder:text-text-secondary/70 disabled:bg-secondary h-11 w-full rounded-[5px] border bg-white px-[15px] text-[18px] outline-none focus-visible:outline-2 focus-visible:outline-offset-1 disabled:cursor-not-allowed ${invalid ? "border-danger" : "border-line"} ${className}`}
        aria-invalid={invalid || undefined}
        {...rest}
    />
);

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
    invalid?: boolean;
    showCount?: boolean;
};

export const Textarea = ({
    invalid = false,
    showCount = false,
    value,
    maxLength,
    className = "",
    ...rest
}: TextareaProps) => {
    const valueLength = typeof value === "string" ? value.length : 0;

    return (
        <div className="relative">
            <textarea
                className={`focus:border-primary focus-visible:outline-primary placeholder:text-text-secondary/70 disabled:bg-secondary block min-h-[180px] w-full resize-y rounded-[5px] border bg-white px-[15px] py-[10px] text-[18px] outline-none focus-visible:outline-2 focus-visible:outline-offset-1 disabled:cursor-not-allowed ${showCount ? "pb-8" : ""} ${invalid ? "border-danger" : "border-line"} ${className}`}
                aria-invalid={invalid || undefined}
                value={value}
                maxLength={maxLength}
                {...rest}
            />
            {showCount && maxLength && (
                <span className="text-text-secondary pointer-events-none absolute right-[15px] bottom-[10px] text-[12px]">
                    {valueLength}/{maxLength}
                </span>
            )}
        </div>
    );
};

export const ErrorMessage = ({
    id,
    children,
}: {
    id?: string;
    children: ReactNode;
}) => (
    <span
        className="text-danger inline-flex items-center gap-1 text-[15px] leading-[18px]"
        id={id}
        role="alert"
    >
        <span aria-hidden="true">▲</span>
        {children}
    </span>
);
