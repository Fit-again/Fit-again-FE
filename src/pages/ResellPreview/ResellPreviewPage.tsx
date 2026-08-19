import Card from "@/components/common/Card";
import PageActions from "@/components/common/PageActions";
import PageLayout from "@/components/common/PageLayout";
import Tag from "@/components/common/Tag";
import { useObjectUrlImage } from "@/hooks/useObjectUrlImage";
import { ROUTES } from "@/routes/paths";
import { useReformFlowStore } from "@/stores/useReformFlowStore";
import { Navigate, useNavigate } from "react-router-dom";

function ResellPreviewPage() {
    const navigate = useNavigate();
    const frontPhoto = useReformFlowStore((state) => state.frontPhoto);
    const diagnosis = useReformFlowStore((state) => state.diagnosisResult);
    const recommendation = useReformFlowStore((state) =>
        state.recommendationRankings.find(
            (item) => item.recommendationType === "RESELL"
        )
    );

    if (!recommendation || recommendation.recommendationType !== "RESELL") {
        return <Navigate to={ROUTES.solutionRecommend} replace />;
    }

    return (
        <PageLayout
            currentStep={5}
            title="리셀 미리보기"
            description="나에게는 불편했던 이 제품, 누구에게는 잘 맞을까요?"
            contentSpacing="compact"
            actions={
                <PageActions
                    nextLabel="결과 보기"
                    onPrevious={() => navigate(ROUTES.solutionRecommend)}
                    onNext={() => navigate(ROUTES.resultConfirm)}
                />
            }
        >
            <div className="mt-[21px] grid gap-7 lg:grid-cols-[493px_minmax(0,1fr)] lg:gap-[30px]">
                <section>
                    <h2 className="text-primary text-[23px] font-bold sm:text-[25px]">
                        분석한 제품
                    </h2>
                    <Card className="border-primary mt-5 p-5">
                        <AnnotatedProductPhoto
                            file={frontPhoto}
                            url={recommendation.frontImageUrl}
                        />
                        <div className="mt-5 flex flex-wrap gap-5 text-[15px]">
                            <p className="text-danger flex items-center gap-2">
                                <FactorBadge tone="danger" />
                                단점으로 작용할 수 있는 요소
                            </p>
                            <p className="text-after flex items-center gap-2">
                                <FactorBadge tone="after" />
                                장점으로 작용할 수 있는 요소
                            </p>
                        </div>
                    </Card>
                    <p className="text-text-secondary mt-5 text-[15px] leading-relaxed">
                        ※ AI 분석은 등록하신 사진을 기반으로 한 참고 정보이며,
                        실제 제품 상태와 다를 수 있습니다.
                    </p>
                </section>

                <section>
                    <h2 className="text-primary text-[23px] font-bold sm:text-[25px]">
                        이 제품과 잘 맞을 수 있는 사용자
                    </h2>
                    <div className="mt-5 flex flex-col gap-[15px]">
                        {recommendation.alternativeProducts.map((product) => (
                            <Card
                                key={product.productType}
                                className="px-[15px] py-[10px]"
                            >
                                <h3 className="text-primary text-[17px] font-bold">
                                    {product.productType}을 선호하는 사용자
                                </h3>
                                <p className="mt-1 text-[15px] leading-relaxed">
                                    {product.hashtags.join(" · ")}
                                </p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {product.hashtags.map((tag) => (
                                        <Tag key={tag} tone="soft">
                                            {tag}
                                        </Tag>
                                    ))}
                                </div>
                            </Card>
                        ))}
                    </div>

                    <h2 className="text-primary mt-[30px] text-[23px] font-bold sm:text-[25px]">
                        리셀 가치에 영향을 주는 요소
                    </h2>
                    <Card className="mt-5 grid gap-6 p-5 sm:grid-cols-2">
                        <ValueFactorList
                            title="가치에 영향을 줄 수 있는 요소"
                            tone="danger"
                            items={[
                                ...(diagnosis?.damageState ?? []),
                                ...(diagnosis?.mainInconvenience ?? []),
                            ]}
                        />
                        <ValueFactorList
                            title="가치를 유지하는 요소"
                            tone="after"
                            items={diagnosis?.externalStructure ?? []}
                        />
                    </Card>
                </section>
            </div>
        </PageLayout>
    );
}

const AnnotatedProductPhoto = ({
    file,
    url,
}: {
    file: File | null;
    url: string;
}) => {
    const imageRef = useObjectUrlImage(url ? null : file);

    return (
        <div className="border-line bg-ground relative aspect-square overflow-hidden rounded-[5px] border">
            {file ? (
                <img
                    ref={imageRef}
                    src={url || undefined}
                    alt="리셀 분석 제품"
                    className="h-full w-full object-cover"
                />
            ) : (
                <span className="text-text-secondary absolute inset-0 flex items-center justify-center text-sm">
                    사진 없음
                </span>
            )}
            <PhotoMarker
                tone="after"
                number={1}
                className="top-[20%] left-[34%]"
            />
            <PhotoMarker
                tone="danger"
                number={1}
                className="top-[30%] right-[18%]"
            />
            <PhotoMarker
                tone="after"
                number={2}
                className="top-[43%] left-[12%]"
            />
            <PhotoMarker
                tone="danger"
                number={2}
                className="top-[40%] right-[35%]"
            />
            <PhotoMarker
                tone="after"
                number={3}
                className="top-[63%] left-[10%]"
            />
            <PhotoMarker
                tone="danger"
                number={3}
                className="top-[61%] right-[8%]"
            />
            <PhotoMarker
                tone="after"
                number={4}
                className="bottom-[12%] left-[7%]"
            />
            <PhotoMarker
                tone="danger"
                number={4}
                className="right-[17%] bottom-[8%]"
            />
        </div>
    );
};

const PhotoMarker = ({
    tone,
    number,
    className,
}: {
    tone: "danger" | "after";
    number: number;
    className: string;
}) => (
    <span
        className={`absolute flex size-5 items-center justify-center rounded-full text-[11px] font-bold text-white shadow before:absolute before:size-10 before:rounded-full before:border before:border-dashed ${tone === "danger" ? "bg-danger before:border-danger" : "bg-after before:border-after"} ${className}`}
        aria-hidden="true"
    >
        {number}
    </span>
);

const FactorBadge = ({ tone }: { tone: "danger" | "after" }) => (
    <span
        className={`flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] text-white ${tone === "danger" ? "bg-danger" : "bg-after"}`}
        aria-hidden="true"
    >
        ✓
    </span>
);

const ValueFactorList = ({
    title,
    tone,
    items,
}: {
    title: string;
    tone: "danger" | "after";
    items: string[];
}) => (
    <div>
        <h3
            className={`text-[16px] font-bold ${tone === "danger" ? "text-danger" : "text-after"}`}
        >
            {title}
        </h3>
        <div className="mt-4 flex flex-wrap gap-2">
            {items.map((item) => (
                <Tag key={item} tone={tone === "danger" ? "danger" : "soft"}>
                    {item}
                </Tag>
            ))}
        </div>
    </div>
);

export default ResellPreviewPage;
