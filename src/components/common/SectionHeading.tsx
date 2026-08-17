import { ErrorMessage } from "@/components/common/form/FormControls";

type SectionHeadingProps = {
    number: number;
    title: string;
    detail?: string;
    required?: boolean;
    error?: string;
};

const SectionHeading = ({
    number,
    title,
    detail,
    required = false,
    error,
}: SectionHeadingProps) => (
    <h2 className="text-primary flex flex-wrap items-baseline gap-2 text-[23px] font-bold sm:text-[25px]">
        <span>
            {number}. {title}
            {required && !error && (
                <span className="text-danger ml-1" aria-label="필수">
                    *
                </span>
            )}
        </span>
        {detail && (
            <span className="text-text-secondary text-[18px] font-normal">
                ({detail})
            </span>
        )}
        {error && <ErrorMessage>{error}</ErrorMessage>}
    </h2>
);

export default SectionHeading;
