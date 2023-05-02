import * as React from "react";

import {Row} from "reactstrap";
import Col from "reactstrap/lib/Col";
import {FormattedMessage} from "react-intl";
import DisplayField from "../../../../components/DisplayField";
import * as moment from "moment";
import {MdCancel, MdCheckCircle} from "react-icons/all";
// @ts-ignore
import {ScenarioActDTO, ScenarioStep} from "../../../../model/scenario/ScenarioActDTO";

interface Props {
    scenarioActDTO?: ScenarioActDTO
    creationDate?: string
}

class ScenarioDataSummary extends React.Component<Props> {

    private DATETIME_FORMAT = process.env.REACT_APP_FASTR_DATETIME_FORMAT;

    constructor(props: Props) {
        super(props);
    }

    public renderActionsTable = (steps: ScenarioStep[] | undefined) => {
        if (!steps) {
            return <React.Fragment/>
        }
        return (
            <React.Fragment>
                <h5 className={"pb-2 pt-2 border-top"} style={{backgroundColor: "#F8F8F8"}}>
                    <FormattedMessage id={"acts.history.communication.smsi.history.title"}/>
                </h5>
                <Row className="bg-dark text-white m-1 font-size-m py-1 pl-2">
                    <Col sm={3} className={"px-1"}><FormattedMessage
                        id={"acts.history.communication.smsi.action.date"}/></Col>
                    <Col sm={8} className={"px-1"}><FormattedMessage
                        id={"acts.history.communication.smsi.details"}/></Col>
                    <Col sm={1} className={"px-1"}><FormattedMessage
                        id={"acts.history.communication.smsi.status"}/></Col>
                </Row>
                {
                    steps?.map((step, index) => (
                        <React.Fragment key={index}>
                            <Row className={"border-bottom p-2"}>
                                <Col sm={3}>
                                    {moment(step?.date).format(this.DATETIME_FORMAT)}
                                </Col>
                                <Col sm={8}>
                                    {step?.label}
                                </Col>
                                <Col sm={1}>
                                    {step?.status === "OK"
                                        ? <span className="font-size-xl"><MdCheckCircle color="#55AF27"/></span>
                                        : <span className="font-size-xl"><MdCancel color="#da3832"/></span>}
                                </Col>
                            </Row>
                        </React.Fragment>
                    ))}
            </React.Fragment>)
    }


    public renderFields = (scenarioActDTO: ScenarioActDTO) => {
        const scenarioSteps = scenarioActDTO.steps;

        return (
            <React.Fragment>
                <Row className="w-100 m-2">
                    <Col sm={6}>
                        <DisplayField fieldName="acts.history.communication.smsi.contact"
                                      isLoading={scenarioActDTO}
                                      fieldValue={scenarioActDTO?.targetPhone}
                                      bold/>
                    </Col>
                    <Col sm={6}>
                        <DisplayField fieldName="acts.history.communication.smsi.begin.date"
                                      isLoading={scenarioActDTO}
                                      fieldValue={moment(this.props.creationDate).format(this.DATETIME_FORMAT)}
                                      bold/>
                    </Col>

                </Row>
                <Row className="w-100 m-2">
                    <Col sm={6}>
                        <DisplayField fieldName="acts.history.communication.smsi.name"
                                      isLoading={scenarioActDTO}
                                      fieldValue={scenarioActDTO?.label}
                                      bold/>
                    </Col>
                    <Col sm={6}>
                        <DisplayField fieldName="acts.history.communication.smsi.update.date"
                                      isLoading={scenarioActDTO}
                                      fieldValue={moment(scenarioSteps?.slice(-1)[0].date).format(this.DATETIME_FORMAT)}
                                      bold/>
                    </Col>

                </Row>
                <Row className="w-100 m-2">
                    <Col sm={6}>
                        <DisplayField fieldName="acts.history.communication.smsi.id"
                                      isLoading={scenarioActDTO}
                                      fieldValue={scenarioActDTO?.instantiatedId}
                                      bold/>
                    </Col>
                    <Col sm={6}>
                        <DisplayField fieldName="acts.history.communication.smsi.status"
                                      isLoading={scenarioActDTO}
                                      fieldValue={<FormattedMessage id={"acts.history.communication.smsi." + scenarioActDTO?.status}/>}
                                      bold/>
                    </Col>
                </Row>
                {scenarioSteps?.length && this.renderActionsTable(scenarioSteps)}
            </React.Fragment>)
    }


    public render(): JSX.Element {
        const {scenarioActDTO} = this.props
        if (!scenarioActDTO) {
            return <React.Fragment/>
        }
        return this.renderFields(scenarioActDTO)
    }
}

export default (ScenarioDataSummary)