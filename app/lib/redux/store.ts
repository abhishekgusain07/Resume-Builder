import { configureStore } from "@reduxjs/toolkit";
import { ResumeState, resumeSlice } from "./resumeSlice";
import resumeReducer from "./resumeSlice"
import settingsReducer from "./settingSlice"

export const store = configureStore({
    reducer: {
        resume: resumeReducer,
        settings: settingsReducer
    }
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch