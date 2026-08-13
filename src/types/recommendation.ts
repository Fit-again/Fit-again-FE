export type RecommendedTask = {
    id: string;
    title: string;
    description: string;
};

export type AlternativeOption = {
    id: "resell" | "upcycle";
    label: string;
    description: string[];
};
