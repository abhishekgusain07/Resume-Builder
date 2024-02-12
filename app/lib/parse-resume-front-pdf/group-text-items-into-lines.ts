import { text } from "stream/consumers";
import { Lines, Line, TextItems } from "./types";

export const groupTextItemsIntoLines= (textItems: TextItems) : Lines => {
    const lines: Lines = []

    let line: Line = []
    for (let item of textItems) {
        if(item.hasEOL) {
            if(item.text.trim() !== "") {
                line.push({...item})
            }
            lines.push(line)
            line = []
        } else if(item.text.trim() != ""){
            line.push({...item})
        }
    }
    if(line.length > 0) {
        lines.push(line);
    }


    const typicalCharWidth = getCharWidth(lines.flat())

    for (let line of lines) {
        for(let i = line.length-1; i > 0; --i) {
            const  currentItem = line[i]!
            const lefItem = line[i-1]!
            const leftItemXEnd = lefItem.x + lefItem.width
            const distance = currentItem.x - leftItemXEnd
            if(distance <= typicalCharWidth) {
                if(shouldAddSpaceBetweenText(lefItem.text, currentItem.text)) {
                    lefItem.text += " "
                }
                lefItem.text += currentItem.text

                const currentItemXEnd = currentItem.x + currentItem.width
                lefItem.width  = currentItemXEnd - lefItem.x
                line.splice(i, 1)
            }
        }
    }
    return lines;
};


const shouldAddSpaceBetweenText = (leftText:string, rightText:string) => {
    const leftTextEnd =  leftText[leftText.length-1]!
    const rightTextStart = rightText[0]!
    const conditions = [
        [":",",","|","."].includes(leftTextEnd) && rightTextStart != " ",
        leftTextEnd != " " && ["|"].includes(rightTextStart)
    ]

    return conditions.some((condition) => condition)
}

// getting width of the charecter which are most common in respect of its height and font in the whole pdf file
const getCharWidth = (textItems: TextItems): number => {
    textItems = textItems.filter((item) => item.text.trim() != "");

    const heightToCount: {[height: number]: number} = {};
    let commonHeight = 0;
    let HeightMaxCount = 0;

    const fontNameToCount: {[fontName: string]: number} = {}
    let commonFontName = ""
    let fontNameMaxCount = 0;

    for(let item of textItems) {
       const {fontName, height, text } = item
        if(!heightToCount[height]) {
            heightToCount[height] = 0;
        }
        heightToCount[height]++;
        if(heightToCount[height]! > HeightMaxCount) {
            commonHeight = height
            HeightMaxCount = heightToCount[height]!
        }
        if(!fontNameToCount[fontName]) {
            fontNameToCount[fontName] = 0
        }
        fontNameToCount[fontName]+=text.length;
        if(fontNameToCount[fontName]! > fontNameMaxCount) {
            commonFontName = fontName
            fontNameMaxCount = fontNameToCount[fontName]!;
        }
    }

    const commonTextItems = textItems.filter((item) => item.fontName === commonFontName && item.height === commonHeight);


    const [totalWidth, numChars] = commonTextItems.reduce((acc, curr) => {
        const [prevWidth, preChars] = acc;
        return [prevWidth + curr.width, preChars + curr.text.length];
    }, [0, 0]);
    const typicalCharWidth = totalWidth/numChars;
    return typicalCharWidth
};