import ProgressHeader from "@/components/common/ProgressHeader";
import PageIntro from "@/components/common/PageIntro";
import type { ReactNode } from "react";

type PageLayoutProps = {
    currentStep: number;
    title: string;
    description: string;
    children: ReactNode;
    actions?: ReactNode;
};

const PageLayout = ({
    currentStep,
    title,
    description,
    children,
    actions,
}: PageLayoutProps) => (
    <div className="bg-ground min-h-screen">
        <ProgressHeader currentStep={currentStep} />
        <PageIntro title={title} description={description} />
        <main className="mx-auto w-full max-w-[1240px] px-5 py-8 sm:px-8 lg:py-12 xl:px-0">
            {children}
            {actions && <div className="mt-12">{actions}</div>}
        </main>
    </div>
);

export default PageLayout;
