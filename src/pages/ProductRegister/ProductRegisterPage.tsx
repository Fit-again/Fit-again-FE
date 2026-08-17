import Card from "@/components/common/Card";
import { ErrorMessage } from "@/components/common/form/FormControls";
import MultiPhotoUpload from "@/components/common/MultiPhotoUpload";
import PageActions from "@/components/common/PageActions";
import PageLayout from "@/components/common/PageLayout";
import SectionHeading from "@/components/common/SectionHeading";
import SelectionCard from "@/components/common/SelectionCard";
import UploadArea from "@/components/common/UploadArea";
import ProductTypeIcon from "@/components/product/ProductTypeIcon";
import { PRODUCT_TYPES } from "@/constants/productTypes";
import { ROUTES } from "@/routes/paths";
import {
    DETAIL_PHOTO_MAX,
    productRegisterSchema,
    type ProductRegisterFormType,
    WEAR_PHOTO_MAX,
} from "@/schema/productRegisterSchema";
import { useReformFlowStore } from "@/stores/useReformFlowStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";

function ProductRegisterPage() {
    const navigate = useNavigate();
    const savedProductType = useReformFlowStore((state) => state.productType);
    const savedFrontPhoto = useReformFlowStore((state) => state.frontPhoto);
    const savedDetailPhotos = useReformFlowStore((state) => state.detailPhotos);
    const savedWearPhotos = useReformFlowStore((state) => state.wearPhotos);
    const setProductInfo = useReformFlowStore((state) => state.setProductInfo);
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<ProductRegisterFormType>({
        resolver: zodResolver(productRegisterSchema),
        defaultValues: {
            productType: savedProductType ?? undefined,
            frontPhoto: savedFrontPhoto ?? undefined,
            detailPhotos: savedDetailPhotos,
            wearPhotos: savedWearPhotos,
        },
    });
    const [selectedType, frontPhoto, detailPhotos, wearPhotos] = useWatch({
        control,
        name: ["productType", "frontPhoto", "detailPhotos", "wearPhotos"],
    });

    const onSubmit = (values: ProductRegisterFormType) => {
        setProductInfo(values);
        navigate(ROUTES.painPoint);
    };

    return (
        <PageLayout
            currentStep={1}
            title="제품 등록"
            description="분석에 필요한 제품 정보와 사진을 등록해주세요."
            actions={
                <PageActions
                    nextLabel="다음 단계"
                    onNext={() => void handleSubmit(onSubmit)()}
                />
            }
        >
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)] lg:gap-7 xl:grid-cols-[minmax(0,521px)_minmax(0,690px)]">
                <section className="lg:border-line lg:border-r lg:pr-[30px]">
                    <SectionHeading
                        number={1}
                        title="제품 유형 선택"
                        required
                        error={errors.productType?.message}
                    />
                    <p className="text-text-secondary mt-1 text-[18px]">
                        제품 유형을 선택해주세요.
                    </p>
                    <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3">
                        <Controller
                            control={control}
                            name="productType"
                            render={({ field }) => (
                                <>
                                    {PRODUCT_TYPES.map(({ id, label }) => (
                                        <SelectionCard
                                            key={id}
                                            label={label}
                                            icon={<ProductTypeIcon type={id} />}
                                            selected={selectedType === id}
                                            onClick={() => field.onChange(id)}
                                        />
                                    ))}
                                </>
                            )}
                        />
                    </div>

                    <Card variant="soft" className="mt-8 p-3 sm:mt-12 xl:mt-28">
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

                <section className="content-start">
                    <div className="grid gap-7 xl:grid-cols-2 xl:gap-[30px]">
                        <div>
                            {errors.frontPhoto?.message && (
                                <div className="mb-1">
                                    <ErrorMessage>
                                        {errors.frontPhoto.message}
                                    </ErrorMessage>
                                </div>
                            )}
                            <SectionHeading
                                number={2}
                                title="정면 사진 업로드"
                                required
                            />
                            <p className="text-text-secondary mt-1 text-[18px]">
                                제품의 양면이 잘 보이도록 촬영해주세요.
                            </p>
                            <div className="mt-3">
                                <Controller
                                    control={control}
                                    name="frontPhoto"
                                    render={({ field }) => (
                                        <UploadArea
                                            label={
                                                frontPhoto
                                                    ? frontPhoto.name
                                                    : "정면 사진을 선택해주세요"
                                            }
                                            description="PNG, JPG 파일을 업로드할 수 있습니다."
                                            file={frontPhoto ?? null}
                                            compact
                                            className="aspect-square"
                                            onFilesSelected={(files) =>
                                                field.onChange(files[0])
                                            }
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        <div>
                            <SectionHeading
                                number={3}
                                title="디테일 사진 업로드"
                                detail="최대 4장"
                            />
                            <p className="text-text-secondary mt-1 text-[18px]">
                                제품을 다양한 각도로 촬영해주세요.
                            </p>
                            <div className="mt-3">
                                <Controller
                                    control={control}
                                    name="detailPhotos"
                                    render={({ field }) => (
                                        <MultiPhotoUpload
                                            files={detailPhotos}
                                            maxCount={DETAIL_PHOTO_MAX}
                                            itemLabel="디테일 사진"
                                            className="grid-cols-2"
                                            onAdd={(file) =>
                                                field.onChange([
                                                    ...detailPhotos,
                                                    file,
                                                ])
                                            }
                                            onRemove={(index) =>
                                                field.onChange(
                                                    detailPhotos.filter(
                                                        (_, i) => i !== index
                                                    )
                                                )
                                            }
                                        />
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-7 xl:mt-[30px]">
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
                            <Controller
                                control={control}
                                name="wearPhotos"
                                render={({ field }) => (
                                    <MultiPhotoUpload
                                        files={wearPhotos}
                                        maxCount={WEAR_PHOTO_MAX}
                                        itemLabel="마모 부위 사진"
                                        className="grid-cols-3 sm:grid-cols-5"
                                        onAdd={(file) =>
                                            field.onChange([
                                                ...wearPhotos,
                                                file,
                                            ])
                                        }
                                        onRemove={(index) =>
                                            field.onChange(
                                                wearPhotos.filter(
                                                    (_, i) => i !== index
                                                )
                                            )
                                        }
                                    />
                                )}
                            />
                        </div>
                    </div>
                </section>
            </div>
        </PageLayout>
    );
}

export default ProductRegisterPage;
