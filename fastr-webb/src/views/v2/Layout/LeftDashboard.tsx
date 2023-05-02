import * as React from "react";
import {useState} from "react";
import './LeftDashboard.scss'
import sfrIcon from "../../../img/logo-fastr-blc.svg";
import SFR from "../../../img/SFR.svg";
import {Button, Form, Input} from "reactstrap";
import {FormattedMessage} from "react-intl";
import {useDispatch} from "react-redux";
import {useHistory} from "react-router";
import {useTypedSelector} from "../../../components/Store/useTypedSelector";
import {ClientState} from "../../../store/reducers/v2/client/ClientReducerV2";
import {fetchAndStoreCloseServices, removeClientV2, selectClientV2} from "../../../store/actions/v2/client/ClientActions";
import {ClientContextSliceState} from "../../../store/ClientContextSlice";
import {parsePhoneNumber} from "libphonenumber-js";
import AppExtPopover from "./AppExtPopover";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import ClientCloseService from "../Client/ClientServices/ClientCloseService";

interface Props {
    activeTab?: string,
    noActivity?: boolean,
    noSearch?: boolean,
    onHeaderSearch?: (query?: string) => void,
    onHomeSelection?: () => void,
    onMenuChange?: (show: boolean) => void,
}

const LeftDashboard = (props: Props) => {
    const {
        activeTab,
        noActivity, noSearch,
        onHeaderSearch, onHomeSelection, onMenuChange
    } = props;
    const dispatch = useDispatch();
    const history = useHistory();
    const user = useTypedSelector(state => state.store.applicationInitialState?.user);
    const client: ClientState = useTypedSelector(state => state.store.client);
    const [isLeftMenuOpen , setIsLeftMenuOpen] = useState(true);
    const [isServiceOpen , setIsServiceOpen] = useState(false);
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
            setIsServiceOpen(false);
        }
    }

    const home = () => {
        if (onHomeSelection) {
            onHomeSelection();
        }
    }

    const renderAllTabs = () => {
        const {loadedClients,currentClient} = client;
        let alreadyLoadedId:string[] = [];
        let nonDuplicate:ClientContextSliceState[] = [];
        let loadedToDisplay = currentClient ? [currentClient] : [];
        loadedToDisplay = [...loadedToDisplay, ...loadedClients.filter(c=>c.clientData && c.clientData.id !== currentClient?.clientData?.id)];
       loadedToDisplay.map(item => {
            if(item.clientData?.id && !alreadyLoadedId.includes(item.clientData?.id)){
                alreadyLoadedId = [...alreadyLoadedId, item.clientData.id];
                nonDuplicate.push(item);
            }
        })
        return nonDuplicate.map(loadedClient => {
            const click = () => onTabClick(loadedClient.clientData!.id, loadedClient.serviceId);
            const del = () => onTabRemove(loadedClient.clientData!.id, loadedClient.serviceId);
            return (
                renderClientTab(loadedClient.clientData!.id, loadedClient.serviceId!, click, del)
            );
        });
    }

    const onTabClick = (clientId, serviceId) => {
        setIsServiceOpen(false);
        dispatch(selectClientV2(clientId, serviceId));
    }

    const onTabRemove = (clientId, serviceId) => {
        dispatch(removeClientV2(clientId, serviceId));
    }

    const iconVip = (ccss: ClientContextSliceState) => {
        return ccss?.clientData?.vip ? <span className="badge badge-white badge-small badge-pill mt-1">vip</span>: "";
    }

    const iconUser = (ccss: ClientContextSliceState, isCurrentClient?: boolean) => {
        return <i className={"menu-icon "+(ccss?.clientData?.corporation ?  (isCurrentClient ? "icon-societe-gradient" :"icon-societe-white" ): (isCurrentClient ? "icon-customer-gradient":"icon-customer-white" ))}/>;
    }

    const getClientName = (ccss: ClientContextSliceState) => {
        if(ccss?.clientData?.corporation) {
            return ccss.clientData?.ownerCorporation?.name;
        } else {
            return ccss.clientData?.ownerPerson?.lastName + " " + ccss.clientData?.ownerPerson?.firstName;
        }
    }

    const onMenuOpenClose =() => {
        setIsLeftMenuOpen(!isLeftMenuOpen)
        if(onMenuChange ) {
            onMenuChange(!isLeftMenuOpen)
        }
    }
    const loadCloseServices = (clientId: string, serviceId: string) => {
        const currentClient = client.loadedClients.find(item => item.clientData?.id === clientId && item.serviceId === serviceId);
        const fetchCondition = currentClient && currentClient.closeServices && currentClient.closeServices.length > 0;
        if (!fetchCondition) {
            dispatch(fetchAndStoreCloseServices(clientId, serviceId));
        }
        setIsServiceOpen(!isServiceOpen);
    }
    const renderClientTab = (clientId: string, serviceId: string, clickAction: () => void, delAction: () => void) => {
        const curCli: ClientContextSliceState | undefined = client.loadedClients.find(c => c.clientData?.id === clientId && c.serviceId === serviceId);
        const isCurrentClient = activeTab?.includes("CLIENT") && clientId === client?.currentClient?.clientData?.id && serviceId === client?.currentClient?.service?.id;

        if (curCli) {
            return (
                <div id={"clientTab_" + clientId + "_" + serviceId}
                         className={"cursor-pointer mb-3 menu-item" + (isCurrentClient ? "-selected selected-border ml-2 text-marron" : " text-white")}
                     key={"clientTab_" + clientId + "-" + serviceId}>
                    <div className="d-flex" >
                        <div className="input-group-prepend p-1 flex-column justify-content-center" onClick={clickAction}>
                            { iconUser(curCli, isCurrentClient) }
                            { iconVip(curCli) }
                        </div>
                        <div className={"p-1 d-flex flex-column "} onClick={clickAction}>
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
                    {isCurrentClient ? <div className="border-top pl-2 pr-2">
                        <div className={"d-flex justify-content-between border-bottom border-2 pt-1 pb-1"}
                            onClick={() => loadCloseServices(clientId, serviceId)}>
                            <span className="d-flex flex-column justify-content-center">Services rapprochés</span>
                            <span className="d-flex flex-column justify-content-center">
                                {!isServiceOpen ?<FiChevronDown /> : <FiChevronUp />}
                            </span>
                           
                        </div>
                        {isServiceOpen ? <ClientCloseService clientId={clientId} serviceId={serviceId}/> : null}

                    </div>:null}
                </div>
            );
        } else {
            return <></>
        }
    }
    return(
        <>
        <div className="leftDashboard">
            <div className="leftDashboard-logo mb-3">
                <img className="ml-2" src={SFR}/>
                <img className="ml-2" width={100} src={sfrIcon}/>
            </div>

            <div className={"d-flex p-2 mb-3 cursor-pointer leftDashboard-item "  + (activeTab === "HOME" ? "menu-item-selected  ml-2" : "")}
                 onClick={home}
            >
                <span id={"homeButton"}
                     className={"d-inline-flex"}
                >
                    <i className={"icon-home leftDashboard-icon " + (activeTab === "HOME" ? "icon-gradient":"icon-white")}/>
                </span>
                <span className="d-flex flex-align-middle ml-3">
                    <h5 className={"mb-0 ml-2 font-weight-normal " + (activeTab === "HOME" ? "text-marron":"text-white")}>
                        <FormattedMessage id={"menu.home"}/>
                    </h5>
                </span>

            </div>
            <Form className={"form-inline pb-4"} onSubmit={search} hidden={noSearch}>
                <div className={"input-group pl-2 leftDashboard-input-group"}>
                    <Input name={"q"} id={"quickSearch"} className={"form-control-sm leftDashboard-input"} placeholder={"Rechercher..."}/>
                    <div className="input-group-append">
                        <Button id="search" type="submit" className="btn-sm leftDashboard-btn" title={"Rechercher"}>
                            <i className={"icon-gradient icon-search"}/>
                        </Button>
                    </div>
                </div>
            </Form>
            {renderAllTabs()}
            <form  className="form-inline flex-column align-items-start fixed-bottom mr-1 cursor-pointer leftDashboard-item-width">
                <div id="appExt" className="d-inline-flex mr-2 leftDashboard-item-full">
                    <span className="m-2">
                        <i className={"icon-white icon-multi-apps leftDashboard-icon"}/>
                    </span>
                    <AppExtPopover target={"appExt"} clientContext={client.currentClient}/>
                    <span className="d-flex flex-align-middle text-white">
                        <FormattedMessage id={"menu.appExternes"}/>
                    </span>
                </div>

                <div className={"d-inline-flex mr-2 cursor-pointer  "+ (noActivity ? "leftDashboard-item-selected":"leftDashboard-item-full")}
                     onClick={settings}
                >
                            <span className="m-2">
                                <i className={"icon-white  leftDashboard-icon " + (noActivity ? "icon-param-red":"icon-param-white")}/>
                            </span>
                    <span className={"d-flex flex-align-middle " + (noActivity ? "text-marron":"text-white")}>
                                <FormattedMessage id={"menu.settings"}/>
                            </span>
                </div>
                <div className="mr-2 rounded text-white cursor-cursor text-uppercase d-inline-flex leftDashboard-item-full" >
                    <span
                        onClick={logout}
                        className="m-2 cursor-pointer"
                        title={"Déconnexion"}
                        >
                        <i className={"icon-white icon-user leftDashboard-icon"}/>
                    </span>
                    <div className={"d-flex flex-column justify-content-center"} title={user?.activity?.code}>
                        <div>
                            {user?.login}
                        </div>
                        <div>
                            {user && !noActivity && " (" + user?.activity?.label + ")"}
                        </div>
                    </div>
                </div>
                <div className="ml-2">
                    <button type="button" onClick={onMenuOpenClose} className={"btn btn-danger btn-sm mr-2 "  + (isLeftMenuOpen ? "leftDashboard-open" : "leftDashboard-close")}>
                        <i className={"icon-white icon-up"}/>
                    </button>
                </div>
            </form>
        </div>
        </>
    )
}

export default LeftDashboard