import { ResumeSkills } from "../../redux";
import { initialFeaturedSkills } from "../../redux/resumeSlice";
import { deepClone } from "../deep-clone";
import { Lines, ResumeSectionToLines, TextItems } from "../types";
import { getDescriptionsLineIdx, getbulletPointsFromLines } from "./lib/bullet-points";
import { getSectionLinesByKeywords } from "./lib/get-section-lines";

export const extractSkills = (sections: ResumeSectionToLines): ResumeSkills | any => {
    const lines = getSectionLinesByKeywords(sections, ["skills"])!
    const descriptionLineIdx = getDescriptionsLineIdx(lines) ?? 0
    const descriptionLines = lines.slice(descriptionLineIdx)
    const descriptions = getbulletPointsFromLines(descriptionLines)

    const featuredSkills = deepClone(initialFeaturedSkills);
    if(descriptionLineIdx !== 0) {
        const featuredSkillLines: Lines= lines.slice(0, descriptionLineIdx)
        const featuredSkillsTextItems: TextItems= featuredSkillLines.flat().filter((item) => item.text.trim()).slice(0, 6)
        for(let i = 0; i < featuredSkillsTextItems.length; ++i) {
            featuredSkills[i]!.skill = featuredSkillsTextItems[i]!.text
        }
    }
    const skills: ResumeSkills = {
        featuredSkills,
        descriptions
    }
    return skills
}