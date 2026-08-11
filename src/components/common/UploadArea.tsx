import { useEffect, useId, useMemo } from "react";

type UploadAreaProps = {
    label: string;
    description?: string;
    accept?: string;
    multiple?: boolean;
    disabled?: boolean;
    file?: File | null;
    onFilesSelected?: (files: File[]) => void;
};

const UploadArea = ({
    label,
    description,
    accept = "image/*",
    multiple = false,
    disabled = false,
    file,
    onFilesSelected,
}: UploadAreaProps) => {
    const inputId = useId();
    const previewUrl = useMemo(
        () => (file ? URL.createObjectURL(file) : undefined),
        [file]
    );

    useEffect(() => {
        if (!previewUrl) return;
        return () => URL.revokeObjectURL(previewUrl);
    }, [previewUrl]);

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
                className={`focus-within:outline-primary border-line bg-placeholder text-text-secondary flex min-h-[240px] w-full flex-col items-center justify-center gap-3 rounded-[5px] border p-3 text-center focus-within:outline-3 focus-within:outline-offset-2 ${disabled ? "cursor-not-allowed opacity-60" : "hover:border-primary cursor-pointer"}`}
                htmlFor={inputId}
            >
                {previewUrl ? (
                    <img
                        src={previewUrl}
                        alt={label}
                        className="max-h-[180px] w-full rounded-[5px] object-contain"
                    />
                ) : (
                    <UploadIcon />
                )}
                <span className="text-[18px] font-medium">{label}</span>
                {description && !previewUrl && (
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
