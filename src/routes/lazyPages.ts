import { lazy } from "react";

export const AIAnalysisPage = lazy(
    () => import("@/pages/AIAnalysis/AIAnalysisPage")
);
export const ErrorPage = lazy(() => import("@/pages/Error/ErrorPage"));
export const HomePage = lazy(() => import("@/pages/Home/HomePage"));
export const NotFoundPage = lazy(() => import("@/pages/NotFound/NotFoundPage"));
export const PainPointPage = lazy(
    () => import("@/pages/PainPoint/PainPointPage")
);
export const ProductRegisterPage = lazy(
    () => import("@/pages/ProductRegister/ProductRegisterPage")
);
export const ReformSimulationPage = lazy(
    () => import("@/pages/ReformSimulation/ReformSimulationPage")
);
export const ResultConfirmPage = lazy(
    () => import("@/pages/ResultConfirm/ResultConfirmPage")
);
export const SolutionRecommendPage = lazy(
    () => import("@/pages/SolutionRecommend/SolutionRecommendPage")
);
export const UpcyclePreviewPage = lazy(
    () => import("@/pages/UpcyclePreview/UpcyclePreviewPage")
);
