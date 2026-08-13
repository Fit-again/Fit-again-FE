import Card from "@/components/common/Card";
import CheckBadge from "@/components/common/CheckBadge";
import Tag from "@/components/common/Tag";
import {
    ALTERNATIVE_OPTIONS,
    MOCK_RECOMMENDATION,
    RECOMMENDED_TASKS,
} from "@/constants/recommendation";
import { useObjectUrlImage } from "@/hooks/useObjectUrlImage";
import type { AlternativeOption } from "@/types/recommendation";

const RecommendationResult = ({ frontPhoto }: { frontPhoto: File | null }) => (
    <>
        <Card className="p-6 sm:p-8">
            <div className="grid gap-8 lg:grid-cols-[minmax(220px,280px)_minmax(0,1fr)_minmax(220px,260px)]">
                <ProductPhoto file={frontPhoto} />

                <div>
                    <Tag tone="primary" icon={<SparkleIcon />}>
                        AI 추천
                    </Tag>
                    <h2 className="text-primary mt-4 text-[24px] font-bold sm:text-[26px]">
                        {MOCK_RECOMMENDATION.title}
                    </h2>
                    <p className="text-text-secondary mt-4 text-[17px] leading-relaxed">
                        {MOCK_RECOMMENDATION.description}
                    </p>

                    <div className="border-line mt-6 rounded-[5px] border p-5">
                        <h3 className="text-primary text-[17px] font-bold">
                            추천 이유
                        </h3>
                        <ul className="mt-3 flex flex-col gap-2.5">
                            {MOCK_RECOMMENDATION.reasons.map((reason) => (
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

                <div className="lg:border-line lg:border-l lg:pl-7">
                    <h3 className="text-primary text-[17px] font-bold">
                        추천 리폼 작업
                    </h3>
                    <ul className="mt-4 flex flex-col gap-3">
                        {RECOMMENDED_TASKS.map((task) => (
                            <li
                                key={task.id}
                                className="bg-secondary rounded-[5px] p-4"
                            >
                                <p className="text-text-strong text-[16px] font-medium">
                                    {task.title}
                                </p>
                                <p className="text-text-secondary mt-1 text-[14px] leading-relaxed">
                                    {task.description}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </Card>

        <section className="mt-10">
            <h2 className="text-primary text-[23px] font-bold sm:text-[25px]">
                다른 활용 방법
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {ALTERNATIVE_OPTIONS.map((option) => (
                    <AlternativeCard key={option.id} option={option} />
                ))}
            </div>
        </section>
    </>
);

const AlternativeCard = ({ option }: { option: AlternativeOption }) => (
    <button
        type="button"
        className="group border-line focus-visible:outline-primary hover:border-primary flex w-full cursor-pointer items-center justify-between gap-4 rounded-[5px] border bg-white p-6 text-left transition-[border-color,box-shadow] hover:shadow-[0_4px_8px_rgba(91,58,41,0.28)] focus-visible:outline-3 focus-visible:outline-offset-2"
    >
        <div>
            <Tag
                tone="soft"
                icon={option.id === "resell" ? <TagIcon /> : <RecycleIcon />}
            >
                {option.label}
            </Tag>
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
        <ChevronRightIcon />
    </button>
);

const ProductPhoto = ({ file }: { file: File | null }) => {
    const imageRef = useObjectUrlImage(file);

    if (!file) {
        return (
            <div className="border-line bg-placeholder text-text-secondary flex aspect-4/5 items-center justify-center rounded-[5px] border">
                <span className="text-[14px]">사진 없음</span>
            </div>
        );
    }

    return (
        <div className="border-line bg-ground aspect-4/5 overflow-hidden rounded-[5px] border">
            <img
                ref={imageRef}
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

const TagIcon = () => (
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

const RecycleIcon = () => (
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

const ChevronRightIcon = () => (
    <svg
        className="text-line group-hover:text-primary size-11 shrink-0 transition-colors"
        viewBox="0 0 49 57"
        fill="none"
        aria-hidden="true"
    >
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M18.5951 10.5794C19.6385 9.53602 21.3302 9.53602 22.3737 10.5794L38.4049 26.6107C39.4484 27.6541 39.4484 29.3459 38.4049 30.3893L22.3737 46.4206C21.3302 47.464 19.6385 47.464 18.5951 46.4206C17.5516 45.3771 17.5516 43.6854 18.5951 42.6419L32.737 28.5L18.5951 14.3581C17.5516 13.3146 17.5516 11.6229 18.5951 10.5794Z"
            fill="currentColor"
        />
    </svg>
);

export default RecommendationResult;
