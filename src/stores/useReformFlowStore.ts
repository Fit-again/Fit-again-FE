import type { ReformFlowState } from "@/types/reformFlow";
import { create } from "zustand";

export const useReformFlowStore = create<ReformFlowState>((set) => ({
    productType: null,
    frontPhoto: null,
    wearPhotos: [],
    painPointKeywordIds: [],
    description: "",
    setProductInfo: (info) => set(info),
    setPainPoint: (info) => set(info),
}));
