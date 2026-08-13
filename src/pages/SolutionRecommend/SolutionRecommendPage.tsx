import PageActions from "@/components/common/PageActions";
import PageLayout from "@/components/common/PageLayout";
import TransitionLoadingOverlay from "@/components/common/TransitionLoadingOverlay";
import RecommendationResult from "@/components/recommendation/RecommendationResult";
import { useTransitionNavigation } from "@/hooks/useTransitionNavigation";
import { ROUTES } from "@/routes/paths";
import { useReformFlowStore } from "@/stores/useReformFlowStore";
import { useNavigate } from "react-router-dom";

function SolutionRecommendPage() {
    const navigate = useNavigate();
    const { isTransitioning, startTransition } = useTransitionNavigation(
        ROUTES.reformSimulation
    );
    const frontPhoto = useReformFlowStore((state) => state.frontPhoto);

    return (
        <>
            <PageLayout
                currentStep={4}
                title="AI 추천 결과"
                description="현재 제품에 가장 적합한 리폼 방향을 확인해보세요."
                actions={
                    <PageActions
                        nextLabel="시뮬레이션 보기"
                        onPrevious={() => navigate(ROUTES.aiAnalysis)}
                        onNext={startTransition}
                        nextDisabled={isTransitioning}
                    />
                }
            >
                <RecommendationResult frontPhoto={frontPhoto} />
            </PageLayout>
            {isTransitioning && (
                <TransitionLoadingOverlay title="리폼 시뮬레이션 로딩 중" />
            )}
        </>
    );
}

export default SolutionRecommendPage;
