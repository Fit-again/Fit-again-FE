export type RecommendedTask = {
    id: string;
    title: string;
    description: string;
};

export type SolutionType = "reform" | "resell" | "upcycle";

export type RecommendationType = "REFORM" | "RESELL" | "UPCYCLING";
export type RecommendationStatus = "RECOMMENDING" | "RECOMMENDED" | "FAILED";
export type WorkCategory = "REPLACE" | "REINFORCE";

export type RecommendedWork = {
    title: string;
    description: string;
    category: WorkCategory;
};

export type ImagePoints = { imageUrl: string; points: string[] };
export type DamageMarker = {
    number: number;
    label: string;
    xPercent: number;
    yPercent: number;
};
export type ApiSimulationStep = {
    step: number;
    title: string;
    description: string[];
    imageUrl: string;
};
export type ReformSimulation = {
    steps: ApiSimulationStep[];
    beforeAfter: { before: ImagePoints; after: ImagePoints };
    damageImageUrls: string[];
    damageMarkers: DamageMarker[];
};
export type AlternativeProduct = { productType: string; hashtags: string[] };
export type ReasonPair = { problem: string; solution: string };
export type UpcyclingCandidate = {
    itemName: string;
    description: string;
    reasonPairs: ReasonPair[];
    expectedChanges: string[];
    imageUrl: string;
};

type RankedRecommendationBase = {
    rank: number;
    reasons: string[];
    frontImageUrl: string;
};
export type ReformRecommendation = RankedRecommendationBase & {
    recommendationType: "REFORM";
    recommendedWorks: RecommendedWork[];
    simulation: ReformSimulation | null;
    resultImageUrl: string;
    summaryComment: string;
    resolvedPains: string[];
    difficulty: "쉬움" | "보통" | "어려움";
};
export type ResellRecommendation = RankedRecommendationBase & {
    recommendationType: "RESELL";
    alternativeProducts: AlternativeProduct[];
};
export type UpcyclingRecommendation = RankedRecommendationBase & {
    recommendationType: "UPCYCLING";
    upcyclingCandidates: UpcyclingCandidate[];
    existingFeatureTags: string[];
};
export type RankedRecommendation =
    ReformRecommendation | ResellRecommendation | UpcyclingRecommendation;
export type RecommendationResult = {
    status: RecommendationStatus;
    rankings: RankedRecommendation[] | null;
};

export type RecommendationContent = {
    id: SolutionType;
    label: string;
    englishLabel: string;
    description: string;
    reasons: string[];
    taskHeading: string;
    tasks: RecommendedTask[];
    previewLabel: string;
};

export type AlternativeOption = {
    id: SolutionType;
    label: string;
    description: string[];
};

export type UpcycleProductType = string;

export type UpcycleProduct = {
    id: UpcycleProductType;
    label: string;
    description: string;
};

export const toSolutionType = (type: RecommendationType): SolutionType =>
    type === "UPCYCLING" ? "upcycle" : (type.toLowerCase() as SolutionType);

export const toRecommendationType = (type: SolutionType): RecommendationType =>
    type === "upcycle"
        ? "UPCYCLING"
        : (type.toUpperCase() as RecommendationType);
