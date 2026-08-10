import Button from "@/components/common/Button";
import { ROUTES } from "@/routes/paths";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-ground flex min-h-screen items-center justify-center px-5">
            <div className="text-center">
                <h1 className="font-logo text-primary text-[40px] font-bold">
                    Fit:again
                </h1>
                <p className="text-text-secondary mt-4 text-[18px]">
                    낡은 제품을 사진 한 장으로 새롭게 리폼해보세요.
                </p>
                <Button
                    className="mt-8"
                    size="lg"
                    onClick={() => navigate(ROUTES.productRegister)}
                >
                    시작하기
                </Button>
            </div>
        </div>
    );
};

export default HomePage;
