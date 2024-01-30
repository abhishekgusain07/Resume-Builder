import { useEffect } from "react"
import { loadStateFromLocalStorage, saveStateToLocalStorage } from "./local-storage"
import { AppDispatch, RootState, store } from "./store"
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import { deepMerge } from "../deep-merge"
import { initialResumeState, setResume } from "./resumeSlice"
import { Resume } from "."
import { Settings, initialSettings, setSettings } from "./settingSlice"

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const useSaveStateStoreToLocalStorage = () => {
    useEffect(() => {
        // subscribe to the Redux Store, so the callback is invoked whenever the state changes.
        const unsubscribe = store.subscribe(()=>{
            // call the saveStateToLocalStorage function with current state
            saveStateToLocalStorage(store.getState());
        })

        // Unsubscribe when the component unmounts or when the dependency array is empty.
        return unsubscribe
    },[])
}


// hooks that checks if there was a state earlier in the localstorage, if it is then it loads it in and set it as the current state, otherwise return with nothing.
export const useSetInitialStore = () => {
    const dispatch = useAppDispatch()
    useEffect(() => {
        const state = loadStateFromLocalStorage()
        if(!state)return;
        if(state.resume) {
            const mergedResumeState = deepMerge(initialResumeState, state.resume) as Resume
            dispatch(setResume(mergedResumeState))
        }
        if(state.settings) {
            const mergedSettingsState = deepMerge(initialSettings, state.settings) as Settings
            dispatch(setSettings(mergedSettingsState))
        }
    })
}