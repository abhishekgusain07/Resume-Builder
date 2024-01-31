// A wrapper for the dynammic resume on resume-builder screen
import Frame from "react-frame-component";
import { A4_HEIGHT_PX, A4_WIDTH_PT, A4_WIDTH_PX, LETTER_HEIGHT_PX, LETTER_WIDTH_PT, LETTER_WIDTH_PX } from "@/app/lib/constants";
import { useMemo } from "react";
import dynamic from "next/dynamic";


const getIFrameInitialContent = (isA4: boolean) => {
    const width = isA4 ? A4_WIDTH_PT : LETTER_WIDTH_PT;


    return `<!DOCTYPE html>
        <html>
            <head>
                <style>
                </style>
            </head>
            <body style'overflow:hidden; width:${width}pt; margin:0; padding:0; -webkit-text-size-adjust:none;'>
                <div></div>
            </body>
        </html>
    `
}

const ResumeIFrame = ({
    documentSize,
    scale,
    children,
    enablePdfViewer
}:{
    documentSize: string;
    scale: number;
    children: React.ReactNode;
    enablePdfViewer?: boolean
}) => {

    const isA4 = documentSize === "A4";
    const iFrameInitialContent = useMemo(() => getIFrameInitialContent(isA4),[isA4]);

    if(enablePdfViewer) {
        return (
            <></>
        )
    }
    const width = isA4 ? A4_WIDTH_PX : LETTER_WIDTH_PX;
    const height = isA4 ? A4_HEIGHT_PX : LETTER_HEIGHT_PX;

    return (
        <div style={{
            maxWidth: `${width * scale}px`,
            maxHeight: `${height * scale}px`
        }}>
            <div style={{
                width: `${width}px`,
                height: `${height}px`,
                transform: `scale(${scale})`
            }}
                className={`origin-top-left bg-white shadow-lg`}
            >
                {/* it is a iFrame wrapper, iframe-> inline FRAME and is used to embed another HTML document within current document. */}
                <Frame initialContent={iFrameInitialContent}
                style={{width: "100%", height: "100%"}} key={isA4? "A4": "LETTER"}>
                    {children}
                </Frame>
            </div>
        </div>
    )
}

export const ResumeIFrameSSR = dynamic(() => Promise.resolve(ResumeIFrame), {
    ssr: false,
});