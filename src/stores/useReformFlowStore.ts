import type { ReformFlowState } from "@/types/reformFlow";
import { toSolutionType } from "@/types/recommendation";
import { create } from "zustand";

const initialReformFlowState = {
    productType: null,
    frontPhoto: null,
    detailPhotos: [],
    wearPhotos: [],
    painPointKeywordIds: [],
    description: "",
    taskId: null,
    imageAnalysis: null,
    diagnosisResult: null,
    recommendationRankings: [],
    recommendedSolution: "reform" as const,
    selectedSolution: "reform" as const,
    selectedUpcycleProduct: "",
};

export const useReformFlowStore = create<ReformFlowState>((set) => ({
    ...initialReformFlowState,
    setProductInfo: (info) =>
        set({
            ...info,
            taskId: null,
            imageAnalysis: null,
            diagnosisResult: null,
            recommendationRankings: [],
        }),
    setPainPoint: (info) =>
        set({
            ...info,
            taskId: null,
            imageAnalysis: null,
            diagnosisResult: null,
            recommendationRankings: [],
        }),
    setAnalysisResult: (result) => set(result),
    setRecommendationRankings: (recommendationRankings) => {
        const recommended = [...recommendationRankings].sort(
            (a, b) => a.rank - b.rank
        )[0];
        const recommendedSolution = recommended
            ? toSolutionType(recommended.recommendationType)
            : "reform";
        const upcycling = recommendationRankings.find(
            (item) => item.recommendationType === "UPCYCLING"
        );

        set({
            recommendationRankings,
            recommendedSolution,
            selectedSolution: recommendedSolution,
            selectedUpcycleProduct:
                upcycling?.upcyclingCandidates[0]?.itemName ?? "",
        });
    },
    setRecommendedSolution: (recommendedSolution) =>
        set({ recommendedSolution, selectedSolution: recommendedSolution }),
    setSelectedSolution: (selectedSolution) => set({ selectedSolution }),
    setSelectedUpcycleProduct: (selectedUpcycleProduct) =>
        set({ selectedUpcycleProduct }),
    resetFlow: () => set(initialReformFlowState),
}));
