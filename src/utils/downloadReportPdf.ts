const REPORT_WIDTH_PX = 1_120;
const REPORT_IMAGE_TIMEOUT_MS = 15_000;
const REPORT_CANVAS_SCALE = 2;
const REPORT_IMAGE_QUALITY = 0.9;

const prepareReportClone = (element: HTMLElement) => {
    const clone = element.cloneNode(true) as HTMLElement;
    clone.dataset.pdfExportClone = "true";
    clone.setAttribute("aria-hidden", "true");
    Object.assign(clone.style, {
        position: "fixed",
        top: "0",
        left: "-12000px",
        width: `${REPORT_WIDTH_PX}px`,
        minWidth: `${REPORT_WIDTH_PX}px`,
        maxWidth: "none",
        height: "auto",
        minHeight: "0",
        flex: "none",
        backgroundColor: "#ffffff",
    });

    const content = clone.querySelector<HTMLElement>(
        '[data-pdf-layout="content"]'
    );
    if (content) {
        Object.assign(content.style, {
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.1fr)",
            gap: "24px",
            flex: "none",
        });
    }

    clone.querySelectorAll<HTMLImageElement>("img").forEach((image) => {
        const source = image.currentSrc || image.src;
        if (!source.startsWith("http")) return;

        image.removeAttribute("src");
        image.crossOrigin = "anonymous";
        image.src = source;
    });

    document.body.appendChild(clone);
    return clone;
};

const waitForImage = (image: HTMLImageElement) => {
    if (image.complete) {
        return image.naturalWidth > 0
            ? Promise.resolve()
            : Promise.reject(new Error("리포트 이미지를 불러오지 못했습니다."));
    }

    return new Promise<void>((resolve, reject) => {
        const cleanup = () => {
            window.clearTimeout(timeout);
            image.removeEventListener("load", handleLoad);
            image.removeEventListener("error", handleError);
        };
        const handleLoad = () => {
            cleanup();
            resolve();
        };
        const handleError = () => {
            cleanup();
            reject(new Error("리포트 이미지를 불러오지 못했습니다."));
        };
        const timeout = window.setTimeout(() => {
            cleanup();
            reject(new Error("리포트 이미지 로딩 시간이 초과되었습니다."));
        }, REPORT_IMAGE_TIMEOUT_MS);

        image.addEventListener("load", handleLoad, { once: true });
        image.addEventListener("error", handleError, { once: true });
    });
};

export const downloadReportPdf = async (
    element: HTMLElement,
    fileName: string
) => {
    const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas-pro"),
        import("jspdf"),
    ]);

    const exportElement = prepareReportClone(element);

    try {
        if (document.fonts) await document.fonts.ready;
        await Promise.all(
            Array.from(exportElement.querySelectorAll("img"), waitForImage)
        );

        let captureError: Error | null = null;
        const canvas = await html2canvas(exportElement, {
            allowTaint: false,
            backgroundColor: "#ffffff",
            imageSmoothing: true,
            imageSmoothingQuality: "high",
            imageTimeout: REPORT_IMAGE_TIMEOUT_MS,
            logging: false,
            scale: REPORT_CANVAS_SCALE,
            useCORS: true,
            windowWidth: REPORT_WIDTH_PX,
            onError: (error) => {
                captureError = error;
            },
        });
        if (captureError) {
            throw new Error("리포트에 포함된 리소스를 불러오지 못했습니다.");
        }
        if (canvas.width <= 0 || canvas.height <= 0) {
            throw new Error("리포트 내용을 이미지로 변환하지 못했습니다.");
        }

        const imageData = canvas.toDataURL("image/jpeg", REPORT_IMAGE_QUALITY);
        const pdf = new jsPDF({
            orientation: "landscape",
            unit: "pt",
            format: "a4",
        });
        const pageMargin = 28;
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const contentHeight = pageHeight - pageMargin * 2;
        const imageWidth = pageWidth - pageMargin * 2;
        const imageHeight = (canvas.height * imageWidth) / canvas.width;
        const imageAlias = "fit-again-reform-report";
        let heightLeft = imageHeight;
        let position = pageMargin;

        pdf.addImage(
            imageData,
            "JPEG",
            pageMargin,
            position,
            imageWidth,
            imageHeight,
            imageAlias,
            "FAST"
        );
        heightLeft -= contentHeight;

        while (heightLeft > 0) {
            position -= contentHeight;
            pdf.addPage();
            pdf.addImage(
                imageData,
                "JPEG",
                pageMargin,
                position,
                imageWidth,
                imageHeight,
                imageAlias,
                "FAST"
            );
            heightLeft -= contentHeight;
        }

        pdf.save(fileName);
    } finally {
        exportElement.remove();
    }
};
