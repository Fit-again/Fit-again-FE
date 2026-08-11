import Button from "@/components/common/Button";
import { ROUTES } from "@/routes/paths";
import { useNavigate } from "react-router-dom";

const painPoints = [
    "오래 사용하며 불편해진 사용 경험",
    "버리기에는 아까운 추억과 가치",
    "지금의 라이프스타일과 맞지 않는 제품",
];

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-ground min-h-screen">
            <section className="mx-auto flex w-full max-w-[1240px] flex-col items-center gap-12 px-5 py-16 sm:px-8 lg:flex-row lg:items-center lg:gap-16 lg:py-24 xl:px-0">
                <div className="w-full max-w-[560px] text-center lg:text-left">
                    <p className="text-text-secondary text-[17px] sm:text-[18px]">
                        나에게 맞게, 다시 사용하다
                    </p>
                    <h1 className="font-logo text-primary mt-3 text-[56px] leading-none font-bold sm:text-[68px]">
                        Fit:again
                    </h1>
                    <p className="text-primary mt-6 text-[22px] leading-snug font-bold sm:text-[26px]">
                        <span className="sm:block">
                            변화된 라이프스타일에 맞는
                        </span>{" "}
                        <span className="sm:block">
                            가장 적합한 활용 방안을 제안해주는 서비스
                        </span>
                    </p>
                    <p className="text-text-secondary mt-4 text-[16px] sm:text-[17px]">
                        지금 바로 나의 제품을 분석해보세요.
                    </p>
                    <Button
                        className="mt-8 w-full sm:w-auto sm:min-w-[300px]"
                        size="lg"
                        onClick={() => navigate(ROUTES.productRegister)}
                    >
                        시작하기
                    </Button>
                </div>

                <div className="border-line bg-secondary/40 flex aspect-[4/3] w-full max-w-[560px] items-center justify-center rounded-[5px] border">
                    <span className="text-text-secondary px-6 text-center text-[15px]">
                        Before / After 제품 이미지 영역
                    </span>
                </div>
            </section>

            <section className="bg-primary px-5 py-16 sm:px-8 lg:py-20">
                <div className="mx-auto flex w-full max-w-[900px] flex-col items-center text-center">
                    <h2 className="text-[24px] leading-snug font-bold text-white sm:text-[28px]">
                        아직 사용할 수 있지만,
                        <br />
                        지금은 손이 가지 않는 럭셔리 제품이 있으신가요?
                    </h2>

                    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                        {painPoints.map((point) => (
                            <span
                                key={point}
                                className="inline-flex min-h-9 items-center rounded-[50px] border border-white/25 bg-white/10 px-5 py-1.5 text-[15px] text-white/90"
                            >
                                {point}
                            </span>
                        ))}
                    </div>

                    <p className="mt-10 text-[15px] leading-relaxed text-white/70 sm:text-[16px]">
                        제품 상태와 현재 사용 목적을 분석하여 가장 적합한 활용
                        방안을 제안합니다.
                        <br />
                        추천된 활용 방안을 시뮬레이션으로 미리 확인해보세요.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
