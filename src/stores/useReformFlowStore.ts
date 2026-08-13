import type { ReformFlowState } from "@/types/reformFlow";
import { create } from "zustand";

const initialReformFlowState = {
    productType: null,
    frontPhoto: null,
    detailPhotos: [],
    wearPhotos: [],
    painPointKeywordIds: [],
    description: "",
};

export const useReformFlowStore = create<ReformFlowState>((set) => ({
    ...initialReformFlowState,
    setProductInfo: (info) => set(info),
    setPainPoint: (info) => set(info),
    resetFlow: () => set(initialReformFlowState),
}));
