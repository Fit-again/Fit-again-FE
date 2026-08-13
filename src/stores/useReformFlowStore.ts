import type { ReformFlowState } from "@/types/reformFlow";
import { create } from "zustand";

const initialReformFlowState = {
    productType: null,
    frontPhoto: null,
    detailPhotos: [],
    wearPhotos: [],
    painPointKeywordIds: [],
    description: "",
    recommendedSolution: "reform" as const,
    selectedSolution: "reform" as const,
    selectedUpcycleProduct: "mini-crossbag" as const,
};

export const useReformFlowStore = create<ReformFlowState>((set) => ({
    ...initialReformFlowState,
    setProductInfo: (info) => set(info),
    setPainPoint: (info) => set(info),
    setRecommendedSolution: (recommendedSolution) =>
        set({ recommendedSolution, selectedSolution: recommendedSolution }),
    setSelectedSolution: (selectedSolution) => set({ selectedSolution }),
    setSelectedUpcycleProduct: (selectedUpcycleProduct) =>
        set({ selectedUpcycleProduct }),
    resetFlow: () => set(initialReformFlowState),
}));
