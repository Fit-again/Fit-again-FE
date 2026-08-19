import { ROUTES } from "@/routes/paths";
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

const PAGE_TITLES: Record<string, string> = {
    [ROUTES.home]: "홈 | Fit Again",
    [ROUTES.productRegister]: "제품 등록 | Fit Again",
    [ROUTES.painPoint]: "불편 입력 | Fit Again",
    [ROUTES.aiAnalysis]: "AI 분석 | Fit Again",
    [ROUTES.solutionRecommend]: "AI 추천 | Fit Again",
    [ROUTES.reformSimulation]: "리폼 시뮬레이션 | Fit Again",
    [ROUTES.resellPreview]: "리셀 미리보기 | Fit Again",
    [ROUTES.upcyclePreview]: "업사이클링 미리보기 | Fit Again",
    [ROUTES.resultConfirm]: "결과 확인 | Fit Again",
};

function App() {
    const { pathname } = useLocation();

    useEffect(() => {
        document.title = PAGE_TITLES[pathname] ?? "Fit Again";
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }, [pathname]);

    return <Outlet />;
}

export default App;
