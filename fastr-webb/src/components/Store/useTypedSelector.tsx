import {
    useSelector as useReduxSelector,
    TypedUseSelectorHook,
} from 'react-redux'
import {AppState} from "../../store";

export const useTypedSelector: TypedUseSelectorHook<AppState> = useReduxSelector;