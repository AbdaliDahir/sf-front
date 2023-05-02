import React from "react"
import {Nav} from "reactstrap"
import sfrLogo from "../../../img/sfr-red.svg";
import {ClientContextSliceState} from "../../../store/ClientContextSlice";
import {useTypedSelector} from "../../../components/Store/useTypedSelector";

import AppExtPopover from "./AppExtPopover";

const Header = () => {
    const clientContext: ClientContextSliceState = useTypedSelector(state => state.store.clientContext);

    return (
        <Nav id="header" className="navbar p-0 bg-gradient-red linear">
            <img className="logo bg-primary" src={sfrLogo} alt="SFR"/>
            <form className="form-inline mr-1">
                <button id="appExt" type="button" className="btn btn-danger btn-sm mr-2"
                        title={"Autres applications"}>
                    <i className={"icon-white icon-multi-apps"}/>
                </button>
                <AppExtPopover target={"appExt"} clientContext={clientContext}/>
            </form>
        </Nav>
    )

}


export default Header
