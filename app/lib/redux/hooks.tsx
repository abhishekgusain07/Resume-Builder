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

        const unsubscribe = store.subscribe(()=>{
            saveStateToLocalStorage(store.getState());
        })
        return unsubscribe
    },[])
}

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