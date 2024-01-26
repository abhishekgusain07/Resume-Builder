import type { ResumeKey } from "../redux";
export interface TextItem {
    text: string;
    x: number;
    y: number;
    width: number;
    height: number;
    fontName: string;
    hasEOL: boolean;
}

export type TextItems = TextItem[]

export type Line = TextItem[]
export type Lines = Line[]

export type Subsections = Lines[];
export type ResumeSectionToLines = {[sectionName in ResumeKey]? : Lines} & {
    [otherSectionName: string]: Lines;
}


type featureScore = -4|-3|-2|-1|0|1|2|3|4;
type ReturnMatchingTextOnly = boolean
export type FeatureSet = 
    | [(item: TextItem) => boolean, featureScore]
    | [(item: TextItem) => RegExpMatchArray | null,
        featureScore,
        ReturnMatchingTextOnly
];
export interface TextScore {
    text: string;
    score: number;
    match: boolean;
}
export type TextScores = TextScore[]