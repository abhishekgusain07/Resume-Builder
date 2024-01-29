import { extractResumeFromSections } from "./extract-resume-from-sections";
import { groupLinesIntoSection } from "./group-lines-into-sections"
import { groupTextItemsIntoLines } from "./group-text-items-into-lines"
import { readPdf } from "./read-pdf"
import { Lines } from "./types"

export const parseResumeFromPdf = async(fileurl: string) => {

    //step1. Read a pdf resume file into text items to prepare for processing
    let textItems = await readPdf(fileurl)

    // step2. group text items into lines
    const lines: Lines = groupTextItemsIntoLines(textItems)

    // step-3. Group these lines into section
    const sections = groupLinesIntoSection(lines)

    // step-4 Extract resume from sections
    const resume = extractResumeFromSections(sections)

    return resume;
};