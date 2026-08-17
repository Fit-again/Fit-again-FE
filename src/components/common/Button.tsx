/*
 * Fit Again 공통 Button 컴포넌트입니다.
 * 디자인 시스템의 버튼 스타일을 variant와 size로 제공합니다.
 */

import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "outline" | "soft" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const variantStyles: Record<ButtonVariant, string> = {
    primary:
        "border-primary bg-primary text-white hover:bg-primary/95 disabled:border-placeholder disabled:bg-placeholder disabled:text-text-secondary",
    outline:
        "border-primary bg-white text-primary hover:bg-secondary/60 disabled:border-line disabled:text-text-secondary",
    soft: "border-primary bg-secondary text-primary hover:bg-secondary/75 disabled:border-line disabled:text-text-secondary",
    ghost: "border-transparent bg-transparent text-primary hover:bg-secondary/60 disabled:text-text-secondary",
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: "min-h-9 px-[15px] text-[15px]",
    md: "min-h-11 px-5 text-[18px]",
    lg: "min-h-[77px] px-10 text-[30px] font-bold",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
    children: ReactNode;
};

const Button = ({
    variant = "primary",
    size = "md",
    fullWidth = false,
    type = "button",
    className = "",
    children,
    ...rest
}: ButtonProps) => (
    <button
        type={type}
        className={`focus-visible:outline-primary inline-flex cursor-pointer items-center justify-center rounded-[5px] border font-medium transition-colors focus-visible:outline-3 focus-visible:outline-offset-2 active:translate-y-px disabled:cursor-not-allowed disabled:hover:brightness-100 ${fullWidth ? "w-full" : "w-auto"} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...rest}
    >
        {children}
    </button>
);

export default Button;
