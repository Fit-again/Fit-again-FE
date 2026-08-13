import { Textarea } from "@/components/common/form/FormControls";
import PageActions from "@/components/common/PageActions";
import PageLayout from "@/components/common/PageLayout";
import SectionHeading from "@/components/common/SectionHeading";
import TransitionLoadingOverlay from "@/components/common/TransitionLoadingOverlay";
import { PAIN_POINT_KEYWORDS } from "@/constants/painPointKeywords";
import { useTransitionNavigation } from "@/hooks/useTransitionNavigation";
import { ROUTES } from "@/routes/paths";
import {
    DESCRIPTION_MAX,
    painPointSchema,
    type PainPointFormType,
} from "@/schema/painPointSchema";
import { useReformFlowStore } from "@/stores/useReformFlowStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";

function PainPointPage() {
    const navigate = useNavigate();
    const { isTransitioning, startTransition } = useTransitionNavigation(
        ROUTES.aiAnalysis
    );
    const savedKeywordIds = useReformFlowStore(
        (state) => state.painPointKeywordIds
    );
    const savedDescription = useReformFlowStore((state) => state.description);
    const setPainPoint = useReformFlowStore((state) => state.setPainPoint);
    const {
        control,
        handleSubmit,
        register,
        formState: { errors },
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

    const onSubmit = (values: PainPointFormType) => {
        setPainPoint(values);
        startTransition();
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
                <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.45fr)] lg:gap-7">
                    <section className="lg:border-line lg:border-r lg:pr-7">
                        <SectionHeading
                            number={1}
                            title="불편 키워드 선택"
                            detail="복수 선택 가능"
                            required
                            error={errors.painPointKeywordIds?.message}
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
                    </section>

                    <section>
                        <SectionHeading number={2} title="추가 설명 입력" />
                        <p className="text-text-secondary mt-1 text-[18px]">
                            현재 느끼는 불편이나 원하는 변화를 자유롭게
                            입력해주세요
                        </p>
                        <div className="mt-5">
                            <Textarea
                                aria-label="추가 설명 입력"
                                className="min-h-105"
                                placeholder="예) 스트랩이 짧고 어깨가 아파요."
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
        className={`focus-visible:outline-primary cursor-pointer rounded-[5px] border px-6 py-3 text-[18px] transition-colors focus-visible:outline-3 focus-visible:outline-offset-2 ${selected ? "border-primary bg-secondary text-primary font-medium" : "border-line text-text-secondary hover:border-primary/60 bg-white"}`}
        aria-pressed={selected}
        onClick={onClick}
    >
        {label}
    </button>
);

export default PainPointPage;
