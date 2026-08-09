import type { HTMLAttributes, ReactNode } from "react";

type CardVariant = "default" | "outlined" | "soft";

const variantStyles: Record<CardVariant, string> = {
    default: "border-line bg-white",
    outlined: "border-primary bg-white",
    soft: "border-line bg-secondary",
};

type CardProps = HTMLAttributes<HTMLElement> & {
    as?: "article" | "section" | "div";
    variant?: CardVariant;
    children: ReactNode;
};

const Card = ({
    as: Component = "div",
    variant = "default",
    className = "",
    children,
    ...rest
}: CardProps) => (
    <Component
        className={`rounded-[5px] border p-5 ${variantStyles[variant]} ${className}`}
        {...rest}
    >
        {children}
    </Component>
);

export default Card;
