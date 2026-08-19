import Card from "@/components/common/Card";
import PageActions from "@/components/common/PageActions";
import PageLayout from "@/components/common/PageLayout";
import { ROUTES } from "@/routes/paths";
import { useReformFlowStore } from "@/stores/useReformFlowStore";
import type { UpcyclingCandidate } from "@/types/recommendation";
import { useNavigate } from "react-router-dom";

function UpcyclePreviewPage() {
    const navigate = useNavigate();
    const selectedProductId = useReformFlowStore(
        (state) => state.selectedUpcycleProduct
    );
    const setSelectedProduct = useReformFlowStore(
        (state) => state.setSelectedUpcycleProduct
    );
    const recommendation = useReformFlowStore((state) =>
        state.recommendationRankings.find(
            (item) => item.recommendationType === "UPCYCLING"
        )
    );
    const products =
        recommendation?.recommendationType === "UPCYCLING"
            ? recommendation.upcyclingCandidates
            : [];
    const selectedProduct =
        products.find((product) => product.itemName === selectedProductId) ??
        products[0];

    if (!selectedProduct) return null;

    return (
        <PageLayout
            currentStep={5}
            title="업사이클링 미리보기"
            description="기존 제품이 새로운 형태로 재탄생하는 과정을 확인해보세요."
            contentSpacing="compact"
            actions={
                <PageActions
                    nextLabel="결과 보기"
                    onPrevious={() => navigate(ROUTES.solutionRecommend)}
                    onNext={() => navigate(ROUTES.resultConfirm)}
                />
            }
        >
            <section className="grid gap-4 lg:grid-cols-3 xl:relative xl:left-1/2 xl:w-[1336px] xl:-translate-x-1/2 xl:gap-[47px]">
                {products.map((product) => (
                    <UpcycleOptionCard
                        key={product.itemName}
                        product={product}
                        selected={product.itemName === selectedProductId}
                        onClick={() => setSelectedProduct(product.itemName)}
                    />
                ))}
            </section>

            <Card className="mt-5 p-5 lg:min-h-[468px] xl:relative xl:left-1/2 xl:w-[1336px] xl:-translate-x-1/2">
                <h2 className="text-primary text-[20px] font-medium">
                    {selectedProduct.itemName}으로 재탄생한다면?
                </h2>
                <div className="mt-[15px] grid gap-[14px] lg:grid-cols-3 xl:grid-cols-[425px_373px_439px]">
                    <PreviewSection title="예상 모습">
                        <GeneratedProductPlaceholder
                            product={selectedProduct}
                        />
                        <p className="text-text-secondary mt-3 text-[12px] leading-relaxed">
                            *AI가 생성한 예상 이미지이며 실제 제작 결과와 차이가
                            있을 수 있습니다.
                        </p>
                    </PreviewSection>

                    <PreviewSection title="왜 이 방향을 제안했을까요?">
                        <p className="text-text-secondary text-[14px]">
                            입력하신 불편과 사용 환경을 분석했어요.
                        </p>
                        <div className="mt-4 flex flex-col gap-4">
                            {selectedProduct.reasonPairs.map(
                                ({ problem, solution }) => (
                                    <div key={problem}>
                                        <h4 className="text-primary text-[16px] font-medium">
                                            {problem}
                                        </h4>
                                        <p className="bg-secondary text-text-strong mt-2 px-3 py-1 text-[14px] leading-relaxed">
                                            {solution}
                                        </p>
                                    </div>
                                )
                            )}
                        </div>
                    </PreviewSection>

                    <PreviewSection title="이렇게 달라질 수 있어요">
                        <p className="text-text-secondary text-[14px]">
                            현재 제품과 달라지는 변화를 확인해보세요.
                        </p>
                        <div className="mt-4 flex flex-col gap-2.5">
                            {selectedProduct.expectedChanges.map((change) => {
                                const [before, after] = change
                                    .split("->")
                                    .map((value) => value.trim());
                                return (
                                    <div
                                        key={change}
                                        className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-center text-[15px]"
                                    >
                                        <span className="bg-danger/10 text-danger px-3 py-1">
                                            {before}
                                        </span>
                                        <span aria-hidden="true">→</span>
                                        <span className="bg-after/10 text-after px-3 py-1">
                                            {after ?? "-"}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </PreviewSection>
                </div>
            </Card>
        </PageLayout>
    );
}

const UpcycleOptionCard = ({
    product,
    selected,
    onClick,
}: {
    product: UpcyclingCandidate;
    selected: boolean;
    onClick: () => void;
}) => (
    <button
        type="button"
        className={`focus-visible:outline-primary relative grid min-h-[190px] cursor-pointer grid-cols-[154px_1fr] items-center gap-[23px] rounded-none border bg-white p-5 text-left transition-[border-color,box-shadow] focus-visible:outline-3 focus-visible:outline-offset-2 ${selected ? "border-black" : "hover:border-primary/60 border-transparent"}`}
        aria-pressed={selected}
        onClick={onClick}
    >
        <span className="text-primary absolute top-4 left-5 text-[18px] font-bold">
            {product.itemName}
        </span>
        {selected && (
            <span className="bg-primary absolute top-4 right-4 flex size-5 items-center justify-center rounded-full text-xs text-white">
                ✓
            </span>
        )}
        <span className="bg-placeholder text-text-secondary mt-10 flex h-[114px] items-center justify-center text-center text-[12px]">
            예상 이미지
        </span>
        <span className="text-text-secondary mt-10 text-[15px] leading-snug">
            {product.description}
        </span>
    </button>
);

const PreviewSection = ({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) => (
    <section className="bg-secondary p-[13px] lg:min-h-[393px]">
        <h2 className="text-primary text-[20px] font-medium">{title}</h2>
        <div className="mt-4">{children}</div>
    </section>
);

const GeneratedProductPlaceholder = ({
    product,
}: {
    product: UpcyclingCandidate;
}) => (
    <div className="bg-secondary text-text-secondary flex aspect-4/3 items-center justify-center overflow-hidden rounded-[5px] px-5 text-center text-[15px]">
        {product.imageUrl ? (
            <img
                src={product.imageUrl}
                alt={`${product.itemName} 예상 모습`}
                className="h-full w-full object-contain"
            />
        ) : (
            `${product.itemName} 예상 이미지`
        )}
    </div>
);

export default UpcyclePreviewPage;
