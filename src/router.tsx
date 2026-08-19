/*
 * Fit Again의 페이지 라우팅을 총괄합니다.
 * 페이지는 초기 번들 크기를 줄이기 위해 lazy loading하고,
 * App의 Outlet 위치에 현재 경로의 페이지를 렌더링합니다.
 */

import App from "@/App";
import ReformFlowRoute from "@/components/route/ReformFlowRoute";
import type { ReformFlowRequirement } from "@/components/route/ReformFlowRoute";
import RouteLoading from "@/components/route/RouteLoading";
import {
    AIAnalysisPage,
    ErrorPage,
    HomePage,
    NotFoundPage,
    PainPointPage,
    ProductRegisterPage,
    ReformSimulationPage,
    ResellPreviewPage,
    ResultConfirmPage,
    SolutionRecommendPage,
    UpcyclePreviewPage,
} from "@/routes/lazyPages";
import { ROUTES } from "@/routes/paths";
import { Suspense, type ReactNode } from "react";
import { createBrowserRouter, type RouteObject } from "react-router-dom";

const lazyPage = (page: ReactNode) => (
    <Suspense fallback={<RouteLoading />}>{page}</Suspense>
);

const guardedPage = (page: ReactNode, requirement: ReformFlowRequirement) => (
    <ReformFlowRoute requirement={requirement}>
        {lazyPage(page)}
    </ReformFlowRoute>
);

export const appRoutes: RouteObject[] = [
    {
        path: ROUTES.home,
        element: <App />,
        errorElement: lazyPage(<ErrorPage />),
        children: [
            { index: true, element: lazyPage(<HomePage />) },
            {
                path: ROUTES.productRegister.slice(1),
                element: lazyPage(<ProductRegisterPage />),
            },
            {
                path: ROUTES.painPoint.slice(1),
                element: guardedPage(<PainPointPage />, "product"),
            },
            {
                path: ROUTES.aiAnalysis.slice(1),
                element: guardedPage(<AIAnalysisPage />, "diagnosis"),
            },
            {
                path: ROUTES.solutionRecommend.slice(1),
                element: guardedPage(
                    <SolutionRecommendPage />,
                    "recommendation"
                ),
            },
            {
                path: ROUTES.reformSimulation.slice(1),
                element: guardedPage(
                    <ReformSimulationPage />,
                    "reformSimulation"
                ),
            },
            {
                path: ROUTES.resellPreview.slice(1),
                element: guardedPage(<ResellPreviewPage />, "resellPreview"),
            },
            {
                path: ROUTES.upcyclePreview.slice(1),
                element: guardedPage(<UpcyclePreviewPage />, "upcyclePreview"),
            },
            {
                path: ROUTES.resultConfirm.slice(1),
                element: guardedPage(<ResultConfirmPage />, "recommendation"),
            },
            { path: "*", element: lazyPage(<NotFoundPage />) },
        ],
    },
];

export const router = createBrowserRouter(appRoutes);
