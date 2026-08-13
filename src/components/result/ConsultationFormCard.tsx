import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import Checkbox from "@/components/common/Checkbox";
import { Field, Input, Textarea } from "@/components/common/form/FormControls";
import type { SyntheticEvent } from "react";

type ConsultationFormCardProps = {
    name: string;
    contact: string;
    message: string;
    agreed: boolean;
    submitted: boolean;
    errors: {
        name?: string;
        contact?: string;
        agree?: string;
    };
    onNameChange: (value: string) => void;
    onContactChange: (value: string) => void;
    onMessageChange: (value: string) => void;
    onAgreementChange: (checked: boolean) => void;
    onViewAgreement: () => void;
    onSubmit: (event: SyntheticEvent<HTMLFormElement>) => void;
};

const ConsultationFormCard = ({
    name,
    contact,
    message,
    agreed,
    submitted,
    errors,
    onNameChange,
    onContactChange,
    onMessageChange,
    onAgreementChange,
    onViewAgreement,
    onSubmit,
}: ConsultationFormCardProps) => (
    <Card className="flex h-full flex-col p-6 sm:p-8">
        <div className="border-line border-b pb-4">
            <h2 className="text-primary text-[22px] font-bold sm:text-[23px]">
                공식 상담 신청
            </h2>
        </div>

        <form
            className="mt-6 flex flex-1 flex-col gap-6"
            onSubmit={onSubmit}
            noValidate
        >
            <Field label="성명" htmlFor="consult-name" required>
                <Input
                    id="consult-name"
                    placeholder="성명을 입력해주세요"
                    invalid={submitted && !!errors.name}
                    aria-describedby="consult-name-error"
                    value={name}
                    onChange={(event) => onNameChange(event.target.value)}
                />
                <ReservedError
                    id="consult-name-error"
                    show={submitted && !!errors.name}
                    message={errors.name}
                />
            </Field>

            <Field label="연락처" htmlFor="consult-contact" required>
                <Input
                    id="consult-contact"
                    placeholder="연락처를 입력해주세요. (예: 010-1234-5678)"
                    invalid={submitted && !!errors.contact}
                    aria-describedby="consult-contact-error"
                    value={contact}
                    onChange={(event) => onContactChange(event.target.value)}
                />
                <ReservedError
                    id="consult-contact-error"
                    show={submitted && !!errors.contact}
                    message={errors.contact}
                />
            </Field>

            <Field label="추가 요청사항" htmlFor="consult-message" optional>
                <Textarea
                    id="consult-message"
                    placeholder={
                        "상담 시 전달하고 싶은 요청사항을 입력해주세요.\n예) 스트랩 길이 조절 가능 여부와 예상 비용이 궁금해요."
                    }
                    className="min-h-[160px]"
                    value={message}
                    onChange={(event) => onMessageChange(event.target.value)}
                />
            </Field>

            <div>
                <div className="flex flex-wrap items-start gap-x-2 gap-y-1">
                    <Checkbox
                        id="consult-agree"
                        checked={agreed}
                        invalid={submitted && !!errors.agree}
                        aria-describedby="consult-agree-error"
                        onChange={(event) =>
                            onAgreementChange(event.target.checked)
                        }
                        label="[필수] 개인정보 수집 및 이용에 동의"
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
                    show={submitted && !!errors.agree}
                    message={errors.agree}
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
