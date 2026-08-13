import AnalysisPhotoCarousel from "@/components/analysis/AnalysisPhotoCarousel";
import Card from "@/components/common/Card";
import Tag from "@/components/common/Tag";
import { MOCK_ANALYSIS } from "@/constants/analysis";
import type { AnalysisPhoto } from "@/types/analysis";
import type { ReactNode } from "react";

type TagTone = "primary" | "danger" | "soft";

type AnalysisResultProps = {
    productTypeLabel: string;
    painPointCauses: string[];
    photos: AnalysisPhoto[];
};

const AnalysisResult = ({
    productTypeLabel,
    painPointCauses,
    photos,
}: AnalysisResultProps) => (
    <div className="grid gap-10 lg:grid-cols-2">
        <section>
            <AnalysisPhotoCarousel photos={photos} />
            <p className="text-text-secondary mt-4 text-[15px]">
                ※ 사진을 기반으로 분석한 결과이며 실제 제품 정보와 차이가 있을
                수 있습니다.
            </p>
        </section>

        <section className="flex flex-col gap-8">
            <div>
                <h2 className="text-primary flex flex-wrap items-baseline gap-2 text-[23px] font-bold sm:text-[25px]">
                    AI가 확인한 제품 특징
                    <span className="text-text-secondary text-[15px] font-normal">
                        (업로드된 사진을 기반으로 확인된 내용입니다)
                    </span>
                </h2>
                <Card className="mt-4">
                    <dl>
                        <InfoRow label="제품 유형">
                            <span className="text-[18px]">
                                {productTypeLabel}
                            </span>
                        </InfoRow>
                        <InfoRow label="외부 구조">
                            <TagList
                                tone="primary"
                                items={MOCK_ANALYSIS.externalStructure}
                            />
                        </InfoRow>
                        <InfoRow label="손상 상태">
                            <TagList
                                tone="danger"
                                items={MOCK_ANALYSIS.damageStatus}
                            />
                        </InfoRow>
                    </dl>
                </Card>
            </div>

            <div>
                <h2 className="text-primary text-[23px] font-bold sm:text-[25px]">
                    현재 사용 환경 분석
                </h2>
                <Card className="mt-4">
                    <dl>
                        <InfoRow label="현재 사용 목적" wide>
                            <span className="text-[18px]">
                                {MOCK_ANALYSIS.usagePurpose}
                            </span>
                        </InfoRow>
                        <InfoRow label="주요 불편 원인" wide>
                            {painPointCauses.length > 0 ? (
                                <ul className="text-[18px]">
                                    {painPointCauses.map((cause) => (
                                        <li key={cause}>- {cause}</li>
                                    ))}
                                </ul>
                            ) : (
                                <span className="text-text-secondary text-[18px]">
                                    -
                                </span>
                            )}
                        </InfoRow>
                        <InfoRow label="개선 필요 부분" wide>
                            <TagList
                                tone="soft"
                                items={MOCK_ANALYSIS.improvementSuggestions}
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
    wide = false,
    children,
}: {
    label: string;
    wide?: boolean;
    children: ReactNode;
}) => (
    <div className="flex gap-4 py-4 first:pt-0 last:pb-0">
        <dt
            className={`border-line text-text-strong shrink-0 border-r pr-3 text-[18px] font-medium ${wide ? "w-40" : "w-28"}`}
        >
            {label}
        </dt>
        <dd className="flex-1">{children}</dd>
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
