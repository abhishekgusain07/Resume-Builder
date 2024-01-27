
// deep Cloning
export const deepClone = <T extends {[key: string]: any} >( object:T) => {
    return JSON.parse(JSON.stringify(object)) as T
}