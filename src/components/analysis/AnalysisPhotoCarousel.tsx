import { useObjectUrlImage } from "@/hooks/useObjectUrlImage";
import type { AnalysisPhoto } from "@/types/analysis";
import { useState } from "react";

const AnalysisPhotoCarousel = ({ photos }: { photos: AnalysisPhoto[] }) => {
    const [index, setIndex] = useState(0);
    const currentIndex = Math.min(index, Math.max(photos.length - 1, 0));
    const current = photos[currentIndex];
    const imgRef = useObjectUrlImage(current?.file ?? null);

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
            <div className="border-line bg-ground relative aspect-square overflow-hidden rounded-[5px] border">
                <img
                    ref={imgRef}
                    alt={current.label}
                    className="h-full w-full object-contain"
                />
                {photos.length > 1 && (
                    <>
                        <CarouselButton
                            direction="left"
                            label="이전 사진"
                            onClick={goPrevious}
                        />
                        <CarouselButton
                            direction="right"
                            label="다음 사진"
                            onClick={goNext}
                        />
                        <span className="bg-secondary text-text-strong absolute right-1/2 -bottom-11 translate-x-1/2 rounded-full px-3 py-1 text-sm">
                            {currentIndex + 1}/{photos.length}
                        </span>
                    </>
                )}
            </div>

            {photos.length > 1 && <div className="h-11" aria-hidden="true" />}
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
        className={`text-text-strong focus-visible:outline-primary absolute top-1/2 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/85 shadow hover:bg-white focus-visible:outline-3 focus-visible:outline-offset-2 ${direction === "left" ? "left-3" : "right-3"}`}
    >
        <svg
            className="size-4"
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
