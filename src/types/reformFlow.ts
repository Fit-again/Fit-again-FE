import type { SolutionType, UpcycleProductType } from "@/types/recommendation";

export type ProductType =
    "tote" | "shoulder" | "cross" | "backpack" | "pouch" | "other";

export type ProductInfo = {
    productType: ProductType;
    frontPhoto: File;
    detailPhotos: File[];
    wearPhotos: File[];
};

export type PainPointInfo = {
    painPointKeywordIds: string[];
    description: string;
};

export type ReformFlowState = {
    productType: ProductType | null;
    frontPhoto: File | null;
    detailPhotos: File[];
    wearPhotos: File[];
    painPointKeywordIds: string[];
    description: string;
    recommendedSolution: SolutionType;
    selectedSolution: SolutionType;
    selectedUpcycleProduct: UpcycleProductType;
    setProductInfo: (info: ProductInfo) => void;
    setPainPoint: (info: PainPointInfo) => void;
    setRecommendedSolution: (solution: SolutionType) => void;
    setSelectedSolution: (solution: SolutionType) => void;
    setSelectedUpcycleProduct: (product: UpcycleProductType) => void;
    resetFlow: () => void;
};
