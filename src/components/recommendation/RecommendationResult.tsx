import Card from "@/components/common/Card";
import CheckBadge from "@/components/common/CheckBadge";
import Tag from "@/components/common/Tag";
import {
    ALTERNATIVE_OPTIONS,
    RECOMMENDATION_CONTENT,
} from "@/constants/recommendation";
import { useObjectUrlImage } from "@/hooks/useObjectUrlImage";
import type { AlternativeOption, SolutionType } from "@/types/recommendation";
import type { RankedRecommendation } from "@/types/recommendation";

type RecommendationResultProps = {
    frontPhoto: File | null;
    recommendation: RankedRecommendation;
    recommendedSolution: SolutionType;
    selectedSolution: SolutionType;
    onSelectSolution: (solution: SolutionType) => void;
};

const RecommendationResult = ({
    frontPhoto,
    recommendation,
    recommendedSolution,
    selectedSolution,
    onSelectSolution,
}: RecommendationResultProps) => {
    const staticContent = RECOMMENDATION_CONTENT[selectedSolution];
    const tasks =
        recommendation.recommendationType === "REFORM"
            ? recommendation.recommendedWorks.map((work, index) => ({
                  id: `${index}-${work.title}`,
                  title: work.title,
                  description: work.description,
              }))
            : recommendation.recommendationType === "RESELL"
              ? staticContent.tasks
              : recommendation.upcyclingCandidates.map((candidate, index) => ({
                    id: `${index}-${candidate.itemName}`,
                    title: candidate.itemName,
                    description: candidate.description,
                }));
    const content = {
        ...staticContent,
        reasons: recommendation.reasons,
        tasks,
        description:
            recommendation.recommendationType === "REFORM"
                ? recommendation.summaryComment
                : staticContent.description,
    };
    const alternatives = ALTERNATIVE_OPTIONS.filter(
        (option) => option.id !== selectedSolution
    );

    return (
        <div>
            <Card className="p-5">
                <div className="grid gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.25fr)_minmax(0,0.75fr)] xl:grid-cols-[384px_462px_minmax(0,1fr)]">
                    <ProductPhoto
                        file={frontPhoto}
                        url={recommendation.frontImageUrl}
                    />

                    <div>
                        {selectedSolution === recommendedSolution && (
                            <Tag tone="primary" icon={<SparkleIcon />}>
                                AI 추천
                            </Tag>
                        )}
                        <h2 className="text-primary mt-3 text-[24px] font-bold sm:text-[26px]">
                            {content.label}{" "}
                            <span className="text-[18px] font-medium">
                                ({content.englishLabel})
                            </span>
                        </h2>
                        <p className="text-text-strong mt-4 text-[17px] leading-relaxed">
                            {content.description}
                        </p>

                        <div className="border-line mt-6 rounded-[5px] border p-5 shadow-[0_3px_7px_rgba(91,58,41,0.12)]">
                            <h3 className="text-primary text-[18px] font-bold">
                                추천 이유
                            </h3>
                            <ul className="mt-3 flex flex-col gap-2.5">
                                {content.reasons.map((reason) => (
                                    <li
                                        key={reason}
                                        className="flex items-start gap-2.5"
                                    >
                                        <CheckBadge />
                                        <span className="text-[16px] leading-relaxed">
                                            {reason}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="lg:border-line lg:border-l lg:pl-5">
                        <h3 className="text-primary text-[18px] font-bold">
                            {content.taskHeading}
                        </h3>
                        <ul className="mt-4 flex flex-col gap-3">
                            {content.tasks.map((task, index) => (
                                <li key={task.id}>
                                    <div className="border-primary/60 bg-secondary rounded-[5px] border p-3">
                                        <p className="text-text-strong text-[16px] font-medium">
                                            {task.title}
                                        </p>
                                        <p className="text-text-secondary mt-1 text-[14px] leading-snug">
                                            {task.description}
                                        </p>
                                    </div>
                                    {selectedSolution !== "reform" &&
                                        index < content.tasks.length - 1 && (
                                            <div
                                                className="text-line flex h-6 items-center justify-center text-2xl"
                                                aria-hidden="true"
                                            >
                                                ⌄
                                            </div>
                                        )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </Card>

            <section className="mt-8">
                <h2 className="text-primary text-[23px] font-bold sm:text-[25px]">
                    다른 활용 방법
                </h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    {alternatives.map((option) => (
                        <AlternativeCard
                            key={option.id}
                            option={option}
                            recommended={option.id === recommendedSolution}
                            onClick={() => onSelectSolution(option.id)}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
};

const AlternativeCard = ({
    option,
    recommended,
    onClick,
}: {
    option: AlternativeOption;
    recommended: boolean;
    onClick: () => void;
}) => (
    <button
        type="button"
        className="border-line hover:border-primary focus-visible:outline-primary flex min-h-[157px] w-full cursor-pointer items-center justify-between gap-4 rounded-[5px] border bg-white p-5 text-left transition-[border-color,box-shadow] hover:shadow-[0_3px_7px_rgba(91,58,41,0.12)] focus-visible:outline-3 focus-visible:outline-offset-2"
        onClick={onClick}
    >
        <div>
            <div className="flex flex-wrap items-center gap-2">
                <Tag tone="soft" icon={<SolutionIcon type={option.id} />}>
                    {option.label}
                </Tag>
                {recommended && (
                    <Tag tone="primary" icon={<SparkleIcon />}>
                        AI 추천
                    </Tag>
                )}
            </div>
            <div className="mt-4 flex flex-col gap-1">
                {option.description.map((line) => (
                    <p
                        key={line}
                        className="text-text-secondary text-[16px] leading-relaxed"
                    >
                        {line}
                    </p>
                ))}
            </div>
        </div>
        <span className="text-line shrink-0 text-4xl" aria-hidden="true">
            ›
        </span>
    </button>
);

const ProductPhoto = ({ file, url }: { file: File | null; url: string }) => {
    const imageRef = useObjectUrlImage(url ? null : file);

    if (!file && !url) {
        return (
            <div className="border-line bg-placeholder text-text-secondary flex aspect-square items-center justify-center rounded-[5px] border">
                <span className="text-[14px]">사진 없음</span>
            </div>
        );
    }

    return (
        <div className="border-line bg-ground aspect-square overflow-hidden rounded-[5px] border">
            <img
                ref={imageRef}
                src={url || undefined}
                alt="추천 제품 사진"
                className="h-full w-full object-cover"
            />
        </div>
    );
};

const SparkleIcon = () => (
    <svg
        className="size-3.5"
        viewBox="0 0 16 16"
        fill="currentColor"
        aria-hidden="true"
    >
        <path d="M8 0c.4 2.4 1.6 3.6 4 4-2.4.4-3.6 1.6-4 4-.4-2.4-1.6-3.6-4-4 2.4-.4 3.6-1.6 4-4Z" />
        <path d="M13 8c.2 1.2.8 1.8 2 2-1.2.2-1.8.8-2 2-.2-1.2-.8-1.8-2-2 1.2-.2 1.8-.8 2-2Z" />
    </svg>
);

const SolutionIcon = ({ type }: { type: SolutionType }) => {
    if (type === "upcycle") {
        return (
            <svg
                className="size-3.5"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
            >
                <path
                    d="M2 8a6 6 0 0 1 10.5-4M14 8a6 6 0 0 1-10.5 4"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                />
                <path
                    d="M11.5 1.5 12.5 4l-2.5 1M4.5 14.5 3.5 12l2.5-1"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        );
    }

    return (
        <svg
            className="size-3.5"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
        >
            <path
                d="M8.7 1.3 14 6.6a1.5 1.5 0 0 1 0 2.1l-4.6 4.6a1.5 1.5 0 0 1-2.1 0L2 8V2h6.7Z"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinejoin="round"
            />
            <circle cx="5.2" cy="5.2" r="1" fill="currentColor" />
        </svg>
    );
};

export default RecommendationResult;
