import { ResumeProject } from "../../redux";
import { isBold } from "../group-lines-into-sections";
import { FeatureSet, Lines, ResumeSectionToLines, Subsections, TextScores } from "../types";
import { getDescriptionsLineIdx, getbulletPointsFromLines } from "./lib/bullet-points";
import { DATE_FEATURE_SET, getHasText } from "./lib/common-features";
import { getTextWithHighestFeatureScore } from "./lib/feature-scoring-system";
import { getSectionLinesByKeywords } from "./lib/get-section-lines";
import { divideSectionIntoSubsections } from "./lib/subsections";

// for build
type ProjectScores = {
    projectScore: TextScores;
    dateScores: TextScores;
}
export const extractProject = (sections: ResumeSectionToLines) => {
    const projects: ResumeProject[] = []
    const projectscores: ProjectScores[] = []
    const lines: Lines = getSectionLinesByKeywords(sections, ["project"])!
    const subsections:Subsections = divideSectionIntoSubsections(lines);
    for(const subsectionLines of subsections) {
        const descriptionIdx = getDescriptionsLineIdx(subsectionLines) ?? 1;
        
        const subsectionInfoTextItems = subsectionLines.slice(0, descriptionIdx).flat();

        const [date, dateScores] = getTextWithHighestFeatureScore(
            subsectionInfoTextItems,
            DATE_FEATURE_SET
        )

        const PROJECT_FEATURE_SET: FeatureSet[] = [
            [isBold, 2],
            [getHasText(date||""), -4]
        ]

        const [project, projectScore] = getTextWithHighestFeatureScore(
            subsectionInfoTextItems,
            PROJECT_FEATURE_SET,
            false
        )


        const descriptionLines = subsectionLines.slice(descriptionIdx)
        const descriptions = getbulletPointsFromLines(descriptionLines)
        projects.push({
            project:project||"", 
            date:date||"",
            descriptions
        })
        projectscores.push({
            projectScore,
            dateScores
        })
    }
    return {projects, projectscores}

}