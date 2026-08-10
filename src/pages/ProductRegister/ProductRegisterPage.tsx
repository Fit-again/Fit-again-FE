import Card from "@/components/common/Card";
import PageActions from "@/components/common/PageActions";
import PageLayout from "@/components/common/PageLayout";
import SelectionCard from "@/components/common/SelectionCard";
import UploadArea from "@/components/common/UploadArea";
import ProductTypeIcon, {
    type ProductType,
} from "@/components/product/ProductTypeIcon";
import { useState } from "react";

type ProductTypeOption = {
    id: ProductType;
    label: string;
};

const productTypes: ProductTypeOption[] = [
    { id: "tote", label: "토트백" },
    { id: "shoulder", label: "숄더백" },
    { id: "cross", label: "크로스백" },
    { id: "backpack", label: "백팩" },
    { id: "pouch", label: "파우치" },
    { id: "other", label: "기타" },
];

function ProductRegisterPage() {
    const [selectedType, setSelectedType] = useState<ProductType>("tote");
    const [fileCount, setFileCount] = useState(0);

    return (
        <PageLayout
            currentStep={1}
            title="제품 등록"
            description="분석에 필요한 제품 정보와 사진을 등록해주세요."
            actions={
                <PageActions nextLabel="다음 단계" onNext={() => undefined} />
            }
        >
            <div className="grid gap-10 lg:grid-cols-[minmax(420px,1fr)_minmax(0,1.45fr)] lg:gap-7">
                <section className="lg:border-line lg:border-r lg:pr-7">
                    <SectionHeading number={1} title="제품 유형 선택" />
                    <p className="text-text-secondary mt-1 text-[18px]">
                        제품 유형을 선택해주세요.
                    </p>
                    <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
                        {productTypes.map(({ id, label }) => (
                            <SelectionCard
                                key={id}
                                label={label}
                                icon={<ProductTypeIcon type={id} />}
                                selected={selectedType === id}
                                onClick={() => setSelectedType(id)}
                            />
                        ))}
                    </div>

                    <Card variant="soft" className="mt-8 sm:mt-12 lg:mt-28">
                        <h3 className="border-line border-b pb-2 text-center text-[15px] font-medium">
                            촬영 가이드
                        </h3>
                        <ul className="text-text-secondary mt-3 list-disc space-y-1 pl-5 text-[15px]">
                            <li>정면이 잘 보이도록 촬영해주세요.</li>
                            <li>배경은 단색을 권장합니다.</li>
                            <li>그림자는 최소화해주세요.</li>
                            <li>손상 부위는 가까이 촬영해주세요.</li>
                        </ul>
                    </Card>
                </section>

                <section className="space-y-8">
                    <div>
                        <SectionHeading number={2} title="정면 사진 업로드" />
                        <p className="text-text-secondary mt-1 text-[18px]">
                            제품의 양면이 잘 보이도록 촬영해주세요.
                        </p>
                        <div className="mt-5">
                            <UploadArea
                                label={
                                    fileCount > 0
                                        ? `${fileCount}개 파일 선택됨`
                                        : "정면 사진을 선택해주세요"
                                }
                                description="PNG, JPG 파일을 업로드할 수 있습니다."
                                onFilesSelected={(files) =>
                                    setFileCount(files.length)
                                }
                            />
                        </div>
                    </div>

                    <div>
                        <SectionHeading
                            number={3}
                            title="마모 부위 사진 업로드"
                            detail="최대 5장"
                        />
                        <p className="text-text-secondary mt-1 text-[18px]">
                            손상·마모 부위가 잘 보이도록 다양한 각도로
                            촬영해주세요.
                        </p>
                        <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-5">
                            {Array.from({ length: 5 }, (_, index) => (
                                <div
                                    className={`border-line aspect-square rounded-[5px] border ${index === 0 ? "bg-placeholder" : "bg-white"}`}
                                    key={index}
                                    aria-label={`마모 부위 사진 ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </PageLayout>
    );
}

const SectionHeading = ({
    number,
    title,
    detail,
}: {
    number: number;
    title: string;
    detail?: string;
}) => (
    <h2 className="text-text-strong flex flex-wrap items-baseline gap-2 text-[23px] font-bold sm:text-[25px]">
        <span>
            {number}. {title}
        </span>
        {detail && (
            <span className="text-text-secondary text-[18px] font-normal">
                ({detail})
            </span>
        )}
    </h2>
);

export default ProductRegisterPage;
