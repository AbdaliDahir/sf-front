export const progressBackgroundByValue = (value: number) => {

    if (value >= 100) {
        return "bg-gradient-red linear"
    } else {
        return "bg-gradient-red linear"
    }

}

export const valueToPercentage = (current: number, total: number) => {
    return (current / total) * 100
}