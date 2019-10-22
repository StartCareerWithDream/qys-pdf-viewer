export const clone = (obj) => {
    if(typeof obj === 'object') {
        return JSON.parse(JSON.stringify(obj))
    }
    return obj
}