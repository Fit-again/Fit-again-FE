type TransitionLoadingOverlayProps = {
    title: string;
};

const TransitionLoadingOverlay = ({ title }: TransitionLoadingOverlayProps) => (
    <div className="bg-ground/85 fixed inset-0 z-50 flex items-center justify-center px-5">
        <div
            className="border-line flex w-full max-w-180 flex-col items-center justify-center gap-[30px] rounded-[5px] border-2 bg-white p-[50px] shadow-[4px_4px_4px_#e7e2d8]"
            role="status"
            aria-live="polite"
        >
            <p className="text-primary text-center text-2xl font-bold sm:text-3xl">
                {title}
            </p>
            <span
                className="border-secondary border-t-primary size-[100px] animate-spin rounded-full border-10"
                aria-hidden="true"
            />
        </div>
    </div>
);

export default TransitionLoadingOverlay;
