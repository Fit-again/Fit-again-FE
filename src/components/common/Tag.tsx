import type { HTMLAttributes, ReactNode } from "react";

type TagTone = "primary" | "soft" | "danger" | "after";

const toneStyles: Record<TagTone, string> = {
    primary: "border-primary bg-primary text-white",
    soft: "border-primary bg-secondary text-primary",
    danger: "border-danger bg-danger text-white",
    after: "border-after bg-after text-white",
};

type TagProps = HTMLAttributes<HTMLSpanElement> & {
    tone?: TagTone;
    icon?: ReactNode;
    children: ReactNode;
};

const Tag = ({
    tone = "soft",
    icon,
    className = "",
    children,
    ...rest
}: TagProps) => (
    <span
        className={`inline-flex min-h-7 items-center gap-1.5 rounded-[50px] border px-[15px] py-1 text-[15px] leading-none ${toneStyles[tone]} ${className}`}
        {...rest}
    >
        {icon}
        {children}
    </span>
);

export default Tag;
