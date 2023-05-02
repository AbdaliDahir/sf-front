import React, {Component} from 'react';
import {connect} from "react-redux";
import Col from "reactstrap/lib/Col";
import Row from "reactstrap/lib/Row";
import {Case} from "../../../../model/Case";
import {CaseCategory} from "../../../../model/CaseCategory";
import {CasesQualificationSettings} from "../../../../model/CasesQualificationSettings";
import {AppState} from "../../../../store";
import {isMaxwelCase} from "../../../../utils/MaxwellUtils";
import ViewCaseConclusion from "../Elements/ViewCaseConclusion";
import CaseData from "../../Components/CaseData/CaseData";
import ScaledCaseConclusion from "../Elements/ScaledCaseConclusion";
import {Payload} from "../ViewCasePage";
import {CaseDataProperty} from "../../../../model/CaseDataProperty";

interface Props {
    retrievedCase: Case
    updateMode: boolean
    revertScalingCaseMode: boolean
    isScalingMode: boolean
    finishingTreatment: boolean
    handleUpdateFormChanges: (formChange) => void
    currentCaseQualification: CasesQualificationSettings
    qualificationLeaf
    payload: Payload
    additionDataOfQualifsAndTheme: Array<CaseDataProperty>
}

class CaseConclusionViewCase extends Component<Props> {

    public render() {
        const isMaxwellCase = isMaxwelCase(this.props.retrievedCase)
        const isCaseScaled = this.props.retrievedCase.category === CaseCategory.SCALED

        const readOnlyCaseData = !this.props.updateMode || (this.props.updateMode && isMaxwellCase)

        return (
            <div>
                {this.props.additionDataOfQualifsAndTheme.length > 0 ?
                    <Row className="mt-2">
                        <Col>
                            <CaseData data={this.props.additionDataOfQualifsAndTheme} readOnly={readOnlyCaseData}
                                      onChange={this.props.handleUpdateFormChanges}/>
                        </Col>
                    </Row>
                    : <React.Fragment/>}

                {(!this.props.isScalingMode && !isCaseScaled) || this.props.revertScalingCaseMode ?
                    <Row className="mt-2">
                        <Col>
                            <ViewCaseConclusion results={this.props.qualificationLeaf?.conclusions} case={this.props.retrievedCase}
                                                getConclusionChanges={this.props.handleUpdateFormChanges}
                                                updateMode={this.props.updateMode} idAct={this.props.payload.idAct}/>
                        </Col>
                    </Row>
                    : <React.Fragment/>}

                {isCaseScaled && !isMaxwellCase ?
                    <Row className="mt-2">
                        <Col>
                            <ScaledCaseConclusion/>
                        </Col>
                    </Row>
                    : <React.Fragment/>}
            </div>
        );
    }
}

function mapStateToProps(state: AppState) {
    return {
        retrievedCase: state.case.currentCase,
        updateMode: state.casePage.updateMode,
        revertScalingCaseMode: state.casePage.revertScalingCaseMode,
        isScalingMode: state.casePage.isScalingMode,
        finishingTreatment: state.casePage.finishingTreatment,
        currentCaseQualification: state.case.currentCaseQualification,
        qualificationLeaf: state.casePage.qualificationLeaf,
        caseQualification: state.casePage.qualification,
        additionDataOfQualifsAndTheme: state.casePage.additionDataOfQualifsAndTheme
    }

}

export default connect(mapStateToProps)(CaseConclusionViewCase)
