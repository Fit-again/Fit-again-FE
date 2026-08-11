import type { ProductType } from "@/components/product/ProductTypeIcon";
import { create } from "zustand";

type ProductInfo = {
    productType: ProductType;
    frontPhoto: File;
    wearPhotos: File[];
};

type PainPointInfo = {
    painPointKeywordIds: string[];
    description: string;
};

type ReformFlowState = {
    productType: ProductType | null;
    frontPhoto: File | null;
    wearPhotos: File[];
    painPointKeywordIds: string[];
    description: string;
    setProductInfo: (info: ProductInfo) => void;
    setPainPoint: (info: PainPointInfo) => void;
};

export const useReformFlowStore = create<ReformFlowState>((set) => ({
    productType: null,
    frontPhoto: null,
    wearPhotos: [],
    painPointKeywordIds: [],
    description: "",
    setProductInfo: (info) => set(info),
    setPainPoint: (info) => set(info),
}));
