import type {
    AlternativeOption,
    RecommendedTask,
} from "@/types/recommendation";

/* 실제 AI 추천 API 연동 전까지 사용하는 목업 결과입니다. */
export const MOCK_RECOMMENDATION = {
    title: "리폼 (Reform)",
    description:
        "현재 사용 목적과 제품 상태를 종합했을 때, 기존 제품을 유지하면서 사용성을 개선하는 리폼이 가장 적합한 활용 방법입니다.",
    reasons: [
        "사용자 애착도가 높은 제품입니다.",
        "구조적 손상이 크지 않아 리폼 효과가 높습니다.",
        "스트랩과 마모 부위를 개선하면 현재 라이프스타일에 더 적합하게 사용할 수 있어요.",
    ],
} as const;

export const RECOMMENDED_TASKS: RecommendedTask[] = [
    {
        id: "strap",
        title: "경량 스트랩 교체",
        description: "무게 부담을 줄이고 착용감을 개선해요.",
    },
    {
        id: "pad",
        title: "어깨 패드 추가",
        description: "어깨에 가해지는 압력을 분산시켜요.",
    },
    {
        id: "corner",
        title: "모서리 보수",
        description: "마모된 부분을 보수하여 외관을 개선해요.",
    },
];

export const ALTERNATIVE_OPTIONS: AlternativeOption[] = [
    {
        id: "resell",
        label: "리셀",
        description: [
            "판매를 원한다면 리셀을 고려해보세요.",
            "중고 명품 플랫폼이나 개인 거래를 통해 새로운 가치를 만들 수 있어요.",
        ],
    },
    {
        id: "upcycle",
        label: "업사이클링",
        description: [
            "새로운 디자인으로 재탄생시켜 다른 형태의 제품으로 활용할 수 있어요.",
            "환경도 지키고 특별한 제품을 만들어보세요.",
        ],
    },
];
