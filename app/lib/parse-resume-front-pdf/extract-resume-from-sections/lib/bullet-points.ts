import { isAllOf } from "@reduxjs/toolkit";
import { Line, Lines, TextItem } from "../../types";




export const BULLET_POINTS = [
    "⋅",
    "∙",
    "🞄",
    "•",
    "⦁",
    "⚫︎",
    "●",
    "⬤",
    "⚬",
    "○",
];

const getFirstBulletPointLineIdx = (lines: Lines): number|undefined => {
    for(let i = 0; i < lines.length; ++i) {
        for (let item of lines[i]) {
            if(BULLET_POINTS.some((bullet) => item.text.includes(bullet))) {
                return i;
            }
        }
    }
    return undefined;
}
const isWord = (str: string) => /^[^0-9]+$/.test(str)

export const hasAtleast8Words = (item: TextItem) => {
    return item.text.split(/\s/).filter((s) => isWord(s)).length >= 8
}
export const getDescriptionsLineIdx = (lines: Lines): number | undefined => {
    let idx = getFirstBulletPointLineIdx(lines);
    if(idx === undefined) {
        for(let i = 0; i < lines.length; ++i) {
            const line = lines[i]
            if(line.length == 1 && hasAtleast8Words(line[0])) {
                idx = i;
                break;
            }
        }
    }
    return idx;
}
// we pass lines into this function and it gives the lines back in bullet points.
// used after we parse the resume and try to rebuild it.
export const getbulletPointsFromLines = (lines: Lines): string[] => {
    const firstBulletPointsLineIndex =  getFirstBulletPointLineIdx(lines)
    if(firstBulletPointsLineIndex === undefined) {
        return lines.map((line) => line.map((item) => item.text).join(" "));
    }
    let lineStr = ""
    for(let item of lines.flat()) {
        const text = item.text
        if(!lineStr.endsWith(" ") && !text.startsWith(" ")) {
            lineStr += " ";
        }
        lineStr += text;
    }

    const commonBulletPoint = getMostCommonBulletPoint(lineStr)

    const firstBulletPointIndex = lineStr.indexOf(commonBulletPoint);
    if(firstBulletPointIndex !== -1) {
        lineStr = lineStr.slice(firstBulletPointIndex)
    }
    return lineStr.split(commonBulletPoint).map((text)=>text.trim()).filter((text) => !!text)
}

// this function takes input as string, and tells which style of bullet point is most frequently present in the string.
const getMostCommonBulletPoint = (str: string):string => {
    const bulletToCount: { [bullet: string]:number } = BULLET_POINTS.reduce((acc: {[bullet: string]:number},curr) => {
        acc[curr] = 0
        return acc ;
    },{});

    let bulletWithMostCount = BULLET_POINTS[0]
    let bulletMaxCount = 0
    for(let char of str) {
        if(bulletToCount.hasOwnProperty(char)) {
            bulletToCount[char] += 1;
            if(bulletToCount[char] > bulletMaxCount) {
                bulletMaxCount = bulletToCount[char]
                bulletWithMostCount = char
            }
        }
    }
    return bulletWithMostCount;
}