import React, {Component} from 'react';
import {connect} from "react-redux";
import Card from "reactstrap/lib/Card";
import CardBody from "reactstrap/lib/CardBody";
import CardHeader from "reactstrap/lib/CardHeader";
import {Case} from "../../../../model/Case";
import {CaseCategory} from "../../../../model/CaseCategory";
import {AppState} from "../../../../store";
import Qualification from "../Elements/Qualification";
import {FormattedMessage} from "react-intl";

interface Props{
    retrievedCase: Case
    revertScalingCaseMode: boolean
}

class QualificationForViewCase extends Component<Props> {
    public render() {
        const {retrievedCase: {qualification, themeQualification}} = this.props;
        const isCaseScaled = this.props.retrievedCase.category === CaseCategory.SCALED
        return (
            <Card className="mt-1">
                <CardHeader>
                    <span className="icon-gradient icon-rom mr-2"/>
                    <FormattedMessage id={"cases.get.details.qualification"}/> </CardHeader>
                <CardBody>
                    <Qualification qualifTags={qualification.tags} type={"Motif"}/>
                    {isCaseScaled && !this.props.revertScalingCaseMode ?
                        <Qualification qualifTags={themeQualification.tags} type={"Thème"}/>
                        : <React.Fragment/>}
                </CardBody>
            </Card>
        );
    }
}

function mapStateToProps(state: AppState) {
    return {
        retrievedCase: state.case.currentCase,
        revertScalingCaseMode: state.casePage.revertScalingCaseMode,
    }
}

export default connect(mapStateToProps)(QualificationForViewCase)
