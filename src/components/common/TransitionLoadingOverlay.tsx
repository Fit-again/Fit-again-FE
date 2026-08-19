type TransitionLoadingOverlayProps = {
    title: string;
};

const TransitionLoadingOverlay = ({ title }: TransitionLoadingOverlayProps) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-5">
        <div
            className="border-line flex min-h-[268px] w-full max-w-180 flex-col items-center justify-center rounded-[5px] border bg-white px-6 py-10 shadow-[5px_7px_2px_rgba(231,226,216,0.85)]"
            role="status"
            aria-live="polite"
        >
            <p className="text-primary text-center text-2xl font-bold sm:text-3xl">
                {title}
            </p>
            <span
                className="border-secondary border-t-primary mt-9 size-20 animate-spin rounded-full border-10"
                aria-hidden="true"
            />
        </div>
    </div>
);

export default TransitionLoadingOverlay;
