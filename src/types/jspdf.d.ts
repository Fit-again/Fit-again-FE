declare module "jspdf" {
    type JsPdfOptions = {
        orientation?: "portrait" | "landscape";
        unit?: string;
        format?: string;
    };

    class JsPDF {
        constructor(options?: JsPdfOptions);
        internal: {
            pageSize: {
                getWidth: () => number;
                getHeight: () => number;
            };
        };
        addImage: (
            imageData: string,
            format: string,
            x: number,
            y: number,
            width: number,
            height: number,
            alias?: string,
            compression?: "NONE" | "FAST" | "MEDIUM" | "SLOW"
        ) => void;
        addPage: () => void;
        save: (fileName: string) => void;
    }

    export { JsPDF as jsPDF };
    export default JsPDF;
}
