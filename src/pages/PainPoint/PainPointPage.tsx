import { Textarea } from "@/components/common/form/FormControls";
import PageActions from "@/components/common/PageActions";
import PageLayout from "@/components/common/PageLayout";
import SectionHeading from "@/components/common/SectionHeading";
import { PAIN_POINT_KEYWORDS } from "@/constants/painPointKeywords";
import { ROUTES } from "@/routes/paths";
import { useReformFlowStore } from "@/stores/useReformFlowStore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const DESCRIPTION_MAX = 1000;

function PainPointPage() {
    const navigate = useNavigate();
    const setPainPoint = useReformFlowStore((state) => state.setPainPoint);
    const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
    const [description, setDescription] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const keywordError =
        selectedKeywords.length === 0
            ? "불편 키워드를 1개 이상 선택해주세요"
            : undefined;

    const toggleKeyword = (id: string) => {
        setSelectedKeywords((prev) =>
            prev.includes(id)
                ? prev.filter((keywordId) => keywordId !== id)
                : [...prev, id]
        );
    };

    const handleNext = () => {
        setSubmitted(true);
        if (!keywordError) {
            setPainPoint({
                painPointKeywordIds: selectedKeywords,
                description,
            });
            navigate(ROUTES.aiAnalysis);
        }
    };

    return (
        <PageLayout
            currentStep={2}
            title="불편 입력"
            description="현재 사용하면서 느끼는 불편함과 원하는 방향을 입력해주세요."
            actions={
                <PageActions
                    nextLabel="AI 분석 시작"
                    onPrevious={() => navigate(ROUTES.productRegister)}
                    onNext={handleNext}
                />
            }
        >
            <div className="grid gap-10 lg:grid-cols-[minmax(420px,1fr)_minmax(0,1.45fr)] lg:gap-7">
                <section className="lg:border-line lg:border-r lg:pr-7">
                    <SectionHeading
                        number={1}
                        title="불편 키워드 선택"
                        detail="복수 선택 가능"
                        required
                        error={submitted ? keywordError : undefined}
                    />
                    <p className="text-text-secondary mt-1 text-[18px]">
                        현재 느끼는 불편함을 선택해주세요.
                    </p>
                    <div className="mt-5 flex flex-wrap gap-4">
                        {PAIN_POINT_KEYWORDS.map(({ id, label }) => (
                            <KeywordToggle
                                key={id}
                                label={label}
                                selected={selectedKeywords.includes(id)}
                                onClick={() => toggleKeyword(id)}
                            />
                        ))}
                    </div>
                </section>

                <section>
                    <SectionHeading number={2} title="추가 설명 입력" />
                    <p className="text-text-secondary mt-1 text-[18px]">
                        현재 느끼는 불편이나 원하는 변화를 자유롭게 입력해주세요
                    </p>
                    <div className="mt-5">
                        <Textarea
                            aria-label="추가 설명 입력"
                            className="min-h-105"
                            placeholder="예) 스트랩이 짧고 어깨가 아파요."
                            maxLength={DESCRIPTION_MAX}
                            showCount
                            value={description}
                            onChange={(event) =>
                                setDescription(event.target.value)
                            }
                        />
                    </div>
                </section>
            </div>
        </PageLayout>
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
