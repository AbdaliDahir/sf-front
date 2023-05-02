
const histoCasesByActivities = [
    [1, 5, 4, 1, 0],
    [2, 0, 1, 1, 3],
    [0, 1, 4, 2, 1]
];

export const getHistoCases = (length: number) => {
    let result = histoCasesByActivities[0];

    for (let i = 1; i < length; i++) {
        const nextList = histoCasesByActivities[i];
        result = result.map((value, index) => {
            return value + nextList[index]
        });
    }
    return result;
}