/*
 * 단계별 화면에 필요한 선행 입력을 확인합니다.
 * 주소 직접 입력이나 새로고침으로 흐름을 건너뛰면
 * 가장 먼저 보완해야 하는 입력 단계로 이동합니다.
 */

import { ROUTES } from "@/routes/paths";
import { useReformFlowStore } from "@/stores/useReformFlowStore";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

export type ReformFlowRequirement =
    | "product"
    | "painPoint"
    | "diagnosis"
    | "recommendation"
    | "reformSimulation"
    | "resellPreview"
    | "upcyclePreview";

type ReformFlowRouteProps = {
    requirement: ReformFlowRequirement;
    children: ReactNode;
};

const ReformFlowRoute = ({ requirement, children }: ReformFlowRouteProps) => {
    const productType = useReformFlowStore((state) => state.productType);
    const frontPhoto = useReformFlowStore((state) => state.frontPhoto);
    const painPointKeywordIds = useReformFlowStore(
        (state) => state.painPointKeywordIds
    );
    const diagnosisResult = useReformFlowStore(
        (state) => state.diagnosisResult
    );
    const recommendationRankings = useReformFlowStore(
        (state) => state.recommendationRankings
    );
    const selectedUpcycleProduct = useReformFlowStore(
        (state) => state.selectedUpcycleProduct
    );
    const hasProductInfo = productType !== null && frontPhoto !== null;
    const reformRecommendation = recommendationRankings.find(
        (item) => item.recommendationType === "REFORM"
    );
    const resellRecommendation = recommendationRankings.find(
        (item) => item.recommendationType === "RESELL"
    );
    const upcycleRecommendation = recommendationRankings.find(
        (item) => item.recommendationType === "UPCYCLING"
    );

    if (!hasProductInfo) {
        return <Navigate to={ROUTES.productRegister} replace />;
    }

    if (requirement !== "product" && painPointKeywordIds.length === 0) {
        return <Navigate to={ROUTES.painPoint} replace />;
    }

    if (
        requirement !== "product" &&
        requirement !== "painPoint" &&
        diagnosisResult === null
    ) {
        return <Navigate to={ROUTES.painPoint} replace />;
    }

    if (
        requirement !== "product" &&
        requirement !== "painPoint" &&
        requirement !== "diagnosis" &&
        recommendationRankings.length === 0
    ) {
        return <Navigate to={ROUTES.aiAnalysis} replace />;
    }

    if (
        requirement === "reformSimulation" &&
        (reformRecommendation?.recommendationType !== "REFORM" ||
            !reformRecommendation.simulation ||
            reformRecommendation.simulation.steps.length < 4)
    ) {
        return <Navigate to={ROUTES.solutionRecommend} replace />;
    }

    if (
        requirement === "resellPreview" &&
        (resellRecommendation?.recommendationType !== "RESELL" ||
            resellRecommendation.alternativeProducts.length === 0)
    ) {
        return <Navigate to={ROUTES.solutionRecommend} replace />;
    }

    if (
        requirement === "upcyclePreview" &&
        (upcycleRecommendation?.recommendationType !== "UPCYCLING" ||
            upcycleRecommendation.upcyclingCandidates.length === 0 ||
            !upcycleRecommendation.upcyclingCandidates.some(
                (candidate) => candidate.itemName === selectedUpcycleProduct
            ))
    ) {
        return <Navigate to={ROUTES.solutionRecommend} replace />;
    }

    return children;
};

export default ReformFlowRoute;
