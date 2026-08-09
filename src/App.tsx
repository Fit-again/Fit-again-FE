import crossBagIcon from "@/assets/product-types/cross-bag.png";
import pouchIcon from "@/assets/product-types/pouch.png";
import shoulderBagIcon from "@/assets/product-types/shoulder-bag.png";
import toteBagIcon from "@/assets/product-types/tote-bag.png";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import Modal from "@/components/common/Modal";
import PageActions from "@/components/common/PageActions";
import PageLayout from "@/components/common/PageLayout";
import SelectionCard from "@/components/common/SelectionCard";
import Tag from "@/components/common/Tag";
import UploadArea from "@/components/common/UploadArea";
import { Field, Input, Textarea } from "@/components/common/form/FormControls";
import { useState, type ReactNode } from "react";

type ProductType = {
    id: string;
    label: string;
    icon: ReactNode;
};

const imageIcon = (src: string, alt: string) => (
    <img className="h-16 w-20 object-contain" src={src} alt={alt} />
);

const productTypes: ProductType[] = [
    { id: "tote", label: "토트백", icon: imageIcon(toteBagIcon, "") },
    {
        id: "shoulder",
        label: "숄더백",
        icon: imageIcon(shoulderBagIcon, ""),
    },
    { id: "cross", label: "크로스백", icon: imageIcon(crossBagIcon, "") },
    { id: "backpack", label: "백팩", icon: <BackpackPlaceholderIcon /> },
    { id: "pouch", label: "파우치", icon: imageIcon(pouchIcon, "") },
    { id: "other", label: "기타", icon: <MoreIcon /> },
];

function App() {
    const [selectedType, setSelectedType] = useState("tote");
    const [description, setDescription] = useState("");
    const [fileCount, setFileCount] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <PageLayout
            currentStep={1}
            title="제품 등록"
            description="분석에 필요한 제품 정보와 사진을 등록해주세요."
            actions={
                <PageActions
                    nextLabel="다음 단계"
                    onNext={() => setModalOpen(true)}
                />
            }
        >
            <div className="grid gap-10 lg:grid-cols-[minmax(420px,1fr)_minmax(0,1.45fr)] lg:gap-7">
                <section className="lg:border-line lg:border-r lg:pr-7">
                    <SectionHeading number={1} title="제품 유형 선택" />
                    <p className="text-text-secondary mt-1 text-[18px]">
                        제품 유형을 선택해주세요.
                    </p>
                    <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
                        {productTypes.map(({ id, label, icon }) => (
                            <SelectionCard
                                key={id}
                                label={label}
                                icon={icon}
                                selected={selectedType === id}
                                onClick={() => setSelectedType(id)}
                            />
                        ))}
                    </div>

                    <Card variant="soft" className="mt-8 sm:mt-12 lg:mt-28">
                        <h3 className="border-line border-b pb-2 text-center text-[15px] font-medium">
                            촬영 가이드
                        </h3>
                        <ul className="text-text-secondary mt-3 list-disc space-y-1 pl-5 text-[15px]">
                            <li>정면이 잘 보이도록 촬영해주세요.</li>
                            <li>배경은 단색을 권장합니다.</li>
                            <li>그림자는 최소화해주세요.</li>
                            <li>손상 부위는 가까이 촬영해주세요.</li>
                        </ul>
                    </Card>
                </section>

                <section className="space-y-8">
                    <div>
                        <SectionHeading number={2} title="정면 사진 업로드" />
                        <p className="text-text-secondary mt-1 text-[18px]">
                            제품의 양면이 잘 보이도록 촬영해주세요.
                        </p>
                        <div className="mt-5">
                            <UploadArea
                                label={
                                    fileCount > 0
                                        ? `${fileCount}개 파일 선택됨`
                                        : "정면 사진을 선택해주세요"
                                }
                                description="PNG, JPG 파일을 업로드할 수 있습니다."
                                onFilesSelected={(files) =>
                                    setFileCount(files.length)
                                }
                            />
                        </div>
                    </div>

                    <div>
                        <SectionHeading
                            number={3}
                            title="마모 부위 사진 업로드"
                            detail="최대 5장"
                        />
                        <p className="text-text-secondary mt-1 text-[18px]">
                            손상·마모 부위가 잘 보이도록 다양한 각도로
                            촬영해주세요.
                        </p>
                        <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-5">
                            {Array.from({ length: 5 }, (_, index) => (
                                <div
                                    className={`border-line aspect-square rounded-[5px] border ${index === 0 ? "bg-placeholder" : "bg-white"}`}
                                    key={index}
                                    aria-label={`마모 부위 사진 ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            </div>

            <Card as="section" className="mt-12">
                <div className="border-line flex flex-col justify-between gap-4 border-b pb-[15px] sm:flex-row sm:items-center">
                    <div>
                        <h2 className="text-primary text-[25px] font-bold">
                            공통 컴포넌트 확인
                        </h2>
                        <p className="text-text-secondary mt-1 text-[15px]">
                            폼, 태그, 버튼과 모달의 기본 상태입니다.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Tag>기본 태그</Tag>
                        <Tag tone="primary">선택됨</Tag>
                        <Tag tone="danger">오류</Tag>
                        <Tag tone="after">After</Tag>
                    </div>
                </div>

                <div className="mt-5 grid gap-5 lg:grid-cols-2">
                    <Field label="제품 이름" htmlFor="product-name" required>
                        <Input
                            id="product-name"
                            placeholder="제품 이름을 입력해주세요"
                        />
                    </Field>
                    <Field
                        label="추가 설명"
                        htmlFor="product-description"
                        optional
                    >
                        <Textarea
                            id="product-description"
                            className="min-h-28"
                            placeholder="제품 상태를 입력해주세요"
                            value={description}
                            maxLength={1000}
                            showCount
                            onChange={(event) =>
                                setDescription(event.target.value)
                            }
                        />
                    </Field>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                    <Button size="sm" onClick={() => setModalOpen(true)}>
                        모달 열기
                    </Button>
                    <Button size="sm" variant="outline">
                        보조 버튼
                    </Button>
                    <Button size="sm" variant="soft">
                        연한 버튼
                    </Button>
                    <Button size="sm" disabled>
                        비활성 버튼
                    </Button>
                </div>
            </Card>

            <Modal
                open={modalOpen}
                title="기본 컴포넌트 준비 완료"
                onClose={() => setModalOpen(false)}
            >
                <p>
                    Fit Again의 공통 레이아웃과 기본 UI를 각 화면에서 재사용할
                    수 있도록 구성했습니다.
                </p>
            </Modal>
        </PageLayout>
    );
}

const SectionHeading = ({
    number,
    title,
    detail,
}: {
    number: number;
    title: string;
    detail?: string;
}) => (
    <h2 className="text-text-strong flex flex-wrap items-baseline gap-2 text-[23px] font-bold sm:text-[25px]">
        <span>
            {number}. {title}
        </span>
        {detail && (
            <span className="text-text-secondary text-[18px] font-normal">
                ({detail})
            </span>
        )}
    </h2>
);

function BackpackPlaceholderIcon() {
    return (
        <svg
            className="text-text-secondary h-16 w-16"
            viewBox="0 0 64 64"
            fill="none"
            aria-hidden="true"
        >
            <path
                d="M20 19c0-8 4-13 12-13s12 5 12 13M15 27c0-6 5-11 11-11h12c6 0 11 5 11 11v27H15V27Z"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <rect
                x="22"
                y="31"
                width="20"
                height="14"
                rx="4"
                stroke="currentColor"
                strokeWidth="3"
            />
        </svg>
    );
}

function MoreIcon() {
    return (
        <span className="text-text-secondary flex gap-2" aria-hidden="true">
            <span className="size-3 rounded-full bg-current" />
            <span className="size-3 rounded-full bg-current" />
            <span className="size-3 rounded-full bg-current" />
        </span>
    );
}

export default App;
