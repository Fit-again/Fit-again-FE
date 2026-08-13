import Card from "@/components/common/Card";
import MultiPhotoUpload from "@/components/common/MultiPhotoUpload";
import PageActions from "@/components/common/PageActions";
import PageLayout from "@/components/common/PageLayout";
import SectionHeading from "@/components/common/SectionHeading";
import SelectionCard from "@/components/common/SelectionCard";
import UploadArea from "@/components/common/UploadArea";
import ProductTypeIcon from "@/components/product/ProductTypeIcon";
import { PRODUCT_TYPES } from "@/constants/productTypes";
import { ROUTES } from "@/routes/paths";
import { useReformFlowStore } from "@/stores/useReformFlowStore";
import type { ProductType } from "@/types/reformFlow";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const DETAIL_PHOTO_MAX = 4;
const WEAR_PHOTO_MAX = 5;

// TODO: 실제 제품 판별은 백엔드 이미지 분석 API 연동 후 대체
const isValidProductPhoto = (file: File) => file.type.startsWith("image/");

function ProductRegisterPage() {
    const navigate = useNavigate();
    const savedProductType = useReformFlowStore((state) => state.productType);
    const savedFrontPhoto = useReformFlowStore((state) => state.frontPhoto);
    const savedDetailPhotos = useReformFlowStore((state) => state.detailPhotos);
    const savedWearPhotos = useReformFlowStore((state) => state.wearPhotos);
    const setProductInfo = useReformFlowStore((state) => state.setProductInfo);
    const [selectedType, setSelectedType] = useState<ProductType | null>(
        savedProductType
    );
    const [frontPhoto, setFrontPhoto] = useState<File | null>(savedFrontPhoto);
    const [detailPhotos, setDetailPhotos] = useState<File[]>(savedDetailPhotos);
    const [wearPhotos, setWearPhotos] = useState<File[]>(savedWearPhotos);
    const [submitted, setSubmitted] = useState(false);

    const typeError = !selectedType ? "제품 유형을 선택해주세요" : undefined;
    const frontPhotoError = !frontPhoto
        ? "정면 사진을 업로드해주세요"
        : !isValidProductPhoto(frontPhoto)
          ? "올바른 제품이 아닙니다"
          : undefined;
    const handleNext = () => {
        setSubmitted(true);
        if (!typeError && !frontPhotoError) {
            setProductInfo({
                productType: selectedType!,
                frontPhoto: frontPhoto!,
                detailPhotos,
                wearPhotos,
            });
            navigate(ROUTES.painPoint);
        }
    };

    return (
        <PageLayout
            currentStep={1}
            title="제품 등록"
            description="분석에 필요한 제품 정보와 사진을 등록해주세요."
            actions={<PageActions nextLabel="다음 단계" onNext={handleNext} />}
        >
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-8 xl:grid-cols-[minmax(0,1.48fr)_minmax(0,2fr)]">
                <section className="lg:border-line lg:border-r lg:pr-8">
                    <SectionHeading
                        number={1}
                        title="제품 유형 선택"
                        required
                        error={submitted ? typeError : undefined}
                    />
                    <p className="text-text-secondary mt-1 text-[18px]">
                        제품 유형을 선택해주세요.
                    </p>
                    <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3">
                        {PRODUCT_TYPES.map(({ id, label }) => (
                            <SelectionCard
                                key={id}
                                label={label}
                                icon={<ProductTypeIcon type={id} />}
                                selected={selectedType === id}
                                onClick={() => setSelectedType(id)}
                            />
                        ))}
                    </div>

                    <Card variant="soft" className="mt-8 p-3 sm:mt-12 xl:mt-24">
                        <h3 className="border-line text-primary border-b pb-1 text-center text-[15px] font-medium">
                            촬영 가이드
                        </h3>
                        <ul className="text-text-secondary mt-2 list-disc space-y-0.5 pl-5 text-[15px] leading-tight">
                            <li>정면이 잘 보이도록 촬영해주세요.</li>
                            <li>배경은 단색을 권장합니다.</li>
                            <li>그림자는 최소화해주세요.</li>
                            <li>손상 부위는 가까이 촬영해주세요.</li>
                        </ul>
                    </Card>
                </section>

                <section className="grid content-start gap-6 xl:grid-cols-2">
                    <div>
                        <SectionHeading
                            number={2}
                            title="정면 사진 업로드"
                            required
                            error={submitted ? frontPhotoError : undefined}
                        />
                        <p className="text-text-secondary mt-1 text-[18px]">
                            제품의 양면이 잘 보이도록 촬영해주세요.
                        </p>
                        <div className="mt-3">
                            <UploadArea
                                label={
                                    frontPhoto
                                        ? frontPhoto.name
                                        : "정면 사진을 선택해주세요"
                                }
                                description="PNG, JPG 파일을 업로드할 수 있습니다."
                                file={frontPhoto}
                                compact
                                onFilesSelected={(files) =>
                                    setFrontPhoto(files[0] ?? null)
                                }
                            />
                        </div>
                    </div>

                    <div>
                        <SectionHeading
                            number={3}
                            title="디테일 사진 업로드"
                            detail="최대 4장"
                        />
                        <p className="text-text-secondary mt-1 text-lg">
                            제품을 다양한 각도로 촬영해주세요.
                        </p>
                        <div className="mt-3">
                            <MultiPhotoUpload
                                files={detailPhotos}
                                maxCount={DETAIL_PHOTO_MAX}
                                itemLabel="디테일 사진"
                                className="grid-cols-2"
                                onAdd={(file) =>
                                    setDetailPhotos((prev) => [...prev, file])
                                }
                                onRemove={(index) =>
                                    setDetailPhotos((prev) =>
                                        prev.filter((_, i) => i !== index)
                                    )
                                }
                            />
                        </div>
                    </div>

                    <div className="xl:col-span-2">
                        <SectionHeading
                            number={4}
                            title="마모 부위 사진 업로드"
                            detail="최대 5장"
                        />
                        <p className="text-text-secondary mt-1 text-[18px]">
                            손상·마모 부위가 잘 보이도록 다양한 각도로
                            촬영해주세요.
                        </p>
                        <div className="mt-3">
                            <MultiPhotoUpload
                                files={wearPhotos}
                                maxCount={WEAR_PHOTO_MAX}
                                itemLabel="마모 부위 사진"
                                className="grid-cols-3 sm:grid-cols-5"
                                onAdd={(file) =>
                                    setWearPhotos((prev) => [...prev, file])
                                }
                                onRemove={(index) =>
                                    setWearPhotos((prev) =>
                                        prev.filter((_, i) => i !== index)
                                    )
                                }
                            />
                        </div>
                    </div>
                </section>
            </div>
        </PageLayout>
    );
}

export default ProductRegisterPage;
