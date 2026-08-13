/*
 * Fit Again의 페이지 라우팅을 총괄합니다.
 * 페이지는 초기 번들 크기를 줄이기 위해 lazy loading하고,
 * App의 Outlet 위치에 현재 경로의 페이지를 렌더링합니다.
 */

import App from "@/App";
import RouteLoading from "@/components/route/RouteLoading";
import {
    AIAnalysisPage,
    HomePage,
    NotFoundPage,
    PainPointPage,
    ProductRegisterPage,
    ReformSimulationPage,
    ResultConfirmPage,
    SolutionRecommendPage,
} from "@/routes/lazyPages";
import { ROUTES } from "@/routes/paths";
import { Suspense, type ReactNode } from "react";
import { createBrowserRouter, type RouteObject } from "react-router-dom";

const lazyPage = (page: ReactNode) => (
    <Suspense fallback={<RouteLoading />}>{page}</Suspense>
);

export const appRoutes: RouteObject[] = [
    {
        path: ROUTES.home,
        element: <App />,
        children: [
            { index: true, element: lazyPage(<HomePage />) },
            {
                path: ROUTES.productRegister.slice(1),
                element: lazyPage(<ProductRegisterPage />),
            },
            {
                path: ROUTES.painPoint.slice(1),
                element: lazyPage(<PainPointPage />),
            },
            {
                path: ROUTES.aiAnalysis.slice(1),
                element: lazyPage(<AIAnalysisPage />),
            },
            {
                path: ROUTES.solutionRecommend.slice(1),
                element: lazyPage(<SolutionRecommendPage />),
            },
            {
                path: ROUTES.reformSimulation.slice(1),
                element: lazyPage(<ReformSimulationPage />),
            },
            {
                path: ROUTES.resultConfirm.slice(1),
                element: lazyPage(<ResultConfirmPage />),
            },
            { path: "*", element: lazyPage(<NotFoundPage />) },
        ],
    },
];

export const router = createBrowserRouter(appRoutes);
