import { Resume, ResumeProfile } from "../../redux";
import { ResumeSectionToLines } from "../types";
import { extractEducation } from "./extract-education";
import { extractProfile } from "./extract-profile";
import { extractProject } from "./extract-project";
import { extractSkills } from "./extract-skills";
import { extractWorkExperience } from "./extract-work-experience";




// make use of all the function like extract-skills, extract-project and extract the resume.
export const extractResumeFromSections = (
    sections: ResumeSectionToLines
):Resume => {
    const {profile} = extractProfile(sections);
    const {educations} = extractEducation(sections);
    const {workExperiences} = extractWorkExperience(sections);
    const  {projects} = extractProject(sections)
    const {skills} = extractSkills(sections);
    
    const es2015fuckyou: ResumeProfile = {
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        location: profile.location || '',
        url: profile.url || '',
        summary: profile.summary || ''
    }
    return {
        profile:es2015fuckyou,
        educations,
        workExperiences,
        projects, 
        skills,
        custom:{
            descriptions: []
        }
    }
}