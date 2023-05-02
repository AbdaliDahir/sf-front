import * as React from "react";
import {FormattedMessage} from "react-intl"
import {Card, CardBody, CardHeader} from "reactstrap"
import {connect} from "react-redux";
import {PassDownProps} from "formsy-react/dist/Wrapper";
import {GenericIncident} from "../../../../model/GenericIncident";
import StepForm from "../../../../components/Form/StepForm/StepForm";
import {CasesQualificationSettings} from "../../../../model/CasesQualificationSettings";
import IncidentStepV2 from "./IncidentStepV2";
import {
    fetchAndStoreIncidentsV2,
    setAdditionalDataMaxwell,
    setCallOriginMaxwell,
    setFormMaxwellIncompleteV2,
    setInitMaxwellIncident
} from "../../../../store/actions/v2/case/CaseActions";
import UploadComponentV2 from "./UploadComponentV2";
import {translate} from "../../../../components/Intl/IntlGlobalProvider";
import {withFormsy} from "formsy-react";
import AdditionalDataStepV2 from "./AdditionalDataStepV2";
import {CaseDataProperty} from "../../../../model/CaseDataProperty";
import {FormChanges} from "../../../Cases/View/ViewCasePage";
import MaxwellValidationStep from "./MaxwellValidationStep";
import {EMaxwellCallOrigin} from "../../../../model/maxwell/enums/EMaxwellCallOrigin";
import {setBlockingUIV2} from "../../../../store/actions/v2/ui/UIActions";
import {AppState} from "../../../../store";

interface Props extends PassDownProps {
    readOnly?: boolean
    onChange?: (formChange) => void
    currentSelectedTheme?: Array<CasesQualificationSettings>,
    themeQualificationCode?: string,
    fetchAndStoreIncidentsV2: (callOrigin: EMaxwellCallOrigin, caseId: string, themeCode: string, allowForcedTicketParentId: boolean, actId?: string, refCTT? : string) => void,
    setFormMaxwellIncompleteV2: (caseId: string) => void,
    setAdditionalDataMaxwell: (caseId: string, additionalData: CaseDataProperty[]) => void,
    setCallOriginMaxwell: (caseId: string, callOrigin: EMaxwellCallOrigin) => void,
    setInitMaxwellIncident: (caseId: string) => void,
    caseId: string,
    callOrigin: EMaxwellCallOrigin,
    setBlockingUIV2,
    maxwellCaseData?,
    attachments?,
    incident?,
    closeGrid: boolean,
    setShowGridADG?,
    actId: string,
    payload : any
}

export interface MaxwellSectionV2State {
    incidentSelected?: GenericIncident,
    maxwellCaseData: CaseDataProperty[],
    hidePreviousButton: boolean
}

class MaxwellSectionV2 extends React.Component<Props, MaxwellSectionV2State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            maxwellCaseData: [],
            hidePreviousButton: false
        }
        if (this.props.currentSelectedTheme && this.props.currentSelectedTheme.length > 0) {
            this.state = {
                maxwellCaseData: this.props.currentSelectedTheme[0].data,
                hidePreviousButton: false
            }
        }
    }

    public componentWillUnmount() {
        this.props.setBlockingUIV2(false)
    }

    public componentDidMount = () => {
        if (this.props.callOrigin === EMaxwellCallOrigin.FROM_ADG) {
            this.props.setInitMaxwellIncident(this.props.caseId)
        }
        if (this.props.payload?.refCTT) {
            this.props.fetchAndStoreIncidentsV2(this.props.callOrigin, this.props.caseId, this.props.themeQualificationCode ? this.props.themeQualificationCode : "", !this.props.readOnly && this.isAllowedValidationStep(), this.props.actId, this.props.payload?.refCTT)
        } else {
            this.props.fetchAndStoreIncidentsV2(this.props.callOrigin, this.props.caseId, this.props.themeQualificationCode ? this.props.themeQualificationCode : "", !this.props.readOnly && this.isAllowedValidationStep(), this.props.actId)
        }

        this.props.setFormMaxwellIncompleteV2(this.props.caseId)
        if (this.props.callOrigin === EMaxwellCallOrigin.FROM_CASE) {
            this.props.setBlockingUIV2(true)
        }
        this.props.setCallOriginMaxwell(this.props.caseId, this.props.callOrigin)
        if (this.props.maxwellCaseData && this.props.maxwellCaseData.length > 0) {
            this.props.setAdditionalDataMaxwell(this.props.caseId, this.props.maxwellCaseData);
        }
        this.setState({
            incidentSelected: this.props.incident
        })
        this.props.setValue(this.props.incident)
    }

    public handleSelectIncident = (incidentSelected: GenericIncident) => {
        this.setState({
            incidentSelected
        })
    }

    public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<MaxwellSectionV2State>): void {
        if (prevState?.incidentSelected !== this.state?.incidentSelected) {
            const {incidentSelected} = this.state
            this.props.setValue(incidentSelected)
        }
    }

    public handleChange = (id: string, val: string) => {
        if (this.state.maxwellCaseData !== undefined) {
            const additionalData = this.state.maxwellCaseData.slice();
            additionalData.forEach((d) => {
                if (d.id === id) {
                    d.value = val;
                }
            });

            this.props.setAdditionalDataMaxwell(this.props.caseId, additionalData);
            const formChanges: FormChanges = {
                data: additionalData
            };
            if (this.props.onChange) {
                this.props.onChange(formChanges)
            }
        }
    };

    public getStepNames = () => {
        return this.isAllowedValidationStep() ?
            [
                translate.formatMessage({id: "act.ADG_MAXWELL.step.additionalData"}),
                translate.formatMessage({id: "act.ADG_MAXWELL.step.incidents"}),
                translate.formatMessage({id: "act.ADG_MAXWELL.step.attachments"}),
                translate.formatMessage({id: "act.ADG_MAXWELL.step.validation"})
            ]
            :
            [
                translate.formatMessage({id: "act.ADG_MAXWELL.step.additionalData"}),
                translate.formatMessage({id: "act.ADG_MAXWELL.step.incidents"}),
                translate.formatMessage({id: "act.ADG_MAXWELL.step.attachments"}),
            ]
    }

    public isAllowedValidationStep = () => {
        return this.props.callOrigin === EMaxwellCallOrigin.FROM_ADG || (this.props.callOrigin === EMaxwellCallOrigin.FROM_INCIDENTS_LIST && !this.props.readOnly)
    }

    public hidePreviousButton = () => {
        this.setState({
            hidePreviousButton: true
        })
    }

    public render = () => {
        return (
            <Card className="my-1">
                {this.props.callOrigin !== EMaxwellCallOrigin.FROM_HISTORY && <CardHeader>
                    <span className="icon-gradient icon-diag mr-2"/>
                    <FormattedMessage id={"act.history.label.ADG_MAXWELL"}/>
                </CardHeader>}
                <CardBody>
                    {this.getStepForm()}
                </CardBody>
            </Card>
        )
    }

    private getStepForm() {
        return this.isAllowedValidationStep() ? (
            <StepForm stepNames={this.getStepNames()} hidePreviousButton={this.state.hidePreviousButton} size={"sm"} caseId={this.props.caseId}>
                <AdditionalDataStepV2 data={this.props.maxwellCaseData || this.state.maxwellCaseData}
                                      caseId={this.props.caseId}
                                      readOnly={this.props.readOnly}
                                      onChange={this.handleChange}
                                      callOrigin={this.props.callOrigin}
                />
                <IncidentStepV2 caseId={this.props.caseId}
                                readOnly={this.props.readOnly}
                                is4steps={true}
                                incidentSelected={this.state?.incidentSelected}
                                setIncidentSelected={this.handleSelectIncident}
                                callOrigin={this.props.callOrigin}
                />
                <UploadComponentV2 caseId={this.props.caseId}
                                   readOnly={this.props.readOnly}
                                   ticketTitle={this.props.incident?.ticketTitle}
                                   callOrigin={this.props.callOrigin}/>
                <MaxwellValidationStep caseId={this.props.caseId}
                                       callOrigin={this.props.callOrigin}
                                       hidePreviousButton={this.hidePreviousButton}
                                       closeGrid={this.props.closeGrid}
                                       setShowGridADG={this.props.setShowGridADG}
                                       readOnly={this.props.readOnly}
                />
            </StepForm>
        ) : (
            <StepForm stepNames={this.getStepNames()} size={"sm"} caseId={this.props.caseId}>
                <AdditionalDataStepV2 data={this.props.callOrigin === EMaxwellCallOrigin.FROM_HISTORY ||
                this.props.callOrigin === EMaxwellCallOrigin.FROM_INCIDENTS_LIST ? this.props.maxwellCaseData : this.state.maxwellCaseData}
                                      caseId={this.props.caseId}
                                      readOnly={this.props.readOnly}
                                      currentSelectedTheme={this.props.currentSelectedTheme}
                                      onChange={this.handleChange}
                                      callOrigin={this.props.callOrigin}
                />
                <IncidentStepV2 caseId={this.props.caseId}
                                incidentSelected={this.state.incidentSelected}
                                readOnly={this.props.readOnly}
                                setIncidentSelected={this.handleSelectIncident}
                                callOrigin={this.props.callOrigin}
                />
                <UploadComponentV2 caseId={this.props.caseId} ticketTitle={this.props.incident?.ticketTitle}
                                   readOnly={this.props.readOnly}
                                   callOrigin={this.props.callOrigin}/>
            </StepForm>
        )
    }
}

const mapDispatchToProps = {
    setCallOriginMaxwell,
    setFormMaxwellIncompleteV2,
    setBlockingUIV2,
    fetchAndStoreIncidentsV2,
    setAdditionalDataMaxwell,
    setInitMaxwellIncident
}

const mapStateToProps = (state: AppState, ownProps: Props) => ({
    payload: state.payload.payload
})

export default connect(mapStateToProps, mapDispatchToProps)(withFormsy(MaxwellSectionV2))