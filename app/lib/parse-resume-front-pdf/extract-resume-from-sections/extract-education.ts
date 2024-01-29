import { ResumeEducation } from "@/app/lib/redux";
import { FeatureSet, Lines, ResumeSectionToLines, Subsections, TextItem, TextScores } from "../types";
import { getSectionLinesByKeywords } from "./lib/get-section-lines";
import { divideSectionIntoSubsections } from "./lib/subsections";
import { getTextWithHighestFeatureScore } from "./lib/feature-scoring-system";
import { hasAllNumbers, hasComma } from "./extract-profile";
import { hasLetter } from "../group-lines-into-sections";
import { DATE_FEATURE_SET } from "./lib/common-features";
import { getDescriptionsLineIdx, getbulletPointsFromLines } from "./lib/bullet-points";


// necessary for builds
type Education = {
    school: string;
    degree: string;
    gpa: string;
    date: string;
    descriptions: string[];
};

type EducationScores = {
    schoolScores: TextScores;
    degreeScores: TextScores;
    gpaScores: TextScores;
    dateScores: TextScores;
}
const SCHOOLS = ["College","University","Institue", "School", "Academy"]
export const hasSchool = (item: TextItem) => {
    return SCHOOLS.some((school) => item.text.includes(school));
}

const DEGREES = ["Bachelor", "Master", "PHD", "Ph."]
export const hasDegree = (item: TextItem) => {
    return DEGREES.some((degree) => item.text.includes(degree)) || /[ABM][A-Z\.]/.test(item.text)
}

export const matchGPA = (item: TextItem) => item.text.match(/[0-9]\.[0-9]\d{1,2}/)

export const matchGrade = (item: TextItem) => {
    const grade = parseFloat(item.text);
    if(Number.isFinite(grade) && grade <= 10) {
        return [String(grade)] as RegExpMatchArray
    }
    return null;
};

// feature sets
export const SCHOOL_FEATURE_SET: FeatureSet[] = [
    [hasSchool, 4],
    [hasDegree, -4],
    [hasAllNumbers, -4],
]

const DEGREE_FEATURE_SET: FeatureSet[] = [
    [hasDegree, 4],
    [hasSchool, -4],
    [hasAllNumbers, -3]
]
const GPA_FEATURE_SET: FeatureSet[] = [
    [matchGPA, 4, true],
    [matchGrade, 3, true],
    [hasComma, -3],
    [hasLetter, -4]
]
export const extractEducation = (sections: ResumeSectionToLines) => {
    const educations : ResumeEducation[] = []
    const eductaionScores: EducationScores[]= []
    const lines: Lines = getSectionLinesByKeywords(sections, ["education"]);
    const subsections: Subsections = divideSectionIntoSubsections(lines)
    ;

    for(const subsectionLines of subsections) {
        const textItem = subsectionLines.flat();
        const [school, schoolScores] = getTextWithHighestFeatureScore(
            textItem,
            SCHOOL_FEATURE_SET
        )
        const [degree, degreeScores] = getTextWithHighestFeatureScore(
            textItem, 
            DEGREE_FEATURE_SET
        )
        const [gpa, gpaScores] = getTextWithHighestFeatureScore(
            textItem,
            GPA_FEATURE_SET
        )
        const [date, dateScores] = getTextWithHighestFeatureScore(
            textItem, 
            DATE_FEATURE_SET
        )

        let descriptions: string[] = []
        const descriptionIdx = getDescriptionsLineIdx(subsectionLines)
        if(descriptionIdx !== undefined) {
            const descriptionLines = subsectionLines.slice(descriptionIdx)
            descriptions = getbulletPointsFromLines(descriptionLines)
        }

        educations.push({school, degree, gpa, date, descriptions})
        eductaionScores.push({ schoolScores, degreeScores, gpaScores, dateScores })

        if(educations.length != 0) {
            const courseLines: Lines = getSectionLinesByKeywords(sections, ["course"]);
            if(courseLines.length != 0) {
                educations[0].descriptions.push(
                    "Courses: " + courseLines.flat().map((item:TextItem)=>item.text).join(" ")
                )
            };
        }
        return {educations, eductaionScores}
    }
};
