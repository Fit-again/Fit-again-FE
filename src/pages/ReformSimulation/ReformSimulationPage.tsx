import Card from "@/components/common/Card";
import Modal from "@/components/common/Modal";
import PageActions from "@/components/common/PageActions";
import PageLayout from "@/components/common/PageLayout";
import TransitionLoadingOverlay from "@/components/common/TransitionLoadingOverlay";
import {
    SignBadge,
    StepArrow,
    StepCardShell,
    StepPhoto,
} from "@/components/simulation/SimulationStepUI";
import { useTransitionNavigation } from "@/hooks/useTransitionNavigation";
import { ROUTES } from "@/routes/paths";
import { useReformFlowStore } from "@/stores/useReformFlowStore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ReformSimulationPage() {
    const navigate = useNavigate();
    const { isTransitioning, startTransition } = useTransitionNavigation(
        ROUTES.resultConfirm
    );
    const frontPhoto = useReformFlowStore((state) => state.frontPhoto);
    const recommendation = useReformFlowStore((state) =>
        state.recommendationRankings.find(
            (item) => item.recommendationType === "REFORM"
        )
    );
    const [openedStepIndex, setOpenedStepIndex] = useState<number | null>(null);
    const simulation =
        recommendation?.recommendationType === "REFORM"
            ? recommendation.simulation
            : null;
    const steps =
        simulation?.steps.map((step) => ({
            id: String(step.step),
            stepNumber: step.step,
            title: step.title,
            bullets: step.description,
        })) ?? [];
    const beforeBullets = simulation?.beforeAfter.before.points ?? [];
    const afterBullets = simulation?.beforeAfter.after.points ?? [];

    if (!simulation || steps.length === 0) return null;

    return (
        <>
            <PageLayout
                currentStep={5}
                title="리폼 시뮬레이션"
                description="추천된 리폼이 적용되는 과정을 단계별로 확인해보세요."
                contentSpacing="compact"
                actions={
                    <PageActions
                        nextLabel="결과 보기"
                        onPrevious={() => navigate(ROUTES.solutionRecommend)}
                        onNext={startTransition}
                        nextDisabled={isTransitioning}
                    />
                }
            >
                <section>
                    <h2 className="text-primary text-[23px] font-bold sm:text-[25px]">
                        리폼 추천 과정
                    </h2>

                    <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-stretch">
                        {/* TODO: 백엔드 부위 인식 API 연동 시 교체 대상 부위 마커 재구현 */}
                        <StepCardShell
                            step={steps[0]}
                            onOpen={() => setOpenedStepIndex(0)}
                        >
                            <StepPhoto
                                file={
                                    simulation.steps[0]?.imageUrl ?? frontPhoto
                                }
                                alt="해체 전 정면 사진"
                            />
                        </StepCardShell>
                        <StepArrow />

                        <StepCardShell
                            step={steps[1]}
                            onOpen={() => setOpenedStepIndex(1)}
                        >
                            <StepPhoto
                                file={
                                    simulation.steps[1]?.imageUrl ?? frontPhoto
                                }
                                alt="교체할 부품 사진"
                            />
                        </StepCardShell>
                        <StepArrow />

                        <StepCardShell
                            step={steps[2]}
                            onOpen={() => setOpenedStepIndex(2)}
                        >
                            <StepPhoto
                                file={
                                    simulation.steps[2]?.imageUrl ?? frontPhoto
                                }
                                alt="보강 부위 상세 사진"
                            />
                        </StepCardShell>
                        <StepArrow />

                        <StepCardShell
                            step={steps[3]}
                            onOpen={() => setOpenedStepIndex(3)}
                        >
                            <StepPhoto
                                file={
                                    simulation.steps[3]?.imageUrl ?? frontPhoto
                                }
                                alt="리폼 완성 예상 사진"
                            />
                        </StepCardShell>
                    </div>
                </section>

                <section className="mt-10">
                    <div className="grid gap-6 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
                        <div>
                            <h3 className="flex items-center gap-2 text-[19px] font-bold">
                                <span className="text-danger">Before</span>
                                <span className="text-danger text-[15px] font-normal">
                                    현재 상태
                                </span>
                            </h3>
                            <Card className="mt-4 p-5">
                                <div className="grid gap-5 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] sm:items-center">
                                    <StepPhoto
                                        file={
                                            simulation.beforeAfter.before
                                                .imageUrl
                                        }
                                        alt="현재 제품 사진"
                                    />
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
                        </div>

                        <div
                            className="hidden justify-center lg:flex"
                            aria-hidden="true"
                        >
                            <StepArrow size="lg" />
                        </div>

                        <div>
                            <h3 className="flex items-center gap-2 text-[19px] font-bold">
                                <span className="text-after">After</span>
                                <span className="text-after text-[15px] font-normal">
                                    리폼 후 기대효과
                                </span>
                            </h3>
                            <Card className="mt-4 p-5">
                                <div className="grid gap-5 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] sm:items-center">
                                    <StepPhoto
                                        file={
                                            simulation.beforeAfter.after
                                                .imageUrl
                                        }
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
                    </div>
                </section>
            </PageLayout>
            {isTransitioning && (
                <TransitionLoadingOverlay title="결과 확인 로딩 중" />
            )}
            {openedStepIndex !== null && (
                <StepDetailModal
                    stepIndex={openedStepIndex}
                    steps={steps}
                    stepImages={simulation.steps.map((step) => step.imageUrl)}
                    onClose={() => setOpenedStepIndex(null)}
                />
            )}
        </>
    );
}

const StepDetailModal = ({
    stepIndex,
    steps,
    stepImages,
    onClose,
}: {
    stepIndex: number;
    steps: import("@/types/simulation").SimulationStep[];
    stepImages: string[];
    onClose: () => void;
}) => {
    const step = steps[stepIndex] ?? steps[0];
    const photo = stepImages[stepIndex] ?? null;

    return (
        <Modal
            open
            title={`STEP ${step.stepNumber} ${step.title}`}
            size="step"
            footer={false}
            onClose={onClose}
        >
            <StepPhoto file={photo} alt={`${step.title} 단계 상세 사진`} />
        </Modal>
    );
};

export default ReformSimulationPage;
