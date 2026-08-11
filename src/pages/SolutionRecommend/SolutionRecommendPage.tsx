import Card from "@/components/common/Card";
import PageActions from "@/components/common/PageActions";
import PageLayout from "@/components/common/PageLayout";
import Tag from "@/components/common/Tag";
import { ROUTES } from "@/routes/paths";
import { useReformFlowStore } from "@/stores/useReformFlowStore";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

type RecommendStep = {
    id: string;
    label: string;
};

type StepStatus = "done" | "active" | "pending";

type RecommendedTask = {
    id: string;
    title: string;
    description: string;
};

type AlternativeOption = {
    id: "resell" | "upcycle";
    label: string;
    description: string[];
};

const RECOMMEND_STEPS: RecommendStep[] = [
    { id: "context", label: "분석 결과 확인 중" },
    { id: "score", label: "리폼 적합도 계산 중" },
    { id: "compose", label: "맞춤 추천 구성 중" },
];

const STEP_DURATION_MS = 1200;

/*
 * 실제 AI 추천 백엔드 연동 전까지 사용하는 목업 추천 결과입니다.
 */
// TODO: 실제 AI 추천 API 연동 후 아래 목업 데이터를 응답 결과로 대체
const MOCK_RECOMMENDATION = {
    title: "리폼 (Reform)",
    description:
        "현재 사용 목적과 제품 상태를 종합했을 때, 기존 제품을 유지하면서 사용성을 개선하는 리폼이 가장 적합한 활용 방법입니다.",
    reasons: [
        "사용자 애착도가 높은 제품입니다.",
        "구조적 손상이 크지 않아 리폼 효과가 높습니다.",
        "스트랩과 마모 부위를 개선하면 현재 라이프스타일에 더 적합하게 사용할 수 있어요.",
    ],
};

const RECOMMENDED_TASKS: RecommendedTask[] = [
    {
        id: "strap",
        title: "경량 스트랩 교체",
        description: "무게 부담을 줄이고 착용감을 개선해요.",
    },
    {
        id: "pad",
        title: "어깨 패드 추가",
        description: "어깨에 가해지는 압력을 분산시켜요.",
    },
    {
        id: "corner",
        title: "모서리 보수",
        description: "마모된 부분을 보수하여 외관을 개선해요.",
    },
];

const ALTERNATIVE_OPTIONS: AlternativeOption[] = [
    {
        id: "resell",
        label: "리셀",
        description: [
            "판매를 원한다면 리셀을 고려해보세요.",
            "중고 명품 플랫폼이나 개인 거래를 통해 새로운 가치를 만들 수 있어요.",
        ],
    },
    {
        id: "upcycle",
        label: "업사이클링",
        description: [
            "새로운 디자인으로 재탄생시켜 다른 형태의 제품으로 활용할 수 있어요.",
            "환경도 지키고 특별한 제품을 만들어보세요.",
        ],
    },
];

function SolutionRecommendPage() {
    const navigate = useNavigate();
    const frontPhoto = useReformFlowStore((state) => state.frontPhoto);
    const [completedCount, setCompletedCount] = useState(0);

    const isComplete = completedCount === RECOMMEND_STEPS.length;
    const progress = Math.round(
        (completedCount / RECOMMEND_STEPS.length) * 100
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
                currentStep={4}
                title="AI 추천"
                description="AI가 제품에 가장 적합한 리폼 방향을 분석하고 있어요."
            >
                <div className="flex flex-1 items-center justify-center pt-16">
                    <Card className="w-full max-w-160 p-8">
                        <div
                            className="bg-line h-2 w-full overflow-hidden rounded-full"
                            role="progressbar"
                            aria-label="AI 추천 진행률"
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
                            {RECOMMEND_STEPS.map((step, index) => {
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
                                            {step.label}
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
                            {`${RECOMMEND_STEPS[completedCount].label}...`}
                        </p>
                    </Card>
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout
            currentStep={4}
            title="AI 추천 결과"
            description="현재 제품에 가장 적합한 리폼 방향을 확인해보세요."
            actions={
                <PageActions
                    nextLabel="시뮬레이션 보기"
                    onPrevious={() => navigate(ROUTES.aiAnalysis)}
                    onNext={() => navigate(ROUTES.reformSimulation)}
                />
            }
        >
            <Card className="p-6 sm:p-8">
                <div className="grid gap-8 lg:grid-cols-[minmax(220px,280px)_minmax(0,1fr)_minmax(220px,260px)]">
                    <ProductPhoto file={frontPhoto} />

                    <div>
                        <Tag tone="primary" icon={<PawIcon />}>
                            AI 추천
                        </Tag>
                        <h2 className="text-primary mt-4 text-[24px] font-bold sm:text-[26px]">
                            {MOCK_RECOMMENDATION.title}
                        </h2>
                        <p className="text-text-secondary mt-4 text-[17px] leading-relaxed">
                            {MOCK_RECOMMENDATION.description}
                        </p>

                        <div className="border-line mt-6 rounded-[5px] border p-5">
                            <h3 className="text-primary text-[17px] font-bold">
                                추천 이유
                            </h3>
                            <ul className="mt-3 flex flex-col gap-2.5">
                                {MOCK_RECOMMENDATION.reasons.map((reason) => (
                                    <li
                                        key={reason}
                                        className="flex items-start gap-2.5"
                                    >
                                        <CheckBadge />
                                        <span className="text-[16px] leading-relaxed">
                                            {reason}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="lg:border-line lg:border-l lg:pl-7">
                        <h3 className="text-primary text-[17px] font-bold">
                            추천 리폼 작업
                        </h3>
                        <ul className="mt-4 flex flex-col gap-3">
                            {RECOMMENDED_TASKS.map((task) => (
                                <li
                                    key={task.id}
                                    className="bg-secondary rounded-[5px] p-4"
                                >
                                    <p className="text-text-strong text-[16px] font-medium">
                                        {task.title}
                                    </p>
                                    <p className="text-text-secondary mt-1 text-[14px] leading-relaxed">
                                        {task.description}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </Card>

            <section className="mt-10">
                <h2 className="text-primary text-[23px] font-bold sm:text-[25px]">
                    다른 활용 방법
                </h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    {ALTERNATIVE_OPTIONS.map((option) => (
                        <AlternativeCard key={option.id} option={option} />
                    ))}
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

const AlternativeCard = ({ option }: { option: AlternativeOption }) => (
    <button
        type="button"
        className="group border-line focus-visible:outline-primary hover:border-primary flex w-full cursor-pointer items-center justify-between gap-4 rounded-[5px] border bg-white p-6 text-left transition-[border-color,box-shadow] hover:shadow-[0_4px_8px_rgba(91,58,41,0.28)] focus-visible:outline-3 focus-visible:outline-offset-2"
    >
        <div>
            <Tag
                tone="soft"
                icon={option.id === "resell" ? <TagIcon /> : <RecycleIcon />}
            >
                {option.label}
            </Tag>
            <div className="mt-4 flex flex-col gap-1">
                {option.description.map((line) => (
                    <p
                        key={line}
                        className="text-text-secondary text-[16px] leading-relaxed"
                    >
                        {line}
                    </p>
                ))}
            </div>
        </div>
        <ChevronRightIcon />
    </button>
);

const ProductPhoto = ({ file }: { file: File | null }) => {
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
            <div className="border-line bg-placeholder text-text-secondary flex aspect-4/5 items-center justify-center rounded-[5px] border">
                <span className="text-[14px]">사진 없음</span>
            </div>
        );
    }

    return (
        <div className="border-line bg-ground aspect-4/5 overflow-hidden rounded-[5px] border">
            <img
                ref={imgRef}
                alt="추천 제품 사진"
                className="h-full w-full object-cover"
            />
        </div>
    );
};

const CheckBadge = () => (
    <span
        className="bg-primary mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] text-white"
        aria-hidden="true"
    >
        ✓
    </span>
);

const PawIcon = () => (
    <svg
        className="size-3.5"
        viewBox="0 0 16 16"
        fill="currentColor"
        aria-hidden="true"
    >
        <path d="M8 0c.4 2.4 1.6 3.6 4 4-2.4.4-3.6 1.6-4 4-.4-2.4-1.6-3.6-4-4 2.4-.4 3.6-1.6 4-4Z" />
        <path d="M13 8c.2 1.2.8 1.8 2 2-1.2.2-1.8.8-2 2-.2-1.2-.8-1.8-2-2 1.2-.2 1.8-.8 2-2Z" />
    </svg>
);

const TagIcon = () => (
    <svg
        className="size-3.5"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
    >
        <path
            d="M8.7 1.3 14 6.6a1.5 1.5 0 0 1 0 2.1l-4.6 4.6a1.5 1.5 0 0 1-2.1 0L2 8V2h6.7Z"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinejoin="round"
        />
        <circle cx="5.2" cy="5.2" r="1" fill="currentColor" />
    </svg>
);

const RecycleIcon = () => (
    <svg
        className="size-3.5"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
    >
        <path
            d="M2 8a6 6 0 0 1 10.5-4M14 8a6 6 0 0 1-10.5 4"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
        />
        <path
            d="M11.5 1.5 12.5 4l-2.5 1"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M4.5 14.5 3.5 12l2.5-1"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const ChevronRightIcon = () => (
    <svg
        className="text-line group-hover:text-primary size-11 shrink-0 transition-colors"
        viewBox="0 0 49 57"
        fill="none"
        aria-hidden="true"
    >
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M18.5951 10.5794C19.6385 9.53602 21.3302 9.53602 22.3737 10.5794L38.4049 26.6107C39.4484 27.6541 39.4484 29.3459 38.4049 30.3893L22.3737 46.4206C21.3302 47.464 19.6385 47.464 18.5951 46.4206C17.5516 45.3771 17.5516 43.6854 18.5951 42.6419L32.737 28.5L18.5951 14.3581C17.5516 13.3146 17.5516 11.6229 18.5951 10.5794Z"
            fill="currentColor"
        />
    </svg>
);

export default SolutionRecommendPage;
