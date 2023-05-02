import React from "react";
import {Row, Col} from "reactstrap";

import {ClientContextSliceState} from "../../../store/ClientContextSlice";
import {useTypedSelector} from "../../../components/Store/useTypedSelector";
import CaseCard from "../../v2/Cases/Components/RecentCase/CaseCard";
import CreateCaseTemplate from "./CreateCaseTemplate/CreateCaseTemplate";
import LastLetterCard from "./LastLetter/LastLetter";
import NextAppointmentCard from "./Appointment/NextAppointmentCard";
import LastInvoices from "./LastInvoices/LastInvoices";
import OfferSummary from "./OfferSummary/OfferSummary";
import "./summary.scss";
import { useDispatch } from "react-redux";
import { selectCaseV2 } from "src/store/actions/v2/case/RecentCasesActions";
import { TabCategory } from "src/model/utils/TabCategory";
import LastContactCard from "./LastContactCard/LastContactCard";
import LastEventCard from "./LastEvent/LastEvent";
import ClientMonitoringBloc from "./ClientMonitoringBloc/ClientMonitoringBloc";
import ClientXP from "./ClientXP/ClientXP";



interface Props {
    clientContext?: ClientContextSliceState
    toggleTab?
}

const Summary = (props: Props) => {
    const { clientContext, toggleTab } = props;
    const recentCaseRef: React.RefObject<any> = React.createRef();
    const dispatch = useDispatch();
    const recentCases = clientContext ? useTypedSelector(state => state.store.client.loadedClients.find(c => c.clientData?.id === clientContext.clientData?.id && c.serviceId === clientContext.serviceId)?.recentCases)?.casesList :
        useTypedSelector(state => state.store.recentCases.casesList);

    

    const handleReprendre = (idCase) => {
        const row = recentCases?.find( (c) => c.caseId === idCase);
        if (row) {
            toggleTab(TabCategory.CASES)
            dispatch(selectCaseV2(row.caseId, row.clientId, row.serviceId));
        }
    }

    return <>
        <Row className="p-0 mb-3">
            <Col md={10} className="p-0 pr-2">
                { recentCases && recentCases?.length > 0 ? <CaseCard recentCase={recentCases[0]}
                                                      recentCaseRef={recentCaseRef.current}
                                                      index={0}
                                                      key={recentCases[0]?.caseId}
                                                      handleReprendre={handleReprendre}
                                                      title={"Dernière Modif"} fromSummary={true} toggleTab={toggleTab}/> : 
                                                      <CreateCaseTemplate toggleTab={toggleTab} clientContext={clientContext}/> }
            </Col>
            <Col md={2} className="pl-0">
                { clientContext?.clientData ? <ClientXP clientContext={clientContext}/> : <></>}
            </Col>
        </Row>
        <Row>
            <Col md={4}>
                <Row>
                    <LastInvoices clientContext={clientContext} />
                </Row>
                <Row>
                    <OfferSummary clientContext={clientContext} />
                </Row>
            </Col>
            <Col md={8}>
                <div className="first-line line w-100 d-flex">
                    <LastEventCard />
                    <LastContactCard />
                    <LastLetterCard clientContext={clientContext} />
                    <NextAppointmentCard />
                </div>
                <div className="second-line w-100">
                    {clientContext?.service && <ClientMonitoringBloc clientContext={clientContext} />}
                </div>
            </Col>
        </Row>
    </>
};

export default Summary;
