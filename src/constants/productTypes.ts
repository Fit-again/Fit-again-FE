import type { ProductType } from "@/types/reformFlow";

export type ProductTypeOption = {
    id: ProductType;
    label: string;
};

export const PRODUCT_TYPES: ProductTypeOption[] = [
    { id: "tote", label: "토트백" },
    { id: "shoulder", label: "숄더백" },
    { id: "cross", label: "크로스백" },
    { id: "backpack", label: "백팩" },
    { id: "pouch", label: "파우치" },
    { id: "other", label: "기타" },
];
