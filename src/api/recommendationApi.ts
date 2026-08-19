import axiosInstance from "@/api/axiosInstance";
import { unwrapApiResponse } from "@/api/response";
import type { ApiResponse } from "@/types/api";
import type {
    DamageMarker,
    RecommendationResult,
} from "@/types/recommendation";

type RawDamageMarker = Omit<DamageMarker, "xPercent" | "yPercent"> & {
    xpercent: number;
    ypercent: number;
};

const RECOMMENDATION_REQUEST_TIMEOUT_MS = 180_000;

const normalizeRecommendation = (result: RecommendationResult) => ({
    ...result,
    rankings:
        result.rankings?.map((ranking) => {
            if (ranking.recommendationType !== "REFORM") return ranking;

            const rawMarkers = (ranking.simulation?.damageMarkers ??
                []) as unknown as RawDamageMarker[];

            return {
                ...ranking,
                simulation: ranking.simulation
                    ? {
                          ...ranking.simulation,
                          damageMarkers: rawMarkers.map((marker) => ({
                              number: marker.number,
                              label: marker.label,
                              xPercent: marker.xpercent,
                              yPercent: marker.ypercent,
                          })),
                      }
                    : null,
            };
        }) ?? null,
});

export const requestRecommendationApi = async (
    taskId: number,
    signal?: AbortSignal
) => {
    const response = await axiosInstance.post<ApiResponse<{ taskId: number }>>(
        `/tasks/${taskId}/recommendations`,
        undefined,
        { signal, timeout: RECOMMENDATION_REQUEST_TIMEOUT_MS }
    );

    return unwrapApiResponse(response.data);
};

export const getRecommendationApi = async (
    taskId: number,
    signal?: AbortSignal
) => {
    const response = await axiosInstance.get<ApiResponse<RecommendationResult>>(
        `/tasks/${taskId}/recommendations`,
        { signal }
    );

    return normalizeRecommendation(unwrapApiResponse(response.data));
};
