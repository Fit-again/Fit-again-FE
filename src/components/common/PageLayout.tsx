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
    <div className="bg-ground mx-auto flex min-h-[1024px] w-full max-w-[1440px] flex-col">
        <ProgressHeader currentStep={currentStep} />
        <PageIntro title={title} description={description} />
        <main className="mx-auto flex w-full max-w-[1240px] flex-1 flex-col px-5 py-8 sm:px-8 lg:py-12 xl:px-0">
            {children}
            {actions && <div className="mt-auto pt-12">{actions}</div>}
        </main>
    </div>
);

export default PageLayout;
