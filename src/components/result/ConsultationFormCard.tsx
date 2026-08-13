import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import Checkbox from "@/components/common/Checkbox";
import { Field, Input, Textarea } from "@/components/common/form/FormControls";
import {
    consultationSchema,
    type ConsultationFormType,
} from "@/schema/consultationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

type ConsultationFormCardProps = {
    onViewAgreement: () => void;
    onSubmit: (values: ConsultationFormType) => void;
};

const ConsultationFormCard = ({
    onViewAgreement,
    onSubmit,
}: ConsultationFormCardProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ConsultationFormType>({
        resolver: zodResolver(consultationSchema),
        defaultValues: {
            name: "",
            contact: "",
            message: "",
            agreed: false,
        },
    });

    return (
        <Card className="flex h-full flex-col p-6 sm:p-8">
            <div className="border-line border-b pb-4">
                <h2 className="text-primary text-[22px] font-bold sm:text-[23px]">
                    공식 상담 신청
                </h2>
            </div>

            <form
                className="mt-6 flex flex-1 flex-col gap-6"
                onSubmit={(event) => void handleSubmit(onSubmit)(event)}
                noValidate
            >
                <Field label="성명" htmlFor="consult-name" required>
                    <Input
                        id="consult-name"
                        placeholder="성명을 입력해주세요"
                        invalid={!!errors.name}
                        aria-describedby="consult-name-error"
                        {...register("name")}
                    />
                    <ReservedError
                        id="consult-name-error"
                        show={!!errors.name}
                        message={errors.name?.message}
                    />
                </Field>

                <Field label="연락처" htmlFor="consult-contact" required>
                    <Input
                        id="consult-contact"
                        placeholder="연락처를 입력해주세요. (예: 010-1234-5678)"
                        invalid={!!errors.contact}
                        aria-describedby="consult-contact-error"
                        {...register("contact")}
                    />
                    <ReservedError
                        id="consult-contact-error"
                        show={!!errors.contact}
                        message={errors.contact?.message}
                    />
                </Field>

                <Field label="추가 요청사항" htmlFor="consult-message" optional>
                    <Textarea
                        id="consult-message"
                        placeholder={
                            "상담 시 전달하고 싶은 요청사항을 입력해주세요.\n예) 스트랩 길이 조절 가능 여부와 예상 비용이 궁금해요."
                        }
                        className="min-h-[160px]"
                        {...register("message")}
                    />
                </Field>

                <div>
                    <div className="flex flex-wrap items-start gap-x-2 gap-y-1">
                        <Checkbox
                            id="consult-agree"
                            invalid={!!errors.agreed}
                            aria-describedby="consult-agree-error"
                            label="[필수] 개인정보 수집 및 이용에 동의"
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
                    <ReservedError
                        id="consult-agree-error"
                        show={!!errors.agreed}
                        message={errors.agreed?.message}
                        className="mt-1.5"
                    />
                </div>

                <div className="mt-auto">
                    <Button type="submit" variant="soft" fullWidth>
                        상담 신청하기
                    </Button>
                </div>
            </form>
        </Card>
    );
};

const ReservedError = ({
    id,
    show,
    message,
    className = "",
}: {
    id: string;
    show: boolean;
    message?: string;
    className?: string;
}) => (
    <p
        id={id}
        role={show ? "alert" : undefined}
        className={`text-danger flex items-center gap-1 text-[15px] ${show ? "visible" : "invisible"} ${className}`}
    >
        <span aria-hidden="true">▲</span>
        {message ?? " "}
    </p>
);

export default ConsultationFormCard;
