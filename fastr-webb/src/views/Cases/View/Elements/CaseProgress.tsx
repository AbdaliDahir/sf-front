import * as React from "react";

import {Case} from "../../../../model/Case";
import {Col} from "reactstrap";
import {FormattedMessage} from "react-intl";
import Label from "reactstrap/lib/Label";
import FormSelectInput from "../../../../components/Form/FormSelectInput";
import {CaseProgressStatus} from "../../../../model/CaseProgressStatus";
import {translate} from "../../../../components/Intl/IntlGlobalProvider";
import {connect} from "react-redux";
import {updateCaseProgressStatus} from "../../../../store/actions";
import ValidationUtils from "../../../../utils/ValidationUtils";
import {AppState} from "../../../../store";

interface Props {
    currentCase: Case
    updateMode: boolean
    updateCaseProgressStatus: (newConclusion: string) => void
    authorizations
    isCurrUserEliToUpdateScaledCase: boolean
    isCurrentOwner: boolean
    userActivity
}

class CaseProgress extends React.Component<Props> {
    private prefilledValuesToHide = [
        CaseProgressStatus.ONGOING_ANALYSIS.valueOf(),
        CaseProgressStatus.REOPENED.valueOf(),
        CaseProgressStatus.CUSTOMER_APPOINTEMENT_PROPOSAL.valueOf(),
        CaseProgressStatus.TREATMENT_END.valueOf(),
        CaseProgressStatus.ONGOING_NOT_STARTING.valueOf()
    ];

    constructor(props: Props) {
        super(props);
    }

    // init progressStatusListInput with elements of Enum (CaseProgressStatus)
    public getListOfProgressStatus = (): JSX.Element[] => {
        const progressStatusOptions: JSX.Element[] = [];
         Object.keys(CaseProgressStatus).filter(progStat => (!this.props.updateMode || this.isCaseProgressDisabledForRetention() || !this.prefilledValuesToHide.includes(progStat)))
            .sort((a,b)=>
                translate.formatMessage({id: a})
                    .localeCompare(translate.formatMessage({id: b})))
            .map(filteredProgStat => {
                progressStatusOptions.push(<option key={filteredProgStat}
                                                   value={filteredProgStat}>
                    {translate.formatMessage({id: filteredProgStat})}
                </option>);
            })
        return progressStatusOptions;
    };

    // call to action update progressStatus to change current case
    public handleProgressStatusChange = (event: React.FormEvent<HTMLInputElement>) => {
        this.props.updateCaseProgressStatus(event.currentTarget.value);
    };

    public isCaseProgressDisabledForRetention = () => {
        return this.props.authorizations.indexOf("ADG_RETENTION") !== -1 ?
            !(this.props.isCurrUserEliToUpdateScaledCase || this.props.isCurrentOwner) : false;
    }

    public handeValue = (isADGObligatoire, isActivitiesMatching) => {
        const {currentCase} = this.props;
        return isADGObligatoire && !isActivitiesMatching ? currentCase.progressStatus : ""
    }

    public render(): JSX.Element {
        const {updateMode, currentCase} = this.props;
        const isADGObligatoire = this.props.authorizations.indexOf("ADG_RETENTION") !== -1 || this.props.authorizations.indexOf("ADG_ANTICHURN") !== -1;
        const ownerActivity = currentCase.caseOwner?.activity?.code;
        const connexionActivity = this.props.userActivity;
        const isActivitiesMatching = ownerActivity === connexionActivity;

        const disabledInput = isADGObligatoire && !isActivitiesMatching ? true : (!updateMode || this.isCaseProgressDisabledForRetention())
        return (
            <Col md={6} className="d-flex">
                                <span><Label className={"col-form-label"}><FormattedMessage
                                    id="cases.edit.progress.list"/><span className="text-danger">*</span></Label>
                                </span>
                <div className="flex-grow-1 ml-2">
                    <FormSelectInput
                        className="flex-grow-1"
                        value={updateMode && !this.isCaseProgressDisabledForRetention() ? this.handeValue(isADGObligatoire, isActivitiesMatching) : currentCase.progressStatus}
                        name="progressStatus" id="progressStatus"
                        onChange={this.handleProgressStatusChange}
                        validations={{isRequired: ValidationUtils.notEmpty}}
                        disabled={disabledInput}>
                        <option key="default" value="" disabled
                                selected/>
                        {
                            this.getListOfProgressStatus()
                        }
                    </FormSelectInput>
                </div>
            </Col>
        )
    }
}

function mapStateToProps(state: AppState) {
    return {
        currentCase: state.case.currentCase,
        updateMode: state.casePage.updateMode,
        finishingTreatment: state.casePage.finishingTreatment,
        authorizations: state.authorization.authorizations,
        isCurrUserEliToUpdateScaledCase: state.casePage.isCurrUserEliToUpdateScaledCase,
        isCurrentOwner: state.casePage.isCurrentOwner,
        userActivity: state.casePage.userActivity
    }
}

const mapDispatchToProps = dispatch => (
    {
        updateCaseProgressStatus: (newProgressStatus: string) => dispatch(updateCaseProgressStatus(newProgressStatus))
    }
)

export default connect(mapStateToProps, mapDispatchToProps)(CaseProgress)
