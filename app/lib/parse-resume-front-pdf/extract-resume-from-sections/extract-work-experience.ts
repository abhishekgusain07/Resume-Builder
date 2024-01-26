import { ResumeWorkExperience } from "../../redux";
import { isBold } from "../group-lines-into-sections";
import { FeatureSet, ResumeSectionToLines, Subsections, TextItem } from "../types";
import { hasAllNumbers } from "./extract-profile";
import { getDescriptionsLineIdx, getbulletPointsFromLines } from "./lib/bullet-points";
import { DATE_FEATURE_SET, getHasText } from "./lib/common-features";
import { getTextWithHighestFeatureScore } from "./lib/feature-scoring-system";
import { getSectionLinesByKeywords } from "./lib/get-section-lines";
import { divideSectionIntoSubsections } from "./lib/subsections";


const WORK_EXPERIENCE_KEYWORD_LOWERCASE = [
    "work",
    "experience",
    "employement",
    "history",
    "job"
];

const JOB_TITLES = [
    "Analyst",
    "Agent",
    "Administrator",
    "Developer",
    "Architect",
    "Assitant",
    "Associate",
    "Fullstack Developer",
    "CTO",
    "Manager"
]

// checking if item has any job title in it
const hasAJobTitle = (item: TextItem) => JOB_TITLES.some((jobTitle) => item.text.split(/\s/).some((word) => word === jobTitle));

const hasMoreThan5Words = (item: TextItem) => item.text.split(/\s/).length > 5

// feature list for job
const JOB_FEATURE_LIST: FeatureSet[] = [
    [hasAJobTitle, 4],
    [hasAllNumbers, -4],
    [hasMoreThan5Words, -2]
]



export const extractWorkExperience = (sections: ResumeSectionToLines) => {
    const workExperiences: ResumeWorkExperience[] = []
    const workExperiencesScore = []

    const lines = getSectionLinesByKeywords(
        sections,
        WORK_EXPERIENCE_KEYWORD_LOWERCASE
    );

    // dividing into subsections.
    const subsections: Subsections = divideSectionIntoSubsections(lines)

    for(const subsectionLines of subsections) {
        const descriptionLineIdx = getDescriptionsLineIdx(subsectionLines) ?? 2

        const subsectionInfoTextItems = subsectionLines.slice(0, descriptionLineIdx).flat();

        const [date, dateScores] = getTextWithHighestFeatureScore(
            subsectionInfoTextItems,
            DATE_FEATURE_SET
        );

        const [jobTitle, jobTitleScore] = getTextWithHighestFeatureScore(
            subsectionInfoTextItems,
            JOB_FEATURE_LIST
        );
        
        
        // Feature Set of a company
        const COMPANY_FEATURE_SET: FeatureSet[] = [
            [isBold, 2],
            [getHasText(date), -4],
            [getHasText(jobTitle), -4]
        ]
        const [company, companyScores] =  getTextWithHighestFeatureScore(
            subsectionInfoTextItems,
            COMPANY_FEATURE_SET
        );

        const subsectionDescriptionLines = subsectionLines.slice(descriptionLineIdx)
        const descriptions = getbulletPointsFromLines(subsectionDescriptionLines)

        workExperiences.push({company,jobTitle,date,descriptions});
        workExperiencesScore.push({companyScores,jobTitleScore,dateScores})
    }

    return {workExperiences, workExperiencesScore}
}