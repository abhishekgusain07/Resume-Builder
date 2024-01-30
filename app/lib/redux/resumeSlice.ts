import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { FeaturedSkill, Resume, ResumeEducation, ResumeProfile, ResumeProject, ResumeSkills, ResumeWorkExperience } from ".";
import { ShowForm } from "./settingSlice";
import { RootState } from "./store";


export const initialProfile: ResumeProfile = {
    name: "",
    summary: "",
    email: "",
    phone: "",
    location: "",
    url: "",
}

export const initialWorkExperience: ResumeWorkExperience = {
    company: "",
    date: "",
    descriptions: [],
    jobTitle: ""
}

export const initialEducation: ResumeEducation = {
    date: "",
    degree: "",
    descriptions: [],
    gpa: "",
    school: ""
}

export const initialProject: ResumeProject = {
    date: "",
    descriptions: [],
    project: ""
}

export const initialFeaturedSkill: FeaturedSkill = {
    rating: 4,
    skill: ""
}

export const initialFeaturedSkills: FeaturedSkill[] = Array(6).fill({
    ...initialFeaturedSkill
});

export const initialSkills: ResumeSkills = {
    descriptions: [],
    featuredSkills: initialFeaturedSkills
}
export const initialCustom = {
    descriptions: [],
};

export const initialResumeState: Resume = {
    profile: initialProfile,
    educations: [initialEducation],
    workExperiences: [initialWorkExperience], 
    projects: [initialProject],
    skills: initialSkills,
    custom: initialCustom
}

export type CreateChangeActionWithDescription<T> = {
    idx: number
} & (
    |
    {
        field: Exclude<keyof T, "descriptions">;
        value: string
    } | {
        field: "descriptions"; value: string[]
    }
)
export const resumeSlice = createSlice({
    name: "resume",
    initialState: initialResumeState,
    reducers: {
        changeProfile: (draft, action: PayloadAction<{field: keyof ResumeProfile; value: string}>) => {
            const {field, value} = action.payload
            draft.profile[field] = value
        },
        changeWorkExperience: (draft, action:PayloadAction<CreateChangeActionWithDescription<ResumeWorkExperience>>) => {
            const {idx, field, value} = action.payload
            const workExperience = draft.workExperiences[idx]
            workExperience[field] = value as any
        },
        changeEducation: (draft, action:PayloadAction<CreateChangeActionWithDescription<ResumeEducation>>) => {
            const {idx, field, value} = action.payload
            const education = draft.educations[idx]
            education[field] = value as any
        },
        changeSkills: (draft, action: PayloadAction<|{
            field:"descriptions";
            value: []
        } | {
            field: FeaturedSkill;
            idx: number;
            skill: string;
            rating: number;
        }>
        ) => {
            const {field} = action.payload
            if(field === "descriptions") {
                const {value} = action.payload
                draft.skills.descriptions = value
            } else {
                const {idx, skill, rating} = action.payload
                const particularSkill = draft.skills.featuredSkills[idx]
                particularSkill.skill = skill
                particularSkill.rating = rating
            }
        },
        changeCustom: (draft, action: PayloadAction<{field:"descriptions"; value: string[]}>) => {
            const {field, value} = action.payload
            draft.custom.descriptions = value
        },
        addSectionInForms: (draft, action: PayloadAction<{form: ShowForm}>) => {
            const {form} = action.payload
            switch(form) {
                case "workExperiences": {
                    draft.workExperiences.push(structuredClone(initialWorkExperience))
                }
                case "educations": {
                    draft.educations.push(structuredClone(initialEducation))
                }
                case "projects": {
                    draft.projects.push(structuredClone(initialProject))
                }
            }
        },
        moveSectionInForms: (draft, action:PayloadAction<{
            form: ShowForm;
            idx: number;
            dir: "up"|"down"
        }>) => {
            const {form, idx, dir} = action.payload
            if(form !== "skills" && form !== "custom") {
                if(idx === 0 && dir === "up" || (idx === draft[form].length - 1 && dir === "down")) {
                    return draft
                }
                const temp = draft[form][idx]
                if(dir === "up") {
                    draft[form][idx] = draft[form][idx-1]
                    draft[form][idx-1] = temp
                } else {
                    draft[form][idx] = draft[form][idx+1]
                    draft[form][idx+1] = temp
                }
            }
        },
        deleteSectionInFormByIdx: (
            draft,
            action: PayloadAction<{form: ShowForm; idx: number}>
        ) => {
            const {form, idx} = action.payload
            if(form!=="skills" && form !== "custom") {
                draft[form].splice(idx, 1)
            }
        },
        setResume: (
            draft,
            action: PayloadAction<Resume>
        ) => {
            return action.payload
        }
    }
});


// exporting action creators generated by the "createslice" for later use.
export const {
    changeCustom,
    changeEducation,
    changeProfile,
    changeSkills,
    changeWorkExperience,
    deleteSectionInFormByIdx,
    addSectionInForms,
    setResume,
    moveSectionInForms
} = resumeSlice.actions
export type ResumeState = ReturnType<typeof resumeSlice.reducer>


//  =============== SELECTORS ==============
// Selectors are functific pieces of the state. They help in efficiently accessing and deriving data from the Redux store. For instance, selectTheions that take the Redux state as an argument and return specmeColor returns the themeColor from the Redux state.

//whenever the selected part changes the componenet re-renders.

export const selectResume = (state: RootState) => state.resume;
export const selectProfile = (state: RootState) => state.resume.profile;
export const selectWorkExperience = (state: RootState) => state.resume.workExperiences;
export const SelectEducations = (state: RootState) => state.resume.educations;
export const SelectProjects = (state: RootState) => state.resume.projects;
export const selectSkills = (state: RootState) => state.resume.skills;
export const selectCustom = (state: RootState) => state.resume.custom;

export default resumeSlice.reducer


