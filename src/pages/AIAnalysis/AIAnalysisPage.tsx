import Card from "@/components/common/Card";
import PageLayout from "@/components/common/PageLayout";
import { ROUTES } from "@/routes/paths";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type AnalysisStep = {
    id: string;
    label: string;
};

type StepStatus = "done" | "active" | "pending";

const ANALYSIS_STEPS: AnalysisStep[] = [
    { id: "product", label: "제품 정보 확인 중" },
    { id: "pain-point", label: "불편 사항 분석 중" },
    { id: "solution", label: "리폼 방향 도출 중" },
];

const STEP_DURATION_MS = 1200;
const NAVIGATE_DELAY_MS = 700;

function AIAnalysisPage() {
    const navigate = useNavigate();
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

    useEffect(() => {
        if (!isComplete) return;

        const timer = setTimeout(() => {
            navigate(ROUTES.solutionRecommend);
        }, NAVIGATE_DELAY_MS);

        return () => clearTimeout(timer);
    }, [isComplete, navigate]);

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
                    {isComplete
                        ? "분석이 완료됐어요. 추천 화면으로 이동할게요."
                        : `${ANALYSIS_STEPS[completedCount].label}...`}
                </p>
            </Card>
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

export default AIAnalysisPage;
