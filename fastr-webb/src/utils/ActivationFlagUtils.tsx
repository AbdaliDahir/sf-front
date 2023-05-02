import {useTypedSelector} from "../components/Store/useTypedSelector";

export const isFlagActivated = (label: string): boolean => {
    const {activationFlags} = useTypedSelector(state => state.activationFlag)
    if (!activationFlags) {
        return false
    }
    const activationFlag = activationFlags.find(flag => label === flag.label)
    if (!activationFlag) {
        return false
    }
    return activationFlag.activated
}