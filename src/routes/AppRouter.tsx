import { Route, Routes } from "react-router-dom";
import AIAnalysisPage from "@/pages/AIAnalysis/AIAnalysisPage";
import HomePage from "@/pages/Home/HomePage";
import NotFoundPage from "@/pages/NotFound/NotFoundPage";
import PainPointPage from "@/pages/PainPoint/PainPointPage";
import ProductRegisterPage from "@/pages/ProductRegister/ProductRegisterPage";
import ReformSimulationPage from "@/pages/ReformSimulation/ReformSimulationPage";
import ResultConfirmPage from "@/pages/ResultConfirm/ResultConfirmPage";
import SolutionRecommendPage from "@/pages/SolutionRecommend/SolutionRecommendPage";
import { ROUTES } from "@/routes/paths";

const AppRouter = () => (
    <Routes>
        <Route path={ROUTES.home} element={<HomePage />} />
        <Route
            path={ROUTES.productRegister}
            element={<ProductRegisterPage />}
        />
        <Route path={ROUTES.painPoint} element={<PainPointPage />} />
        <Route path={ROUTES.aiAnalysis} element={<AIAnalysisPage />} />
        <Route
            path={ROUTES.solutionRecommend}
            element={<SolutionRecommendPage />}
        />
        <Route
            path={ROUTES.reformSimulation}
            element={<ReformSimulationPage />}
        />
        <Route path={ROUTES.resultConfirm} element={<ResultConfirmPage />} />
        <Route path="*" element={<NotFoundPage />} />
    </Routes>
);

export default AppRouter;
