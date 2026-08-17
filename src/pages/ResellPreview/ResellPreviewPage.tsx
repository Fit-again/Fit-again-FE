import Card from "@/components/common/Card";
import PageActions from "@/components/common/PageActions";
import PageLayout from "@/components/common/PageLayout";
import Tag from "@/components/common/Tag";
import { useObjectUrlImage } from "@/hooks/useObjectUrlImage";
import { ROUTES } from "@/routes/paths";
import { useReformFlowStore } from "@/stores/useReformFlowStore";
import { useNavigate } from "react-router-dom";

const MATCHING_USERS = [
    {
        title: "가볍게 외출하는 간결한 스타일의 사용자",
        description:
            "출퇴근용으로 사용하면서 발생한 어깨 부담과 외관 마모를 개선하기 위해 기능 개선 중심의 리폼을 추천합니다.",
        tags: ["#간결한 소지품", "#짧은 외출"],
    },
    {
        title: "토트백을 주로 사용하는 사용자",
        description:
            "장시간 어깨에 메기보다 손이나 팔에 들고 이동하는 방식을 선호해요.",
        tags: ["#토트백 사용", "#더블 핸들 활용"],
    },
    {
        title: "이동 시간이 짧거나 차량 이동이 많은 사용자",
        description:
            "장시간 가방을 메고 이동하기보다 차량 이동이나 짧은 외출이 많아 무게 부담이 상대적으로 적어요.",
        tags: ["#차량 이동", "#짧은 이동"],
    },
];

const VALUE_FACTORS = {
    negative: [
        "핸들 / 가죽 마모",
        "수납 공간 부족",
        "무게감",
        "스트랩 흘러내림",
    ],
    positive: [
        "더블 핸들 디자인",
        "탈부착 스트랩",
        "사이드 포켓 구조",
        "유연한 가죽 소재",
    ],
};

function ResellPreviewPage() {
    const navigate = useNavigate();
    const frontPhoto = useReformFlowStore((state) => state.frontPhoto);

    return (
        <PageLayout
            currentStep={5}
            title="리셀 미리보기"
            description="나에게는 불편했던 이 제품, 누구에게는 잘 맞을까요?"
            contentSpacing="compact"
            actions={
                <PageActions
                    nextLabel="결과 보기"
                    onPrevious={() => navigate(ROUTES.solutionRecommend)}
                    onNext={() => navigate(ROUTES.resultConfirm)}
                />
            }
        >
            <div className="-mt-4 grid gap-7 lg:grid-cols-[minmax(0,490px)_minmax(0,1fr)] lg:gap-[30px]">
                <section>
                    <h2 className="text-primary text-[23px] font-bold sm:text-[25px]">
                        분석한 제품
                    </h2>
                    <Card className="mt-4 p-5">
                        <AnnotatedProductPhoto file={frontPhoto} />
                        <div className="mt-4 flex flex-col gap-3 text-[15px]">
                            <p className="text-danger flex items-center gap-2">
                                <FactorBadge tone="danger" />
                                단점으로 작용할 수 있는 요소
                            </p>
                            <p className="text-after flex items-center gap-2">
                                <FactorBadge tone="after" />
                                장점으로 작용할 수 있는 요소
                            </p>
                        </div>
                    </Card>
                    <p className="text-text-secondary mt-4 text-[14px] leading-relaxed">
                        ※ AI 분석은 등록하신 사진을 기반으로 한 참고 정보이며,
                        실제 제품 상태와 다를 수 있습니다.
                    </p>
                </section>

                <section>
                    <h2 className="text-primary text-[23px] font-bold sm:text-[25px]">
                        이 제품과 잘 맞을 수 있는 사용자
                    </h2>
                    <div className="mt-4 flex flex-col gap-3">
                        {MATCHING_USERS.map((user) => (
                            <Card key={user.title} className="p-3">
                                <h3 className="text-primary text-[17px] font-bold">
                                    {user.title}
                                </h3>
                                <p className="mt-1 text-[15px] leading-relaxed">
                                    {user.description}
                                </p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {user.tags.map((tag) => (
                                        <Tag key={tag} tone="soft">
                                            {tag}
                                        </Tag>
                                    ))}
                                </div>
                            </Card>
                        ))}
                    </div>

                    <h2 className="text-primary mt-7 text-[23px] font-bold sm:text-[25px]">
                        리셀 가치에 영향을 주는 요소
                    </h2>
                    <Card className="mt-4 grid gap-6 p-5 sm:grid-cols-2">
                        <ValueFactorList
                            title="가치에 영향을 줄 수 있는 요소"
                            tone="danger"
                            items={VALUE_FACTORS.negative}
                        />
                        <ValueFactorList
                            title="가치를 유지하는 요소"
                            tone="after"
                            items={VALUE_FACTORS.positive}
                        />
                    </Card>
                </section>
            </div>
        </PageLayout>
    );
}

const AnnotatedProductPhoto = ({ file }: { file: File | null }) => {
    const imageRef = useObjectUrlImage(file);

    return (
        <div className="border-line bg-ground relative aspect-square overflow-hidden rounded-[5px] border">
            {file ? (
                <img
                    ref={imageRef}
                    alt="리셀 분석 제품"
                    className="h-full w-full object-cover"
                />
            ) : (
                <span className="text-text-secondary absolute inset-0 flex items-center justify-center text-sm">
                    사진 없음
                </span>
            )}
            <PhotoMarker
                tone="after"
                number={1}
                className="top-[20%] left-[34%]"
            />
            <PhotoMarker
                tone="danger"
                number={1}
                className="top-[30%] right-[18%]"
            />
            <PhotoMarker
                tone="after"
                number={2}
                className="top-[43%] left-[12%]"
            />
            <PhotoMarker
                tone="danger"
                number={2}
                className="top-[40%] right-[35%]"
            />
            <PhotoMarker
                tone="after"
                number={3}
                className="top-[63%] left-[10%]"
            />
            <PhotoMarker
                tone="danger"
                number={3}
                className="top-[61%] right-[8%]"
            />
            <PhotoMarker
                tone="after"
                number={4}
                className="bottom-[12%] left-[7%]"
            />
            <PhotoMarker
                tone="danger"
                number={4}
                className="right-[17%] bottom-[8%]"
            />
        </div>
    );
};

const PhotoMarker = ({
    tone,
    number,
    className,
}: {
    tone: "danger" | "after";
    number: number;
    className: string;
}) => (
    <span
        className={`absolute flex size-5 items-center justify-center rounded-full text-[11px] font-bold text-white shadow before:absolute before:size-10 before:rounded-full before:border before:border-dashed ${tone === "danger" ? "bg-danger before:border-danger" : "bg-after before:border-after"} ${className}`}
        aria-hidden="true"
    >
        {number}
    </span>
);

const FactorBadge = ({ tone }: { tone: "danger" | "after" }) => (
    <span
        className={`flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] text-white ${tone === "danger" ? "bg-danger" : "bg-after"}`}
        aria-hidden="true"
    >
        ✓
    </span>
);

const ValueFactorList = ({
    title,
    tone,
    items,
}: {
    title: string;
    tone: "danger" | "after";
    items: string[];
}) => (
    <div>
        <h3
            className={`text-[16px] font-bold ${tone === "danger" ? "text-danger" : "text-after"}`}
        >
            {title}
        </h3>
        <div className="mt-4 flex flex-wrap gap-2">
            {items.map((item) => (
                <Tag key={item} tone={tone === "danger" ? "danger" : "soft"}>
                    {item}
                </Tag>
            ))}
        </div>
    </div>
);

export default ResellPreviewPage;
