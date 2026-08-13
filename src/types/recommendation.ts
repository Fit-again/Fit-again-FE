export type RecommendedTask = {
    id: string;
    title: string;
    description: string;
};

export type SolutionType = "reform" | "resell" | "upcycle";

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

export type UpcycleProductType = "mini-crossbag" | "card-wallet" | "pouch";

export type UpcycleProduct = {
    id: UpcycleProductType;
    label: string;
    description: string;
};
