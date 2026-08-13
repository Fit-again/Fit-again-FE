import AnalysisResult from "@/components/analysis/AnalysisResult";
import PageActions from "@/components/common/PageActions";
import PageLayout from "@/components/common/PageLayout";
import TransitionLoadingOverlay from "@/components/common/TransitionLoadingOverlay";
import { PAIN_POINT_CAUSE_TEXT } from "@/constants/painPointKeywords";
import { PRODUCT_TYPES } from "@/constants/productTypes";
import { useTransitionNavigation } from "@/hooks/useTransitionNavigation";
import { ROUTES } from "@/routes/paths";
import { useReformFlowStore } from "@/stores/useReformFlowStore";
import type { AnalysisPhoto } from "@/types/analysis";
import { useNavigate } from "react-router-dom";

function AIAnalysisPage() {
    const navigate = useNavigate();
    const { isTransitioning, startTransition } = useTransitionNavigation(
        ROUTES.solutionRecommend
    );
    const productType = useReformFlowStore((state) => state.productType);
    const frontPhoto = useReformFlowStore((state) => state.frontPhoto);
    const detailPhotos = useReformFlowStore((state) => state.detailPhotos);
    const wearPhotos = useReformFlowStore((state) => state.wearPhotos);
    const painPointKeywordIds = useReformFlowStore(
        (state) => state.painPointKeywordIds
    );
    const productTypeLabel =
        PRODUCT_TYPES.find((type) => type.id === productType)?.label ?? "-";
    const painPointCauses = painPointKeywordIds.map(
        (id) => PAIN_POINT_CAUSE_TEXT[id] ?? id
    );
    const photos: AnalysisPhoto[] = [
        ...(frontPhoto ? [{ file: frontPhoto, label: "정면 사진" }] : []),
        ...detailPhotos.map((file, index) => ({
            file,
            label: `디테일 사진 ${index + 1}`,
        })),
        ...wearPhotos.map((file, index) => ({
            file,
            label: `마모 부위 사진 ${index + 1}`,
        })),
    ];

    return (
        <>
            <PageLayout
                currentStep={3}
                title="AI 분석 결과"
                description="등록한 사진과 입력 내용을 바탕으로 제품의 현재 상태를 분석했습니다."
                actions={
                    <PageActions
                        nextLabel="추천 결과 보기"
                        onPrevious={() => navigate(ROUTES.painPoint)}
                        onNext={startTransition}
                        nextDisabled={isTransitioning}
                    />
                }
            >
                <AnalysisResult
                    productTypeLabel={productTypeLabel}
                    painPointCauses={painPointCauses}
                    photos={photos}
                />
            </PageLayout>
            {isTransitioning && (
                <TransitionLoadingOverlay title="AI 추천 결과 로딩 중" />
            )}
        </>
    );
}

export default AIAnalysisPage;
