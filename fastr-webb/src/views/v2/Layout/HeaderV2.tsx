import React, {useEffect} from "react"
import {Button, Form, Input, Nav} from "reactstrap"
import sfrLogo from "../../../img/sfrIconDegrade.svg";
import {useHistory} from "react-router";
import {useTypedSelector} from "../../../components/Store/useTypedSelector";
import {useDispatch} from "react-redux";
import AppExtPopover from "./AppExtPopover";
import {removeClientV2, selectClientV2} from "../../../store/actions/v2/client/ClientActions";
import {ClientContextSliceState} from "../../../store/ClientContextSlice";
import {parsePhoneNumber} from "libphonenumber-js";
import {ClientState} from "../../../store/reducers/v2/client/ClientReducerV2";

import "./HeaderV2.css";

interface Props {
    activeTab?: string,
    noSettings?: boolean,
    noActivity?: boolean,
    noSearch?: boolean,
    onHeaderSearch?: (query?: string) => void,
    onHomeSelection?: () => void
}

const HeaderV2 = (props: Props) => {
    const {
        activeTab,
        noSettings, noActivity, noSearch,
        onHeaderSearch, onHomeSelection
    } = props;
    const dispatch = useDispatch();
    const history = useHistory();
    const user = useTypedSelector(state => state.store.applicationInitialState?.user);
    const client: ClientState = useTypedSelector(state => state.store.client);

    useEffect(() => {
        if (!user) {
            //dispatch(fetchAndStoreApplicationInitialStateV2());
        }
    });

    const logout = () => {
        history.push("/logout");
    }

    const settings = () => {
        dispatch(selectClientV2("", ""));
        history.push(`/activities`);
    }

    const search = (form) => {
        form.preventDefault();
        if (onHeaderSearch) {
            onHeaderSearch(form.target.q.value);
        }
    }

    const home = () => {
        if (onHomeSelection) {
            onHomeSelection();
        }
    }

    const renderAllTabs = () => {
        return client.loadedClients.map(loadedClient => {
            const click = () => onTabClick(loadedClient.clientData!.id, loadedClient.serviceId);
            const del = () => onTabRemove(loadedClient.clientData!.id, loadedClient.serviceId);
            return (
                renderClientTab(loadedClient.clientData!.id, loadedClient.serviceId!, click, del)
            );
        });
    }

    const onTabClick = (clientId, serviceId) => {
        dispatch(selectClientV2(clientId, serviceId));
    }

    const onTabRemove = (clientId, serviceId) => {
        dispatch(removeClientV2(clientId, serviceId));
    }

    const iconVip = (ccss: ClientContextSliceState) => {
        return ccss?.clientData?.vip ? <span className="badge badge-white badge-small badge-pill mt-1">vip</span>: "";
    }

    const iconUser = (ccss: ClientContextSliceState) => {
        return <i className={"icon-white " + (ccss?.clientData?.corporation ? "icon-pro" : "icon-user")}/>;
    }

    const getClientName = (ccss: ClientContextSliceState) => {
        if(ccss?.clientData?.corporation) {
            return ccss.clientData?.ownerCorporation?.name;
        } else {
            return ccss.clientData?.ownerPerson?.lastName + " " + ccss.clientData?.ownerPerson?.firstName;
        }
    }

    const renderClientTab = (clientId: string, serviceId: string, clickAction: () => void, delAction: () => void) => {
        const curCli: ClientContextSliceState | undefined = client.loadedClients.find(c => c.clientData?.id === clientId && c.serviceId === serviceId);
        const isCurrentClient = activeTab?.includes("CLIENT") && clientId === client?.currentClient?.clientData?.id && serviceId === client?.currentClient?.service?.id;

        if (curCli) {
            return (
                <div id={"clientTab_" + clientId + "_" + serviceId}
                     className={"cursor-pointer d-inline-flex ml-1 pr-2 pl-2 bg-card" + (isCurrentClient ? "-selected" : "")}
                     key={"clientTab_" + clientId + "-" + serviceId}>
                    <div className="input-group-prepend p-1 flex-column justify-content-center" onClick={clickAction}>
                        { iconUser(curCli) }
                        { iconVip(curCli) }
                    </div>
                    <div className={"p-1 text-white d-flex flex-column"} onClick={clickAction}>
                        <b>
                            {getClientName(curCli)}
                        </b>
                        <div>
                            {parsePhoneNumber(curCli.service?.label, 'FR').formatNational()}
                        </div>
                    </div>
                    <div className="p-1 cursor-pointer hover-red" onClick={delAction}>
                        <i className={"icon-white icon-close"}/>
                    </div>
                </div>
            );
        } else {
            return <React.Fragment/>
        }
    }

    return (
        <Nav id="header" className="navbar p-0 bg-gradient-red linear">
            <img className={"logo"} src={sfrLogo} alt="SFR"/>
            <div id={"openedTabs"} className={"col d-inline-flex"}>
                <div id={"homeButton"}
                     className={"cursor-pointer d-inline-flex p-3 bg-card" + (activeTab === "HOME" ? "-selected" : "")}
                     onClick={home}><i className={"icon-white icon-home"}/></div>
                {renderAllTabs()}
            </div>
            <Form className={"form-inline mr-1"} onSubmit={search} hidden={noSearch}>
                <div className={"input-group"}>
                    <Input name={"q"} id={"quickSearch"} className={"form-control-sm"} placeholder={"Rechercher..."}/>
                    <div className="input-group-append">
                        <Button id="search" type="submit" className="btn btn-danger btn-sm" title={"Rechercher"}>
                            <i className={"icon-white icon-search"}/>
                        </Button>
                    </div>
                </div>
            </Form>
            <form className="form-inline mr-1">
                <div className="mr-2 p-1 rounded text-white cursor-cursor text-uppercase d-inline-flex" title={user?.activity?.code}>
                    <i className={"icon-white icon-user m-2"}/>
                    <div className={"d-flex flex-column justify-content-center"}>
                        <div>
                            {user?.login}
                        </div>
                        <div>
                            {user && !noActivity && " (" + user?.activity?.label + ")"}
                        </div>
                    </div>
                </div>
                <button id="appExt" type="button" className="btn btn-danger btn-sm mr-2"
                        title={"Applications externes"}>
                    <i className={"icon-white icon-multi-apps"}/>
                </button>
                <AppExtPopover target={"appExt"} clientContext={client.currentClient}/>
                <div className="mr-2"/>
                <button type="button" onClick={settings} hidden={noSettings} className="btn btn-danger btn-sm mr-1"
                        title={"Paramètres de connexions"}>
                    <i className={"icon-white icon-settings"}/>
                </button>
                <button type="button" onClick={logout} className="btn btn-danger btn-sm mr-2" title={"Déconnexion"}>
                    <i className={"icon-white icon-power"}/>
                </button>
            </form>
        </Nav>
    );
}

export default HeaderV2
