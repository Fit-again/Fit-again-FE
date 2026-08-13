import PageActions from "@/components/common/PageActions";
import PageLayout from "@/components/common/PageLayout";
import ProcessProgressCard from "@/components/common/ProcessProgressCard";
import RecommendationResult from "@/components/recommendation/RecommendationResult";
import { RECOMMEND_STEPS } from "@/constants/recommendation";
import { useStepProgress } from "@/hooks/useStepProgress";
import { ROUTES } from "@/routes/paths";
import { useReformFlowStore } from "@/stores/useReformFlowStore";
import { useNavigate } from "react-router-dom";

function SolutionRecommendPage() {
    const navigate = useNavigate();
    const frontPhoto = useReformFlowStore((state) => state.frontPhoto);
    const { completedCount, isComplete, progress } = useStepProgress(
        RECOMMEND_STEPS.length
    );

    if (!isComplete) {
        return (
            <PageLayout
                currentStep={4}
                title="AI 추천"
                description="AI가 제품에 가장 적합한 리폼 방향을 분석하고 있어요."
            >
                <div className="flex flex-1 items-center justify-center pt-16">
                    <ProcessProgressCard
                        steps={RECOMMEND_STEPS}
                        completedCount={completedCount}
                        progress={progress}
                        progressLabel="AI 추천 진행률"
                    />
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
            <RecommendationResult frontPhoto={frontPhoto} />
        </PageLayout>
    );
}

export default SolutionRecommendPage;
