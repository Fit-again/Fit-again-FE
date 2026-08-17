import miniCrossbagImage from "@/assets/upcycle/mini-crossbag.png";
import Card from "@/components/common/Card";
import { UPCYCLE_PRODUCTS } from "@/constants/recommendation";
import type { UpcycleProductType } from "@/types/recommendation";

const EXPECTED_CHANGES = [
    ["사용 방식", "큰 토트백", "데일리 크로스백"],
    ["휴대 방식", "토트/숄더", "크로스바디"],
    ["크기", "기존 대비 감소", "컴팩트한 크기"],
    ["무게", "기존 대비 감소", "휴대가 편리"],
    ["사용 목적", "출퇴근 중심", "가벼운 외출/일상"],
] as const;

const ORIGINAL_FEATURES = [
    "MCM 시그니처 패턴",
    "가죽 소재",
    "금속 하드웨어",
    "브랜드 아이덴티티",
] as const;

const RESULT_PRODUCT_ORDER: UpcycleProductType[] = [
    "mini-crossbag",
    "card-wallet",
    "pouch",
];

type UpcycleResultCardProps = {
    selectedProductId: UpcycleProductType;
    onSelectProduct: (product: UpcycleProductType) => void;
};

const UpcycleResultCard = ({
    selectedProductId,
    onSelectProduct,
}: UpcycleResultCardProps) => {
    const selectedProduct =
        UPCYCLE_PRODUCTS.find(({ id }) => id === selectedProductId) ??
        UPCYCLE_PRODUCTS[0];
    const orderedProducts = RESULT_PRODUCT_ORDER.map((id) =>
        UPCYCLE_PRODUCTS.find((product) => product.id === id)!
    );

    return (
        <div className="flex flex-col gap-[30px]">
            <section>
                <div className="flex max-w-[528px]">
                    {orderedProducts.map((product) => (
                        <button
                            key={product.id}
                            type="button"
                            className={`min-h-[46px] flex-1 cursor-pointer border px-4 text-[20px] font-medium ${product.id === selectedProductId ? "border-primary bg-primary text-white" : "border-primary text-primary bg-white"}`}
                            aria-pressed={product.id === selectedProductId}
                            onClick={() => onSelectProduct(product.id)}
                        >
                            {product.label}
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
                                {selectedProduct.label}
                            </h2>
                            <p className="mt-4 text-[16px] leading-relaxed">
                                {selectedProduct.description}
                            </p>
                        </div>
                        <div className="bg-ground flex min-h-[185px] items-center justify-center overflow-hidden rounded-[5px]">
                            {selectedProduct.id === "mini-crossbag" ? (
                                <img
                                    src={miniCrossbagImage}
                                    alt="미니 크로스백 예상 결과"
                                    className="h-full w-full object-contain"
                                />
                            ) : (
                                <span className="text-text-secondary text-[15px]">
                                    {selectedProduct.label} 예상 이미지
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
                        {EXPECTED_CHANGES.map(([label, before, after]) => (
                            <div
                                key={label}
                                className="grid grid-cols-[72px_minmax(0,1fr)] items-center gap-5"
                            >
                                <dt className="text-[15px] font-medium">
                                    {label}
                                </dt>
                                <dd className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-center text-[14px]">
                                    <span className="bg-danger/10 text-danger px-3 py-1">
                                        {before}
                                    </span>
                                    <span aria-hidden="true">→</span>
                                    <span className="bg-after/10 text-after px-3 py-1">
                                        {after}
                                    </span>
                                </dd>
                            </div>
                        ))}
                    </dl>
                </section>
                <section>
                    <h3 className="text-primary text-center text-[22px] font-bold">
                        이어지는 기존 제품의 특징
                    </h3>
                    <div className="mt-8 flex flex-col items-center gap-4">
                        {ORIGINAL_FEATURES.map((feature) => (
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
