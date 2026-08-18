import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import Checkbox from "@/components/common/Checkbox";
import {
    ErrorMessage,
    Field,
    Input,
    Textarea,
} from "@/components/common/form/FormControls";
import {
    createConsultationSchema,
    UPCYCLE_IMPORTANT_PARTS,
    type ConsultationFormType,
} from "@/schema/consultationSchema";
import type { SolutionType } from "@/types/recommendation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";

type ConsultationFormCardProps = {
    onViewAgreement: () => void;
    onSubmit: (values: ConsultationFormType) => void | Promise<void>;
    solutionType: SolutionType;
    selectedUpcycleProduct: string;
    upcycleProductOptions: string[];
    submitting?: boolean;
    submitError?: string | null;
};

const ConsultationFormCard = ({
    onViewAgreement,
    onSubmit,
    solutionType,
    selectedUpcycleProduct,
    upcycleProductOptions,
    submitting = false,
    submitError,
}: ConsultationFormCardProps) => {
    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ConsultationFormType>({
        resolver: zodResolver(createConsultationSchema(solutionType)),
        defaultValues: {
            name: "",
            contact: "",
            message: "",
            upcycleProducts:
                solutionType === "upcycle" && selectedUpcycleProduct
                    ? [selectedUpcycleProduct]
                    : [],
            importantPart: undefined,
            agreed: false,
        },
    });
    const [upcycleProducts, importantPart] = useWatch({
        control,
        name: ["upcycleProducts", "importantPart"],
    });
    const messageLabel =
        solutionType === "resell" ? "문의사항" : "추가 요청사항";
    const messagePlaceholder = {
        reform: "상담 시 전달하고 싶은 요청사항을 입력해주세요.\n예) 스트랩 길이 조절 가능 여부와 예상 비용이 궁금해요.",
        resell: "상담 시 전달하고 싶은 문의사항을 입력해주세요.\n예) 이 정도 마모가 있어도 판매 가능한가요?",
        upcycle: "상담 시 전달하고 싶은 요청사항을 입력해주세요.",
    }[solutionType];

    return (
        <Card className="flex h-full flex-col p-5">
            <div className="border-line border-b pb-2">
                <h2 className="text-primary text-[22px] font-bold sm:text-[23px]">
                    공식 상담 신청
                </h2>
            </div>

            <form
                className="mt-5 flex flex-1 flex-col gap-4"
                onSubmit={(event) => void handleSubmit(onSubmit)(event)}
                noValidate
            >
                <Field
                    label="성명"
                    htmlFor="consult-name"
                    required
                    error={errors.name?.message}
                    className="space-y-1.5 [&_label]:leading-tight"
                >
                    <Input
                        id="consult-name"
                        placeholder="성명을 입력해주세요"
                        invalid={!!errors.name}
                        aria-describedby="consult-name-error"
                        className="!h-[42px]"
                        {...register("name")}
                    />
                </Field>

                <Field
                    label="연락처"
                    htmlFor="consult-contact"
                    required
                    error={errors.contact?.message}
                    className="space-y-1.5 [&_label]:leading-tight"
                >
                    <Input
                        id="consult-contact"
                        placeholder="연락처를 입력해주세요. (예: 010-1234-5678)"
                        invalid={!!errors.contact}
                        aria-describedby="consult-contact-error"
                        className="!h-[42px]"
                        {...register("contact")}
                    />
                </Field>

                {solutionType === "upcycle" && (
                    <>
                        <Controller
                            control={control}
                            name="upcycleProducts"
                            render={({ field }) => (
                                <fieldset>
                                    <legend className="flex flex-wrap items-center gap-2 text-[18px] font-medium">
                                        희망 업사이클링 제품
                                        <span className="text-danger">*</span>
                                        <span className="text-text-secondary text-[15px] font-normal">
                                            (복수선택 가능)
                                        </span>
                                        {errors.upcycleProducts?.message && (
                                            <ErrorMessage>
                                                {errors.upcycleProducts.message}
                                            </ErrorMessage>
                                        )}
                                    </legend>
                                    <div className="mt-2 flex flex-wrap gap-3">
                                        {upcycleProductOptions.map(
                                            (product) => {
                                                const selected =
                                                    upcycleProducts.includes(
                                                        product
                                                    );
                                                return (
                                                    <button
                                                        key={product}
                                                        type="button"
                                                        className={`min-h-10 rounded-[5px] border px-4 text-[15px] ${selected ? "border-primary bg-secondary text-primary font-medium" : "border-line text-text-secondary bg-white"}`}
                                                        aria-pressed={selected}
                                                        onClick={() =>
                                                            field.onChange(
                                                                selected
                                                                    ? upcycleProducts.filter(
                                                                          (
                                                                              item
                                                                          ) =>
                                                                              item !==
                                                                              product
                                                                      )
                                                                    : [
                                                                          ...upcycleProducts,
                                                                          product,
                                                                      ]
                                                            )
                                                        }
                                                    >
                                                        {product}
                                                    </button>
                                                );
                                            }
                                        )}
                                    </div>
                                </fieldset>
                            )}
                        />

                        <Controller
                            control={control}
                            name="importantPart"
                            render={({ field }) => (
                                <fieldset>
                                    <legend className="text-[18px] font-medium">
                                        가장 중요하게 생각하는 부분{" "}
                                        <span className="text-text-secondary text-[15px] font-normal">
                                            (선택)
                                        </span>
                                    </legend>
                                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
                                        {UPCYCLE_IMPORTANT_PARTS.map((part) => (
                                            <Checkbox
                                                key={part}
                                                id={`important-${part}`}
                                                label={part}
                                                checked={importantPart === part}
                                                onChange={() =>
                                                    field.onChange(
                                                        importantPart === part
                                                            ? undefined
                                                            : part
                                                    )
                                                }
                                            />
                                        ))}
                                    </div>
                                </fieldset>
                            )}
                        />
                    </>
                )}

                <Field
                    label={messageLabel}
                    htmlFor="consult-message"
                    optional
                    className="space-y-1.5 [&_label]:leading-tight"
                >
                    <Textarea
                        id="consult-message"
                        placeholder={messagePlaceholder}
                        className={`${solutionType === "upcycle" ? "!min-h-20" : "min-h-[270px]"} resize-none`}
                        {...register("message")}
                    />
                </Field>

                <div className="-mt-1.5">
                    <div className="flex flex-wrap items-start gap-x-2 gap-y-1">
                        <Checkbox
                            id="consult-agree"
                            invalid={!!errors.agreed}
                            aria-describedby="consult-agree-error"
                            label={
                                solutionType === "resell" ? (
                                    "[필수] 개인정보 수집 및 이용에 동의"
                                ) : (
                                    <>
                                        <span className="text-danger">*</span>{" "}
                                        개인정보 수집 및 이용에 동의
                                    </>
                                )
                            }
                            {...register("agreed")}
                        />
                        <button
                            type="button"
                            className="text-text-secondary hover:text-primary cursor-pointer text-sm underline underline-offset-2"
                            onClick={onViewAgreement}
                        >
                            (보기)
                        </button>
                    </div>
                    {errors.agreed?.message && (
                        <span
                            id="consult-agree-error"
                            className="sr-only"
                            role="alert"
                        >
                            {errors.agreed.message}
                        </span>
                    )}
                </div>

                <div>
                    {submitError && (
                        <div className="mb-2">
                            <ErrorMessage>{submitError}</ErrorMessage>
                        </div>
                    )}
                    <Button
                        type="submit"
                        variant="soft"
                        fullWidth
                        disabled={submitting}
                    >
                        {submitting ? "신청 중..." : "상담 신청하기"}
                    </Button>
                </div>
            </form>
        </Card>
    );
};

export default ConsultationFormCard;
