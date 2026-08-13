export const downloadReportPdf = async (
    element: HTMLElement,
    fileName: string
) => {
    const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas-pro"),
        import("jspdf"),
    ]);

    const canvas = await html2canvas(element, {
        backgroundColor: "#ffffff",
        scale: 2,
    });
    const imageData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
    });
    const pageMargin = 28;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const contentHeight = pageHeight - pageMargin * 2;
    const imageWidth = pageWidth - pageMargin * 2;
    const imageHeight = (canvas.height * imageWidth) / canvas.width;
    let heightLeft = imageHeight;
    let position = pageMargin;

    pdf.addImage(
        imageData,
        "PNG",
        pageMargin,
        position,
        imageWidth,
        imageHeight
    );
    heightLeft -= contentHeight;

    while (heightLeft > 0) {
        position -= contentHeight;
        pdf.addPage();
        pdf.addImage(
            imageData,
            "PNG",
            pageMargin,
            position,
            imageWidth,
            imageHeight
        );
        heightLeft -= contentHeight;
    }

    pdf.save(fileName);
};
