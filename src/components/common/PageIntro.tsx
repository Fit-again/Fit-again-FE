type PageIntroProps = {
    title: string;
    description: string;
};

const PageIntro = ({ title, description }: PageIntroProps) => (
    <section className="border-line border-b bg-white shadow-[0_6px_5px_0_rgba(231,222,216,0.25)]">
        <div className="mx-auto w-full max-w-[1240px] px-5 py-6 sm:px-8 lg:py-5 xl:px-0">
            <h1 className="text-primary text-[28px] leading-tight font-bold sm:text-[30px]">
                {title}
            </h1>
            <p className="text-primary mt-4 text-[17px] leading-relaxed font-medium sm:text-[20px]">
                {description}
            </p>
        </div>
    </section>
);

export default PageIntro;
