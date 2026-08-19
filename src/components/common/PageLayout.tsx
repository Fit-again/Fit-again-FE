import ProgressHeader from "@/components/common/ProgressHeader";
import PageIntro from "@/components/common/PageIntro";
import type { ServiceStep } from "@/constants/serviceSteps";
import type { ReactNode } from "react";

type PageLayoutProps = {
    currentStep: number;
    title: string;
    description: string;
    children: ReactNode;
    actions?: ReactNode;
    contentSpacing?: "default" | "compact";
    steps?: ServiceStep[];
};

const PageLayout = ({
    currentStep,
    title,
    description,
    children,
    actions,
    contentSpacing = "default",
    steps,
}: PageLayoutProps) => (
    <div className="bg-ground flex min-h-dvh w-full flex-col">
        <ProgressHeader currentStep={currentStep} steps={steps} />
        <PageIntro title={title} description={description} />
        <main
            className={`mx-auto flex w-full max-w-[1240px] flex-1 flex-col px-5 pt-8 pb-[25px] sm:px-8 xl:px-0 ${contentSpacing === "compact" ? "lg:pt-[30px]" : "lg:pt-[50px]"}`}
        >
            {children}
            {actions && <div className="mt-auto pt-7">{actions}</div>}
        </main>
    </div>
);

export default PageLayout;
