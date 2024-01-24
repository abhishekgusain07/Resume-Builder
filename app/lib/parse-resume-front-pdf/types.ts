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
export type ResumeSectionToLines =
