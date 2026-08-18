import Card from "@/components/common/Card";
import type { UpcyclingCandidate } from "@/types/recommendation";

type UpcycleResultCardProps = {
    products: UpcyclingCandidate[];
    featureTags: string[];
    selectedProductId: string;
    onSelectProduct: (product: string) => void;
};

const UpcycleResultCard = ({
    products,
    featureTags,
    selectedProductId,
    onSelectProduct,
}: UpcycleResultCardProps) => {
    const selectedProduct =
        products.find(({ itemName }) => itemName === selectedProductId) ??
        products[0];

    if (!selectedProduct) return null;

    return (
        <div className="flex flex-col gap-[30px]">
            <section>
                <div className="flex max-w-[528px]">
                    {products.map((product) => (
                        <button
                            key={product.itemName}
                            type="button"
                            className={`min-h-[46px] flex-1 cursor-pointer border px-4 text-[20px] font-medium ${product.itemName === selectedProductId ? "border-primary bg-primary text-white" : "border-primary text-primary bg-white"}`}
                            aria-pressed={
                                product.itemName === selectedProductId
                            }
                            onClick={() => onSelectProduct(product.itemName)}
                        >
                            {product.itemName}
                        </button>
                    ))}
                </div>
                <Card variant="outlined" className="rounded-tl-none p-5">
                    <div className="grid min-h-[245px] items-center gap-6 sm:grid-cols-[minmax(0,1fr)_minmax(260px,0.9fr)]">
                        <div>
                            <p className="text-text-secondary text-[15px]">
                                선택한 업사이클링 방향
                            </p>
                            <h2 className="text-primary mt-1 text-[26px] font-bold">
                                {selectedProduct.itemName}
                            </h2>
                            <p className="mt-4 text-[16px] leading-relaxed">
                                {selectedProduct.description}
                            </p>
                        </div>
                        <div className="bg-ground flex min-h-[185px] items-center justify-center overflow-hidden rounded-[5px]">
                            {selectedProduct.imageUrl ? (
                                <img
                                    src={selectedProduct.imageUrl}
                                    alt={`${selectedProduct.itemName} 예상 결과`}
                                    className="h-full w-full object-contain"
                                />
                            ) : (
                                <span className="text-text-secondary text-[15px]">
                                    {selectedProduct.itemName} 예상 이미지
                                </span>
                            )}
                        </div>
                    </div>
                </Card>
            </section>

            <Card className="grid min-h-[315px] gap-[30px] p-5 sm:grid-cols-[minmax(0,2.12fr)_minmax(0,1fr)]">
                <section className="sm:border-line sm:border-r sm:pr-5">
                    <h3 className="text-primary text-center text-[22px] font-bold">
                        예상되는 변화
                    </h3>
                    <dl className="mt-5 space-y-3">
                        {selectedProduct.expectedChanges.map(
                            (change, index) => {
                                const [before, after] = change
                                    .split("->")
                                    .map((value) => value.trim());
                                return (
                                    <div
                                        key={change}
                                        className="grid grid-cols-[72px_minmax(0,1fr)] items-center gap-5"
                                    >
                                        <dt className="text-[15px] font-medium">
                                            변화 {index + 1}
                                        </dt>
                                        <dd className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-center text-[14px]">
                                            <span className="bg-danger/10 text-danger px-3 py-1">
                                                {before}
                                            </span>
                                            <span aria-hidden="true">→</span>
                                            <span className="bg-after/10 text-after px-3 py-1">
                                                {after ?? "-"}
                                            </span>
                                        </dd>
                                    </div>
                                );
                            }
                        )}
                    </dl>
                </section>
                <section>
                    <h3 className="text-primary text-center text-[22px] font-bold">
                        이어지는 기존 제품의 특징
                    </h3>
                    <div className="mt-8 flex flex-col items-center gap-4">
                        {featureTags.map((feature) => (
                            <span
                                key={feature}
                                className="bg-secondary text-primary rounded-full px-4 py-2 text-[15px]"
                            >
                                {feature}
                            </span>
                        ))}
                    </div>
                </section>
            </Card>
        </div>
    );
};

export default UpcycleResultCard;
