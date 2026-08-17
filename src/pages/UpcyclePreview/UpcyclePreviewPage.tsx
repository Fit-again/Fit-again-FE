import Card from "@/components/common/Card";
import miniCrossbagImage from "@/assets/upcycle/mini-crossbag.png";
import PageActions from "@/components/common/PageActions";
import PageLayout from "@/components/common/PageLayout";
import {
    UPCYCLE_PRODUCTS,
    UPCYCLE_REASONING,
} from "@/constants/recommendation";
import { ROUTES } from "@/routes/paths";
import { useReformFlowStore } from "@/stores/useReformFlowStore";
import type { UpcycleProduct } from "@/types/recommendation";
import { useNavigate } from "react-router-dom";

function UpcyclePreviewPage() {
    const navigate = useNavigate();
    const selectedProductId = useReformFlowStore(
        (state) => state.selectedUpcycleProduct
    );
    const setSelectedProduct = useReformFlowStore(
        (state) => state.setSelectedUpcycleProduct
    );
    const selectedProduct =
        UPCYCLE_PRODUCTS.find((product) => product.id === selectedProductId) ??
        UPCYCLE_PRODUCTS[0];

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
            <section className="grid gap-4 lg:grid-cols-3">
                {UPCYCLE_PRODUCTS.map((product) => (
                    <UpcycleOptionCard
                        key={product.id}
                        product={product}
                        selected={product.id === selectedProductId}
                        onClick={() => setSelectedProduct(product.id)}
                    />
                ))}
            </section>

            <Card className="mt-[30px] p-5 lg:min-h-[393px]">
                <div className="grid gap-5 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.32fr)_minmax(0,1fr)]">
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
                            {UPCYCLE_REASONING.map(
                                ({ painPoint, direction }) => (
                                    <div key={painPoint}>
                                        <h4 className="text-primary text-[16px] font-medium">
                                            {painPoint}
                                        </h4>
                                        <p className="bg-secondary text-text-strong mt-2 px-3 py-1 text-[14px] leading-relaxed">
                                            {direction}
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
                            {UPCYCLE_CHANGES.map(({ before, after }) => (
                                <div
                                    key={before}
                                    className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-center text-[15px]"
                                >
                                    <span className="bg-danger/10 text-danger px-3 py-1">
                                        {before}
                                    </span>
                                    <span aria-hidden="true">→</span>
                                    <span className="bg-after/10 text-after px-3 py-1">
                                        {after}
                                    </span>
                                </div>
                            ))}
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
    product: UpcycleProduct;
    selected: boolean;
    onClick: () => void;
}) => (
    <button
        type="button"
        className={`focus-visible:outline-primary relative grid min-h-[186px] cursor-pointer grid-cols-[110px_1fr] items-center gap-4 rounded-[5px] border bg-white p-5 text-left transition-[border-color,box-shadow] focus-visible:outline-3 focus-visible:outline-offset-2 ${selected ? "border-primary shadow-[0_3px_7px_rgba(91,58,41,0.15)]" : "border-line hover:border-primary/60"}`}
        aria-pressed={selected}
        onClick={onClick}
    >
        <span className="text-primary absolute top-4 left-5 text-[18px] font-bold">
            {product.label}
        </span>
        {selected && (
            <span className="bg-primary absolute top-4 right-4 flex size-5 items-center justify-center rounded-full text-xs text-white">
                ✓
            </span>
        )}
        <span className="bg-placeholder text-text-secondary mt-8 flex aspect-square items-center justify-center text-center text-[12px]">
            예상 이미지
        </span>
        <span className="text-text-secondary mt-8 text-[15px] leading-snug">
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
    <section className="border-line border-t pt-5 first:border-0 first:pt-0 lg:border-t-0 lg:border-l lg:pl-5 lg:first:pl-0">
        <h2 className="text-primary text-[22px] font-bold sm:text-[25px]">
            {title}
        </h2>
        <div className="mt-4">{children}</div>
    </section>
);

const UPCYCLE_CHANGES = [
    { before: "큰 토트백", after: "미니 크로스백" },
    { before: "큰 사이즈", after: "컴팩트한 사이즈" },
    { before: "숄더 착용", after: "크로스바디 착용" },
    { before: "출퇴근 중심", after: "가벼운 외출/일상" },
    { before: "높은 휴대 부담", after: "휴대 부담 감소" },
    { before: "큰 수납공간", after: "필수 수납 위주" },
] as const;

const GeneratedProductPlaceholder = ({
    product,
}: {
    product: UpcycleProduct;
}) => (
    <div className="bg-secondary text-text-secondary flex aspect-4/3 items-center justify-center overflow-hidden rounded-[5px] px-5 text-center text-[15px]">
        {product.id === "mini-crossbag" ? (
            <img
                src={miniCrossbagImage}
                alt="미니 크로스백 예상 모습"
                className="h-full w-full object-contain"
            />
        ) : (
            `${product.label} 예상 이미지`
        )}
    </div>
);

export default UpcyclePreviewPage;
