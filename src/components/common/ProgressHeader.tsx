/*
 * 서비스 전 화면에서 공유하는 6단계 진행 헤더입니다.
 * 넓은 화면에서는 전체 단계를, 작은 화면에서는 현재 단계와 진행률을 표시합니다.
 */

import { SERVICE_STEPS, type ServiceStep } from "@/constants/serviceSteps";
import { ROUTES } from "@/routes/paths";
import { Link } from "react-router-dom";

type ProgressHeaderProps = {
    currentStep: number;
    steps?: ServiceStep[];
};

const ProgressHeader = ({
    currentStep,
    steps = SERVICE_STEPS,
}: ProgressHeaderProps) => {
    const activeStep =
        steps.find((step) => step.id === currentStep) ?? steps[0];
    const progress = `${(activeStep.id / steps.length) * 100}%`;
    const hasCondensedResultSteps = steps.length === 5;

    return (
        <header className="border-line border-b bg-white">
            <div className="mx-auto flex min-h-[87px] w-full max-w-[1320px] items-center gap-5 px-5 py-4 sm:gap-10 sm:px-8 xl:gap-16 xl:px-0">
                <Link
                    className="font-brand text-primary focus-visible:outline-primary shrink-0 text-[34px] leading-none font-extrabold focus-visible:rounded focus-visible:outline-3 focus-visible:outline-offset-2 sm:text-[40px]"
                    to={ROUTES.home}
                    aria-label="Fit Again 홈"
                >
                    Fit:again
                </Link>

                <nav
                    className={`hidden min-w-0 flex-1 xl:block ${hasCondensedResultSteps ? "xl:ml-[120px]" : ""}`}
                    aria-label="서비스 진행 단계"
                >
                    <ol className="flex items-center">
                        {steps.map((step, index) => {
                            const active = step.id === activeStep.id;

                            return (
                                <li
                                    className="flex min-w-0 flex-1 items-center last:flex-none"
                                    key={step.id}
                                    aria-current={active ? "step" : undefined}
                                >
                                    <span
                                        className={`flex shrink-0 items-center gap-2 whitespace-nowrap ${active ? "text-primary text-[20px] font-bold" : "text-primary/35 text-[18px]"}`}
                                    >
                                        {active && (
                                            <span className="bg-primary flex size-6 items-center justify-center rounded-full text-[14px] text-white">
                                                {step.id}
                                            </span>
                                        )}
                                        {step.label}
                                    </span>
                                    {index < steps.length - 1 && (
                                        <span
                                            className="bg-line mx-5 h-px min-w-4 flex-1"
                                            aria-hidden="true"
                                        />
                                    )}
                                </li>
                            );
                        })}
                    </ol>
                </nav>

                <div className="ml-auto min-w-0 flex-1 xl:hidden">
                    <div className="mb-2 flex items-center justify-end gap-2 text-[15px]">
                        <span className="text-primary font-bold">
                            {activeStep.id}. {activeStep.label}
                        </span>
                        <span className="text-text-secondary">
                            / {steps.length}
                        </span>
                    </div>
                    <div
                        className="bg-line ml-auto h-1.5 w-full max-w-56 overflow-hidden rounded-full"
                        role="progressbar"
                        aria-label="서비스 진행률"
                        aria-valuemin={1}
                        aria-valuemax={steps.length}
                        aria-valuenow={activeStep.id}
                    >
                        <div
                            className="bg-primary h-full rounded-full transition-[width]"
                            style={{ width: progress }}
                        />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default ProgressHeader;
