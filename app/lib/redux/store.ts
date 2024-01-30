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

// useSelector is a hook used for reading data from the Redux store.
//You pass a selector function to useSelector that takes the current Redux state and returns the specific piece of state you're interested in.
//Whenever the selected part of the state changes, the component re-renders.
export type RootState = ReturnType<typeof store.getState>


// useDispatch is a used to "dispatch" function, whcih can use to dispatch actions to the redux store. Actions are used to trigger changest to the state in the Redux store.
export type AppDispatch = typeof store.dispatch