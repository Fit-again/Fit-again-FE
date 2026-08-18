import { analyzeImagesApi } from "@/api/imageApi";
import { createTaskApi, getDiagnosisApi } from "@/api/taskApi";
import Card from "@/components/common/Card";
import { ErrorMessage, Textarea } from "@/components/common/form/FormControls";
import PageActions from "@/components/common/PageActions";
import PageLayout from "@/components/common/PageLayout";
import SectionHeading from "@/components/common/SectionHeading";
import TransitionLoadingOverlay from "@/components/common/TransitionLoadingOverlay";
import { PAIN_POINT_KEYWORDS } from "@/constants/painPointKeywords";
import { ROUTES } from "@/routes/paths";
import {
    DESCRIPTION_MAX,
    painPointSchema,
    type PainPointFormType,
} from "@/schema/painPointSchema";
import { useReformFlowStore } from "@/stores/useReformFlowStore";
import { ApiError } from "@/types/api";
import { getApiErrorMessage } from "@/utils/apiError";
import { pollUntil } from "@/utils/polling";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function PainPointPage() {
    const navigate = useNavigate();
    const [isTransitioning, setIsTransitioning] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);
    const productType = useReformFlowStore((state) => state.productType);
    const frontPhoto = useReformFlowStore((state) => state.frontPhoto);
    const detailPhotos = useReformFlowStore((state) => state.detailPhotos);
    const wearPhotos = useReformFlowStore((state) => state.wearPhotos);
    const savedKeywordIds = useReformFlowStore(
        (state) => state.painPointKeywordIds
    );
    const savedDescription = useReformFlowStore((state) => state.description);
    const setPainPoint = useReformFlowStore((state) => state.setPainPoint);
    const setAnalysisResult = useReformFlowStore(
        (state) => state.setAnalysisResult
    );
    const {
        control,
        handleSubmit,
        register,
        formState: { errors },
        setError,
        clearErrors,
    } = useForm<PainPointFormType>({
        resolver: zodResolver(painPointSchema),
        defaultValues: {
            painPointKeywordIds: savedKeywordIds,
            description: savedDescription,
        },
    });
    const [selectedKeywords, description] = useWatch({
        control,
        name: ["painPointKeywordIds", "description"],
    });

    useEffect(
        () => () => {
            abortControllerRef.current?.abort();
        },
        []
    );

    const onSubmit = async (values: PainPointFormType) => {
        if (!productType || !frontPhoto || isTransitioning) return;

        setPainPoint(values);
        clearErrors("root");
        setIsTransitioning(true);
        const controller = new AbortController();
        abortControllerRef.current = controller;

        try {
            const imageAnalysis = await analyzeImagesApi(
                frontPhoto,
                detailPhotos,
                controller.signal
            );
            if (!imageAnalysis.isValid) {
                throw new ApiError(imageAnalysis.message);
            }

            const productTypeLabel =
                PRODUCT_TYPE_LABELS[productType] ?? productType;
            const keywords = values.painPointKeywordIds.map(
                (id) =>
                    PAIN_POINT_KEYWORDS.find((keyword) => keyword.id === id)
                        ?.label ?? id
            );
            const { taskId } = await createTaskApi(
                {
                    productType: productTypeLabel,
                    frontImageUrl: imageAnalysis.frontImageUrl,
                    detailImageUrls: imageAnalysis.detailImageUrls,
                    damageImages: wearPhotos,
                    keywords,
                    description: values.description,
                },
                controller.signal
            );
            const diagnosis = await pollUntil({
                load: () => getDiagnosisApi(taskId, controller.signal),
                isComplete: (value) => value.status === "DIAGNOSED",
                isFailed: (value) => value.status === "FAILED",
                getFailureMessage: (value) => value.errorMessage,
                signal: controller.signal,
            });

            if (!diagnosis.diagnosisResult) {
                throw new ApiError("AI 진단 결과를 확인할 수 없습니다.");
            }

            setAnalysisResult({
                taskId,
                imageAnalysis,
                diagnosisResult: diagnosis.diagnosisResult,
            });
            navigate(ROUTES.aiAnalysis);
        } catch (error) {
            if (controller.signal.aborted) return;
            setError("root", { message: getApiErrorMessage(error) });
            setIsTransitioning(false);
        }
    };

    return (
        <>
            <PageLayout
                currentStep={2}
                title="불편 입력"
                description="현재 사용하면서 느끼는 불편함과 원하는 방향을 입력해주세요."
                actions={
                    <PageActions
                        nextLabel="AI 분석 시작"
                        onPrevious={() => navigate(ROUTES.productRegister)}
                        onNext={() => void handleSubmit(onSubmit)()}
                        nextDisabled={isTransitioning}
                    />
                }
            >
                {errors.root?.message && (
                    <div className="mb-5">
                        <ErrorMessage>{errors.root.message}</ErrorMessage>
                    </div>
                )}
                <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.45fr)] lg:gap-7">
                    <section className="lg:border-line flex flex-col lg:min-h-[628px] lg:border-r lg:pr-7">
                        <SectionHeading
                            number={1}
                            title="불편 키워드 선택"
                            detail="복수 선택 가능"
                            required
                        />
                        <p className="text-text-secondary mt-1 text-[18px]">
                            현재 느끼는 불편함을 선택해주세요.
                        </p>
                        <div className="mt-5 flex flex-wrap gap-4">
                            <Controller
                                control={control}
                                name="painPointKeywordIds"
                                render={({ field }) => (
                                    <>
                                        {PAIN_POINT_KEYWORDS.map(
                                            ({ id, label }) => {
                                                const selected =
                                                    selectedKeywords.includes(
                                                        id
                                                    );

                                                return (
                                                    <KeywordToggle
                                                        key={id}
                                                        label={label}
                                                        selected={selected}
                                                        onClick={() =>
                                                            field.onChange(
                                                                selected
                                                                    ? selectedKeywords.filter(
                                                                          (
                                                                              keywordId
                                                                          ) =>
                                                                              keywordId !==
                                                                              id
                                                                      )
                                                                    : [
                                                                          ...selectedKeywords,
                                                                          id,
                                                                      ]
                                                            )
                                                        }
                                                    />
                                                );
                                            }
                                        )}
                                    </>
                                )}
                            />
                        </div>
                        {errors.painPointKeywordIds?.message && (
                            <div className="mt-5">
                                <ErrorMessage>
                                    {errors.painPointKeywordIds.message}
                                </ErrorMessage>
                            </div>
                        )}

                        <Card variant="soft" className="mt-10 p-3 lg:mt-auto">
                            <h3 className="border-line text-text-secondary border-b pb-1 text-center text-[15px] font-medium">
                                작성 TIP
                            </h3>
                            <p className="text-text-secondary mt-3 text-[15px] leading-relaxed">
                                제품을 어떤 상황에서 사용하는지, 어떤 점이
                                불편한지, 앞으로 어떻게 사용하고 싶은지 함께
                                작성하면 AI가 사용 목적과 니즈를 더 정확하게
                                분석해 적합한 활용 방법을 추천할 수 있어요.
                            </p>
                        </Card>
                    </section>

                    <section>
                        <SectionHeading number={2} title="추가 설명 입력" />
                        <p className="text-text-secondary mt-1 text-[18px]">
                            현재 느끼는 불편이나 원하는 변화를 자유롭게
                            입력해주세요.
                        </p>
                        <div className="mt-5">
                            <Textarea
                                aria-label="추가 설명 입력"
                                className="min-h-[360px] resize-none lg:!min-h-[550px]"
                                placeholder="예) 출퇴근할 때 자주 사용하는데 스트랩이 짧아서 어깨가 아파요. 노트북을 넣고 다녀도 부담이 적도록 더 편하게 사용하고 싶어요."
                                maxLength={DESCRIPTION_MAX}
                                showCount
                                value={description}
                                {...register("description")}
                            />
                        </div>
                    </section>
                </div>
            </PageLayout>
            {isTransitioning && (
                <TransitionLoadingOverlay title="AI 분석 결과 로딩 중" />
            )}
        </>
    );
}

const KeywordToggle = ({
    label,
    selected,
    onClick,
}: {
    label: string;
    selected: boolean;
    onClick: () => void;
}) => (
    <button
        type="button"
        className={`focus-visible:outline-primary min-h-[42px] cursor-pointer rounded-[5px] border px-7 py-1.5 text-[18px] transition-colors focus-visible:outline-3 focus-visible:outline-offset-2 ${selected ? "border-primary bg-secondary text-primary font-medium" : "border-primary text-primary hover:bg-secondary/40 bg-white"}`}
        aria-pressed={selected}
        onClick={onClick}
    >
        {label}
    </button>
);

export default PainPointPage;

const PRODUCT_TYPE_LABELS = {
    tote: "토트백",
    shoulder: "숄더백",
    cross: "크로스백",
    backpack: "백팩",
    pouch: "파우치",
    other: "기타",
} as const;
