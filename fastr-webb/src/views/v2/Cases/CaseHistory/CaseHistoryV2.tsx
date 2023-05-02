import * as React from "react";
import {useEffect, useState} from "react";
import classnames from 'classnames';
import {Nav, NavItem, NavLink, TabContent, TabPane} from "reactstrap";
import {FormattedMessage} from "react-intl";
import ActsHistory from "./ActsHistoryV2";
import EventsHistoryV2 from "./EventsHistoryV2";
import NotesHistoryV2 from "./NotesHistoryV2";
import {Case} from "../../../../model/Case";
import CaseUtils, {getActionsLength, getActsLength, getCommunicationsLength} from "../../../../utils/CaseUtils";
import {CaseResource} from "../../../../model/CaseResource";
import "../../../../css/timeline.scss"
import CommunicationsHistory from "./CommunicationHistoryV2";
import {AppState} from "../../../../store";
import {useSelector} from "react-redux";
import CaseEventService from "../../../../service/CaseEventService";
import {ViewCaseEvent} from "../../../../model/ViewCaseEvent";
import {IncidentsListItem} from "../../../../model/IncidentsList";
import CaseService from "../../../../service/CaseService";
import {isInProgressIncident} from "../../../../utils/MaxwellUtilsV2";
import GenericCardToggleV2 from "../Components/Sections/GenericCardToggleV2";
import ActionsHistory from "../../../Cases/Components/CaseHistory/ActionsHistory";


const retrieveComunicationResources = (resources: Array<CaseResource>) => {
    return resources ? resources.filter(resource => CaseUtils.isComunication(resource)).sort((a, b) => {
        const aa = new Date(a.creationDate).getTime();
        const bb = new Date(b.creationDate).getTime()
        return aa > bb ? -1 : aa < bb ? 1 : 0;
    }) : [];
};

const CaseHistoryV2 = (props) => {
    const {caseId, caseFromParent, casePicto, cardHeaderClass, cardClass, cardBodyClass, isExpanded, isExpandable, icon, forceOpenActionsHistory} = props;
    const caseFromStore: Case = useSelector((state: AppState) => state.store.cases.casesList[caseId]?.currentCase)
    const currentCase: Case = caseFromStore ? caseFromStore : caseFromParent;
    const caseEventService: CaseEventService = new CaseEventService(true);
    const caseService: CaseService = new CaseService(true);
    const notes = currentCase?.notes;
    const events = currentCase?.events;
    const contacts = currentCase?.contacts;
    const resources = currentCase?.resources;
    const siebelAccount = currentCase?.siebelAccount;
    const [activeTab, setActiveTab] = useState(1);
    const [eventsHistory, setEventsHistory] = useState(Array());
    const [filteredActsResources, setFilteredActsResources] = useState(Array());
    const [filteredActionResources, setFilteredActionResources] = useState(Array());

    const filterActsResources = (resources?: Array<CaseResource>) => {
        return resources ? resources.filter(resource => CaseUtils.isAct(resource))
            .sort((a, b) => {
                const aa = new Date(a.creationDate).getTime();
                const bb = new Date(b.creationDate).getTime()
                return aa > bb ? -1 : aa < bb ? 1 : 0;
            }) : [];
    }

    useEffect(() => {
        if(forceOpenActionsHistory > 0) {
            setActiveTab(3)
            changeTab(3)
        }
    }, [forceOpenActionsHistory])

    const handleActsResources = async () => {
        try {
            const filteredResourcesByIsAct = filterActsResources(resources);
            if(filteredResourcesByIsAct.filter(resource =>CaseUtils.isADGMAxwell(resource)).length > 0) {
                const incidentsArr: IncidentsListItem[] = await caseService.getIncidentsList(caseId);
                if (incidentsArr && incidentsArr.length > 0 && incidentsArr.find(incident => isInProgressIncident(incident))) {
                    const ids: Array<string> = incidentsArr
                        .filter(incident => isInProgressIncident(incident))
                        .map(incident => incident.actId);
                    setFilteredActsResources(filteredResourcesByIsAct.filter(resource => ids.indexOf(resource.id) === -1));
                    return;
                }
            }
                // @ts-ignore
                setFilteredActsResources(filteredResourcesByIsAct);

        } catch (e) {
            console.error(e)
        }
    }

    const handleActionsResources = async () => {
        const actionsResources = resources ? resources.filter(resource => CaseUtils.isAction(resource))
            .sort((a, b) => {
                const aa = new Date(a.creationDate).getTime();
                const bb = new Date(b.creationDate).getTime()
                return aa > bb ? -1 : aa < bb ? 1 : 0;
            }) : [];
        setFilteredActionResources(actionsResources);
    }


    const changeTab = (tabNumber: number) => () => {
        setActiveTab(tabNumber);
    };

    useEffect(() => {
        getEventsHistory();
        handleActsResources();
        handleActionsResources();
    }, [currentCase?.events, currentCase?.resources])

    const getEventsHistory = async () => {
        if (events?.length > 0 && currentCase) {
            const eventsHistory: ViewCaseEvent[] = await caseEventService.getCaseEventsHistory(currentCase.caseId);
            setEventsHistory(eventsHistory);
        }
    }

    return (
        currentCase ?
            <GenericCardToggleV2 icon={icon} casePicto={casePicto}
                                 cardHeaderClass={cardHeaderClass}
                                 cardClass={cardClass}
                                 cardBodyClass={"p-0 " + cardBodyClass}
                                 isExpandable={isExpandable}
                                 isExpanded={isExpanded}
                                 title={"cases.history.title"}
                                 onToggle={props.onToggle}>
                <div className="w-100 bg-light">
                    <Nav tabs className="border-0">
                        <NavItem>
                            <NavLink
                                className={classnames({'active': activeTab === 1}, "bg-light", "rounded-top")}
                                onClick={changeTab(1)}>
                                <FormattedMessage id={"cases.history.contacts.and.notes"}/> ({notes?.length})
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({'active': activeTab === 2}, "bg-light", "rounded-top")}
                                onClick={changeTab(2)}>
                                <FormattedMessage id={"cases.history.acts"}/> ({getActsLength(filteredActsResources)})
                            </NavLink>
                        </NavItem>

                        <NavItem>
                            <NavLink
                                className={classnames({'active': activeTab === 3}, "bg-light", "rounded-top")}
                                onClick={changeTab(3)}>
                                <FormattedMessage id={"cases.history.actions"}/> ({getActionsLength(filteredActionResources)})
                            </NavLink>
                        </NavItem>

                        {<NavItem>
                            <NavLink
                                className={classnames({'active': activeTab === 4}, "bg-light", "rounded-top")}
                                onClick={changeTab(4)}>
                                <FormattedMessage
                                    id={"cases.history.comunication"}/> ({getCommunicationsLength(resources)})
                            </NavLink>
                        </NavItem>}
                        <NavItem>
                            <NavLink
                                className={classnames({'active': activeTab === 5}, "bg-light", "rounded-top")}
                                onClick={changeTab(5)}>
                                <FormattedMessage id={"cases.history.events"}/> ({eventsHistory.length})
                            </NavLink>
                        </NavItem>
                    </Nav>
                </div>

                <TabContent activeTab={activeTab} className="p-3 pb-4">
                    <TabPane tabId={1}>
                        <NotesHistoryV2 notes={notes} contacts={contacts} caseId={caseId}/>
                    </TabPane>

                    <TabPane tabId={2}>
                        <ActsHistory resources={filteredActsResources} caseId={caseId} siebelAccount={siebelAccount}/>
                    </TabPane>

                    <TabPane tabId={3}>
                        <ActionsHistory actionsResources={filteredActionResources} caseId={caseId} updateActionsDetails={props.updateActionsDetails}/>
                    </TabPane>

                    <TabPane tabId={4}>
                        <CommunicationsHistory resources={retrieveComunicationResources(resources)}/>
                    </TabPane>
                    <TabPane tabId={5}>
                        <EventsHistoryV2 events={eventsHistory} key={activeTab}/>
                    </TabPane>

                </TabContent>
            </GenericCardToggleV2>
            : <React.Fragment/>
    )
};


export default CaseHistoryV2;