import { useObjectUrlImage } from "@/hooks/useObjectUrlImage";
import { useId } from "react";

type MultiPhotoUploadProps = {
    files: File[];
    maxCount: number;
    itemLabel: string;
    accept?: string;
    className?: string;
    onAdd: (file: File) => void;
    onRemove: (index: number) => void;
};

const MultiPhotoUpload = ({
    files,
    maxCount,
    itemLabel,
    accept = "image/*",
    className = "grid-cols-3 sm:grid-cols-5",
    onAdd,
    onRemove,
}: MultiPhotoUploadProps) => {
    const inputId = useId();

    return (
        <div className={`grid gap-3 ${className}`}>
            {Array.from({ length: maxCount }, (_, index) => {
                const file = files[index];

                if (file) {
                    return (
                        <PhotoThumbnail
                            key={index}
                            file={file}
                            label={`${itemLabel} ${index + 1}`}
                            onRemove={() => onRemove(index)}
                        />
                    );
                }

                if (index === files.length) {
                    return (
                        <AddSlot
                            key={index}
                            inputId={`${inputId}-${index}`}
                            label={`${itemLabel} 추가`}
                            accept={accept}
                            onAdd={onAdd}
                        />
                    );
                }

                return (
                    <div
                        key={index}
                        className="border-line aspect-square rounded-[5px] border bg-white"
                        aria-hidden="true"
                    />
                );
            })}
        </div>
    );
};

const PhotoThumbnail = ({
    file,
    label,
    onRemove,
}: {
    file: File;
    label: string;
    onRemove: () => void;
}) => {
    const imgRef = useObjectUrlImage(file);

    return (
        <div className="border-line relative aspect-square overflow-hidden rounded-[5px] border">
            <img
                ref={imgRef}
                alt={label}
                className="h-full w-full object-cover"
            />
            <button
                type="button"
                onClick={onRemove}
                aria-label={`${label} 삭제`}
                className="focus-visible:outline-primary absolute top-1.5 right-1.5 flex size-5 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white shadow focus-visible:outline-2 focus-visible:outline-offset-1"
            >
                <svg
                    className="size-3"
                    viewBox="0 0 12 12"
                    fill="none"
                    aria-hidden="true"
                >
                    <path
                        d="m2.5 2.5 7 7m0-7-7 7"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                    />
                </svg>
            </button>
        </div>
    );
};

const AddSlot = ({
    inputId,
    label,
    accept,
    onAdd,
}: {
    inputId: string;
    label: string;
    accept: string;
    onAdd: (file: File) => void;
}) => (
    <div>
        <input
            className="sr-only"
            id={inputId}
            type="file"
            accept={accept}
            onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                    onAdd(file);
                }
                event.target.value = "";
            }}
        />
        <label
            className="border-line text-text-secondary hover:border-primary focus-within:outline-primary flex aspect-square cursor-pointer items-center justify-center rounded-[5px] border bg-white focus-within:outline-3 focus-within:outline-offset-2"
            htmlFor={inputId}
        >
            <span className="sr-only">{label}</span>
            <svg
                className="size-7"
                viewBox="0 0 28 28"
                fill="none"
                aria-hidden="true"
            >
                <rect
                    x="4"
                    y="3.5"
                    width="17.5"
                    height="19"
                    rx="2.5"
                    stroke="currentColor"
                    strokeWidth="2"
                />
                <circle cx="10" cy="9.5" r="2.3" fill="currentColor" />
                <path
                    d="m5.5 19.5 5-5 3.5 3.5 2.5-2.5 4.5 4.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </label>
    </div>
);

export default MultiPhotoUpload;
