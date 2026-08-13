import Button from "@/components/common/Button";

type PageActionsProps = {
    previousLabel?: string;
    nextLabel: string;
    onPrevious?: () => void;
    onNext: () => void;
    nextDisabled?: boolean;
};

const PageActions = ({
    previousLabel = "이전 단계",
    nextLabel,
    onPrevious,
    onNext,
    nextDisabled = false,
}: PageActionsProps) => (
    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        {onPrevious ? (
            <Button
                className="sm:flex-1 lg:max-w-40"
                variant="outline"
                onClick={onPrevious}
            >
                {previousLabel}
            </Button>
        ) : (
            <span aria-hidden="true" />
        )}
        <Button
            className="sm:flex-[2] lg:max-w-xs"
            onClick={onNext}
            disabled={nextDisabled}
        >
            {nextLabel}
        </Button>
    </div>
);

export default PageActions;
