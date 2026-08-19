import AnalysisPhotoCarousel from "@/components/analysis/AnalysisPhotoCarousel";
import Card from "@/components/common/Card";
import Tag from "@/components/common/Tag";
import type { AnalysisPhoto, DiagnosisResult } from "@/types/analysis";
import type { ReactNode } from "react";

type TagTone = "primary" | "danger" | "soft";

type AnalysisResultProps = {
    photos: AnalysisPhoto[];
    result: DiagnosisResult;
};

const AnalysisResult = ({ photos, result }: AnalysisResultProps) => (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-[30px] xl:h-[646px] xl:grid-cols-[631px_618px]">
        <section className="flex flex-col items-center gap-5">
            <div className="w-full">
                <AnalysisPhotoCarousel photos={photos} />
            </div>
            <p className="text-text-secondary text-[15px]">
                ※ 사진을 기반으로 분석한 결과이며 실제 제품 정보와 차이가 있을
                수 있습니다.
            </p>
        </section>

        <section className="flex flex-col gap-[30px]">
            <div>
                <h2 className="text-primary flex flex-wrap items-baseline gap-2 text-[23px] font-bold sm:text-[25px]">
                    AI가 확인한 제품 특징
                    <span className="text-text-secondary text-[15px] font-normal">
                        (업로드된 사진을 기반으로 확인된 내용입니다)
                    </span>
                </h2>
                <Card className="mt-[15px]">
                    <dl>
                        <InfoRow label="제품 유형">
                            <span className="text-[18px]">
                                {result.productType}
                            </span>
                        </InfoRow>
                        <InfoRow label="외부 구조">
                            <TagList
                                tone="primary"
                                items={result.externalStructure}
                            />
                        </InfoRow>
                        <InfoRow label="손상 상태">
                            <TagList tone="danger" items={result.damageState} />
                        </InfoRow>
                    </dl>
                </Card>
            </div>

            <div className="flex min-h-0 flex-1 flex-col gap-[15px]">
                <h2 className="text-primary text-[23px] font-bold sm:text-[25px]">
                    현재 사용 환경 분석
                </h2>
                <Card className="min-h-0 flex-1">
                    <dl className="flex h-full flex-col [&>div:nth-child(2)]:flex-1">
                        <InfoRow label="현재 사용 목적">
                            <span
                                className={`text-[18px] ${result.currentPurpose === "확인할 수 없음" ? "text-danger font-medium" : ""}`}
                            >
                                {result.currentPurpose}
                            </span>
                        </InfoRow>
                        <InfoRow label="주요 불편 원인">
                            {result.mainInconvenience.length > 0 ? (
                                <ul className="text-[18px]">
                                    {result.mainInconvenience.map((cause) => (
                                        <li key={cause}>- {cause}</li>
                                    ))}
                                </ul>
                            ) : (
                                <span className="text-text-secondary text-[18px]">
                                    -
                                </span>
                            )}
                        </InfoRow>
                        <InfoRow label="개선 필요 부분">
                            <TagList
                                tone="soft"
                                items={result.areasForImprovement}
                            />
                        </InfoRow>
                    </dl>
                </Card>
            </div>
        </section>
    </div>
);

const InfoRow = ({
    label,
    children,
}: {
    label: string;
    children: ReactNode;
}) => (
    <div className="flex flex-col gap-2 p-[15px] sm:flex-row sm:gap-5">
        <dt className="border-line text-text-strong border-b pb-2 text-base font-medium sm:basis-[100px] sm:border-r sm:border-b-0 sm:pr-3 sm:pb-0 lg:text-[20px]">
            {label}
        </dt>
        <dd className="min-w-0 flex-1">{children}</dd>
    </div>
);

const TagList = ({
    tone,
    items,
}: {
    tone: TagTone;
    items: readonly string[];
}) => (
    <div className="flex flex-wrap gap-2">
        {items.map((item) => (
            <Tag key={item} tone={tone}>
                {item}
            </Tag>
        ))}
    </div>
);

export default AnalysisResult;
