export type ProductType =
    "tote" | "shoulder" | "cross" | "backpack" | "pouch" | "other";

export type ProductInfo = {
    productType: ProductType;
    frontPhoto: File;
    wearPhotos: File[];
};

export type PainPointInfo = {
    painPointKeywordIds: string[];
    description: string;
};

export type ReformFlowState = {
    productType: ProductType | null;
    frontPhoto: File | null;
    wearPhotos: File[];
    painPointKeywordIds: string[];
    description: string;
    setProductInfo: (info: ProductInfo) => void;
    setPainPoint: (info: PainPointInfo) => void;
    resetFlow: () => void;
};
