import {
    getRecommendationApi,
    requestRecommendationApi,
} from "@/api/recommendationApi";
import AnalysisResult from "@/components/analysis/AnalysisResult";
import { ErrorMessage } from "@/components/common/form/FormControls";
import PageActions from "@/components/common/PageActions";
import PageLayout from "@/components/common/PageLayout";
import TransitionLoadingOverlay from "@/components/common/TransitionLoadingOverlay";
import { ROUTES } from "@/routes/paths";
import { useReformFlowStore } from "@/stores/useReformFlowStore";
import { ApiError } from "@/types/api";
import type { AnalysisPhoto } from "@/types/analysis";
import { getApiErrorMessage } from "@/utils/apiError";
import { pollUntil } from "@/utils/polling";
import { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

function AIAnalysisPage() {
    const navigate = useNavigate();
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [requestError, setRequestError] = useState<string | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    const taskId = useReformFlowStore((state) => state.taskId);
    const diagnosisResult = useReformFlowStore(
        (state) => state.diagnosisResult
    );
    const imageAnalysis = useReformFlowStore((state) => state.imageAnalysis);
    const setRecommendationRankings = useReformFlowStore(
        (state) => state.setRecommendationRankings
    );
    const photos: AnalysisPhoto[] =
        diagnosisResult?.allImages.map((file, index) => ({
            file,
            label:
                index === 0
                    ? "정면 사진"
                    : index <= (imageAnalysis?.detailImageUrls.length ?? 0)
                      ? `디테일 사진 ${index}`
                      : `마모 사진 ${index - (imageAnalysis?.detailImageUrls.length ?? 0)}`,
        })) ?? [];

    useEffect(
        () => () => {
            abortControllerRef.current?.abort();
        },
        []
    );

    const handleRecommendation = async () => {
        if (!taskId || isTransitioning) return;

        setRequestError(null);
        setIsTransitioning(true);
        const controller = new AbortController();
        abortControllerRef.current = controller;

        try {
            let recommendationRequestError: unknown;
            const loadRecommendation = async () => {
                const latest = await getRecommendationApi(
                    taskId,
                    controller.signal
                );

                if (
                    latest.status === "DIAGNOSED" &&
                    recommendationRequestError
                ) {
                    throw recommendationRequestError;
                }

                return latest;
            };
            let result = await loadRecommendation();

            if (result.status === "DIAGNOSED") {
                void requestRecommendationApi(taskId, controller.signal).catch(
                    (error: unknown) => {
                        recommendationRequestError = error;
                    }
                );
            }

            if (result.status === "FAILED") {
                throw new ApiError("AI 작업 처리에 실패했습니다.");
            }

            if (result.status !== "RECOMMENDED") {
                result = await pollUntil({
                    load: loadRecommendation,
                    isComplete: (value) => value.status === "RECOMMENDED",
                    isFailed: (value) => value.status === "FAILED",
                    signal: controller.signal,
                });
            }

            if (!result.rankings?.length) {
                throw new ApiError("AI 추천 결과를 확인할 수 없습니다.");
            }
            setRecommendationRankings(result.rankings);
            navigate(ROUTES.solutionRecommend);
        } catch (error) {
            if (controller.signal.aborted) return;
            setRequestError(getApiErrorMessage(error));
            setIsTransitioning(false);
        }
    };

    if (!diagnosisResult) {
        return <Navigate to={ROUTES.painPoint} replace />;
    }

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
                        onNext={() => void handleRecommendation()}
                        nextDisabled={isTransitioning}
                    />
                }
            >
                {requestError && (
                    <div className="mb-5">
                        <ErrorMessage>{requestError}</ErrorMessage>
                    </div>
                )}
                <AnalysisResult photos={photos} result={diagnosisResult} />
            </PageLayout>
            {isTransitioning && (
                <TransitionLoadingOverlay title="AI 추천 결과 로딩 중" />
            )}
        </>
    );
}

export default AIAnalysisPage;
