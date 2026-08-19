import type { ButtonHTMLAttributes, ReactNode } from "react";

type SelectionCardProps = Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "children"
> & {
    label: string;
    icon: ReactNode;
    selected?: boolean;
};

const SelectionCard = ({
    label,
    icon,
    selected = false,
    className = "",
    type = "button",
    ...rest
}: SelectionCardProps) => (
    <button
        type={type}
        className={`focus-visible:outline-primary flex aspect-square w-full cursor-pointer flex-col items-center justify-center gap-[10px] rounded-[5px] border p-[10px] text-[18px] transition-[border-color,background-color,box-shadow,color] focus-visible:outline-3 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${selected ? "border-primary bg-secondary text-primary font-medium shadow-[0_4px_8px_rgba(91,58,41,0.28)]" : "border-line text-text-secondary hover:border-primary/60 bg-white"} ${className}`}
        aria-pressed={selected}
        {...rest}
    >
        <span className="flex items-center justify-center" aria-hidden="true">
            {icon}
        </span>
        <span>{label}</span>
    </button>
);

export default SelectionCard;
