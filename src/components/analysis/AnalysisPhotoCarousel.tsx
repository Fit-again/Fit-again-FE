import { useObjectUrlImage } from "@/hooks/useObjectUrlImage";
import type { AnalysisPhoto } from "@/types/analysis";
import { useState } from "react";

const AnalysisPhotoCarousel = ({ photos }: { photos: AnalysisPhoto[] }) => {
    const [index, setIndex] = useState(0);
    const currentIndex = Math.min(index, Math.max(photos.length - 1, 0));
    const current = photos[currentIndex];
    const imgRef = useObjectUrlImage(
        current?.file instanceof File ? current.file : null
    );

    if (!current) {
        return (
            <div className="border-line bg-placeholder text-text-secondary flex aspect-4/3 items-center justify-center rounded-[5px] border">
                <span className="text-[14px]">사진 없음</span>
            </div>
        );
    }

    const goPrevious = () =>
        setIndex((previous) => (previous - 1 + photos.length) % photos.length);
    const goNext = () => setIndex((previous) => (previous + 1) % photos.length);

    return (
        <div>
            <div className="flex items-center gap-[5px]">
                {photos.length > 1 && (
                    <CarouselButton
                        direction="left"
                        label="이전 사진"
                        onClick={goPrevious}
                    />
                )}
                <div className="border-line bg-ground relative aspect-square min-w-0 flex-1 overflow-hidden rounded-[5px] border">
                    <img
                        ref={imgRef}
                        src={
                            typeof current.file === "string"
                                ? current.file
                                : undefined
                        }
                        alt={current.label}
                        className="h-full w-full object-contain"
                    />
                </div>
                {photos.length > 1 && (
                    <CarouselButton
                        direction="right"
                        label="다음 사진"
                        onClick={goNext}
                    />
                )}
            </div>

            {photos.length > 1 && (
                <div className="mt-5 flex justify-center">
                    <span className="bg-secondary text-text-strong rounded-full px-3 py-1 text-sm">
                        {currentIndex + 1}/{photos.length}
                    </span>
                </div>
            )}
        </div>
    );
};

const CarouselButton = ({
    direction,
    label,
    onClick,
}: {
    direction: "left" | "right";
    label: string;
    onClick: () => void;
}) => (
    <button
        type="button"
        onClick={onClick}
        aria-label={label}
        className="text-line focus-visible:outline-primary flex size-[30px] shrink-0 cursor-pointer items-center justify-center focus-visible:outline-3 focus-visible:outline-offset-2"
    >
        <svg
            className="size-[30px]"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
        >
            <path
                d={direction === "left" ? "M10 3 5 8l5 5" : "M6 3l5 5-5 5"}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    </button>
);

export default AnalysisPhotoCarousel;
