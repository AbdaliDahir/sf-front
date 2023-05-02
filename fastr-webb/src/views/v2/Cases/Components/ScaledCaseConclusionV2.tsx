import * as React from "react";
import {ChangeEvent} from "react";
import {connect} from "react-redux";
import {FormGroup} from "reactstrap";

import {Case} from "../../../../model/Case";
import {AppState} from "../../../../store";

import ValidationUtils from "../../../../utils/ValidationUtils";
import FormSelectInput from "../../../../components/Form/FormSelectInput";
import {FormattedMessage} from "react-intl";

import Label from "reactstrap/lib/Label";
import "./ScaledCaseConclusionV2.scss"
import {ScaledConclusionSetting} from "../../../../model/ScaledConclusionSetting";
import {setScalingConclusionRefV2} from "../../../../store/actions/v2/case/CaseActions";
import {translate} from "../../../../components/Intl/IntlGlobalProvider";

interface Props {
    caseId: string
    retrievedCase: Case
    selectedStatus: string
    scaledCaseConclusionSettings?: Map<string, ScaledConclusionSetting[]>
    setScalingConclusionRefV2: (caseId: string, value) => void
    isUnjustifiedFieldMandatory: boolean
    disabled?: boolean
}

export interface State {
    processed: boolean;
    caseType: string,
    clientWarned: string,
    isUnjustified: boolean,
    clientConfirmed: string
}

const clientInformationDefaultValues = "clientInformationDefaultValues";

class ScaledCaseConclusionV2 extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            processed: false,
            caseType: this.specifyCaseType(),
            clientWarned: this.setClientInformedDefaultValue(),
            isUnjustified: false,
            clientConfirmed:  this.setClientConfirmedByTelDefaultValue()
        }
    }

    public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any) {
        if (prevProps.selectedStatus !== this.props.selectedStatus) {
            this.setState({
                processed: false,
                caseType: this.specifyCaseType(),
                clientWarned: this.setClientInformedDefaultValue(),
                isUnjustified: false,
                clientConfirmed: this.setClientConfirmedByTelDefaultValue()
            })
        }
    }

    public specifyCaseType() {
        const type = this.props.retrievedCase.qualification.caseType;
        if (type && type.includes("Commercial")) {
            return "Commercial"
        } else if (type && type.includes("Technique")) {
            return "Technique"
        }
        return ""
    }

    public handleClientWarn = (event: ChangeEvent<HTMLInputElement>) => {
        const res = event.currentTarget.value;
        if (res === "Oui") {
            this.setState({
                clientWarned: res
            });
        } else if (res === "Non") {
            this.setState({
                clientWarned: res
            });
        }
    };

    public handleClientConfirmationResolved = (event: ChangeEvent<HTMLInputElement>) => {
        const res = event.currentTarget.value;
        if (res === "Oui") {
            this.setState({
                clientConfirmed: res
            });
        } else if (res === "Non") {
            this.setState({
                clientConfirmed: res,
                clientWarned: ""
            });
        }
    };

    public setClientConfirmedByTelDefaultValue = () => {
        if(this.props.scaledCaseConclusionSettings) {
            const setting: ScaledConclusionSetting[] | undefined = this.props.scaledCaseConclusionSettings[clientInformationDefaultValues];
            if (setting) {
                const foundCode = setting.find(s => s.code === "clientConfirmedByTel")
                if(foundCode === undefined || foundCode.resolved === undefined) {
                    return ""
                }
                return foundCode?.resolved ? "Oui" : "Non"
            }
        }
        return ""
    };

    public setClientInformedDefaultValue = () => {
        if(this.props.scaledCaseConclusionSettings) {
            const setting: ScaledConclusionSetting[] | undefined = this.props.scaledCaseConclusionSettings[clientInformationDefaultValues];
            if (setting) {
                const foundCode = setting.find(s => s.code === "clientInformed")
                if(foundCode === undefined || foundCode.resolved === undefined) {
                    return ""
                }
                return foundCode?.resolved ? "Oui" : "Non"
            }
        }
        return ""
    };


    public handleJustificationState = (event: ChangeEvent<HTMLInputElement>) => {
        const res = event.currentTarget.value;
        if (res === "Oui") {
            this.setState({
                isUnjustified: true
            });
        } else if (res === "Non") {
            this.setState({
                isUnjustified: false
            });
        }
    };

    public renderYesOrNotInput(): JSX.Element {
        return (
            <React.Fragment>
                <option key="default" value="" disabled
                        selected/>
                <option key="default" value="Oui">Oui</option>
                <option key="default" value="Non">Non</option>
            </React.Fragment>
        )
    }

    public renderClientWarnedResolved(): JSX.Element {
        if ((this.props.selectedStatus === "UNRESOLVED" || this.props.selectedStatus === "RESOLVED") && this.state.clientConfirmed === "Non") {
            return (
                <React.Fragment>
                    <section className={"scaled_case_conclusion__form_element"}>
                        <FormGroup>
                            <Label className={"font-weight-bold"}>
                                <FormattedMessage
                                    id="cases.scaling.conclusion.clientforwarned"/><span
                                className="text-danger">*</span>
                            </Label>
                            <FormSelectInput
                                key={this.props.selectedStatus}
                                disabled={this.props.disabled ? this.props.disabled : false}
                                validations={{isRequired: ValidationUtils.notEmpty}}
                                name="scaling.scalingConclusion.clientForwarned" id="clientForwarned"
                                label={translate.formatMessage({id: "cases.scaling.conclusion.clientforwarned"})}
                                onChange={this.handleClientWarn}
                                forcedValue={this.state.clientWarned}
                                forceDirty
                            >
                                {this.renderYesOrNotInput()}
                            </FormSelectInput>
                        </FormGroup>
                    </section>
                </React.Fragment>
            )
        } else {
            return <React.Fragment/>
        }
    }

    private renderOptionsFromSetting = (fieldName: string): JSX.Element[] => {
        if (this.props.scaledCaseConclusionSettings) {
            const setting: ScaledConclusionSetting[] | undefined = this.props.scaledCaseConclusionSettings[fieldName];
            if (setting) {
                return setting.filter((s) => s.resolved === (this.props.selectedStatus === "RESOLVED"))
                    .sort((a, b) =>
                        a.label.localeCompare(b.label)
                    )
                    .map((s) =>
                        <option value={s.label}>
                            {s.label}
                        </option>)
            }
        }

        return [<React.Fragment/>];
    }

    public renderInformWay(): JSX.Element {
        if ((this.props.selectedStatus === "UNRESOLVED" || this.props.selectedStatus === "RESOLVED") &&  this.state.clientWarned === "Oui" && this.state.clientConfirmed === "Non") {
            return (
                <React.Fragment>
                    <section className={"scaled_case_conclusion__form_element"}>

                        <FormGroup>
                            <Label className={"font-weight-bold"}>
                                <FormattedMessage
                                    id="cases.scaling.conclusion.informingway"/><span
                                className="text-danger">*</span>
                            </Label>
                            <FormSelectInput
                                key={this.props.selectedStatus}
                                value={""}
                                validations={{isRequired: ValidationUtils.notEmpty}}
                                name="scaling.scalingConclusion.informingWay" id="informingWay"
                                label={translate.formatMessage({id: "cases.scaling.conclusion.informingway"})}
                                disabled={this.props.disabled ? this.props.disabled : false}
                                forceDirty
                            >
                                <option key="default" value="" disabled
                                        selected/>
                                {this.renderOptionsFromSetting("informingWay")}
                            </FormSelectInput>
                        </FormGroup>
                    </section>
                </React.Fragment>
            )
        } else {
            return <React.Fragment/>;
        }
    }

    private renderTreatmentType = (): JSX.Element => {
        return (
            <React.Fragment>
                <section className={"scaled_case_conclusion__form_element"}>
                    <Label className={"font-weight-bold"}>
                        <FormattedMessage
                            id="cases.scaling.conclusion.treatmenttype"/><span
                        className="text-danger">*</span>
                    </Label>
                    <FormSelectInput
                        key={this.props.selectedStatus}
                        disabled={this.props.disabled ? this.props.disabled : false}
                        validations={{isRequired: ValidationUtils.notEmpty}}
                        name="scaling.scalingConclusion.treatmentType" id="treatmentType"
                        label={translate.formatMessage({id: "cases.scaling.conclusion.treatmenttype"})}
                        forceDirty
                    >
                        <option key="default"
                                value={""}
                                disabled
                                selected/>
                        {this.renderOptionsFromSetting("treatmentType")}
                    </FormSelectInput>
                </section>
            </React.Fragment>
        )
    }

    private renderDysfunctionCause = (): JSX.Element => {
        return (
            <React.Fragment>
                <section className={"scaled_case_conclusion__form_element"}>
                    <Label className={"font-weight-bold"}>
                        <FormattedMessage
                            id="cases.scaling.conclusion.dysfuntioncause"/><span
                        className="text-danger">*</span>
                    </Label>
                    <FormSelectInput
                        key={this.props.selectedStatus}
                        disabled={this.props.disabled ? this.props.disabled : false}
                        validations={{isRequired: ValidationUtils.notEmpty}}
                        name="scaling.scalingConclusion.dysfuntionCause" id="dysfuntionCause"
                        label={translate.formatMessage({id: "cases.scaling.conclusion.dysfuntioncause"})}
                        forceDirty
                    >
                        <option key="default" value="" disabled
                                selected/>
                        {this.renderOptionsFromSetting("dysfuntionCause")}
                    </FormSelectInput>
                </section>
            </React.Fragment>

        )
    }

    private renderResolutionAction = (): JSX.Element => {
        return (
            <React.Fragment>
                <section className={"scaled_case_conclusion__form_element"}>
                    <Label className={"font-weight-bold"}>
                        <FormattedMessage
                            id="cases.scaling.conclusion.resolutionaction"/><span
                        className="text-danger">*</span>
                    </Label>
                    <FormSelectInput
                        key={this.props.selectedStatus}
                        disabled={this.props.disabled ? this.props.disabled : false}
                        validations={{isRequired: ValidationUtils.notEmpty}}
                        name="scaling.scalingConclusion.resolutionAction" id="resolutionAction"
                        label={translate.formatMessage({id: "cases.scaling.conclusion.resolutionaction"})}
                        forceDirty
                    >
                        <option key="default" value="" disabled
                                selected/>
                        {this.renderOptionsFromSetting("resolutionAction")}

                    </FormSelectInput>
                </section>
            </React.Fragment>

        )
    }

    private renderClientConfirmation = (): JSX.Element => {
        return (
            <React.Fragment>
                <section className={"scaled_case_conclusion__form_element"}>
                    <FormGroup>
                        <Label className={"font-weight-bold"}>
                            <FormattedMessage
                                id="cases.scaling.conclusion.clientconfirmation"/><span
                            className="text-danger">*</span>
                        </Label>
                        <FormSelectInput
                            key={this.props.selectedStatus}
                            disabled={this.props.disabled ? this.props.disabled : false}
                            validations={{isRequired: ValidationUtils.notEmpty}}
                            name="scaling.scalingConclusion.clientConfirmation" id="clientConfirmation"
                            label={translate.formatMessage({id: "cases.scaling.conclusion.clientconfirmation"})}
                            onChange={this.handleClientConfirmationResolved}
                            forcedValue={this.state.clientConfirmed}
                            forceDirty
                        >
                            {this.renderYesOrNotInput()}
                        </FormSelectInput>
                    </FormGroup>
                </section>
            </React.Fragment>
        )
    }

    private renderUnresolutionCause = (): JSX.Element => {
        return (
            <React.Fragment>
                <section className={"scaled_case_conclusion__form_element"}>
                    <FormGroup>
                        <Label className={"font-weight-bold"}>
                            <FormattedMessage id="cases.scaling.conclusion.unresolutioncause"/>
                            <span className="text-danger">*</span>
                        </Label>
                        <FormSelectInput
                            key={this.props.selectedStatus}
                            disabled={this.props.disabled ? this.props.disabled : false}
                            validations={{isRequired: ValidationUtils.notEmpty}}
                            name="scaling.scalingConclusion.unresolutionCause" id="unresolutionCause"
                            label={translate.formatMessage({id: "cases.scaling.conclusion.unresolutioncause"})}
                            forceDirty
                        >
                            <option key="default" value="" disabled
                                    selected/>
                            {this.renderOptionsFromSetting("unresolutionCause")}
                        </FormSelectInput>
                    </FormGroup>
                </section>
            </React.Fragment>
        )
    }

    public renderJustificationPart(): JSX.Element {
        return (
            <React.Fragment>
                <section className={"scaled_case_conclusion__form_element"}>
                    <FormGroup>
                        <Label className={"font-weight-bold"} for="scaling-justification-switch">
                            <FormattedMessage id="cases.scaling.conclusion.justification.title"/>
                            <span className="text-danger">*</span>
                        </Label>
                        <FormSelectInput color="primary"
                                         key={this.props.selectedStatus}
                                         disabled={this.props.disabled ? this.props.disabled : false}
                                         validations={this.props.isUnjustifiedFieldMandatory ? {isRequired: ValidationUtils.notEmpty} : {}}
                                         name="scaling.scalingConclusion.isUnjustified"
                                         label={translate.formatMessage({id: "cases.scaling.conclusion.justification.title"})}
                                         id="isUnjustified"
                                         onChange={this.handleJustificationState}
                                         value=""
                                         forceDirty
                        >
                            {this.renderYesOrNotInput()}
                        </FormSelectInput>
                    </FormGroup>
                </section>
                {this.renderJustificationCause()}
            </React.Fragment>
        )
    }

    public renderJustificationCause(): JSX.Element {
        const isUnjustified = this.state.isUnjustified;
        if (isUnjustified) {
            return (
                <React.Fragment>
                    <section className={"scaled_case_conclusion__form_element"}>
                        <Label className={"font-weight-bold"}>
                            <FormattedMessage
                                id="cases.scaling.conclusion.unjustificationcause"/>
                            <span className="text-danger">*</span>
                        </Label>
                        <FormSelectInput
                            key={this.props.selectedStatus}
                            disabled={this.props.disabled ? this.props.disabled : false}
                            validations={{isRequired: ValidationUtils.notEmpty}}
                            name="scaling.scalingConclusion.unjustificationCause" id="unjustificationCause"
                            label={translate.formatMessage({id: "cases.scaling.conclusion.unjustificationcause"})}
                            forceDirty
                        >
                            <option key="default" value="" disabled
                                    selected/>
                            {this.renderOptionsFromSetting("unjustificationCause")}
                        </FormSelectInput>
                    </section>
                </React.Fragment>
            )
        } else {
            return (
                <React.Fragment/>
            )
        }
    }

    private renderData(): JSX.Element[] {
        const {caseType} = this.state
        const elements: JSX.Element[] = []
        if (this.props.selectedStatus === "RESOLVED") {
            if (caseType === "Commercial") {
                elements.push(<section className={"scaled_case_conclusion__first_line"}>
                        {this.renderTreatmentType()}
                        {this.renderClientConfirmation()}
                    </section>
                );
            } else if (caseType === "Technique") {
                elements.push(<section className={"scaled_case_conclusion__first_line"}>
                        {this.renderDysfunctionCause()}
                        {this.renderResolutionAction()}
                        {this.renderClientConfirmation()}
                    </section>
                );
            }
        } else if (this.props.selectedStatus === "UNRESOLVED") {
            elements.push(<section className={"scaled_case_conclusion__first_line"}>
                    {this.renderUnresolutionCause()}
                    {this.renderClientConfirmation()}
                </section>
            );
        }
        elements.push(<section className={"scaled_case_conclusion__second_line"}>
                {this.renderClientWarnedResolved()}
                {this.renderInformWay()}
            </section>
        );
        if (this.props.selectedStatus === "RESOLVED") {
            elements.push(<section className={"scaled_case_conclusion__third_line"}>
                    {this.renderJustificationPart()}
                </section>
            );
        }
        return elements;
    }

    public render(): JSX.Element {
        return (
            <div ref={(ref) => this.props.setScalingConclusionRefV2(this.props.caseId, ref)}>
                {this.renderData()}
            </div>
        )
    }
}

const mapDispatchToProps = {
    setScalingConclusionRefV2
};
const mapStateToProps = (state: AppState, ownProps: Props) => ({
    retrievedCase: state.store.cases.casesList[ownProps.caseId]?.currentCase,
    isUnjustifiedFieldMandatory: state.store.cases.casesList[ownProps.caseId]?.isUnjustifiedFieldMandatory,
    scaledCaseConclusionSettings: state.store.cases.casesList[ownProps.caseId]?.scaledCaseConclusionSettings,
})

export default connect(mapStateToProps, mapDispatchToProps)(ScaledCaseConclusionV2)
