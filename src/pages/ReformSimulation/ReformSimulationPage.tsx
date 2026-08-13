import Card from "@/components/common/Card";
import PageActions from "@/components/common/PageActions";
import PageLayout from "@/components/common/PageLayout";
import TransitionLoadingOverlay from "@/components/common/TransitionLoadingOverlay";
import {
    SignBadge,
    StepArrow,
    StepCardShell,
    StepDetailPhoto,
    StepPhoto,
} from "@/components/simulation/SimulationStepUI";
import { PAIN_POINT_CAUSE_TEXT } from "@/constants/painPointKeywords";
import {
    AFTER_EFFECT_TEXT,
    DEFAULT_AFTER_BULLETS,
    DEFAULT_BEFORE_BULLETS,
    SIMULATION_STEPS,
} from "@/constants/simulation";
import { useTransitionNavigation } from "@/hooks/useTransitionNavigation";
import { ROUTES } from "@/routes/paths";
import { useReformFlowStore } from "@/stores/useReformFlowStore";
import { useNavigate } from "react-router-dom";

function ReformSimulationPage() {
    const navigate = useNavigate();
    const { isTransitioning, startTransition } = useTransitionNavigation(
        ROUTES.resultConfirm
    );
    const frontPhoto = useReformFlowStore((state) => state.frontPhoto);
    const wearPhotos = useReformFlowStore((state) => state.wearPhotos);
    const painPointKeywordIds = useReformFlowStore(
        (state) => state.painPointKeywordIds
    );
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
        <>
            <PageLayout
                currentStep={5}
                title="리폼 시뮬레이션"
                description="추천된 리폼이 적용되는 과정을 단계별로 확인해보세요."
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
                        <StepCardShell step={SIMULATION_STEPS[0]}>
                            <StepPhoto
                                file={frontPhoto}
                                alt="해체 전 정면 사진"
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
                            <div className="mt-4 grid gap-5 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] sm:items-center">
                                <StepPhoto
                                    file={frontPhoto}
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
                            <div className="mt-4 grid gap-5 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] sm:items-center">
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
            {isTransitioning && (
                <TransitionLoadingOverlay title="결과 확인 로딩 중" />
            )}
        </>
    );
}

export default ReformSimulationPage;
