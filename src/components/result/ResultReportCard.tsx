import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import CheckBadge from "@/components/common/CheckBadge";
import Tag from "@/components/common/Tag";
import { DIFFICULTY_LEVELS } from "@/constants/result";
import { useObjectUrlImage } from "@/hooks/useObjectUrlImage";
import type { ReformRecommendation } from "@/types/recommendation";
import type { RefObject } from "react";

type ResultReportCardProps = {
    reportRef: RefObject<HTMLDivElement | null>;
    frontPhoto: File | null;
    recommendation: ReformRecommendation;
    isSaving: boolean;
    saved: boolean;
    saveError: boolean;
    onSave: () => void;
};

const ResultReportCard = ({
    reportRef,
    frontPhoto,
    recommendation,
    isSaving,
    saved,
    saveError,
    onSave,
}: ResultReportCardProps) => (
    <Card className="flex h-full flex-col p-5">
        <div ref={reportRef} className="flex flex-1 flex-col bg-white">
            <div className="border-line flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 border-b pb-4">
                <h2 className="text-primary text-[22px] font-bold sm:text-[23px]">
                    AI 리폼 리포트
                </h2>
                <p className="text-text-secondary text-[13px] sm:text-[14px]">
                    위 내용은 AI 분석 기반의 추천 사항으로, 실제 상담 및 작업
                    과정에서 변경될 수 있습니다.
                </p>
            </div>

            <div
                className="mt-5 grid flex-1 gap-10 sm:grid-cols-[308px_minmax(0,1fr)]"
                data-pdf-layout="content"
            >
                <div className="flex flex-col items-start justify-center">
                    <h3 className="text-primary text-[16px] font-bold">
                        최종 리폼 결과
                    </h3>
                    <div className="mt-3 w-full">
                        <ReportPhoto
                            file={frontPhoto}
                            url={recommendation.resultImageUrl}
                        />
                    </div>
                </div>

                <div className="flex flex-col justify-between gap-6">
                    <ReportSection title="AI 추천">
                        <p className="mt-3 text-[16px] leading-relaxed">
                            {recommendation.summaryComment}
                        </p>
                    </ReportSection>

                    <ReportSection title="해결되는 불편">
                        <ul className="mt-3 flex flex-col gap-2">
                            {recommendation.resolvedPains.map((issue) => (
                                <li
                                    key={issue}
                                    className="flex items-start gap-2.5"
                                >
                                    <CheckBadge />
                                    <span className="text-[15px] leading-relaxed">
                                        {issue}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </ReportSection>

                    <ReportSection title="추천 리폼 작업">
                        <div className="mt-3 flex flex-wrap gap-2">
                            {recommendation.recommendedWorks.map((task) => (
                                <Tag key={task.title} tone="primary">
                                    {task.title}
                                </Tag>
                            ))}
                        </div>
                    </ReportSection>

                    <ReportSection title="예상 난이도">
                        <div className="mt-4">
                            <DifficultyGauge
                                level={Math.max(
                                    DIFFICULTY_LEVELS.indexOf(
                                        recommendation.difficulty
                                    ),
                                    0
                                )}
                            />
                        </div>
                    </ReportSection>
                </div>
            </div>
        </div>

        <div className="mt-auto pt-8">
            <Button
                variant="soft"
                fullWidth
                onClick={onSave}
                disabled={isSaving}
            >
                {isSaving ? "PDF 생성 중..." : "AI 리폼 리포트 저장"}
            </Button>
            {saved && (
                <p
                    className="text-primary mt-2 text-center text-[14px]"
                    role="status"
                    aria-live="polite"
                >
                    PDF로 저장되었습니다.
                </p>
            )}
            {saveError && (
                <p
                    className="text-danger mt-2 text-center text-[14px]"
                    role="alert"
                >
                    리포트를 저장하지 못했습니다. 다시 시도해주세요.
                </p>
            )}
        </div>
    </Card>
);

const ReportSection = ({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) => (
    <section>
        <h3 className="text-primary flex items-center gap-3 text-[17px] font-bold">
            {title}
            <span className="bg-line h-px flex-1" aria-hidden="true" />
        </h3>
        {children}
    </section>
);

const DifficultyGauge = ({ level }: { level: number }) => {
    const fillPercent = ((level + 1) / DIFFICULTY_LEVELS.length) * 100;

    return (
        <div>
            <div
                className="h-2 w-full overflow-hidden rounded-full"
                style={{
                    background: `linear-gradient(to right, var(--color-danger-soft) 0%, var(--color-danger) ${fillPercent}%, var(--color-line) ${fillPercent}%, var(--color-line) 100%)`,
                }}
                role="img"
                aria-label={`예상 난이도: ${DIFFICULTY_LEVELS[level]}`}
            />
            <ul className="mt-2 flex justify-between text-[13px]">
                {DIFFICULTY_LEVELS.map((label, index) => (
                    <li
                        key={label}
                        className={
                            index === level
                                ? "text-danger font-medium"
                                : "text-text-secondary"
                        }
                    >
                        {label}
                    </li>
                ))}
            </ul>
        </div>
    );
};

const ReportPhoto = ({ file, url }: { file: File | null; url: string }) => {
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
                alt="최종 리폼 결과 사진"
                className="h-full w-full object-cover"
            />
        </div>
    );
};

export default ResultReportCard;
