import Card from "@/components/common/Card";
import type { ProgressStep, ProgressStepStatus } from "@/types/progress";

type ProcessProgressCardProps = {
    steps: readonly ProgressStep[];
    completedCount: number;
    progress: number;
    progressLabel: string;
};

const ProcessProgressCard = ({
    steps,
    completedCount,
    progress,
    progressLabel,
}: ProcessProgressCardProps) => {
    const activeStep = steps[completedCount] ?? steps.at(-1);

    return (
        <Card className="w-full max-w-160 p-8">
            <div
                className="bg-line h-2 w-full overflow-hidden rounded-full"
                role="progressbar"
                aria-label={progressLabel}
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
                {steps.map((step, index) => {
                    const status: ProgressStepStatus =
                        index < completedCount
                            ? "done"
                            : index === completedCount
                              ? "active"
                              : "pending";

                    return (
                        <li key={step.id} className="flex items-center gap-3">
                            <ProgressStepIcon status={status} />
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
                {activeStep ? `${activeStep.label}...` : "처리 중..."}
            </p>
        </Card>
    );
};

export const ProgressStepIcon = ({
    status,
}: {
    status: ProgressStepStatus;
}) => {
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

export default ProcessProgressCard;
