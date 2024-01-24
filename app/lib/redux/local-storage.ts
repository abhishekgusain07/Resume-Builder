// import { parse } from "path";
import { RootState } from "./store";

const LOCAL_STORAGE_KEY = "GusainAbhisek"
export const saveStateToLocalStorage = (state: RootState) => {
    try {
        const stringifiedState = JSON.stringify(state)
        localStorage.setItem(LOCAL_STORAGE_KEY, stringifiedState)
    } catch (e) {}
}

export const loadStateFromLocalStorage = () => {
    const stringifiedState = localStorage.getItem(LOCAL_STORAGE_KEY)
    if(!stringifiedState)return undefined
    return JSON.parse(stringifiedState)
}