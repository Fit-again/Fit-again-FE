import Card from "@/components/common/Card";
import { useObjectUrlImage } from "@/hooks/useObjectUrlImage";
import type { SimulationStep } from "@/types/simulation";
import { Fragment, useState, type ReactNode } from "react";

export const StepCardShell = ({
    step,
    pager,
    children,
    onOpen,
}: {
    step: SimulationStep;
    pager?: ReactNode;
    children: ReactNode;
    onOpen: () => void;
}) => (
    <Card as="article" className="flex flex-1 flex-col p-0">
        <button
            type="button"
            className="focus-visible:outline-primary flex h-full w-full cursor-pointer flex-col p-5 text-left focus-visible:outline-3 focus-visible:outline-offset-2"
            onClick={onOpen}
            aria-label={`${step.title} 단계 상세 보기`}
        >
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <span className="border-primary bg-secondary text-primary inline-flex h-7 shrink-0 items-center rounded-full border px-3 text-[13px] font-medium">
                        {`STEP ${step.stepNumber}`}
                    </span>
                    <h3 className="text-primary text-[18px] font-bold">
                        {step.title}
                    </h3>
                </div>
                {pager}
            </div>

            <div className="mt-4">{children}</div>

            <ul className="text-text-strong mt-4 list-disc space-y-1.5 pl-5 text-[15px]">
                {step.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                ))}
            </ul>
        </button>
    </Card>
);

export const StepArrow = ({ size = "sm" }: { size?: "sm" | "lg" }) => (
    <div
        className="hidden shrink-0 items-center justify-center lg:flex"
        aria-hidden="true"
    >
        <svg
            className={`text-line ${size === "lg" ? "size-8" : "size-5"}`}
            viewBox="0 0 16 16"
            fill="none"
        >
            <path
                d="M6 3l5 5-5 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    </div>
);

export const StepPhoto = ({
    file,
    alt,
}: {
    file: File | null;
    alt: string;
}) => {
    const imageRef = useObjectUrlImage(file);

    if (!file) {
        return (
            <div className="border-line bg-placeholder text-text-secondary flex aspect-4/3 items-center justify-center rounded-[5px] border">
                <span className="text-[13px]">사진 없음</span>
            </div>
        );
    }

    return (
        <div className="border-line bg-ground aspect-4/3 overflow-hidden rounded-[5px] border">
            <img
                ref={imageRef}
                alt={alt}
                className="h-full w-full object-cover"
            />
        </div>
    );
};

export const StepDetailPhoto = ({
    photos,
    fallback,
    altPrefix,
}: {
    photos: File[];
    fallback: File | null;
    altPrefix: string;
}) => {
    const [index, setIndex] = useState(0);

    if (photos.length === 0) {
        return <StepPhoto file={fallback} alt={altPrefix} />;
    }

    const currentIndex = Math.min(index, photos.length - 1);
    const goPrevious = () =>
        setIndex((previous) => (previous - 1 + photos.length) % photos.length);
    const goNext = () => setIndex((previous) => (previous + 1) % photos.length);

    return (
        <div className="relative">
            <StepPhoto
                file={photos[currentIndex] ?? null}
                alt={`${altPrefix} ${currentIndex + 1}`}
            />
            {photos.length > 1 && (
                <Fragment>
                    <PhotoPagerButton
                        direction="left"
                        label={`${altPrefix} 이전 사진`}
                        onClick={goPrevious}
                    />
                    <PhotoPagerButton
                        direction="right"
                        label={`${altPrefix} 다음 사진`}
                        onClick={goNext}
                    />
                    <span className="bg-primary/80 absolute right-2 bottom-2 rounded-full px-2.5 py-0.5 text-[12px] text-white">
                        {`${currentIndex + 1} / ${photos.length}`}
                    </span>
                </Fragment>
            )}
        </div>
    );
};

const PhotoPagerButton = ({
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
        className={`text-text-strong focus-visible:outline-primary absolute top-1/2 flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/85 shadow hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 ${direction === "left" ? "left-2" : "right-2"}`}
    >
        <svg
            className="size-3.5"
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

export const SignBadge = ({ tone }: { tone: "danger" | "after" }) => (
    <span
        className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-white ${tone === "danger" ? "bg-danger" : "bg-after"}`}
        aria-hidden="true"
    >
        {tone === "danger" ? "−" : "+"}
    </span>
);
