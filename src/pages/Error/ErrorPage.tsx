import Button from "@/components/common/Button";
import { ROUTES } from "@/routes/paths";
import { useEffect } from "react";
import { useNavigate, useRouteError } from "react-router-dom";

const ErrorPage = () => {
    const navigate = useNavigate();
    const error = useRouteError();

    useEffect(() => {
        if (import.meta.env.DEV) {
            console.error(error);
        }
    }, [error]);

    return (
        <main className="bg-ground flex min-h-dvh items-center justify-center px-5 py-12">
            <div className="max-w-lg text-center">
                <h1 className="text-primary text-3xl font-bold sm:text-4xl">
                    화면을 불러오지 못했습니다
                </h1>
                <p className="text-text-secondary mt-4 text-base sm:text-lg">
                    잠시 후 다시 시도하거나 홈으로 이동해주세요.
                </p>
                <Button
                    className="mt-8"
                    size="lg"
                    onClick={() => navigate(ROUTES.home)}
                >
                    홈으로 이동
                </Button>
            </div>
        </main>
    );
};

export default ErrorPage;
