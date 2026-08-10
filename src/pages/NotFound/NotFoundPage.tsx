import Button from "@/components/common/Button";
import { ROUTES } from "@/routes/paths";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-ground flex min-h-screen items-center justify-center px-5">
            <div className="text-center">
                <h1 className="text-primary text-[40px] font-bold">404</h1>
                <p className="text-text-secondary mt-4 text-[18px]">
                    존재하지 않는 페이지입니다.
                </p>
                <Button
                    className="mt-8"
                    size="lg"
                    onClick={() => navigate(ROUTES.home)}
                >
                    홈으로 이동
                </Button>
            </div>
        </div>
    );
};

export default NotFoundPage;
