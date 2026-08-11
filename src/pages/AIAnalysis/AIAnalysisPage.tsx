import Card from "@/components/common/Card";
import PageActions from "@/components/common/PageActions";
import PageLayout from "@/components/common/PageLayout";
import Tag from "@/components/common/Tag";
import { PAIN_POINT_CAUSE_TEXT } from "@/constants/painPointKeywords";
import { PRODUCT_TYPES } from "@/constants/productTypes";
import { ROUTES } from "@/routes/paths";
import { useReformFlowStore } from "@/stores/useReformFlowStore";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

type AnalysisStep = {
    id: string;
    label: string;
};

type StepStatus = "done" | "active" | "pending";

type TagTone = "primary" | "danger" | "soft";

const ANALYSIS_STEPS: AnalysisStep[] = [
    { id: "product", label: "제품 정보 확인 중" },
    { id: "pain-point", label: "불편 사항 분석 중" },
    { id: "solution", label: "리폼 방향 도출 중" },
];

const STEP_DURATION_MS = 1200;

/*
 * 실제 AI 이미지 분석 백엔드 연동 전까지 사용하는 목업 분석 결과입니다.
 * 사진만으로 판단 가능한 항목(외부 구조, 손상 상태, 사용 목적, 개선 필요 부분)은
 * 아직 분석 로직이 없어 고정 값을 보여줍니다.
 */
// TODO: 실제 AI 이미지 분석 API 연동 후 아래 목업 데이터를 응답 결과로 대체
const MOCK_ANALYSIS = {
    externalStructure: ["더블 핸들", "탈부착 스트랩", "사이드 포켓"],
    damageStatus: ["모서리 마모", "스트랩 사용감"],
    usagePurpose: "출퇴근용",
    improvementSuggestions: [
        "경량 스트랩 교체",
        "어깨 패드 추가",
        "모서리 보강",
    ],
};

function AIAnalysisPage() {
    const navigate = useNavigate();
    const productType = useReformFlowStore((state) => state.productType);
    const frontPhoto = useReformFlowStore((state) => state.frontPhoto);
    const wearPhotos = useReformFlowStore((state) => state.wearPhotos);
    const painPointKeywordIds = useReformFlowStore(
        (state) => state.painPointKeywordIds
    );
    const [completedCount, setCompletedCount] = useState(0);

    const isComplete = completedCount === ANALYSIS_STEPS.length;
    const progress = Math.round((completedCount / ANALYSIS_STEPS.length) * 100);

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
                currentStep={3}
                title="AI 분석"
                description="AI가 제품 상태와 불편 사항을 분석하고 있어요."
            >
                <Card className="mx-auto max-w-140">
                    <div
                        className="bg-line h-2 w-full overflow-hidden rounded-full"
                        role="progressbar"
                        aria-label="AI 분석 진행률"
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
                        {ANALYSIS_STEPS.map((step, index) => {
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
                        {`${ANALYSIS_STEPS[completedCount].label}...`}
                    </p>
                </Card>
            </PageLayout>
        );
    }

    const productTypeLabel =
        PRODUCT_TYPES.find((type) => type.id === productType)?.label ?? "-";

    const painPointCauses = painPointKeywordIds.map(
        (id) => PAIN_POINT_CAUSE_TEXT[id] ?? id
    );

    return (
        <PageLayout
            currentStep={3}
            title="AI 분석 결과"
            description="등록한 사진과 입력 내용을 바탕으로 제품의 현재 상태를 분석했습니다."
            actions={
                <PageActions
                    nextLabel="추천 결과 보기"
                    onPrevious={() => navigate(ROUTES.painPoint)}
                    onNext={() => navigate(ROUTES.solutionRecommend)}
                />
            }
        >
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
                <section>
                    <div className="grid gap-3">
                        <PhotoFrame
                            file={frontPhoto}
                            label="정면 사진"
                            className="aspect-4/3"
                        />
                        {wearPhotos.length > 0 && (
                            <div className="grid grid-cols-2 gap-3">
                                {wearPhotos.slice(0, 2).map((file, index) => (
                                    <PhotoFrame
                                        key={index}
                                        file={file}
                                        label={`마모 부위 사진 ${index + 1}`}
                                        className="aspect-square"
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                    <p className="text-text-secondary mt-4 text-[15px]">
                        ※ 사진을 기반으로 분석한 결과이며 실제 제품 정보와
                        차이가 있을 수 있습니다.
                    </p>
                </section>

                <section className="flex flex-col gap-8">
                    <div>
                        <h2 className="text-text-strong flex flex-wrap items-baseline gap-2 text-[23px] font-bold sm:text-[25px]">
                            AI가 확인한 제품 특징
                            <span className="text-text-secondary text-[15px] font-normal">
                                (업로드된 사진을 기반으로 확인된 내용입니다)
                            </span>
                        </h2>
                        <Card className="mt-4">
                            <dl className="divide-line divide-y">
                                <InfoRow label="제품 유형">
                                    <span className="text-[18px]">
                                        {productTypeLabel}
                                    </span>
                                </InfoRow>
                                <InfoRow label="외부 구조">
                                    <TagList
                                        tone="primary"
                                        items={MOCK_ANALYSIS.externalStructure}
                                    />
                                </InfoRow>
                                <InfoRow label="손상 상태">
                                    <TagList
                                        tone="danger"
                                        items={MOCK_ANALYSIS.damageStatus}
                                    />
                                </InfoRow>
                            </dl>
                        </Card>
                    </div>

                    <div>
                        <h2 className="text-text-strong text-[23px] font-bold sm:text-[25px]">
                            현재 사용 환경 분석
                        </h2>
                        <Card className="mt-4">
                            <dl className="divide-line divide-y">
                                <InfoRow label="현재 사용 목적">
                                    <span className="text-[18px]">
                                        {MOCK_ANALYSIS.usagePurpose}
                                    </span>
                                </InfoRow>
                                <InfoRow label="주요 불편 원인">
                                    {painPointCauses.length > 0 ? (
                                        <ul className="text-[18px]">
                                            {painPointCauses.map((cause) => (
                                                <li key={cause}>- {cause}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <span className="text-text-secondary text-[18px]">
                                            -
                                        </span>
                                    )}
                                </InfoRow>
                                <InfoRow label="개선 필요 부분">
                                    <TagList
                                        tone="soft"
                                        items={
                                            MOCK_ANALYSIS.improvementSuggestions
                                        }
                                    />
                                </InfoRow>
                            </dl>
                        </Card>
                    </div>
                </section>
            </div>
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

const InfoRow = ({
    label,
    children,
}: {
    label: string;
    children: ReactNode;
}) => (
    <div className="flex gap-6 py-4 first:pt-0 last:pb-0">
        <dt className="border-line text-text-strong w-28 shrink-0 border-r pr-4 text-[18px] font-medium">
            {label}
        </dt>
        <dd className="flex-1">{children}</dd>
    </div>
);

const TagList = ({ tone, items }: { tone: TagTone; items: string[] }) => (
    <div className="flex flex-wrap gap-2">
        {items.map((item) => (
            <Tag key={item} tone={tone}>
                {item}
            </Tag>
        ))}
    </div>
);

const PhotoFrame = ({
    file,
    label,
    className = "",
}: {
    file: File | null;
    label: string;
    className?: string;
}) => {
    const url = useMemo(
        () => (file ? URL.createObjectURL(file) : null),
        [file]
    );

    useEffect(() => {
        return () => {
            if (url) URL.revokeObjectURL(url);
        };
    }, [url]);

    return (
        <div
            className={`border-line bg-placeholder text-text-secondary flex items-center justify-center overflow-hidden rounded-[5px] border ${className}`}
        >
            {url ? (
                <img
                    src={url}
                    alt={label}
                    className="h-full w-full object-cover"
                />
            ) : (
                <span className="text-[14px]">사진 없음</span>
            )}
        </div>
    );
};

export default AIAnalysisPage;
