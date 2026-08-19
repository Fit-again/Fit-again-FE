import type { DiagnosisResult } from "@/types/analysis";
import type { RankedRecommendation } from "@/types/recommendation";

export const diagnosisFixture: DiagnosisResult = {
    allImages: [
        "https://example.com/front.png",
        "https://example.com/wear.png",
    ],
    productType: "숄더백",
    externalStructure: ["넉넉한 수납공간", "튼튼한 본체"],
    damageState: ["모서리 마모"],
    currentPurpose: "출퇴근용",
    mainInconvenience: ["어깨에 부담이 감", "스트랩이 자주 흘러내림"],
    areasForImprovement: ["경량 스트랩 교체", "모서리 보수"],
    color: "브라운",
    size: "medium",
    pattern: "무지",
};

export const recommendationRankingsFixture: RankedRecommendation[] = [
    {
        rank: 1,
        recommendationType: "REFORM",
        reasons: ["기존 디자인을 유지하면서 불편을 개선할 수 있어요."],
        frontImageUrl: "https://example.com/front.png",
        recommendedWorks: [
            {
                title: "경량 스트랩 교체",
                description: "가벼운 스트랩으로 교체합니다.",
                category: "REPLACE",
            },
            {
                title: "모서리 보수",
                description: "마모된 모서리를 보강합니다.",
                category: "REINFORCE",
            },
        ],
        simulation: {
            steps: [
                {
                    step: 1,
                    title: "해체",
                    description: ["기존 스트랩과 부속을 분리합니다."],
                    imageUrl: "https://example.com/step-1.png",
                },
                {
                    step: 2,
                    title: "경량 스트랩 교체",
                    description: ["경량 스트랩을 연결합니다."],
                    imageUrl: "https://example.com/step-2.png",
                },
                {
                    step: 3,
                    title: "모서리 보수",
                    description: ["마모된 모서리를 보강합니다."],
                    imageUrl: "https://example.com/step-3.png",
                },
                {
                    step: 4,
                    title: "완성",
                    description: ["마감 상태를 확인합니다."],
                    imageUrl: "https://example.com/step-4.png",
                },
            ],
            beforeAfter: {
                before: {
                    imageUrl: "https://example.com/before.png",
                    points: ["스트랩이 자주 흘러내림", "모서리 마모"],
                },
                after: {
                    imageUrl: "https://example.com/after.png",
                    points: [
                        "경량 스트랩으로 착용감 개선",
                        "기존 디자인을 유지하면서 사용성 향상",
                    ],
                },
            },
            damageImageUrls: ["https://example.com/wear.png"],
            damageMarkers: [
                {
                    number: 1,
                    label: "모서리 마모",
                    xPercent: 70,
                    yPercent: 80,
                },
            ],
        },
        resultImageUrl: "https://example.com/reform-result.png",
        summaryComment: "착용감과 내구성을 함께 개선하는 리폼입니다.",
        resolvedPains: ["어깨 부담", "스트랩 흘러내림"],
        difficulty: "보통",
    },
    {
        rank: 2,
        recommendationType: "RESELL",
        reasons: ["현재 형태를 선호하는 사용자에게 판매할 수 있어요."],
        frontImageUrl: "https://example.com/front.png",
        alternativeProducts: [
            { productType: "경량 크로스백", hashtags: ["가벼움", "출퇴근"] },
            { productType: "백팩", hashtags: ["수납", "편안함"] },
        ],
    },
    {
        rank: 3,
        recommendationType: "UPCYCLING",
        reasons: ["원단을 활용해 새로운 제품으로 만들 수 있어요."],
        frontImageUrl: "https://example.com/front.png",
        upcyclingCandidates: [
            {
                itemName: "미니 크로스백",
                description: "기존 원단을 활용한 가벼운 미니백",
                reasonPairs: [
                    {
                        problem: "어깨가 아파요",
                        solution: "작고 가벼운 크기로 부담을 줄여요.",
                    },
                ],
                expectedChanges: ["무거운 가방 -> 가벼운 미니백"],
                imageUrl: "",
            },
            {
                itemName: "카드지갑",
                description: "자투리 원단을 활용한 카드지갑",
                reasonPairs: [
                    {
                        problem: "무게가 부담스러워요",
                        solution: "필요한 카드만 가볍게 휴대해요.",
                    },
                ],
                expectedChanges: ["큰 수납공간 -> 간결한 카드 수납"],
                imageUrl: "",
            },
            {
                itemName: "파우치",
                description: "소품을 보관하는 다용도 파우치",
                reasonPairs: [
                    {
                        problem: "활용도가 낮아요",
                        solution: "일상 소품 보관에 다시 활용해요.",
                    },
                ],
                expectedChanges: ["낮은 활용도 -> 일상 소품 보관"],
                imageUrl: "",
            },
        ],
        existingFeatureTags: ["튼튼한 원단", "넉넉한 면적"],
    },
];

export const seedApiFlowStore = () => ({
    productType: "shoulder" as const,
    frontPhoto: new File(["dummy"], "front.png", { type: "image/png" }),
    wearPhotos: [new File(["dummy"], "wear.png", { type: "image/png" })],
    painPointKeywordIds: ["shoulder-pain", "strap-slip"],
    description: "스트랩이 자주 흘러내려요.",
    taskId: 1,
    imageAnalysis: {
        frontImageUrl: "https://example.com/front.png",
        detailImageUrls: [],
        isValid: true,
        message: "분석 가능한 이미지입니다.",
    },
    diagnosisResult: diagnosisFixture,
    recommendationRankings: recommendationRankingsFixture,
    recommendedSolution: "reform" as const,
    selectedSolution: "reform" as const,
    selectedUpcycleProduct: "미니 크로스백",
});
