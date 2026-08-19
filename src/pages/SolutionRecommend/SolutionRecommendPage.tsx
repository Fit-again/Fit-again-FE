import PageActions from "@/components/common/PageActions";
import PageLayout from "@/components/common/PageLayout";
import TransitionLoadingOverlay from "@/components/common/TransitionLoadingOverlay";
import RecommendationResult from "@/components/recommendation/RecommendationResult";
import {
    RECOMMENDATION_CONTENT,
    RECOMMENDATION_DESCRIPTIONS,
} from "@/constants/recommendation";
import { useTransitionNavigation } from "@/hooks/useTransitionNavigation";
import { ROUTES } from "@/routes/paths";
import { useReformFlowStore } from "@/stores/useReformFlowStore";
import { toRecommendationType } from "@/types/recommendation";
import { Navigate, useNavigate } from "react-router-dom";

function SolutionRecommendPage() {
    const navigate = useNavigate();
    const recommendedSolution = useReformFlowStore(
        (state) => state.recommendedSolution
    );
    const selectedSolution = useReformFlowStore(
        (state) => state.selectedSolution
    );
    const setSelectedSolution = useReformFlowStore(
        (state) => state.setSelectedSolution
    );
    const previewRoute = {
        reform: ROUTES.reformSimulation,
        resell: ROUTES.resellPreview,
        upcycle: ROUTES.upcyclePreview,
    }[selectedSolution];
    const loadingTitle = {
        reform: "리폼 시뮬레이션 로딩 중",
        resell: "리셀 미리보기 로딩 중",
        upcycle: "업사이클링 미리보기 로딩 중",
    }[selectedSolution];
    const { isTransitioning, startTransition } =
        useTransitionNavigation(previewRoute);
    const frontPhoto = useReformFlowStore((state) => state.frontPhoto);
    const recommendationRankings = useReformFlowStore(
        (state) => state.recommendationRankings
    );
    const recommendation = recommendationRankings.find(
        (item) =>
            item.recommendationType === toRecommendationType(selectedSolution)
    );

    if (!recommendation) {
        return <Navigate to={ROUTES.aiAnalysis} replace />;
    }

    return (
        <>
            <PageLayout
                currentStep={4}
                title="AI 추천 결과"
                description={RECOMMENDATION_DESCRIPTIONS[selectedSolution]}
                actions={
                    <PageActions
                        nextLabel={
                            RECOMMENDATION_CONTENT[selectedSolution]
                                .previewLabel
                        }
                        onPrevious={() => navigate(ROUTES.aiAnalysis)}
                        onNext={startTransition}
                        nextDisabled={isTransitioning}
                    />
                }
            >
                <RecommendationResult
                    frontPhoto={frontPhoto}
                    recommendation={recommendation}
                    recommendedSolution={recommendedSolution}
                    selectedSolution={selectedSolution}
                    onSelectSolution={setSelectedSolution}
                />
            </PageLayout>
            {isTransitioning && (
                <TransitionLoadingOverlay title={loadingTitle} />
            )}
        </>
    );
}

export default SolutionRecommendPage;
