import Button from "@/components/common/Button";
import heroBeforeAfter from "@/assets/home/hero-before-after.png";
import { ROUTES } from "@/routes/paths";
import { useReformFlowStore } from "@/stores/useReformFlowStore";
import { useNavigate } from "react-router-dom";

const painPoints = [
    "오래 사용하며 불편해진 사용 경험",
    "버리기에는 아까운 추억과 가치",
    "지금의 라이프스타일과 맞지 않는 제품",
];

const HomePage = () => {
    const navigate = useNavigate();
    const resetFlow = useReformFlowStore((state) => state.resetFlow);

    const handleStart = () => {
        resetFlow();
        navigate(ROUTES.productRegister);
    };

    return (
        <div className="bg-ground flex min-h-dvh w-full flex-col lg:h-dvh lg:overflow-hidden">
            <section className="mx-auto flex w-full max-w-[1240px] flex-col items-center gap-12 px-5 py-16 sm:px-8 lg:h-[60.55dvh] lg:min-h-0 lg:flex-row lg:gap-[70px] lg:py-[clamp(36px,6vh,64px)] xl:px-0">
                <div className="w-full max-w-[598px] text-center lg:text-left">
                    <p className="text-text-strong text-[20px] sm:text-[25px]">
                        나에게 맞게, 다시 사용하다
                    </p>
                    <h1 className="font-logo text-primary mt-5 text-[60px] leading-none font-normal tracking-[0.07em] sm:text-[80px]">
                        Fit:again
                    </h1>
                    <p className="text-primary mt-6 text-[24px] leading-[1.28] font-bold sm:text-[30px]">
                        <span className="sm:block">
                            변화된 라이프스타일에 맞는
                        </span>{" "}
                        <span className="sm:block">
                            가장 적합한 활용 방안을 제안해주는 서비스
                        </span>
                    </p>
                    <p className="text-text-secondary mt-7 text-[17px] sm:text-[18px]">
                        지금 바로 나의 제품을 분석해보세요.
                    </p>
                    <Button
                        className="mx-auto mt-2 w-full max-w-[598px] lg:mx-0"
                        size="lg"
                        onClick={handleStart}
                    >
                        시작하기
                    </Button>
                </div>

                <img
                    className="max-h-[min(424px,48dvh)] w-full max-w-[572px] rounded-[5px] object-cover"
                    src={heroBeforeAfter}
                    alt="리폼 전후 비교, 낡은 갈색 가방이 깨끗한 아이보리색 가방으로 리폼된 모습"
                />
            </section>

            <section className="bg-primary flex flex-1 flex-col items-center justify-center px-5 py-16 sm:px-8 lg:h-[39.45dvh] lg:min-h-0 lg:flex-none lg:py-[clamp(32px,5vh,50px)]">
                <div className="mx-auto flex w-full max-w-[1160px] flex-col items-center text-center">
                    <h2 className="text-[25px] leading-snug font-bold text-white">
                        아직 사용할 수 있지만,
                        <br />
                        지금은 손이 가지 않는 럭셔리 제품이 있으신가요?
                    </h2>

                    <div className="mt-8 flex flex-wrap items-center justify-center gap-[30px]">
                        {painPoints.map((point) => (
                            <span
                                key={point}
                                className="bg-ground/20 inline-flex min-h-[50px] items-center rounded-[5px] px-5 py-2 text-[18px] text-white/90 shadow-[0_0_12.2px_0_rgba(250,248,243,0.5)] sm:text-[24px]"
                            >
                                {point}
                            </span>
                        ))}
                    </div>

                    <p className="mt-10 text-[16px] leading-relaxed text-white/80 sm:text-[18px]">
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
