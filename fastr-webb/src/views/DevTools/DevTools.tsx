// @ts-nocheck

import {Badge, Button} from "reactstrap";
import * as React from "react";
import {useTypedSelector} from "../../components/Store/useTypedSelector";
import {AppState} from "../../store";

import "./DevTools.scss";
import {toggleForceStoreV2} from "../../store/actions/v2/applicationInitalState/ApplicationInitalStateActions";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {User} from "../../model/User";
import UXUtils from "../../utils/UXUtils";

interface Props {
    authorizations
    hideDevTools
    payload
}

const DevTools = (props: Props) => {
    const forceStoreV2: any = useTypedSelector((state: AppState) => state.store.applicationInitialState.activationFlags?.find((f) => f.label === "forceAccessStoreV2"));
    const isStoreV2: boolean = useTypedSelector((state: AppState) => state.store.applicationInitialState.activationFlags?.find((f) => f.label === "accessStoreV2")?.activated);
    const user: User | undefined = useTypedSelector((state: AppState) => state.store.applicationInitialState?.user);

    const dispatch = useDispatch();
    const [display, setDisplay] = useState();

    useEffect(() => {
        props.hideDevTools(() => {
            setDisplay(false)
        })
    }, [])

    const toggleDisplay = () => {
        setDisplay(!display);
    }

    const toggleStoreV2 = (e) => {
        e.stopPropagation()
        dispatch(toggleForceStoreV2())
    }

    const openInLocalHost = (e) => {
        e.stopPropagation();
        open(window.location.href.replace(window.location.protocol, "http:").replace(window.location.host, "localhost:3000"), "_blank")
    };

    const openDisRC = (e) => {
        e.stopPropagation();
        open(window.location.origin+"/client/" + props.payload.idClient + "/service/" + props.payload.idService, "_blank")
    };

    const replaceAsLocalHost = (e) => {
        e.stopPropagation()
        window.location.href = window.location.href.replace(window.location.protocol, "http:").replace(window.location.host, "localhost:3000")
    };

    const copyPayload = (e) => {
        e.stopPropagation();
        UXUtils.copyToClipboard(JSON.stringify(props.payload));
    }

    const createToggleButton = (title: string, toggleFct: () => void, toggleBool) => {
        return (
            <Button size={"sm"} color={"primary"} onClick={toggleFct} className={"d-flex item"}>
                <div className={"flex-3 w-100"}>{title}</div>
                <div className={"flex-1 w-100"}>{(toggleBool ? "[✔️]" : "[❌]")}</div>
            </Button>
        );
    }

    const {authorizations} = props;
    const storeV2 = forceStoreV2 ? forceStoreV2.activated : (isStoreV2 || authorizations.includes("accessStoreV2"));

    return (
        <div className={"devTool " + (display ? "" : "hidden")}>
            <div className={"divToolz bg-info cursor-pointer"} onClick={toggleDisplay}>
                {/*{user && <Badge className={"badgeInfos item"} color={"primary"}>{user?.login} : {user?.activity.code}/{user?.activity.label}</Badge>}*/}
                {user && <Button size={"sm"} color={"primary"} className={"item small"}  onClick={copyPayload} title={"Copy payload in clipboard"}>{user?.login} : {user?.activity.code}/{user?.activity.label}</Button>}
                <Button size={"sm"} color={"primary"} className={"item"} onClick={openInLocalHost}>New tab as Localhost ↗️</Button>
                <Button size={"sm"} color={"primary"} className={"item"} onClick={replaceAsLocalHost}>Replace as Localhost ↩️</Button>
                {props.payload && props.payload.idClient && props.payload.idService && <Button size={"sm"} color={"primary"} className={"item"} onClick={openDisRC}>Ouvrir DISRC ↩️</Button>}
                {createToggleButton("Store V2", toggleStoreV2, storeV2)}
            </div>

            <Badge color={"info"} className={"cursor-pointer badgeToggle"} onClick={toggleDisplay}>
                <h5>
                    {display ?
                        <i className={"icon-white icon-close"}/>
                        :
                        <i className={"icon-white icon-settings"}/>
                    }
                </h5>
            </Badge>
        </div>
    );
}

export default DevTools