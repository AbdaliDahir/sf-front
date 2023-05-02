import * as React from "react";
import {RefObject, useEffect, useRef, useState} from "react";
import classnames from 'classnames';
import {Nav, NavItem, NavLink, TabContent, TabPane} from "reactstrap";
import {FormattedMessage} from "react-intl";
import GenericCardToggle from "../../../../components/Bootstrap/GenericCardToggle";
import ActsHistory from "./ActsHistory";
import EventsHistory from "./EventsHistory";
import NotesHistory from "./NotesHistory";
import {useTypedSelector} from "../../../../components/Store/useTypedSelector";
import {Case} from "../../../../model/Case";
import CaseUtils, {getActsLength, getCommunicationsLength} from "../../../../utils/CaseUtils";
import {CaseResource} from "../../../../model/CaseResource";
import "../../../../css/timeline.scss"
import CaseEventService from "../../../../service/CaseEventService";
import {ViewCaseEvent} from "../../../../model/ViewCaseEvent";
import CommunicationsHistory from "./CommunicationHistory";

const retrieveActResources = (resources: Array<CaseResource>) => {
    return resources.filter(resource => CaseUtils.isAct(resource)).sort((a, b) => {
        const aa = new Date(a.creationDate).getTime();
        const bb = new Date(b.creationDate).getTime()
        return aa > bb ? -1 : aa < bb ? 1 : 0;
    });
};

const retrieveComunicationResources = (resources: Array<CaseResource>) => {
    return resources.filter(resource => CaseUtils.isComunication(resource)).sort((a, b) => {
        const aa = new Date(a.creationDate).getTime();
        const bb = new Date(b.creationDate).getTime()
        return aa > bb ? -1 : aa < bb ? 1 : 0;
    });
};

const CaseHistory = () => {
    const caseEventService: CaseEventService = new CaseEventService(true);
    const currentCase: Case | undefined = useTypedSelector(state => state.case.currentCase);
    const {notes, events, contacts, resources, caseId, siebelAccount} = currentCase!;
    const [activeTab, setActiveTab] = useState(1);
    const [eventsHistory, setEventsHistory] = useState(Array());
    const scrollToRef: RefObject<any> = useRef(null);

    const scrollToBottom = () => {
        scrollToRef.current?.scrollIntoView(true)
    }

    const changeTab = (tabNumber: number) => () => {
        setActiveTab(tabNumber);
        scrollToBottom()
    };

    useEffect(() => {
        getEventsHistory();
    }, [currentCase?.events])

    const getEventsHistory = async () => {
        if (events.length > 0) {
            const eventsHistory: ViewCaseEvent[] = await caseEventService.getCaseEventsHistory(caseId);
            setEventsHistory(eventsHistory);
        }
    }


    return (
        <GenericCardToggle icon="icon-document" cardBodyClass={"p-0"} title={"cases.history.title"}>
            <div className="w-100 bg-light">
                <Nav tabs className="border-0">
                    <NavItem>
                        <NavLink
                            className={classnames({'active': activeTab === 1}, "bg-light", "rounded-top")}
                            onClick={changeTab(1)}>
                            <FormattedMessage id={"cases.history.contacts.and.notes"}/> ({notes.length})
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({'active': activeTab === 2}, "bg-light", "rounded-top")}
                            onClick={changeTab(2)}>
                            <FormattedMessage id={"cases.history.acts"}/> ({getActsLength(resources)})
                        </NavLink>
                    </NavItem>
                    {<NavItem>
                        <NavLink
                            className={classnames({'active': activeTab === 3}, "bg-light", "rounded-top")}
                            onClick={changeTab(3)}>
                            <FormattedMessage id={"cases.history.comunication"}/> ({getCommunicationsLength(resources)})
                        </NavLink>
                    </NavItem>}
                    <NavItem>
                        <NavLink
                            className={classnames({'active': activeTab === 4}, "bg-light", "rounded-top")}
                            onClick={changeTab(4)}>
                            <FormattedMessage id={"cases.history.events"}/> ({eventsHistory.length})
                        </NavLink>
                    </NavItem>
                </Nav>
            </div>

            <TabContent activeTab={activeTab} className="p-3 pb-4">
                <TabPane tabId={1}>
                    <NotesHistory notes={notes} contacts={contacts}/>
                </TabPane>

                <TabPane tabId={2}>
                    <ActsHistory resources={retrieveActResources(resources)} caseId={currentCase?.caseId} siebelAccount={siebelAccount}/>
                </TabPane>
                <TabPane tabId={3}>
                    <CommunicationsHistory resources={retrieveComunicationResources(resources)}/>
                </TabPane>
                <TabPane tabId={4}>
                    <EventsHistory events={eventsHistory} key={activeTab}/>
                </TabPane>
                <div ref={scrollToRef}></div>
            </TabContent>
        </GenericCardToggle>
    )
};


export default CaseHistory;