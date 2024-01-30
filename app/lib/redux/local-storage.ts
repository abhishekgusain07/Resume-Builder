import { RootState } from "./store";

const LOCAL_STORAGE_KEY = "GusainAbhisek"

// This function is intended to persistently store a serialized representation of the application state in the browser's local storage.
export const saveStateToLocalStorage = (state: RootState) => {
    try {
        const stringifiedState = JSON.stringify(state)
        localStorage.setItem(LOCAL_STORAGE_KEY, stringifiedState)
    } catch (e) {}
}


// Retrieves and deserialize the application state from the browser localstorage.
export const loadStateFromLocalStorage = () => {
    try{
        const stringifiedState = localStorage.getItem(LOCAL_STORAGE_KEY)
        if(!stringifiedState)return undefined
        return JSON.parse(stringifiedState)
    } catch(e){return undefined;}
}

export const getHasUsedAppBefore = () => Boolean(loadStateFromLocalStorage());
