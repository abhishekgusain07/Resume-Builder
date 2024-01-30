"use client"
import Link from "next/link";
import { useEffect, useState } from "react";
import { TextItems } from "../lib/parse-resume-front-pdf/types";
import { groupTextItemsIntoLines } from "../lib/parse-resume-front-pdf/group-text-items-into-lines";
import { groupLinesIntoSection } from "../lib/parse-resume-front-pdf/group-lines-into-sections";
import { extractResumeFromSections } from "../lib/parse-resume-front-pdf/extract-resume-from-sections";
import { readPdf } from "../lib/parse-resume-front-pdf/read-pdf";
import { FlexBoxSpacer } from "../components/FlexBoxSpacer";
import { Heading } from "../components/documentation/Heading";
import { Paragraph } from "../components/documentation/Paragraph";
import { cx } from "../lib/cx";
import { ResumeDropZone } from "../components/ResumeDropZone";
import { ResumeTable } from "./ResumeTable";
import { initialResumeState } from "../lib/redux/resumeSlice";
import { ResumeParserAlgorightmArticle } from "./ResumeParserAlgorithmArticle";

const RESUME_EXAMPLES = [
    {
      fileUrl: "resume-example/public-resume.pdf",
      description: <span>Took from public sources</span>,
    },
    {
      fileUrl: "resume-example/inhouse-resume.pdf",
      description: (
        <span>
          Created with Inhouse Resume Builder -{" "}
          <Link href="/resume-builder">Link</Link>
        </span>
      ),
    },
];
const defaultFileUrl = RESUME_EXAMPLES[1]["fileUrl"];

export default function ResumeParser() {
    const [fileUrl, setFileUrl] = useState(defaultFileUrl);
    
    const [textItems, setTextItems] = useState<TextItems>([])
    const lines = groupTextItemsIntoLines(textItems || [])
    const sections = groupLinesIntoSection(lines)
    const resume = extractResumeFromSections(sections);

    useEffect(() => {
        async function parse() {
            const textItems = await readPdf(fileUrl);
            setTextItems(textItems)
        }
        parse();
    }, [fileUrl])
    
    return (
        <main className="h-full w-full overflow-hidden">
            <div className="grid md:grid-cols-6">
            <div className="flex justify-center px-2 md:col-span-3 md-h-[calc(100vh-var(--top-nav-bar-height))] md:justify-end">
                <section className="mt-5 grow px-4 md:max-w-[600px] md:px-0">
                    <div className="aspect-h-[9.5] aspect-w-7">
                    <iframe src={`${fileUrl}#navpanes=0`} className="h-full w-full" />
                    </div>
                </section>
                <FlexBoxSpacer maxWidth={45} className="hidden md:block" />
            </div>
            <div className="flex px-6 text-gray-900 md:col-span-3 md-h-[calc(100vh-var(--top-nav-bar-height))] md:overflow-y-scroll">
                    <FlexBoxSpacer maxWidth={45} className="hidden md:block" />
                    <section className="max-w-[600px] grow">
                        <Heading className="text-primary !mt-4">
                            Resume Parser Playground
                        </Heading>
                        <Paragraph smallMarginTop={true}>
                            This Playground showcases the inhouse resume parser and its ability to parser information from a resume PDF. Click around the PDF examples below to observe different parsing result.
                        </Paragraph>
                        <div className="mt-3 flex gap-3">
                            {
                                RESUME_EXAMPLES.map((example, idx) => (
                                    <article key={idx}
                                        className={cx("flex-1 cursor-pointer rounded-md border-2 px-4 py-3 shadow-sm outline-none hover:bg-gray-50 focus:bg-gray-50", example.fileUrl === fileUrl ? "border-blue-400":"border-gray-300")}
                                        onClick = {() => setFileUrl(example.fileUrl)}
                                        onKeyDown={(e) => {
                                            if(["Enter"," "].includes(e.key)) {
                                                setFileUrl(example.fileUrl)
                                            }
                                        }}
                                        tabIndex={0}
                                    >
                                        <h1 className="font-semibold"> Resume Example {idx+1} </h1>
                                        <p className="mt-2 text-sm text-gray-500">
                                            {example.description}
                                        </p>
                                    </article>
                                ))}
                        </div>
                                    <Paragraph>
                                        you can also {" "}
                                        <span className="font-semibold">
                                            Add your resume below
                                        </span> to access how well your resume would be parsed by similar Application tracking system (ATS) used in job application. The more information if can parse out, the better it indicates the resume is well formatted and easy to read.
                                    </Paragraph>
                                    <div className="mt-3">
                                        <ResumeDropZone onFileUrlChange={(fileUrl) => setFileUrl(fileUrl || defaultFileUrl)} playgroundView={true} />
                                    </div>
                                    <Heading level={2} className="!mt-[1.2em]">
                                        Resume Parsing Results
                                    </Heading>
                                    <ResumeTable resume={initialResumeState}/>
                                    <h2>Parsing Algorithms Steps</h2>
                                    <ResumeParserAlgorightmArticle />
                    </section>
                </div>
            </div>
        </main>
    )
}