import React from 'react';
import {Card, CardBody, CardHeader, FormGroup} from "reactstrap";
import IncidentsList from "./IncidentsList";
import './MaxwellBlock.scss'
import {useTypedSelector} from "../../../../../components/Store/useTypedSelector";
import {AppState} from "../../../../../store";
import {FormattedMessage} from "react-intl";

interface Props {
    caseId: string
    isEditable: boolean
}

const MaxwellBlock = (props: Props) => {
    const {caseId, isEditable} = props;

    const isCaseHasInProgressIncident: boolean = useTypedSelector((state: AppState) => state.store.cases.casesList[props.caseId]?.hasInProgressIncident)
    const isCurrentCancelScaling: boolean = useTypedSelector((state: AppState) => state.store.cases.casesList[props.caseId]?.isCurrentCaseCancelScaling)

    return (isCaseHasInProgressIncident && !isCurrentCancelScaling ?
        <Card className="my-2">
            <CardHeader>
                <span className="icon-gradient icon-diag mr-2"/>
                <FormattedMessage id={"maxwellV2.incident.list.title"}/>
            </CardHeader>
            <CardBody>
                <section className={"maxwell-section__wrapper"}>
                    <FormGroup className={"mb-0"}>
                        <IncidentsList caseId={caseId} disabled={!isEditable}/>
                    </FormGroup>
                </section>
            </CardBody>
        </Card> : <React.Fragment/>)
}

export default MaxwellBlock
