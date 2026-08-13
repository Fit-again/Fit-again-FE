import PageActions from "@/components/common/PageActions";
import PageLayout from "@/components/common/PageLayout";
import Modal from "@/components/common/Modal";
import ConsultationFormCard from "@/components/result/ConsultationFormCard";
import ResultReportCard from "@/components/result/ResultReportCard";
import { PAIN_POINT_CAUSE_TEXT } from "@/constants/painPointKeywords";
import { DEFAULT_RESOLVED_ISSUES } from "@/constants/result";
import { ROUTES } from "@/routes/paths";
import { useReformFlowStore } from "@/stores/useReformFlowStore";
import { downloadReportPdf } from "@/utils/downloadReportPdf";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function ResultConfirmPage() {
    const navigate = useNavigate();
    const frontPhoto = useReformFlowStore((state) => state.frontPhoto);
    const selectedSolution = useReformFlowStore(
        (state) => state.selectedSolution
    );
    const painPointKeywordIds = useReformFlowStore(
        (state) => state.painPointKeywordIds
    );
    const reportRef = useRef<HTMLDivElement>(null);
    const [isSavingReport, setIsSavingReport] = useState(false);
    const [reportSaved, setReportSaved] = useState(false);
    const [reportSaveError, setReportSaveError] = useState(false);
    const [agreementOpen, setAgreementOpen] = useState(false);
    const [submittedAt, setSubmittedAt] = useState<Date | null>(null);
    const resolvedIssues =
        painPointKeywordIds.length > 0
            ? painPointKeywordIds.map((id) => PAIN_POINT_CAUSE_TEXT[id] ?? id)
            : DEFAULT_RESOLVED_ISSUES;
    const previousRoute = {
        reform: ROUTES.reformSimulation,
        resell: ROUTES.resellPreview,
        upcycle: ROUTES.upcyclePreview,
    }[selectedSolution];

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

    return (
        <>
            <PageLayout
                currentStep={6}
                title="결과 확인"
                description="AI 리폼 리포트를 확인하고 저장하거나 공식 상담을 신청할 수 있습니다."
                actions={
                    <PageActions
                        nextLabel="홈으로"
                        onPrevious={() => navigate(previousRoute)}
                        onNext={() => navigate(ROUTES.home)}
                    />
                }
            >
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
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
                        onViewAgreement={() => setAgreementOpen(true)}
                        onSubmit={() => setSubmittedAt(new Date())}
                    />
                </div>
            </PageLayout>

            <Modal
                open={agreementOpen}
                title="개인정보 수집 및 이용 동의"
                onClose={() => setAgreementOpen(false)}
            >
                <AgreementContent />
            </Modal>

            <Modal
                open={submittedAt !== null}
                title="공식 상담 신청 완료"
                onClose={() => setSubmittedAt(null)}
            >
                <ConsultationComplete submittedAt={submittedAt} />
            </Modal>
        </>
    );
}

const AgreementContent = () => (
    <div className="space-y-5 text-[15px] leading-relaxed sm:text-[16px]">
        <p>원활한 상담 진행을 위해 아래와 같이 개인정보를 수집·이용합니다.</p>
        <section>
            <h3 className="font-medium">1. 수집 및 이용 목적</h3>
            <p>
                - AI 기반 상품 분석 결과를 바탕으로 한 맞춤형 상담 서비스 제공
            </p>
            <p>- 견적 안내, 매입·위탁 진행 절차 안내 및 고객 문의 처리</p>
        </section>
        <section>
            <h3 className="font-medium">2. 수집하는 개인정보 항목</h3>
            <p>- 필수 항목: 이름, 휴대폰 번호</p>
            <p>- 서비스 이용 과정에서 생성되는 정보: AI 분석 데이터</p>
        </section>
        <section>
            <h3 className="font-medium">3. 보유 및 이용 기간</h3>
            <p>
                - 상담 접수일로부터 6개월 보존 후 파기합니다. 관계 법령에 따라
                보존할 필요가 있는 경우 해당 기간까지 보관합니다.
            </p>
        </section>
        <section>
            <h3 className="font-medium">4. 동의 거부 권리 및 불이익</h3>
            <p>
                - 이용자는 개인정보 수집 및 이용에 대한 동의를 거부할 권리가
                있습니다. 단, 동의 거부 시 상담 서비스 제공이 불가합니다.
            </p>
        </section>
    </div>
);

const ConsultationComplete = ({
    submittedAt,
}: {
    submittedAt: Date | null;
}) => (
    <div className="text-center">
        <p>등록해주신 상품의 상담 접수가 정상적으로 완료되었습니다.</p>
        <div className="bg-ground mt-6 rounded-[5px] p-5">
            <p className="text-primary font-medium">접수 일시</p>
            <p className="mt-1">
                {submittedAt?.toLocaleString("ko-KR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                })}
            </p>
            <div className="border-line mt-5 border-t pt-4">
                <p className="text-primary font-medium">예상 연락 시간</p>
                <p className="mt-1">영업시간 내 접수 시 평균 1~2시간 이내</p>
                <p>영업시간 외 접수 시 다음 영업일 오전 10시 이후 순차 안내</p>
            </div>
        </div>
        <p className="text-text-secondary mt-5 text-left text-[14px]">
            ※ 상담원 운영시간: 평일 09:30 ~ 18:00 (주말/공휴일 제외)
        </p>
    </div>
);

export default ResultConfirmPage;
