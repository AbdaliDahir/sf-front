import React from "react";
import 'react-block-ui/style.css';
import 'react-notifications/lib/notifications.css';
import './CaseHeaderV2.scss';
import CaseActionsV2 from "./CaseActionsV2";
import { Badge, Nav, Navbar, NavItem } from "reactstrap";
import { FormattedMessage } from "react-intl";
import { useSelector } from "react-redux";
import { AppState } from "../../../../store";
import { Case } from "../../../../model/Case";
import { ArbeoActDetailData } from "../../../../model/ArbeoActDetailData";
import { ClientContextSliceState } from "../../../../store/ClientContextSlice";
import UXUtils from "../../../../utils/UXUtils";
import { useTypedSelector } from "../../../../components/Store/useTypedSelector";
import { CaseStatus } from "../../../../model/case/CaseStatus";
import moment from "moment-timezone";

interface Props {
    formsyRef
    actDetail: ArbeoActDetailData
    actCreator
    caseId: string
    clientContext: ClientContextSliceState
    fromDisrc: boolean
    onClick: () => void
    actionsProps
}

const CaseHeaderV2 = (props: Props) => {

    const { fromDisrc, caseId, clientContext, actDetail, actCreator, formsyRef } = props;
    const casesList: Case = useSelector((state: AppState) => state.store.cases.casesList)
    const currentCaseIsClosed = useTypedSelector((state) => state.store.cases.casesList[caseId]?.currentCase?.status === CaseStatus.CLOSED);
    const DATETIME_FORMAT = process.env.REACT_APP_FASTR_DATETIME_FORMAT;

    const aCase = casesList ? casesList[caseId] : undefined
    const generateBadge = () => {
        let type;
        if (aCase?.qualification?.caseType) {
            type = aCase.qualification.caseType
        }
        if (type === "") {
            return <React.Fragment />
        } else {
            return <Badge className="mr-2" color="secondary">{type}</Badge>
        }
    }

    return (
        <Navbar
            className={fromDisrc ? "" : "sticky-top " + "p-1 border-bottom pl-3 pr-3 bg-light case-header-v2__main_container"}
            style={{ backgroundColor: "rgba(255,255,255,1)" }}>

            <section className={"case-header-v2__first-line"}>
                <h4 onClick={props.onClick}>
                    {generateBadge()}
                    <FormattedMessage id="cases.get.details.title" />
                    <span id="headerCaseId" onClick={UXUtils.copyValueToClipboard} className={"px-1 cursor-pointer ripple rounded"}>{caseId}</span>
                    {currentCaseIsClosed &&
                        <div className="mt-2">
                            <FormattedMessage id="cases.get.details.closed.date" /> {moment(aCase?.currentCase?.closureDate).format(DATETIME_FORMAT)}
                        </div>
                    }
                </h4>
                <Nav className="ml-auto" navbar>
                    <NavItem>
                        <CaseActionsV2 {...props.actionsProps}
                            formsyRef={formsyRef}
                            caseId={aCase?.caseId}
                            clientId={clientContext?.clientData?.id}
                            serviceId={clientContext?.service?.id}
                            lastDiagDetails={actDetail}
                            actCreator={actCreator}
                        />
                    </NavItem>
                </Nav>
            </section>
        </Navbar>

    )
}

export default CaseHeaderV2
