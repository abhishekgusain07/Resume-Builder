import { FORMERR } from "dns";
import { Line, Lines, Subsections } from "../../types";
import { isBold } from "../../group-lines-into-sections";


export const divideSectionIntoSubsections = (lines: Lines): Subsections => {
    const isLineNewSubsectionByLineGap = createIsLineNewSubsectionByLineGap(lines)

    let subsections = createSubsections(lines, isLineNewSubsectionByLineGap)

    if(subsections.length === 1) {
        const isLineNewSubsectionByBold = (line: Line, prevLine: Line): boolean => {
            if(isBold(prevLine[0]!) && isBold(line[0]!)) {
                return true;
            }
            return false;
        };
        subsections = createSubsections(lines, isLineNewSubsectionByBold);
    }
    return subsections;
}


// just type so that below function is typesafe,
type isLineANewSubsection = (line: Line, prevLine: Line) => boolean;



// creating a function which will tel us if 2 lines deserve a seprate section or not, are they too far to be in one section.
const createIsLineNewSubsectionByLineGap = (lines: Lines): isLineANewSubsection => {
    const lineGapToCount :{[lineGap: number]: number} = {}

    const linesY = lines.map((line) => line[0]!.y)

    let lineGapWithMostCount : number = 0
    let maxCount = 0

    for (let i = 1; i < linesY.length; ++i) {
        const lineGap = Math.round(linesY[i-1]!-linesY[i]!)
        if(!lineGapToCount[lineGap]) {
            lineGapToCount[lineGap] = 1;
        } 
        lineGapToCount[lineGap] += 1;
        if(lineGapToCount[lineGap]! > maxCount) {
            maxCount = lineGapToCount[lineGap]!
            lineGapWithMostCount = lineGap
        }
    }

    const subsectionGapThreshold = lineGapWithMostCount * 1.4;

    const isLineNewSubsection = (line: Line, prevLine: Line) => {
        return Math.round(prevLine[0]!.y - line[0]!.y) > subsectionGapThreshold
    }
    return isLineNewSubsection;
}

// now the actual functino to create subsections

export const createSubsections = (
    lines: Lines,
    isLineANewSubsection: isLineANewSubsection
) : Subsections => {
    const subsections: Subsections = []

    let subsection: Lines = []

    for(let i = 0; i < lines.length; ++i) {
        const line = lines[i];
        if(i === 0) {
            subsection.push(line!)
            continue;
        }
        if(isLineANewSubsection(lines[i]!, lines[i-1]!)) {
            subsections.push(subsection)
            subsection = []
        }
        subsection.push(line!)
    }
    if(subsection.length > 0) {
        subsections.push(subsection);
    }
    return subsections;
}