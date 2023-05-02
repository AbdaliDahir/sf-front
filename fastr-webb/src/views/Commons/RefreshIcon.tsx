import React from "react";
import './RefreshIcon.scss'
import {useTypedSelector} from "../../components/Store/useTypedSelector";
interface Props {
    headerTop?: boolean
}
const RefreshIcon = (props: Props) => {
    const needToBeRefresh: boolean = useTypedSelector(state => state.store.cases.infoToRefresh);

    const refresh = () => {
        window.location.reload(false);
    }
    return (needToBeRefresh ? <div className={"refresh-icon-container"}>
                <i className={`icon-gradient icon-restart mr-2 clickable ${props.headerTop ? 'header-top' : ''}`} onClick={refresh}/>
            </div> : <></>
    )
}

export default RefreshIcon;