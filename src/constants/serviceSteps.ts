export type ServiceStep = {
    id: number;
    label: string;
};

export const SERVICE_STEPS: ServiceStep[] = [
    { id: 1, label: "제품 등록" },
    { id: 2, label: "불편 입력" },
    { id: 3, label: "AI 분석" },
    { id: 4, label: "추천" },
    { id: 5, label: "미리보기" },
    { id: 6, label: "결과" },
];

export const RESELL_RESULT_STEPS: ServiceStep[] = [
    { id: 1, label: "제품 등록" },
    { id: 2, label: "불편 입력" },
    { id: 3, label: "AI 분석" },
    { id: 4, label: "추천" },
    { id: 5, label: "결과" },
];
