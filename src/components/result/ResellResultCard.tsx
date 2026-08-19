import consultationIcon from "@/assets/result/consultation.svg";
import inspectionIcon from "@/assets/result/inspection.svg";
import resellIcon from "@/assets/result/resell.svg";
import Card from "@/components/common/Card";
import ProductTypeIcon from "@/components/product/ProductTypeIcon";
import type { ProductType } from "@/types/reformFlow";
import type { AlternativeProduct } from "@/types/recommendation";

const RESELL_STEPS = [
    {
        title: "상담 신청",
        description:
            "제품 정보가 전문 리셀 파트너에게 전달되어 상담이 시작됩니다.",
        icon: resellIcon,
    },
    {
        title: "전문 검수 및 조건 안내",
        description:
            "실제 제품 상태를 확인하고 판매 가능 여부와 조건을 안내받아요.",
        icon: inspectionIcon,
    },
    {
        title: "리셀 진행",
        description: "안내받은 조건에 동의하면 리셀 절차가 진행됩니다.",
        icon: consultationIcon,
    },
] as const;

const ResellResultCard = ({ products }: { products: AlternativeProduct[] }) => (
    <div className="flex min-w-0 flex-col gap-[30px]">
        <section>
            <h2 className="text-primary text-[22px] leading-tight font-bold">
                리셀을 선택한다면, 이렇게 이어갈 수 있어요.
            </h2>
            <Card
                variant="soft"
                className="mt-4 grid h-[226px] gap-7 p-5 sm:grid-cols-3"
            >
                {RESELL_STEPS.map((step, index) => (
                    <div
                        key={step.title}
                        className="relative flex items-stretch"
                    >
                        <article className="border-line flex h-full flex-1 flex-col items-center rounded-[5px] border bg-white p-5 text-center">
                            <img
                                src={step.icon}
                                alt=""
                                className="size-7"
                                aria-hidden="true"
                            />
                            <h3 className="mt-4 text-[18px] font-medium">
                                {step.title}
                            </h3>
                            <p className="text-text-secondary mt-4 text-left text-[15px] leading-snug">
                                {step.description}
                            </p>
                        </article>
                        {index < RESELL_STEPS.length - 1 && (
                            <span
                                className="text-line absolute top-1/2 -right-5 z-10 -translate-y-1/2 text-4xl"
                                aria-hidden="true"
                            >
                                ›
                            </span>
                        )}
                    </div>
                ))}
            </Card>
        </section>

        <section>
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h2 className="text-primary text-[22px] leading-tight font-bold">
                        다음 제품에서 이런 특징을 고려해보세요
                    </h2>
                    <p className="text-text-secondary mt-1 text-[14px] leading-tight">
                        현재 니즈에 맞는 제품 유형을 추천해요.
                    </p>
                </div>
                <a
                    href="https://kr.mcmworldwide.com/ko_KR/home"
                    target="_blank"
                    rel="noreferrer"
                    className="bg-primary inline-flex min-h-10 items-center rounded-[5px] px-5 text-[15px] text-white"
                >
                    MCM 공식 사이트 둘러보기
                </a>
            </div>

            <Card className="mt-4 grid h-[322px] gap-5 p-5 sm:grid-cols-3">
                {products.map((product, index) => (
                    <article
                        key={`${index}-${product.productType}`}
                        className="flex flex-col items-center border-t pt-5 first:border-0 first:pt-0 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-5 sm:first:border-l-0 sm:first:pl-0"
                    >
                        <div className="w-full text-left">
                            <p className="text-text-secondary text-[14px]">
                                추천 {index + 1}
                            </p>
                            <h3 className="mt-1 text-[17px] font-medium">
                                {product.productType}
                            </h3>
                        </div>
                        <ProductTypeIcon
                            type={toProductType(product.productType)}
                            className="mt-4 h-32 w-32"
                        />
                        <div className="mt-auto flex flex-wrap justify-center gap-2 pt-4">
                            {product.hashtags.map((tag, tagIndex) => (
                                <span
                                    key={`${index}-${tagIndex}`}
                                    className="bg-secondary text-text-secondary rounded-full px-2.5 py-1 text-[12px]"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </article>
                ))}
            </Card>
        </section>
    </div>
);

export default ResellResultCard;

const toProductType = (label: string): ProductType =>
    (
        ({
            토트백: "tote",
            숄더백: "shoulder",
            크로스백: "cross",
            백팩: "backpack",
            파우치: "pouch",
            기타: "other",
        }) as Record<string, ProductType>
    )[label] ?? "other";
