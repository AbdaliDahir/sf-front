import * as moment from "moment";
import React, {Component} from 'react';
import {FormattedMessage} from "react-intl";
import {Row} from "reactstrap";
import Alert from "reactstrap/lib/Alert";
import Col from "reactstrap/lib/Col";
import {connect} from "react-redux";
import {AppState} from "../../../../store";
import {Status} from "../../../../model/Status";
import {ScaleDetail} from "../../../../model/ScaleDetail.ts";

interface Props {
    routingRule,
    caseId,
    userActivity,
    userName: string,
    ownerName,
    caseStatus: Status,
    caseOwner?,
    currentCase?,
    themeSelected?,
    userSiteLabel?,
    canCCUpdateCurrentCase,
    isCurrentCaseScaled,
    payload
}

class RoutingInformationV2 extends Component<Props> {

    public areActivitiesMatching = () => {
        const {userActivity, routingRule} = this.props
        return routingRule?.receiverActivity.code === userActivity.code
    }

    public renderName() {
        const {userName, ownerName, canCCUpdateCurrentCase, payload} = this.props
        if (payload?.refCTT) {
            return "SYSTEME"
        }
        if ((!ownerName || ownerName === userName)) { // Case à prendre en charge
            return userName
        } else if (ownerName !== userName) {
            if (canCCUpdateCurrentCase) {
                return userName
            } else {
                return ownerName
            }
        }
    }

    public renderNextStatus() {
        const areActivitiesMatching = this.areActivitiesMatching();
        const isPrisEnCharge = this.props.caseStatus === "ONGOING";
        const isAutoAffectation = areActivitiesMatching;
        if (this.props.caseStatus === "RESOLVED" && !this.props.isCurrentCaseScaled) {
            return "Résolu"
        }
        if (this.props.caseStatus === "CLOSED") {
            return "Fermé"
        }
        return (isPrisEnCharge || isAutoAffectation || this.props.payload?.refCTT) ? "Pris en charge" : "A prendre en charge"
    }

    public renderTraiterPar() {
        const areActivitiesMatching = this.areActivitiesMatching();
        const isPrisEnCharge = this.props.caseStatus === "ONGOING";
        const isAutoAffectation = areActivitiesMatching;
        if (isPrisEnCharge || isAutoAffectation || this.props.payload?.refCTT) {
            return (
                <Col className={"text-center"}>
                    <Row>
                        <Col>
                            <span><FormattedMessage id="cases.scaling.next.owner"/></span>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <span className="font-weight-bold">{this.renderName()}</span>
                        </Col>
                    </Row>
                </Col>
            )
        }

        return <React.Fragment/>
    }

    public render() {
        const {routingRule} = this.props
        const scaledDetail = this.props.currentCase.scaleDetails && this.props.currentCase.scaleDetails.filter((scale: ScaleDetail) => scale.progressStatus !== "TREATMENT_END")![this.props.currentCase.scaleDetails!.length - 1]

        if (routingRule?.receiverSite?.code && routingRule?.receiverActivity?.code) {
            return (
                <Alert color="light" className="pb-0 mb-0">
                    <Row>
                        <Col className={"text-center"}>
                            <Row>
                                <Col>
                                    <span><FormattedMessage id="cases.scaling.next.case.state"/></span>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                            <span
                                                className="font-weight-bold">{this.renderNextStatus()}</span>
                                </Col>
                            </Row>
                        </Col>
                        {
                            this.renderTraiterPar()
                        }
                        <Col className={"text-center"}>
                            <Row>
                                <Col>
                                    <span><FormattedMessage id="cases.scaling.receiver.act"/></span>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                            <span
                                                className="font-weight-bold">{routingRule?.receiverActivity?.label}</span>
                                </Col>
                            </Row>
                        </Col>
                        <Col className={"text-center"}>
                            <Row>
                                <Col>
                                    <span><FormattedMessage id="cases.scaling.receiver.site"/></span>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <span className="font-weight-bold">{routingRule?.receiverSite?.label}</span>
                                </Col>
                            </Row>
                        </Col>

                        {(!scaledDetail || this.props.currentCase.status === "QUALIFIED") && routingRule?.estimatedResolutionDateOfCase &&
                            <Col className={"text-center"}>
                                <Row>
                                    <Col>
                                        <span>
                                            <FormattedMessage id="cases.scaling.estimated.resolution.date"/>
                                        </span>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <span className="font-weight-bold">{moment(routingRule?.estimatedResolutionDateOfCase).format('DD/MM/YYYY')}</span>
                                    </Col>
                                </Row>
                            </Col>
                        }

                        {scaledDetail && this.props.currentCase.status !== "QUALIFIED" &&
                            <Col className={"text-center"}>
                                <Row>
                                    <Col>
                                        <span>
                                            <FormattedMessage id={"cases.scaling.real.resolution.date"}/>
                                        </span>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <span className="font-weight-bold">
                                            {scaledDetail.assignmentContext?.dateAssignment ?
                                                moment(scaledDetail.assignmentContext?.dateAssignment).format('DD/MM/YYYY')
                                                : moment(scaledDetail?.dateTime).format('DD/MM/YYYY')
                                            }
                                        </span>
                                    </Col>
                                </Row>
                            </Col>
                        }
                    </Row>
                </Alert>
            );
        } else {
            return <React.Fragment/>
        }
    }
}

const mapStateToProps = (state: AppState, ownProps: Props) => (
    {
        currentCase: state.store.cases.casesList[ownProps.caseId]?.currentCase,
        caseOwner: state.store.cases.casesList[ownProps.caseId]?.currentCase.caseOwner,
        isThemeSelected: state.store.cases.casesList[ownProps.caseId].isThemeSelected,
        userActivity: state.store.applicationInitialState.user?.activity,
        userName: state.store.applicationInitialState.user?.login,
        userSiteLabel: state.store.applicationInitialState.user?.site?.label,
        ownerName: state.store.cases.casesList[ownProps.caseId]?.currentCase.caseOwner.login,
        caseStatus: state.store.cases.casesList[ownProps.caseId]?.currentCase.status,
        canCCUpdateCurrentCase: state.store.cases.casesList[ownProps.caseId].caseBooleans?.canCCUpdateCurrentCase,
        isCurrentCaseScaled: state.store.cases.casesList[ownProps.caseId]?.isCurrentCaseScaled,
        payload: state.payload.payload
    }
)

export default connect(mapStateToProps)(RoutingInformationV2);
