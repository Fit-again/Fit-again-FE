import PageActions from "@/components/common/PageActions";
import PageLayout from "@/components/common/PageLayout";
import ProcessProgressCard from "@/components/common/ProcessProgressCard";
import ConsultationFormCard from "@/components/result/ConsultationFormCard";
import ResultReportCard from "@/components/result/ResultReportCard";
import { PAIN_POINT_CAUSE_TEXT } from "@/constants/painPointKeywords";
import {
    CONTACT_REGEX,
    DEFAULT_RESOLVED_ISSUES,
    RESULT_STEPS,
} from "@/constants/result";
import { useStepProgress } from "@/hooks/useStepProgress";
import { ROUTES } from "@/routes/paths";
import { useReformFlowStore } from "@/stores/useReformFlowStore";
import { downloadReportPdf } from "@/utils/downloadReportPdf";
import { useRef, useState, type SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";

function ResultConfirmPage() {
    const navigate = useNavigate();
    const frontPhoto = useReformFlowStore((state) => state.frontPhoto);
    const painPointKeywordIds = useReformFlowStore(
        (state) => state.painPointKeywordIds
    );
    const reportRef = useRef<HTMLDivElement>(null);
    const [isSavingReport, setIsSavingReport] = useState(false);
    const [reportSaved, setReportSaved] = useState(false);
    const [reportSaveError, setReportSaveError] = useState(false);
    const [name, setName] = useState("");
    const [contact, setContact] = useState("");
    const [message, setMessage] = useState("");
    const [agreed, setAgreed] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const { completedCount, isComplete, progress } = useStepProgress(
        RESULT_STEPS.length
    );

    if (!isComplete) {
        return (
            <PageLayout
                currentStep={6}
                title="결과"
                description="AI 리폼 리포트를 생성하고 있어요."
            >
                <div className="flex flex-1 items-center justify-center pt-16">
                    <ProcessProgressCard
                        steps={RESULT_STEPS}
                        completedCount={completedCount}
                        progress={progress}
                        progressLabel="결과 생성 진행률"
                    />
                </div>
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

    const handleSaveReport = async () => {
        if (!reportRef.current) return;

        setIsSavingReport(true);
        setReportSaved(false);
        setReportSaveError(false);

        try {
            await downloadReportPdf(reportRef.current, "AI-리폼-리포트.pdf");
            setReportSaved(true);
        } catch (error) {
            console.error(error);
            setReportSaveError(true);
        } finally {
            setIsSavingReport(false);
        }
    };

    const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitted(true);

        if (!nameError && !contactError && !agreeError) {
            // 실제 상담 신청 API 연동 전까지 사용하는 목업 제출 처리입니다.
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
                <ResultReportCard
                    reportRef={reportRef}
                    frontPhoto={frontPhoto}
                    resolvedIssues={resolvedIssues}
                    isSaving={isSavingReport}
                    saved={reportSaved}
                    saveError={reportSaveError}
                    onSave={() => void handleSaveReport()}
                />
                <ConsultationFormCard
                    name={name}
                    contact={contact}
                    message={message}
                    agreed={agreed}
                    submitted={submitted}
                    submitSuccess={submitSuccess}
                    errors={{
                        name: nameError,
                        contact: contactError,
                        agree: agreeError,
                    }}
                    onNameChange={setName}
                    onContactChange={setContact}
                    onMessageChange={setMessage}
                    onAgreementChange={setAgreed}
                    onSubmit={handleSubmit}
                />
            </div>
        </PageLayout>
    );
}

export default ResultConfirmPage;
