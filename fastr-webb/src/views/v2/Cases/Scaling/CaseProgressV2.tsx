import * as React from "react";
import {Col} from "reactstrap";
import {FormattedMessage} from "react-intl";
import Label from "reactstrap/lib/Label";
import FormSelectInput from "../../../../components/Form/FormSelectInput";
import {CaseProgressStatus} from "../../../../model/CaseProgressStatus";
import {translate} from "../../../../components/Intl/IntlGlobalProvider";
import {connect} from "react-redux";
import {AppState} from "../../../../store";
import ValidationUtils from "../../../../utils/ValidationUtils";
import {handleTreatmentEndChangedV2} from "../../../../store/actions/v2/case/CaseActions";
import CaseService from "../../../../service/CaseService";

interface Props {
    caseId: string
    authorizations
    userActivity
    canCCUpdateCurrentCase
    readOnly: boolean
    formsyRef
    handleTreatmentEndChangedV2
    progressStatus
    serviceType
    caseType
    scalingConclusionRefV2
    caseOwner
    isCaseHasInProgressIncident: boolean,
    isCaseHasInVerifiedGdprComments: boolean
    isCurrentCancelScaling: boolean
    payload: any
}

interface State {
    progressStatusList: JSX.Element[],
    options: JSX.Element[]
}

const caseService: CaseService = new CaseService(true);

class CaseProgressV2 extends React.Component<Props, State> {
    private prefilledValuesToHide = [
        CaseProgressStatus.REOPENED.valueOf(),
        CaseProgressStatus.CUSTOMER_APPOINTEMENT_PROPOSAL.valueOf()
    ];

    constructor(props: Props) {
        super(props);
        if ((!this.props.isCurrentCancelScaling && this.props.isCaseHasInProgressIncident) || this.props.isCaseHasInVerifiedGdprComments) {
            this.prefilledValuesToHide.push(CaseProgressStatus.TREATMENT_END.valueOf());
        }
        this.state = {
            progressStatusList: this.props.payload?.refCTT ? [<option key={'Incident créé suite ciblage'}>{'Incident créé suite ciblage'}</option>] : this.getCaseProgressStatusSetting(),
            options: this.getListOfProgressStatus()}
    }

    public componentDidUpdate(prevProps: Props) {
        if (prevProps.isCaseHasInProgressIncident !== this.props.isCaseHasInProgressIncident || prevProps.isCaseHasInVerifiedGdprComments !== this.props.isCaseHasInVerifiedGdprComments) {
            if (this.props.isCaseHasInProgressIncident || this.props.isCaseHasInVerifiedGdprComments) {
                this.prefilledValuesToHide.push(CaseProgressStatus.TREATMENT_END.valueOf());
            } else {
                this.prefilledValuesToHide = this.prefilledValuesToHide.filter(item => JSON.stringify(item) !== JSON.stringify(CaseProgressStatus.TREATMENT_END.valueOf()))
            }
            this.setState({
                options: this.getListOfProgressStatus()
            })
        }

        if (prevProps.readOnly !== this.props.readOnly) {
            this.setState({
                options: this.getListOfProgressStatus()
            })
        }
    }

    // init progressStatusListInput with elements of Enum (CaseProgressStatus)
    public getListOfProgressStatus = (): JSX.Element[] => {
        const indexREOPENED = this.prefilledValuesToHide.indexOf(CaseProgressStatus.REOPENED.valueOf())
        if (!this.props.readOnly) {
            this.prefilledValuesToHide.push(CaseProgressStatus.ONGOING_ANALYSIS.valueOf());
            this.prefilledValuesToHide.push(CaseProgressStatus.ONGOING_NOT_STARTING.valueOf())
            if (indexREOPENED === -1) {
                this.prefilledValuesToHide.push(CaseProgressStatus.REOPENED.valueOf())
            }
        } else {
            const indexONGOING_ANALYSIS = this.prefilledValuesToHide.indexOf(CaseProgressStatus.ONGOING_ANALYSIS.valueOf())
            const indexONGOING_NOT_STARTING = this.prefilledValuesToHide.indexOf(CaseProgressStatus.ONGOING_NOT_STARTING.valueOf())
            if (indexONGOING_ANALYSIS !== -1) {
                this.prefilledValuesToHide.splice(indexONGOING_ANALYSIS, 1)
            }
            if (indexONGOING_NOT_STARTING !== -1) {
                this.prefilledValuesToHide.splice(indexONGOING_NOT_STARTING, 1)
            }
            if (indexREOPENED !== -1) {
                this.prefilledValuesToHide.splice(indexREOPENED, 1)
            }
        }
        const progressStatusOptions: JSX.Element[] = [];
        Object.keys(CaseProgressStatus)
            .filter(progStat => (!this.prefilledValuesToHide.includes(progStat)))
            .sort((a, b) =>
                translate.formatMessage({ id: a }).localeCompare(translate.formatMessage({ id: b }))
            )
            .map(filteredProgStat => {
                progressStatusOptions.push(
                    <option key={filteredProgStat} value={filteredProgStat}>
                        {translate.formatMessage({ id: filteredProgStat })}
                    </option>
                );
            })
        if (this.props.readOnly && this.props.progressStatus) {
            progressStatusOptions.push(
                <option key={this.props.progressStatus} value={this.props.progressStatus}>
                    {translate.formatMessage({id: this.props.progressStatus})}
                </option>);
        }

        return progressStatusOptions;
    };


    public getCaseProgressStatusSetting = (): JSX.Element[] => {
        const progressStatusOptions: JSX.Element[] = [];
       caseService.getCaseProgressStatusList(this.props.userActivity.code).then((value) =>
           value
               .sort((a, b) =>
               a.label.localeCompare(b.label)
           ).forEach(element => {
               progressStatusOptions.push(
                   <option key={element.code} value={element.code}>
                       {element.label}
                   </option>
               );
           })
       ).then(() => { 
            this.setState({
                progressStatusList: progressStatusOptions
            });
        })

        return progressStatusOptions;
    };

    private handleProgressStatusChanged = async (evt) => {
        await this.props.handleTreatmentEndChangedV2(this.props.caseId, evt.currentTarget.value === "TREATMENT_END",
            this.props.userActivity.code,
            this.props.serviceType,
            this.props.caseType
        );
        if (this.props.scalingConclusionRefV2) {
            this.props.scalingConclusionRefV2.scrollIntoView();
        }
    }

    private progressStatusToDisplay(): string {
        if (this.props.payload?.refCTT) {
            return 'Incident créé suite ciblage'
        }
        if (this.props.canCCUpdateCurrentCase || this.prefilledValuesToHide.includes(this.props.progressStatus)) {
            return ''
        }
        return this.props.progressStatus
    }

    public render(): JSX.Element {
        return (
            <Col xs={6} className="d-flex align-items-center pl-2 pr-1 justify-content-evenly">
                <Label className={"font-weight-bold mb-0 mr-2"}>
                    <FormattedMessage id="cases.edit.progress.list" /><span className="text-danger">*</span>
                </Label>
                <FormSelectInput
                    className="flex-grow-1 mb-0"
                    classNameToProps="mb-0"
                    value={this.progressStatusToDisplay()}
                    name="scaling.progressStatus" id="scaling.progressStatus"
                    label={translate.formatMessage({ id: "input.validations.scaling.progressStatus" })}
                    validations={this.props.readOnly ? {} : { isRequired: ValidationUtils.notEmpty }}
                    forceDirty={true}
                    onChange={this.handleProgressStatusChanged}
                    bsSize={"sm"}
                    disabled={this.props.readOnly}>
                    <option key="default" value="" disabled selected />
                    {
                        [...this.state.progressStatusList, ...this.state.options]
                    }
                </FormSelectInput>
            </Col>
        )
    }
}

function mapStateToProps(state: AppState, ownProps: Props) {
    return {
        authorizations: state.store.applicationInitialState.authorizations,
        caseType: state.store.cases.casesList[ownProps.caseId].currentCase.qualification.caseType,
        progressStatus: state.store.cases.casesList[ownProps.caseId].currentCase.progressStatus,
        caseOwner: state.store.cases.casesList[ownProps.caseId].currentCase.caseOwner,
        scalingConclusionRefV2: state.store.cases.casesList[ownProps.caseId].scalingConclusionRefV2,
        serviceType: state.store.cases.casesList[ownProps.caseId].currentCase.serviceType,
        userActivity: state.store.applicationInitialState.user?.activity,
        canCCUpdateCurrentCase: state.store.cases.casesList[ownProps.caseId].caseBooleans.canCCUpdateCurrentCase,
        isCaseHasInProgressIncident: state.store.cases.casesList[ownProps.caseId]?.hasInProgressIncident,
        isCaseHasInVerifiedGdprComments:state.store.cases.casesList[ownProps.caseId]?.hasInVerifiedGdprComments,
        isCurrentCancelScaling: state.store.cases.casesList[ownProps.caseId]?.isCurrentCaseCancelScaling,
        payload: state.payload.payload
    }
}

const mapDispatchToProps = {
    handleTreatmentEndChangedV2
}

export default connect(mapStateToProps, mapDispatchToProps)(CaseProgressV2)
