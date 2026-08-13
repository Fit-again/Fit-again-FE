import AnalysisResult from "@/components/analysis/AnalysisResult";
import PageActions from "@/components/common/PageActions";
import PageLayout from "@/components/common/PageLayout";
import ProcessProgressCard from "@/components/common/ProcessProgressCard";
import { ANALYSIS_STEPS } from "@/constants/analysis";
import { PAIN_POINT_CAUSE_TEXT } from "@/constants/painPointKeywords";
import { PRODUCT_TYPES } from "@/constants/productTypes";
import { useStepProgress } from "@/hooks/useStepProgress";
import { ROUTES } from "@/routes/paths";
import { useReformFlowStore } from "@/stores/useReformFlowStore";
import type { AnalysisPhoto } from "@/types/analysis";
import { useNavigate } from "react-router-dom";

function AIAnalysisPage() {
    const navigate = useNavigate();
    const productType = useReformFlowStore((state) => state.productType);
    const frontPhoto = useReformFlowStore((state) => state.frontPhoto);
    const wearPhotos = useReformFlowStore((state) => state.wearPhotos);
    const painPointKeywordIds = useReformFlowStore(
        (state) => state.painPointKeywordIds
    );
    const { completedCount, isComplete, progress } = useStepProgress(
        ANALYSIS_STEPS.length
    );

    if (!isComplete) {
        return (
            <PageLayout
                currentStep={3}
                title="AI 분석"
                description="AI가 제품 상태와 불편 사항을 분석하고 있어요."
            >
                <div className="flex flex-1 items-center justify-center pt-16">
                    <ProcessProgressCard
                        steps={ANALYSIS_STEPS}
                        completedCount={completedCount}
                        progress={progress}
                        progressLabel="AI 분석 진행률"
                    />
                </div>
            </PageLayout>
        );
    }

    const productTypeLabel =
        PRODUCT_TYPES.find((type) => type.id === productType)?.label ?? "-";
    const painPointCauses = painPointKeywordIds.map(
        (id) => PAIN_POINT_CAUSE_TEXT[id] ?? id
    );
    const photos: AnalysisPhoto[] = [
        ...(frontPhoto ? [{ file: frontPhoto, label: "정면 사진" }] : []),
        ...wearPhotos.map((file, index) => ({
            file,
            label: `마모 부위 사진 ${index + 1}`,
        })),
    ];

    return (
        <PageLayout
            currentStep={3}
            title="AI 분석 결과"
            description="등록한 사진과 입력 내용을 바탕으로 제품의 현재 상태를 분석했습니다."
            actions={
                <PageActions
                    nextLabel="추천 결과 보기"
                    onPrevious={() => navigate(ROUTES.painPoint)}
                    onNext={() => navigate(ROUTES.solutionRecommend)}
                />
            }
        >
            <AnalysisResult
                productTypeLabel={productTypeLabel}
                painPointCauses={painPointCauses}
                photos={photos}
            />
        </PageLayout>
    );
}

export default AIAnalysisPage;
