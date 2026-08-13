const RouteLoading = () => (
    <main
        className="bg-ground text-primary flex min-h-screen items-center justify-center"
        aria-busy="true"
    >
        <p className="text-[18px] font-medium" role="status">
            화면을 불러오는 중...
        </p>
    </main>
);

export default RouteLoading;
