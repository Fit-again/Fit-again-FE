import { useObjectUrlImage } from "@/hooks/useObjectUrlImage";
import { useId } from "react";

type UploadAreaProps = {
    label: string;
    description?: string;
    accept?: string;
    multiple?: boolean;
    disabled?: boolean;
    file?: File | null;
    compact?: boolean;
    className?: string;
    onFilesSelected?: (files: File[]) => void;
};

const UploadArea = ({
    label,
    description,
    accept = "image/*",
    multiple = false,
    disabled = false,
    file,
    compact = false,
    className = "",
    onFilesSelected,
}: UploadAreaProps) => {
    const inputId = useId();
    const imgRef = useObjectUrlImage(file ?? null);

    return (
        <div>
            <input
                className="sr-only"
                id={inputId}
                type="file"
                accept={accept}
                multiple={multiple}
                disabled={disabled}
                onChange={(event) => {
                    onFilesSelected?.(Array.from(event.target.files ?? []));
                    event.target.value = "";
                }}
            />
            <label
                className={`focus-within:outline-primary border-line text-text-secondary flex w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-[5px] border p-3 text-center focus-within:outline-3 focus-within:outline-offset-2 ${compact ? "bg-placeholder aspect-square" : "min-h-60 bg-white"} ${disabled ? "cursor-not-allowed opacity-60" : "hover:border-primary cursor-pointer"} ${className}`}
                htmlFor={inputId}
            >
                <img
                    ref={imgRef}
                    alt={label}
                    className={`h-full w-full rounded-[5px] ${compact ? "object-cover" : "max-h-45 object-contain"} ${file ? "" : "hidden"}`}
                />
                {!file && <UploadIcon />}
                <span className={compact ? "sr-only" : "text-lg font-medium"}>
                    {label}
                </span>
                {description && !file && !compact && (
                    <span className="max-w-sm px-5 text-[15px]">
                        {description}
                    </span>
                )}
            </label>
        </div>
    );
};

const UploadIcon = () => (
    <svg className="size-14" viewBox="0 0 56 56" fill="none" aria-hidden="true">
        <rect
            x="8"
            y="7"
            width="35"
            height="38"
            rx="5"
            stroke="currentColor"
            strokeWidth="5"
        />
        <circle cx="20" cy="19" r="5" fill="currentColor" />
        <path
            d="m11 39 10-10 7 7 5-5 9 9"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <circle cx="43" cy="42" r="11" className="fill-secondary" />
        <path
            d="M43 36v12M37 42h12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
        />
    </svg>
);

export default UploadArea;
