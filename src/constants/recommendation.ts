import type {
    AlternativeOption,
    RecommendationContent,
    SolutionType,
} from "@/types/recommendation";

export const RECOMMENDATION_CONTENT: Record<
    SolutionType,
    RecommendationContent
> = {
    reform: {
        id: "reform",
        label: "리폼",
        englishLabel: "Reform",
        description:
            "현재 사용 목적과 제품 상태를 종합했을 때, 기존 제품을 유지하면서 사용성을 개선하는 리폼이 가장 적합한 활용 방법입니다.",
        reasons: [
            "사용자 애착도가 높은 제품입니다.",
            "구조적 손상이 크지 않아 리폼 효과가 높습니다.",
            "스트랩과 마모 부위를 개선하면 현재 라이프스타일에 더 적합하게 사용할 수 있어요.",
        ],
        taskHeading: "추천 리폼 작업",
        tasks: [
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
        ],
        previewLabel: "시뮬레이션 보기",
    },
    resell: {
        id: "resell",
        label: "리셀",
        englishLabel: "Resell",
        description:
            "현재 제품은 사용 가능한 상태이지만, 변화한 사용 목적과의 차이가 커 리폼보다 리셀을 추천합니다.",
        reasons: [
            "무게 부담과 수납 불편이 커요.",
            "현재 사용 목적은 출퇴근이에요.",
            "제품 구조상 해당 불편의 개선 범위가 제한적이에요.",
        ],
        taskHeading: "리셀 활용 방안",
        tasks: [
            {
                id: "continue-value",
                title: "가치 이어가기",
                description:
                    "사용 가능한 제품의 가치를 다른 사용자에게 이어갈 수 있어요.",
            },
            {
                id: "professional-resell",
                title: "전문 리셀 연계",
                description:
                    "전문 검수를 통해 실제 판매 가능 여부와 조건을 확인해요.",
            },
            {
                id: "new-product",
                title: "새로운 제품 탐색",
                description:
                    "입력한 불편과 사용 목적에 맞는 새로운 제품을 추천해드려요.",
            },
        ],
        previewLabel: "결과 보기",
    },
    upcycle: {
        id: "upcycle",
        label: "업사이클링",
        englishLabel: "Upcycling",
        description:
            "기존 형태를 유지하기보다 사용 가능한 소재와 디테일을 활용해 새로운 제품으로 재탄생시키는 방향을 추천합니다.",
        reasons: [
            "현재 가방의 크기와 무게가 사용 목적에 맞지 않아요.",
            "기존 형태를 유지한 채 불편을 모두 해결하기 어려워요.",
            "가죽과 주요 디자인 요소는 새로운 제품에 활용할 수 있어요.",
        ],
        taskHeading: "추천 업사이클링 방향",
        tasks: [
            {
                id: "mini-crossbag",
                title: "미니 크로스백",
                description:
                    "상태가 좋은 가죽을 활용해 더 작고 가볍게 휴대할 수 있는 가방으로 재구성해요.",
            },
            {
                id: "card-wallet",
                title: "카드지갑",
                description:
                    "마모가 적은 가죽과 브랜드 디테일을 활용해 일상에서 자주 사용할 수 있는 소형 제품으로 재탄생시켜요.",
            },
            {
                id: "pouch",
                title: "파우치",
                description:
                    "활용 가능한 넓은 가죽 면과 기존 디테일을 살려 다양한 소지품을 담을 수 있는 파우치로 재구성해요.",
            },
        ],
        previewLabel: "업사이클링 미리보기",
    },
};

export const ALTERNATIVE_OPTIONS: AlternativeOption[] = [
    {
        id: "reform",
        label: "리폼",
        description: [
            "기존 제품의 형태는 유지하면서,",
            "현재 느끼는 불편을 개선해 다시 사용할 수 있어요.",
        ],
    },
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

export const RECOMMENDATION_DESCRIPTIONS: Record<SolutionType, string> = {
    reform: "현재 제품에 가장 적합한 리폼 방향을 확인해보세요.",
    resell: "현재 제품에 가장 적합한 리셀 방향을 확인해보세요.",
    upcycle: "현재 제품에 가장 적합한 업사이클링 방향을 확인해보세요.",
};
