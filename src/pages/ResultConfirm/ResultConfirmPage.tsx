import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import Checkbox from "@/components/common/Checkbox";
import { Field, Input, Textarea } from "@/components/common/form/FormControls";
import PageActions from "@/components/common/PageActions";
import PageLayout from "@/components/common/PageLayout";
import Tag from "@/components/common/Tag";
import { PAIN_POINT_CAUSE_TEXT } from "@/constants/painPointKeywords";
import { ROUTES } from "@/routes/paths";
import { useReformFlowStore } from "@/stores/useReformFlowStore";
import { useEffect, useRef, useState, type SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";

type ResultStep = {
    id: string;
    label: string;
};

type StepStatus = "done" | "active" | "pending";

const RESULT_STEPS: ResultStep[] = [
    { id: "compile", label: "리폼 결과 데이터 정리 중" },
    { id: "difficulty", label: "예상 난이도 산정 중" },
    { id: "report", label: "AI 리폼 리포트 생성 중" },
];

const STEP_DURATION_MS = 1200;

const DIFFICULTY_LEVELS = [
    "매우 쉬움",
    "쉬움",
    "보통",
    "어려움",
    "매우 어려움",
];

const DEFAULT_RESOLVED_ISSUES = [
    "장시간 착용 시 어깨 부담",
    "스트랩 사용감",
    "모서리 마모",
];

/*
 * 실제 AI 리폼 리포트 백엔드 연동 전까지 사용하는 목업 결과입니다.
 */
// TODO: 실제 AI 리폼 리포트 API 연동 후 아래 목업 데이터를 응답 결과로 대체
const MOCK_REPORT = {
    recommendation:
        "출퇴근용으로 사용하면서 발생한 어깨 부담과 외관 마모를 개선하기 위해 기능 개선 중심의 리폼을 추천합니다.",
    tasks: ["경량 스트랩", "어깨 패드 추가", "모서리 보강"],
    difficultyIndex: 2,
};

const CONTACT_REGEX = /^01[016789]-?\d{3,4}-?\d{4}$/;

function ResultConfirmPage() {
    const navigate = useNavigate();
    const frontPhoto = useReformFlowStore((state) => state.frontPhoto);
    const painPointKeywordIds = useReformFlowStore(
        (state) => state.painPointKeywordIds
    );
    const [completedCount, setCompletedCount] = useState(0);

    const [reportSaved, setReportSaved] = useState(false);

    const [name, setName] = useState("");
    const [contact, setContact] = useState("");
    const [message, setMessage] = useState("");
    const [agreed, setAgreed] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const isComplete = completedCount === RESULT_STEPS.length;
    const progress = Math.round((completedCount / RESULT_STEPS.length) * 100);

    useEffect(() => {
        if (isComplete) return;

        const timer = setTimeout(() => {
            setCompletedCount((prev) => prev + 1);
        }, STEP_DURATION_MS);

        return () => clearTimeout(timer);
    }, [completedCount, isComplete]);

    if (!isComplete) {
        return (
            <PageLayout
                currentStep={6}
                title="결과"
                description="AI 리폼 리포트를 생성하고 있어요."
            >
                <Card className="mx-auto max-w-140">
                    <div
                        className="bg-line h-2 w-full overflow-hidden rounded-full"
                        role="progressbar"
                        aria-label="결과 생성 진행률"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={progress}
                    >
                        <div
                            className="bg-primary h-full rounded-full transition-[width] duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    <ul className="mt-8 flex flex-col gap-5">
                        {RESULT_STEPS.map((step, index) => {
                            const status: StepStatus =
                                index < completedCount
                                    ? "done"
                                    : index === completedCount
                                      ? "active"
                                      : "pending";

                            return (
                                <li
                                    key={step.id}
                                    className="flex items-center gap-3"
                                >
                                    <StepIcon status={status} />
                                    <span
                                        className={`text-[18px] ${status === "pending" ? "text-text-secondary" : "text-primary font-medium"}`}
                                    >
                                        {step.label}
                                    </span>
                                </li>
                            );
                        })}
                    </ul>

                    <p
                        className="text-text-secondary mt-8 text-center text-[16px]"
                        role="status"
                        aria-live="polite"
                    >
                        {`${RESULT_STEPS[completedCount].label}...`}
                    </p>
                </Card>
            </PageLayout>
        );
    }

    const resolvedIssues =
        painPointKeywordIds.length > 0
            ? painPointKeywordIds.map((id) => PAIN_POINT_CAUSE_TEXT[id] ?? id)
            : DEFAULT_RESOLVED_ISSUES;

    const nameError = name.trim() === "" ? "성명을 입력해주세요" : undefined;
    const contactError =
        contact.trim() === ""
            ? "연락처를 입력해주세요"
            : !CONTACT_REGEX.test(contact)
              ? "올바른 연락처 형식이 아닙니다"
              : undefined;
    const agreeError = !agreed
        ? "개인정보 수집 및 이용에 동의해주세요"
        : undefined;

    const handleSaveReport = () => {
        // TODO: 실제 리포트 저장/다운로드 API 연동 전까지 사용하는 목업 동작
        setReportSaved(true);
    };

    const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitted(true);

        if (!nameError && !contactError && !agreeError) {
            // TODO: 실제 상담 신청 API 연동 전까지 사용하는 목업 제출 처리
            setSubmitSuccess(true);
        }
    };

    return (
        <PageLayout
            currentStep={6}
            title="결과 확인"
            description="AI 리폼 리포트를 확인하고 저장하거나 공식 상담을 신청할 수 있습니다."
            actions={
                <PageActions
                    nextLabel="홈으로"
                    onPrevious={() => navigate(ROUTES.reformSimulation)}
                    onNext={() => navigate(ROUTES.home)}
                />
            }
        >
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(320px,1fr)]">
                <Card className="p-6 sm:p-8">
                    <div className="border-line flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 border-b pb-4">
                        <h2 className="text-text-strong text-[22px] font-bold sm:text-[23px]">
                            AI 리폼 리포트
                        </h2>
                        <p className="text-text-secondary text-[13px] sm:text-[14px]">
                            위 내용은 AI 분석 기반의 추천 사항으로, 실제 상담 및
                            작업 과정에서 변경될 수 있습니다.
                        </p>
                    </div>

                    <div className="mt-6 grid gap-6 sm:grid-cols-[minmax(180px,220px)_1fr]">
                        <div>
                            <h3 className="text-text-strong text-[16px] font-bold">
                                최종 리폼 결과
                            </h3>
                            <div className="mt-3">
                                <ReportPhoto file={frontPhoto} />
                            </div>
                        </div>

                        <div className="flex flex-col gap-6">
                            <section>
                                <h3 className="border-line text-text-strong border-b pb-2 text-[17px] font-bold">
                                    AI 추천
                                </h3>
                                <p className="mt-3 text-[16px] leading-relaxed">
                                    {MOCK_REPORT.recommendation}
                                </p>
                            </section>

                            <section>
                                <h3 className="border-line text-text-strong border-b pb-2 text-[17px] font-bold">
                                    해결되는 불편
                                </h3>
                                <ul className="mt-3 flex flex-col gap-2">
                                    {resolvedIssues.map((issue) => (
                                        <li
                                            key={issue}
                                            className="flex items-start gap-2.5"
                                        >
                                            <CheckBadge />
                                            <span className="text-[15px] leading-relaxed">
                                                {issue}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            <section>
                                <h3 className="border-line text-text-strong border-b pb-2 text-[17px] font-bold">
                                    추천 리폼 작업
                                </h3>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {MOCK_REPORT.tasks.map((task) => (
                                        <Tag key={task} tone="primary">
                                            {task}
                                        </Tag>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <h3 className="border-line text-text-strong border-b pb-2 text-[17px] font-bold">
                                    예상 난이도
                                </h3>
                                <div className="mt-4">
                                    <DifficultyGauge
                                        level={MOCK_REPORT.difficultyIndex}
                                    />
                                </div>
                            </section>
                        </div>
                    </div>

                    <Button
                        variant="soft"
                        fullWidth
                        className="mt-8"
                        onClick={handleSaveReport}
                    >
                        AI 리폼 리포트 저장
                    </Button>
                    {reportSaved && (
                        <p
                            className="text-primary mt-2 text-center text-[14px]"
                            role="status"
                            aria-live="polite"
                        >
                            리포트가 저장되었습니다.
                        </p>
                    )}
                </Card>

                <Card className="flex h-full flex-col p-6 sm:p-8">
                    <div className="border-line border-b pb-4">
                        <h2 className="text-text-strong text-[22px] font-bold sm:text-[23px]">
                            공식 상담 신청
                        </h2>
                    </div>

                    <form
                        className="mt-6 flex flex-1 flex-col gap-6"
                        onSubmit={handleSubmit}
                        noValidate
                    >
                        <Field label="성명" htmlFor="consult-name" required>
                            <Input
                                id="consult-name"
                                placeholder="성명을 입력해주세요"
                                invalid={submitted && !!nameError}
                                aria-describedby="consult-name-error"
                                value={name}
                                onChange={(event) =>
                                    setName(event.target.value)
                                }
                            />
                            <ReservedError
                                id="consult-name-error"
                                show={submitted && !!nameError}
                                message={nameError}
                            />
                        </Field>

                        <Field
                            label="연락처"
                            htmlFor="consult-contact"
                            required
                        >
                            <Input
                                id="consult-contact"
                                placeholder="연락처를 입력해주세요. (예: 010-1234-5678)"
                                invalid={submitted && !!contactError}
                                aria-describedby="consult-contact-error"
                                value={contact}
                                onChange={(event) =>
                                    setContact(event.target.value)
                                }
                            />
                            <ReservedError
                                id="consult-contact-error"
                                show={submitted && !!contactError}
                                message={contactError}
                            />
                        </Field>

                        <Field
                            label="추가 요청사항"
                            htmlFor="consult-message"
                            optional
                        >
                            <Textarea
                                id="consult-message"
                                placeholder={
                                    "상담 시 전달하고 싶은 요청사항을 입력해주세요.\n예) 스트랩 길이 조절 가능 여부와 예상 비용이 궁금해요."
                                }
                                className="min-h-[160px]"
                                value={message}
                                onChange={(event) =>
                                    setMessage(event.target.value)
                                }
                            />
                        </Field>

                        <div>
                            <Checkbox
                                id="consult-agree"
                                checked={agreed}
                                invalid={submitted && !!agreeError}
                                aria-describedby="consult-agree-error"
                                onChange={(event) =>
                                    setAgreed(event.target.checked)
                                }
                                label={
                                    <>
                                        [필수] 개인정보 수집 및 이용에 동의{" "}
                                        <button
                                            type="button"
                                            className="text-primary underline underline-offset-2"
                                            onClick={() => {
                                                // TODO: 개인정보 처리방침 모달은 추후 별도 작업에서 연동
                                            }}
                                        >
                                            (보기)
                                        </button>
                                    </>
                                }
                            />
                            <ReservedError
                                id="consult-agree-error"
                                show={submitted && !!agreeError}
                                message={agreeError}
                                className="mt-1.5"
                            />
                        </div>

                        <div className="mt-auto flex flex-col gap-2">
                            <Button type="submit" variant="soft" fullWidth>
                                상담 신청하기
                            </Button>
                            {submitSuccess && (
                                <p
                                    className="text-primary text-center text-[15px]"
                                    role="status"
                                    aria-live="polite"
                                >
                                    상담 신청이 접수되었습니다. 담당자가 곧
                                    연락드릴게요.
                                </p>
                            )}
                        </div>
                    </form>
                </Card>
            </div>
        </PageLayout>
    );
}

const StepIcon = ({ status }: { status: StepStatus }) => {
    if (status === "done") {
        return (
            <span
                className="bg-primary flex size-7 shrink-0 items-center justify-center rounded-full text-[14px] text-white"
                aria-hidden="true"
            >
                ✓
            </span>
        );
    }

    if (status === "active") {
        return (
            <span
                className="border-primary flex size-7 shrink-0 items-center justify-center rounded-full border-2"
                aria-hidden="true"
            >
                <span className="bg-primary size-2.5 animate-pulse rounded-full" />
            </span>
        );
    }

    return (
        <span
            className="border-line size-7 shrink-0 rounded-full border-2"
            aria-hidden="true"
        />
    );
};

const ReservedError = ({
    id,
    show,
    message,
    className = "",
}: {
    id?: string;
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

const CheckBadge = () => (
    <span
        className="bg-primary mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] text-white"
        aria-hidden="true"
    >
        ✓
    </span>
);

const DifficultyGauge = ({ level }: { level: number }) => {
    const fillPercent = ((level + 1) / DIFFICULTY_LEVELS.length) * 100;

    return (
        <div>
            <div
                className="h-2 w-full overflow-hidden rounded-full"
                style={{
                    background: `linear-gradient(to right, #f6d9d3 0%, var(--color-danger) ${fillPercent}%, var(--color-line) ${fillPercent}%, var(--color-line) 100%)`,
                }}
                role="img"
                aria-label={`예상 난이도: ${DIFFICULTY_LEVELS[level]}`}
            />
            <ul className="mt-2 flex justify-between text-[13px]">
                {DIFFICULTY_LEVELS.map((label, index) => (
                    <li
                        key={label}
                        className={
                            index === level
                                ? "text-danger font-medium"
                                : "text-text-secondary"
                        }
                    >
                        {label}
                    </li>
                ))}
            </ul>
        </div>
    );
};

const ReportPhoto = ({ file }: { file: File | null }) => {
    const imgRef = useRef<HTMLImageElement>(null);

    /*
     * blob URL은 img 엘리먼트에 직접(ref로) 반영합니다.
     * React state로 다루면 StrictMode의 effect 이중 실행 시
     * "생성 → 정리(해제) → 재실행"이 같은 커밋 안에서 렌더 없이 발생해,
     * 방금 해제된 URL이 화면에 남는 문제가 생깁니다.
     */
    useEffect(() => {
        if (!file || !imgRef.current) return;

        const url = URL.createObjectURL(file);
        imgRef.current.src = url;

        return () => URL.revokeObjectURL(url);
    }, [file]);

    if (!file) {
        return (
            <div className="border-line bg-placeholder text-text-secondary flex aspect-square items-center justify-center rounded-[5px] border">
                <span className="text-[14px]">사진 없음</span>
            </div>
        );
    }

    return (
        <div className="border-line bg-ground aspect-square overflow-hidden rounded-[5px] border">
            <img
                ref={imgRef}
                alt="최종 리폼 결과 사진"
                className="h-full w-full object-cover"
            />
        </div>
    );
};

export default ResultConfirmPage;
