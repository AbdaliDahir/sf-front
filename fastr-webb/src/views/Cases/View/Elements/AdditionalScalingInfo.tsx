import * as React from "react";
import Card from "reactstrap/lib/Card";
import {FormattedMessage} from "react-intl";

import CardBody from "reactstrap/lib/CardBody";
import Row from "reactstrap/lib/Row";
// Components
import {User} from "../../../../model/User";
import {Case} from "../../../../model/Case";
import {AppState} from "../../../../store";
import {updateCaseProgressStatus} from "../../../../store/actions";
import {connect} from "react-redux";
import {CaseCategory} from "../../../../model/CaseCategory";
import {CaseStatus} from "../../../../model/case/CaseStatus";
import CaseProgress from "./CaseProgress";
import Col from "reactstrap/lib/Col";
import Label from "reactstrap/lib/Label";
import FormDateInput from "../../../../components/Form/Date/FormDateInput";
import ValidationUtils from "../../../../utils/ValidationUtils";
import FormHiddenInput from "../../../../components/Form/FormHiddenInput";

interface Props {
    creationDate: string,
    owner: User,
    currentCase: Case,
    revertScalingCaseMode: boolean,
    finishingTreatment: boolean,
    updateMode: boolean,
    authorizations
    isCurrUserEliToUpdateScaledCase: boolean
    userActivity
}

class AdditionalScalingInfo extends React.Component<Props> {

    public shouldShowCaseProgress(): boolean {
        return ((this.props.currentCase.progressStatus || this.props.updateMode) && this.props.currentCase.status === CaseStatus.ONGOING);
    }

    public shouldShowDoNotResolveBeforeDate(): boolean {
        const {currentCase} = this.props;
        return (currentCase.status === CaseStatus.ONGOING && !!currentCase.doNotResolveBeforeDate) || this.props.updateMode
    }

    public isDoNotResolveDateDisabledForRetention = () => {
        return this.props.authorizations.indexOf("ADG_RETENTION") !== -1 ? !this.props.isCurrUserEliToUpdateScaledCase : false;
    }

    public isADGObligatoireAndDate = (isADGObligatoire, isActivitiesMatching, date) => {
        return !isADGObligatoire || isActivitiesMatching || date;
    }

    public notBeforeDateValidation = () => {
        if (!this.props.updateMode) {
            return;
        }
        return {isFutureDateOrEmpty: ValidationUtils.isFutureDateOrEmpty}
    }

    public render(): JSX.Element {
        const {currentCase} = this.props;
        const isCaseScaled = this.props.currentCase.category === CaseCategory.SCALED;
        const date = currentCase.doNotResolveBeforeDate ? new Date(currentCase.doNotResolveBeforeDate) : null;

        const isADGObligatoire = this.props.authorizations.indexOf("ADG_RETENTION") !== -1 || this.props.authorizations.indexOf("ADG_ANTICHURN") !== -1;
        const ownerActivity = currentCase.caseOwner?.activity?.code;
        const connexionActivity = this.props.userActivity;
        const isActivitiesMatching = ownerActivity === connexionActivity;

        const disabledInput = isADGObligatoire && !isActivitiesMatching ? true : (!this.props.updateMode || this.isDoNotResolveDateDisabledForRetention());
        const isClearable = isADGObligatoire && !isActivitiesMatching ? false : (this.props.updateMode && !this.isDoNotResolveDateDisabledForRetention());
        if (isCaseScaled && !this.props.revertScalingCaseMode && !this.props.finishingTreatment && (this.shouldShowCaseProgress() || (this.shouldShowDoNotResolveBeforeDate() && !this.isDoNotResolveDateDisabledForRetention()))) {
            return (
                <Card className="mb-2 text-center h-100">
                    <CardBody className="h-100 pb-0">
                        <Row>
                            {this.shouldShowCaseProgress() ?
                                <CaseProgress/>
                                : <React.Fragment/>}
                            {this.shouldShowDoNotResolveBeforeDate() && this.isADGObligatoireAndDate(isADGObligatoire, isActivitiesMatching, date) ?
                                <Col md={6} className="d-flex">
                                <span className={"ml-3"}>
                                    <Label className={"col-form-label"}>
                                        <FormattedMessage
                                            id="case.scaled.doNotResolveBeforeDate"/>
                                    </Label>
                                </span>

                                    <div className="ml-2 mb-0">
                                        <FormDateInput peekNextMonth={true}
                                                       minDate={new Date()}
                                                       classNameFormGroup={"mb-0"}
                                                       showMonthDropdown={true}
                                                       showYearDropdown={true}
                                                       disabled={disabledInput}
                                                       id="doNotResolveBeforeDate"
                                                       name="doNotResolveBeforeDate"
                                                       value={date}
                                                       isClearable={isClearable}
                                                       validations={this.notBeforeDateValidation()}
                                        />
                                    </div>
                                </Col>
                                : <FormHiddenInput name="doNotResolveBeforeDate" id="doNotResolveBeforeDate" value={date} />}
                        </Row>
                    </CardBody>
                </Card>
            )
        } else {
            return <React.Fragment/>
        }
    }
}


function mapStateToProps(state: AppState) {
    return {
        currentCase: state.case.currentCase,
        updateMode: state.casePage.updateMode,
        finishingTreatment: state.casePage.finishingTreatment,
        revertScalingCaseMode: state.casePage.revertScalingCaseMode,
        authorizations:state.authorization.authorizations,
        isCurrUserEliToUpdateScaledCase: state.casePage.isCurrUserEliToUpdateScaledCase,
        userActivity: state.casePage.userActivity
    }

}


const mapDispatchToProps = dispatch => (
    {
        updateCaseProgressStatus: (newProgressStatus: string) => dispatch(updateCaseProgressStatus(newProgressStatus))
    }
);

export default connect(mapStateToProps, mapDispatchToProps)(AdditionalScalingInfo)