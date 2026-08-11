import Card from "@/components/common/Card";
import PageActions from "@/components/common/PageActions";
import PageLayout from "@/components/common/PageLayout";
import { PAIN_POINT_CAUSE_TEXT } from "@/constants/painPointKeywords";
import { ROUTES } from "@/routes/paths";
import { useReformFlowStore } from "@/stores/useReformFlowStore";
import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

type SimulationStep = {
    id: string;
    stepNumber: number;
    title: string;
    progressLabel: string;
    bullets: string[];
};

type StepStatus = "done" | "active" | "pending";

type PhotoMarker = {
    x: number;
    y: number;
    label: string;
};

const STEP_DURATION_MS = 1200;

const SIMULATION_STEPS: SimulationStep[] = [
    {
        id: "disassemble",
        stepNumber: 1,
        title: "해체",
        progressLabel: "해체 시뮬레이션 중",
        bullets: ["교체 대상 부위 확인", "기존 부품 분리 준비"],
    },
    {
        id: "replace",
        stepNumber: 2,
        title: "교체",
        progressLabel: "교체 시뮬레이션 중",
        bullets: ["경량 스트랩 교체", "어깨 패드 추가"],
    },
    {
        id: "reinforce",
        stepNumber: 3,
        title: "보강",
        progressLabel: "보강 시뮬레이션 중",
        bullets: ["모서리 보수", "가죽 마감 보강"],
    },
    {
        id: "complete",
        stepNumber: 4,
        title: "완성",
        progressLabel: "완성 이미지 생성 중",
        bullets: ["최종 리폼 결과 확인", "개선된 사용 모습 미리보기"],
    },
];

const REPLACE_MARKERS: PhotoMarker[] = [
    { x: 18, y: 82, label: "1" },
    { x: 85, y: 28, label: "2" },
];

const DEFAULT_BEFORE_BULLETS = [
    "스트랩이 자주 흘러내림",
    "장시간 착용 시 어깨 부담",
    "모서리 마모로 외관이 손상됨",
];

const DEFAULT_AFTER_BULLETS = [
    "경량 스트랩으로 착용감 개선",
    "어깨 패드 추가로 압력 분산",
    "모서리 보강으로 외관 복원",
    "기존 디자인을 유지하면서 사용성 향상",
];

/*
 * 실제 AI 리폼 시뮬레이션(부위 인식, 부품 합성, 완성 이미지 생성) 백엔드 연동 전까지
 * 사용하는 목업 개선 효과 문구입니다. 선택된 불편 키워드를 기준으로 도출합니다.
 */
// TODO: 실제 AI 리폼 시뮬레이션 API 연동 후 아래 목업 데이터를 응답 결과로 대체
const AFTER_EFFECT_TEXT: Record<string, string> = {
    heavy: "경량 소재 적용으로 무게 부담 완화",
    "strap-slip": "경량 스트랩으로 착용감 개선",
    "shoulder-pain": "어깨 패드 추가로 압력 분산",
    "lack-storage": "수납 구조 보강으로 공간 확장",
    wear: "마모 부위 보강으로 외관 복원",
    "style-mismatch": "디자인 리터치로 스타일 개선",
    "rarely-used": "활용도를 높이는 리폼 적용",
    "outdated-design": "트렌드에 맞는 디자인으로 리프레시",
    "lock-zipper": "잠금·지퍼 부품 교체로 사용성 개선",
};

function ReformSimulationPage() {
    const navigate = useNavigate();
    const frontPhoto = useReformFlowStore((state) => state.frontPhoto);
    const wearPhotos = useReformFlowStore((state) => state.wearPhotos);
    const painPointKeywordIds = useReformFlowStore(
        (state) => state.painPointKeywordIds
    );
    const [completedCount, setCompletedCount] = useState(0);

    const isComplete = completedCount === SIMULATION_STEPS.length;
    const progress = Math.round(
        (completedCount / SIMULATION_STEPS.length) * 100
    );

    useEffect(() => {
        if (isComplete) return;

        const timer = setTimeout(() => {
            setCompletedCount((prev) => prev + 1);
        }, STEP_DURATION_MS);

        return () => clearTimeout(timer);
    }, [completedCount, isComplete]);

    if (!isComplete) {
        return (
            <PageLayout
                currentStep={5}
                title="시뮬레이션"
                description="추천된 리폼이 적용되는 과정을 시뮬레이션하고 있어요."
            >
                <div className="flex flex-1 items-center justify-center pt-16">
                    <Card className="w-full max-w-160 p-8">
                        <div
                            className="bg-line h-2 w-full overflow-hidden rounded-full"
                            role="progressbar"
                            aria-label="시뮬레이션 진행률"
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-valuenow={progress}
                        >
                            <div
                                className="bg-primary h-full rounded-full transition-[width] duration-500"
                                style={{ width: `${progress}%` }}
                            />
                        </div>

                        <ul className="mt-8 flex flex-col gap-5">
                            {SIMULATION_STEPS.map((step, index) => {
                                const status: StepStatus =
                                    index < completedCount
                                        ? "done"
                                        : index === completedCount
                                          ? "active"
                                          : "pending";

                                return (
                                    <li
                                        key={step.id}
                                        className="flex items-center gap-3"
                                    >
                                        <StepIcon status={status} />
                                        <span
                                            className={`text-[18px] ${status === "pending" ? "text-text-secondary" : "text-primary font-medium"}`}
                                        >
                                            {step.progressLabel}
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>

                        <p
                            className="text-text-secondary mt-8 text-center text-[16px]"
                            role="status"
                            aria-live="polite"
                        >
                            {`${SIMULATION_STEPS[completedCount].progressLabel}...`}
                        </p>
                    </Card>
                </div>
            </PageLayout>
        );
    }

    const beforeBullets =
        painPointKeywordIds.length > 0
            ? painPointKeywordIds.map((id) => PAIN_POINT_CAUSE_TEXT[id] ?? id)
            : DEFAULT_BEFORE_BULLETS;

    const afterBullets =
        painPointKeywordIds.length > 0
            ? [
                  ...painPointKeywordIds.map(
                      (id) => AFTER_EFFECT_TEXT[id] ?? "선택한 불편 사항 개선"
                  ),
                  "기존 디자인을 유지하면서 사용성 향상",
              ]
            : DEFAULT_AFTER_BULLETS;

    return (
        <PageLayout
            currentStep={5}
            title="리폼 시뮬레이션"
            description="추천된 리폼이 적용되는 과정을 단계별로 확인해보세요."
            actions={
                <PageActions
                    nextLabel="결과 보기"
                    onPrevious={() => navigate(ROUTES.solutionRecommend)}
                    onNext={() => navigate(ROUTES.resultConfirm)}
                />
            }
        >
            <section>
                <h2 className="text-primary text-[23px] font-bold sm:text-[25px]">
                    리폼 추천 과정
                </h2>

                <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-stretch">
                    <StepCardShell step={SIMULATION_STEPS[0]}>
                        <StepPhoto
                            file={frontPhoto}
                            alt="교체 대상 부위를 표시한 정면 사진"
                            markers={REPLACE_MARKERS}
                        />
                    </StepCardShell>
                    <StepArrow />

                    <StepCardShell step={SIMULATION_STEPS[1]}>
                        <StepPhoto
                            file={wearPhotos[0] ?? frontPhoto}
                            alt="교체할 부품 사진"
                        />
                    </StepCardShell>
                    <StepArrow />

                    <StepCardShell
                        step={SIMULATION_STEPS[2]}
                        pager={
                            wearPhotos.length > 1 ? (
                                <span className="text-text-secondary text-[13px]">
                                    {`상세 사진 ${wearPhotos.length}장`}
                                </span>
                            ) : undefined
                        }
                    >
                        <StepDetailPhoto
                            photos={wearPhotos}
                            fallback={frontPhoto}
                            altPrefix="보강 부위 상세 사진"
                        />
                    </StepCardShell>
                    <StepArrow />

                    <StepCardShell step={SIMULATION_STEPS[3]}>
                        <StepPhoto
                            file={frontPhoto}
                            alt="리폼 완성 예상 사진"
                        />
                    </StepCardShell>
                </div>
            </section>

            <section className="mt-10">
                <div className="grid gap-6 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
                    <Card className="p-6">
                        <h3 className="flex items-center gap-2 text-[19px] font-bold">
                            <span className="text-danger">Before</span>
                            <span className="text-danger text-[15px] font-normal">
                                현재 상태
                            </span>
                        </h3>
                        <div className="mt-4 grid gap-5 sm:grid-cols-[minmax(140px,180px)_1fr] sm:items-center">
                            <StepPhoto file={frontPhoto} alt="현재 제품 사진" />
                            <ul className="flex flex-col gap-2.5">
                                {beforeBullets.map((bullet) => (
                                    <li
                                        key={bullet}
                                        className="flex items-start gap-2.5"
                                    >
                                        <SignBadge tone="danger" />
                                        <span className="text-danger text-[15px] leading-relaxed">
                                            {bullet}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </Card>

                    <div
                        className="hidden justify-center lg:flex"
                        aria-hidden="true"
                    >
                        <StepArrow size="lg" />
                    </div>

                    <Card className="p-6">
                        <h3 className="flex items-center gap-2 text-[19px] font-bold">
                            <span className="text-after">After</span>
                            <span className="text-after text-[15px] font-normal">
                                리폼 후 기대효과
                            </span>
                        </h3>
                        <div className="mt-4 grid gap-5 sm:grid-cols-[minmax(140px,180px)_1fr] sm:items-center">
                            <StepPhoto
                                file={frontPhoto}
                                alt="리폼 후 기대 제품 사진"
                            />
                            <ul className="flex flex-col gap-2.5">
                                {afterBullets.map((bullet) => (
                                    <li
                                        key={bullet}
                                        className="flex items-start gap-2.5"
                                    >
                                        <SignBadge tone="after" />
                                        <span className="text-after text-[15px] leading-relaxed">
                                            {bullet}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </Card>
                </div>
            </section>
        </PageLayout>
    );
}

const StepIcon = ({ status }: { status: StepStatus }) => {
    if (status === "done") {
        return (
            <span
                className="bg-primary flex size-7 shrink-0 items-center justify-center rounded-full text-[14px] text-white"
                aria-hidden="true"
            >
                ✓
            </span>
        );
    }

    if (status === "active") {
        return (
            <span
                className="border-primary flex size-7 shrink-0 items-center justify-center rounded-full border-2"
                aria-hidden="true"
            >
                <span className="bg-primary size-2.5 animate-pulse rounded-full" />
            </span>
        );
    }

    return (
        <span
            className="border-line size-7 shrink-0 rounded-full border-2"
            aria-hidden="true"
        />
    );
};

const StepCardShell = ({
    step,
    pager,
    children,
}: {
    step: SimulationStep;
    pager?: ReactNode;
    children: ReactNode;
}) => (
    <Card as="article" className="flex flex-1 flex-col p-5">
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

        <ul className="text-text-secondary mt-4 list-disc space-y-1.5 pl-5 text-[15px]">
            {step.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
            ))}
        </ul>
    </Card>
);

const StepArrow = ({ size = "sm" }: { size?: "sm" | "lg" }) => (
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

const StepPhoto = ({
    file,
    alt,
    markers,
}: {
    file: File | null;
    alt: string;
    markers?: PhotoMarker[];
}) => {
    const imgRef = useRef<HTMLImageElement>(null);

    /*
     * blob URL은 img 엘리먼트에 직접(ref로) 반영합니다.
     * React state로 다루면 StrictMode의 effect 이중 실행 시
     * "생성 → 정리(해제) → 재실행"이 같은 커밋 안에서 렌더 없이 발생해,
     * 방금 해제된 URL이 화면에 남는 문제가 생깁니다.
     */
    useEffect(() => {
        if (!file || !imgRef.current) return;

        const url = URL.createObjectURL(file);
        imgRef.current.src = url;

        return () => URL.revokeObjectURL(url);
    }, [file]);

    if (!file) {
        return (
            <div className="border-line bg-placeholder text-text-secondary flex aspect-4/3 items-center justify-center rounded-[5px] border">
                <span className="text-[13px]">사진 없음</span>
            </div>
        );
    }

    return (
        <div className="border-line bg-ground relative aspect-4/3 overflow-hidden rounded-[5px] border">
            <img
                ref={imgRef}
                alt={alt}
                className="h-full w-full object-cover"
            />
            {markers?.map((marker) => (
                <span
                    key={marker.label}
                    className="bg-danger absolute flex size-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-[12px] font-bold text-white shadow"
                    style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                    aria-hidden="true"
                >
                    {marker.label}
                </span>
            ))}
        </div>
    );
};

const StepDetailPhoto = ({
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
    const goPrev = () =>
        setIndex((prev) => (prev - 1 + photos.length) % photos.length);
    const goNext = () => setIndex((prev) => (prev + 1) % photos.length);

    return (
        <div className="relative">
            <StepPhoto
                file={photos[currentIndex]}
                alt={`${altPrefix} ${currentIndex + 1}`}
            />
            {photos.length > 1 && (
                <Fragment>
                    <button
                        type="button"
                        onClick={goPrev}
                        aria-label={`${altPrefix} 이전 사진`}
                        className="text-text-strong focus-visible:outline-primary absolute top-1/2 left-2 flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/85 shadow hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2"
                    >
                        <ChevronIcon direction="left" />
                    </button>
                    <button
                        type="button"
                        onClick={goNext}
                        aria-label={`${altPrefix} 다음 사진`}
                        className="text-text-strong focus-visible:outline-primary absolute top-1/2 right-2 flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/85 shadow hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2"
                    >
                        <ChevronIcon direction="right" />
                    </button>
                    <span className="bg-primary/80 absolute right-2 bottom-2 rounded-full px-2.5 py-0.5 text-[12px] text-white">
                        {`${currentIndex + 1} / ${photos.length}`}
                    </span>
                </Fragment>
            )}
        </div>
    );
};

const ChevronIcon = ({ direction }: { direction: "left" | "right" }) => (
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
);

const SignBadge = ({ tone }: { tone: "danger" | "after" }) => (
    <span
        className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-white ${tone === "danger" ? "bg-danger" : "bg-after"}`}
        aria-hidden="true"
    >
        {tone === "danger" ? "−" : "+"}
    </span>
);

export default ReformSimulationPage;
