/*
 * 서비스 전 화면에서 공유하는 6단계 진행 헤더입니다.
 * 넓은 화면에서는 전체 단계를, 작은 화면에서는 현재 단계와 진행률을 표시합니다.
 */

import { SERVICE_STEPS } from "@/constants/serviceSteps";

type ProgressHeaderProps = {
    currentStep: number;
};

const ProgressHeader = ({ currentStep }: ProgressHeaderProps) => {
    const activeStep =
        SERVICE_STEPS.find((step) => step.id === currentStep) ??
        SERVICE_STEPS[0];
    const progress = `${(activeStep.id / SERVICE_STEPS.length) * 100}%`;

    return (
        <header className="border-line border-b bg-white">
            <div className="mx-auto flex min-h-[88px] w-full max-w-[1320px] items-center gap-10 px-5 sm:px-8 lg:px-[30px]">
                <a
                    className="font-logo text-primary focus-visible:outline-primary shrink-0 text-[34px] leading-none font-bold focus-visible:rounded focus-visible:outline-3 focus-visible:outline-offset-2"
                    href="/"
                    aria-label="Fit Again 홈"
                >
                    Fit:again
                </a>

                <nav
                    className="hidden min-w-0 flex-1 xl:block"
                    aria-label="서비스 진행 단계"
                >
                    <ol className="flex items-center">
                        {SERVICE_STEPS.map((step, index) => {
                            const active = step.id === activeStep.id;

                            return (
                                <li
                                    className="flex min-w-0 flex-1 items-center last:flex-none"
                                    key={step.id}
                                    aria-current={active ? "step" : undefined}
                                >
                                    <span
                                        className={`flex shrink-0 items-center gap-2 text-[17px] whitespace-nowrap ${active ? "text-primary font-bold" : "text-primary/35"}`}
                                    >
                                        {active && (
                                            <span className="bg-primary flex size-6 items-center justify-center rounded-full text-[14px] text-white">
                                                {step.id}
                                            </span>
                                        )}
                                        {step.label}
                                    </span>
                                    {index < SERVICE_STEPS.length - 1 && (
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
                            / {SERVICE_STEPS.length}
                        </span>
                    </div>
                    <div
                        className="bg-line ml-auto h-1.5 w-full max-w-56 overflow-hidden rounded-full"
                        role="progressbar"
                        aria-label="서비스 진행률"
                        aria-valuemin={1}
                        aria-valuemax={SERVICE_STEPS.length}
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
