import React, {Component} from 'react';
import {FormattedMessage} from "react-intl";
import {connect} from "react-redux";
import {UncontrolledAlert} from "reactstrap";
import Col from "reactstrap/lib/Col";
import Row from "reactstrap/lib/Row";
import {Case} from "../../../../model/Case";
import CaseCreation from "../Elements/CaseCreation";
import CaseStatus from "../Elements/CaseStatus";
import AdditionalScalingInfo from "../Elements/AdditionalScalingInfo";

interface Props {
    adgFailureReason: string,
    retrievedCase: Case
}

class InfoBar extends Component<Props> {

    public render() {
        const {retrievedCase: {reopeningCounter, creationDate, caseOwner, status, category,qualification}} = this.props;
        return (
            <div>
                {!!this.props.adgFailureReason &&
                <Row><Col md={12}><UncontrolledAlert color="danger" fade={false}><FormattedMessage
                    id="Act has failed"/>{this.props.adgFailureReason}</UncontrolledAlert></Col></Row>}

                <Row className="text-center mb-2 mt-2">
                    <Col md={6} className="pr-1">
                        <CaseStatus reopened={reopeningCounter} status={status}
                                    type={qualification ? qualification.caseType : undefined}
                                    category={category}/>
                    </Col>
                    <Col md={6}>
                        <CaseCreation creationDate={creationDate}
                                      owner={caseOwner}/>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <AdditionalScalingInfo/>
                    </Col>
                </Row>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        adgFailureReason: state.casePage.adgFailureReason,
        retrievedCase: state.case.currentCase
    }
}

export default connect(mapStateToProps)(InfoBar)
