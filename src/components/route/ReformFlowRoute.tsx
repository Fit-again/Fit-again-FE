/*
 * 단계별 화면에 필요한 선행 입력을 확인합니다.
 * 주소 직접 입력이나 새로고침으로 흐름을 건너뛰면
 * 가장 먼저 보완해야 하는 입력 단계로 이동합니다.
 */

import { ROUTES } from "@/routes/paths";
import { useReformFlowStore } from "@/stores/useReformFlowStore";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

type FlowRequirement = "product" | "painPoint";

type ReformFlowRouteProps = {
    requirement: FlowRequirement;
    children: ReactNode;
};

const ReformFlowRoute = ({ requirement, children }: ReformFlowRouteProps) => {
    const productType = useReformFlowStore((state) => state.productType);
    const frontPhoto = useReformFlowStore((state) => state.frontPhoto);
    const painPointKeywordIds = useReformFlowStore(
        (state) => state.painPointKeywordIds
    );
    const hasProductInfo = productType !== null && frontPhoto !== null;

    if (!hasProductInfo) {
        return <Navigate to={ROUTES.productRegister} replace />;
    }

    if (requirement === "painPoint" && painPointKeywordIds.length === 0) {
        return <Navigate to={ROUTES.painPoint} replace />;
    }

    return children;
};

export default ReformFlowRoute;
