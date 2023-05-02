import * as React from "react";
import {ChangeEvent} from "react";
import {connect} from "react-redux";
import {CardHeader, Col, FormGroup, Row} from "reactstrap";
import Card from "reactstrap/lib/Card";
import CardBody from "reactstrap/lib/CardBody";
import FormSwitchInput from "../../../../components/Form/FormSwitchInput";

import {Case} from "../../../../model/Case";
import {CaseScalingConclusion} from "../../../../model/CaseScalingConclusion";
import {AppState} from "../../../../store";

import ValidationUtils from "../../../../utils/ValidationUtils";
import FormSelectInput from "../../../../components/Form/FormSelectInput";
import {FormattedMessage} from "react-intl";

import Label from "reactstrap/lib/Label";
import {default as CaseStatusComponent} from "../../Components/Contacts/CaseStatus";
import {translate} from "../../../../components/Intl/IntlGlobalProvider";
import {setScalingConclusionRef} from "../../../../store/actions/CasePageAction";

interface Props {
    retrievedCase: Case
    finishingTreatment: boolean,
    updateMode: boolean,
    setScalingConclusionRef: (ref) => void
}

export interface State {
    processed: boolean;
    caseType: string,
    selectedStatus: string,
    clientWarned: boolean,
    isUnjustified: boolean,
    clientConfirmed: string

}

enum DYSFUNCTION_CAUSE {
    SIMCARD = 'SIMCARD', PROVISIONNING = 'PROVISIONNING', RADIO = "RADIO", NETWORK = "NETWORK", TERMINAL = "TERMINAL"
}

enum RESOLUTION_ACTION {
    COMPLEX_ANALYSIS = 'COMPLEXE_ANALYSIS',
    SCALE_N3 = 'SCALE_N3',
    SCALE_N2 = 'SCALE_N2',
    CONFIG_TERMINAL = 'CONFIG_TERMINAL',
    NETWORK_INCIDENT = 'NETWORK_INCIDENT',
    IT_INCIDENT = 'IT_INCIDENT',
    NEW_SIMCARD = 'NEW_SIMCARD'
}

enum UNJUSTIFIED_CAUSE {
    UNCORRECT_RECEIVER = 'UNCORRECT_RECEIVER', TRANSMITTER_HANDLING = 'TRANSMITTER_HANDLING'
}


class ScaledCaseConclusion extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            processed: false,
            caseType: this.specifyCaseType(),
            selectedStatus: this.getSelectedStatus(),
            clientWarned: false,
            isUnjustified: false,
            clientConfirmed: ""
        }
    }

    private getSelectedStatus() {
        return this.props.retrievedCase.status === 'RESOLVED'
        || this.props.retrievedCase.status === 'UNRESOLVED' ? this.props.retrievedCase.status : '';
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

    public handleCaseStatus = (status: 'RESOLVED' | 'UNRESOLVED' | '') => {
        if ((status === "RESOLVED" || status === "UNRESOLVED") && (status !== this.state.selectedStatus)) {
            this.setState({
                selectedStatus: status,
                clientWarned: false,
                clientConfirmed: "",
                isUnjustified: false
            });
        }
    };

    public handleClientWarn = (event: ChangeEvent<HTMLInputElement>) => {
        const res = event.currentTarget.value;
        if (res === "Oui") {
            this.setState({
                clientWarned: true
            });
        } else if (res === "Non") {
            this.setState({
                clientWarned: false
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
                clientWarned: false
            });
        }
    };

    public renderResolvedTechnique(isHidden: boolean): JSX.Element {
        const scaledConclusion = this.props.retrievedCase.finishingTreatmentConclusion;
        return (
            <React.Fragment>
                <Row>
                    <h6><Label className={"col-form-label"}>
                        <FormattedMessage
                            id="cases.scaling.conclusion.dysfuntioncause"/><span
                        className="text-danger">*</span>
                    </Label>
                    </h6>
                    <FormSelectInput
                        key={this.state.selectedStatus}
                        value={scaledConclusion ? scaledConclusion.dysfuntionCause : ""}
                        validations={isHidden ? {} : {isRequired: ValidationUtils.notEmpty}}
                        name="dysfuntionCause" id="dysfuntionCause"
                        disabled={!this.props.updateMode}
                        classNameToProps={"w-100"}>
                        <option key="default" value="" disabled
                                selected/>
                        {Object.keys(DYSFUNCTION_CAUSE).map(cause =>
                            <option key="default"
                                    value={translate.formatMessage({id: `cases.scaling.conclusion.dysfunction.cause.${cause}`})}>{translate.formatMessage({id: `cases.scaling.conclusion.dysfunction.cause.${cause}`})}</option>
                        )}
                    </FormSelectInput>
                </Row>
                <Row>
                    <h6><Label className={"col-form-label"}>
                        <FormattedMessage
                            id="cases.scaling.conclusion.resolutionaction"/><span
                        className="text-danger">*</span>
                    </Label>
                    </h6>
                    <FormSelectInput
                        key={this.state.selectedStatus}
                        value={scaledConclusion ? scaledConclusion.resolutionAction : ""}
                        validations={isHidden ? {} : {isRequired: ValidationUtils.notEmpty}}
                        name="resolutionAction" id="resolutionAction"
                        disabled={!this.props.updateMode}
                        classNameToProps={"w-100"}>
                        <option key="default" value="" disabled
                                selected/>
                        {Object.keys(RESOLUTION_ACTION).map(action =>
                            <option key="default"
                                    value={translate.formatMessage({id: `cases.scaling.conclusion.resolution.action.${action}`})}>{translate.formatMessage({id: `cases.scaling.conclusion.resolution.action.${action}`})}</option>
                        )}
                    </FormSelectInput>
                </Row>
                <Row className={"pb-5"}>
                    <FormGroup>
                        <h6><Label className={"col-form-label"}>
                            <FormattedMessage
                                id="cases.scaling.conclusion.clientconfirmation"/><span
                            className="text-danger">*</span>
                        </Label>
                        </h6>
                        <FormSelectInput
                            key={this.state.selectedStatus}
                            value={scaledConclusion ? scaledConclusion.clientConfirmation : ""}
                            validations={isHidden ? {} : {isRequired: ValidationUtils.notEmpty}}
                            name="clientConfirmation" id="clientConfirmation"
                            disabled={!this.props.updateMode}
                            onChange={this.handleClientConfirmationResolved}
                            classNameToProps={"w-100"}>
                            {this.renderYesOrNotInput()}
                        </FormSelectInput>
                    </FormGroup>
                </Row>
                <Row>
                    {this.renderClientWarnedResolved(isHidden)}
                </Row>
                <Row className={"mt-5 "}>
                    {this.renderInformWay(isHidden)}
                </Row>

            </React.Fragment>
        )
    }

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

    public renderResolvedCommercial(isHidden: boolean): JSX.Element {
        const scaledConclusion = this.props.retrievedCase.finishingTreatmentConclusion;
        return (
            <React.Fragment>
                <Row>
                    <h6><Label className={"col-form-label"}>
                        <FormattedMessage
                            id="cases.scaling.conclusion.treatmenttype"/><span
                        className="text-danger">*</span>
                    </Label>
                    </h6>
                </Row>
                <Row>
                    <FormSelectInput
                        key={this.state.selectedStatus}
                        value={scaledConclusion ? scaledConclusion.treatmentType : ""}
                        validations={isHidden ? {} : {isRequired: ValidationUtils.notEmpty}}
                        name="treatmentType" id="treatmentType"
                        disabled={!this.props.updateMode}
                        classNameToProps={"w-100"}>
                        <option key="default"
                                value={""}
                                disabled
                                selected/>
                        <option key="default" value="Favorable">Favorable</option>
                        <option key="default" value="Défavorable">Défavorable</option>
                        <option key="default" value="Partiellement favorable">Partiellement favorable
                        </option>
                    </FormSelectInput>
                </Row>
                <Row>
                    <FormGroup>
                        <h6><Label className={"col-form-label"}>
                            <FormattedMessage
                                id="cases.scaling.conclusion.clientconfirmation"/><span
                            className="text-danger">*</span>
                        </Label>
                        </h6>
                        <FormSelectInput
                            key={this.state.selectedStatus}
                            value={scaledConclusion ? scaledConclusion.clientConfirmation : ""}
                            validations={isHidden ? {} : {isRequired: ValidationUtils.notEmpty}}
                            name="clientConfirmation" id="clientConfirmation"
                            disabled={!this.props.updateMode} onChange={this.handleClientConfirmationResolved}
                            classNameToProps={"w-100"}>
                            {this.renderYesOrNotInput()}
                        </FormSelectInput>
                    </FormGroup>
                </Row>
                <Row>
                    {this.renderClientWarnedResolved(isHidden)}
                </Row>
                {this.renderInformWay(isHidden)}
            </React.Fragment>
        )
    }

    public renderClientWarnedResolved(isHidden: boolean): JSX.Element {
        const scaledConclusion = this.props.retrievedCase.finishingTreatmentConclusion;
        const clientForwarned = scaledConclusion ? scaledConclusion.clientForwarned : undefined;
        if (clientForwarned || this.state.clientConfirmed === "Non") {
            return (
                <React.Fragment>
                    <FormGroup>
                        <h6><Label className={"col-form-label"}>
                            <FormattedMessage
                                id="cases.scaling.conclusion.clientforwarned"/><span className="text-danger">*</span>
                        </Label>
                        </h6>
                        <FormSelectInput
                            key={this.state.selectedStatus}
                            validations={isHidden ? {} : {isRequired: ValidationUtils.notEmpty}}
                            name="clientForwarned" id="clientForwarned"
                            disabled={!this.props.updateMode} onChange={this.handleClientWarn}
                            value={scaledConclusion ? scaledConclusion.clientForwarned : ""}
                            classNameToProps={"w-100"}
                        >
                            {this.renderYesOrNotInput()}
                        </FormSelectInput>
                    </FormGroup>

                </React.Fragment>
            )
        } else {
            return <React.Fragment/>
        }
    }

    public renderInformWay(isHidden: boolean): JSX.Element {
        const scaledConclusion = this.props.retrievedCase.finishingTreatmentConclusion;
        const informingWay = scaledConclusion !== undefined && scaledConclusion !== null ? scaledConclusion.informingWay : "";
        if (informingWay) {
            return (
                <React.Fragment>
                    <Row>
                        <FormGroup>
                            <h6><Label className={"col-form-label"}>
                                <FormattedMessage
                                    id="cases.scaling.conclusion.informingway"/><span
                                className="text-danger">*</span>
                            </Label>
                            </h6>
                            <FormSelectInput
                                key={this.state.selectedStatus}
                                value={informingWay}
                                validations={isHidden ? {} : {isRequired: ValidationUtils.notEmpty}}
                                name="informingWay" id="informingWay"
                                disabled={true}
                                classNameToProps={"w-100"}>
                                <option key="default" value="" disabled
                                        selected/>
                                <option key="default" value="SMSi">SMSi</option>
                                <option key="default" value="SMS">SMS</option>
                                <option key="default" value="Mail">Mail</option>
                                <option key="default" value="Courrier">Courrier</option>
                                <option key="default" value="Répondeur">Répondeur</option>
                            </FormSelectInput>
                        </FormGroup>
                    </Row>
                </React.Fragment>
            )
        } else if (this.state.clientWarned && this.state.clientConfirmed === "Non") {
            return (
                <React.Fragment>
                    <Row>
                        <FormGroup>
                            <h6><Label className={"col-form-label"}>
                                <FormattedMessage
                                    id="cases.scaling.conclusion.informingway"/><span
                                className="text-danger">*</span>
                            </Label>
                            </h6>
                            <FormSelectInput
                                key={this.state.selectedStatus}
                                value={""}
                                validations={isHidden ? {} : {isRequired: ValidationUtils.notEmpty}}
                                name="informingWay" id="informingWay"
                                disabled={false}
                                classNameToProps={"w-100"}>
                                <option key="default" value="" disabled
                                        selected/>
                                <option key="default" value="SMS">SMS</option>
                                <option key="default" value="Mail">Mail</option>
                                <option key="default" value="Courrier">Courrier</option>
                                <option key="default" value="Répondeur">Répondeur</option>
                            </FormSelectInput>
                        </FormGroup>
                    </Row>
                </React.Fragment>
            )
        } else {
            return <React.Fragment/>;
        }
    }

    public renderUnresolvedTechnique(isHidden: boolean): JSX.Element {
        const scaledConclusion = this.props.retrievedCase.finishingTreatmentConclusion;
        return (
            <React.Fragment>
                <Row>
                    <h6><Label className={"col-form-label"}>
                        <FormattedMessage
                            id="cases.scaling.conclusion.unresolutioncause"/><span className="text-danger">*</span>
                    </Label>
                    </h6>
                    <FormSelectInput
                        key={this.state.selectedStatus}
                        value={scaledConclusion ? scaledConclusion.unresolutionCause : ""}
                        validations={isHidden ? {} : {isRequired: ValidationUtils.notEmpty}}
                        name="unresolutionCause" id="unresolutionCause"
                        disabled={!this.props.updateMode}
                        classNameToProps={"w-100"}>
                        <option key="default" value="" disabled
                                selected/>
                        <option key="default" value="Traitable par émetteur">Traitable par émetteur</option>
                        <option key="default" value="Mauvais destinataire">Mauvais destinataire</option>
                        <option key="default" value="Incomplet">Incomplet</option>
                        <option key="default"
                                value={translate.formatMessage({id: "document not found"})}>{translate.formatMessage({id: "document not found"})}</option>
                    </FormSelectInput>
                </Row>
                <Row>
                    <h6><Label className={"col-form-label"}>
                        <FormattedMessage
                            id="cases.scaling.conclusion.clientconfirmation"/><span
                        className="text-danger">*</span>
                    </Label>
                    </h6>
                    <FormSelectInput
                        key={this.state.selectedStatus}
                        value={scaledConclusion ? scaledConclusion.clientConfirmation : ""}
                        validations={isHidden ? {} : {isRequired: ValidationUtils.notEmpty}}
                        name="clientConfirmation" id="clientConfirmation"
                        disabled={!this.props.updateMode} onChange={this.handleClientConfirmationResolved}
                        classNameToProps={"w-100"}>
                        {this.renderYesOrNotInput()}
                    </FormSelectInput>
                </Row>
                <Row>
                    {this.renderClientWarnedResolved(isHidden)}
                </Row>
                {this.renderInformWay(isHidden)}
            </React.Fragment>
        )
    }

    public renderUnresolvedCommercial(isHidden: boolean): JSX.Element {
        const scaledConclusion = this.props.retrievedCase.finishingTreatmentConclusion;
        return (
            <React.Fragment>
                <Row>
                    <h6><Label className={"col-form-label"}>
                        <FormattedMessage
                            id="cases.scaling.conclusion.unresolutioncause"/><span className="text-danger">*</span>
                    </Label>
                    </h6>
                    <FormSelectInput
                        key={this.state.selectedStatus}
                        value={scaledConclusion? scaledConclusion.unresolutionCause : ""}
                        validations={isHidden ? {} : {isRequired: ValidationUtils.notEmpty}}
                        name="unresolutionCause" id="unresolutionCause"
                        disabled={!this.props.updateMode}
                        classNameToProps={"w-100"}>
                        <option key="default"
                                value=""
                                disabled
                                selected/>
                        <option key="default" value="Traitable par émetteur">Traitable par émetteur</option>
                        <option key="default" value="Mauvais destinataire">Mauvais destinataire</option>
                        <option key="default" value="Incomplet">Incomplet</option>
                        <option key="default"
                                value={translate.formatMessage({id: "document not found"})}>{translate.formatMessage({id: "document not found"})}</option>
                    </FormSelectInput>
                </Row>
                <Row>
                    <h6><Label className={"col-form-label"}>
                        <FormattedMessage
                            id="cases.scaling.conclusion.clientconfirmation"/>
                        <span className="text-danger">*</span>
                    </Label>
                    </h6>
                    <FormSelectInput
                        key={this.state.selectedStatus}
                        value={scaledConclusion ? scaledConclusion.clientConfirmation : ""}
                        validations={isHidden ? {} : {isRequired: ValidationUtils.notEmpty}}
                        name="clientConfirmation" id="clientConfirmation"
                        disabled={!this.props.updateMode} onChange={this.handleClientConfirmationResolved}
                        classNameToProps={"w-100"}>
                        {this.renderYesOrNotInput()}
                    </FormSelectInput>
                </Row>
                <Row>
                    {this.renderClientWarnedResolved(isHidden)}
                </Row>
                {this.renderInformWay(isHidden)}
            </React.Fragment>
        )
    }

    public renderLackOfSettings(isHidden: boolean): JSX.Element {
        return (
            <React.Fragment>
                <Col md={8} className={"text-center"}>
                    <h6 className="text-primary"><FormattedMessage
                        id="cases.scaling.conclusion.settings.lack"/><span className="text-danger">*</span></h6>
                    <FormGroup className="d-none">
                        <FormSelectInput
                            value=""
                            validations={isHidden ? {} : {isRequired: ValidationUtils.notEmpty}}
                            name="emptyScaledCaseConclusion"
                            classNameToProps={"w-100"}>
                            <option key="default" value="" disabled
                                    selected/>
                        </FormSelectInput>
                    </FormGroup>

                </Col>
            </React.Fragment>
        )
    }

    public caseStatusBeforeClosing = () => {
        const scaledConculsion: CaseScalingConclusion | undefined = this.props.retrievedCase.finishingTreatmentConclusion
        if (scaledConculsion && scaledConculsion.unresolutionCause && scaledConculsion.unresolutionCause !== "") {
            return "UNRESOLVED"
        } else {
            return "RESOLVED"
        }
    }

    public renderData(isHidden: boolean): JSX.Element {
        let {selectedStatus} = this.state
        const {caseType} = this.state
        if (!this.props.updateMode) {
            selectedStatus = this.props.retrievedCase.status;
        }
        if (selectedStatus === "CLOSED") {
            selectedStatus = this.caseStatusBeforeClosing()
        }
        if (selectedStatus === "" && this.props.updateMode) {
            return <React.Fragment/>;
        } else if (selectedStatus === "UNRESOLVED" && caseType === "Commercial") {
            return this.renderUnresolvedCommercial(isHidden);
        } else if (selectedStatus === "RESOLVED" && caseType === "Commercial") {
            return this.renderResolvedCommercial(isHidden);
        } else if (selectedStatus === "UNRESOLVED" && caseType === "Technique") {
            return this.renderUnresolvedTechnique(isHidden);
        } else if (selectedStatus === "RESOLVED" && caseType === "Technique") {
            return this.renderResolvedTechnique(isHidden);
        } else if ((selectedStatus === "RESOLVED" || selectedStatus === "UNRESOLVED") && caseType === "") {
            return this.renderLackOfSettings(isHidden);
        } else {
            return <React.Fragment/>;
        }
    }

    public handleJustificationState = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({
            isUnjustified: event.currentTarget.checked
        });
    };

    public isCommercialResolvedCase = () => {
        const currentCaseStatus = this.props.retrievedCase.status;
        const updateMode = this.props.updateMode;
        if (this.state.caseType !== "Commercial") {
            return false;
        } else if (updateMode) {
            return this.state.selectedStatus === "RESOLVED"
        } else {
            if (currentCaseStatus !== "CLOSED") {
                return currentCaseStatus === "RESOLVED"
            } else {
                return this.caseStatusBeforeClosing() === "RESOLVED"
            }
        }
    }

    public renderJustificationPart(isHidden: boolean): JSX.Element {
        const scaledConclusion = this.props.retrievedCase.finishingTreatmentConclusion;
        const isJustified = (scaledConclusion !== undefined && scaledConclusion !== null) ? scaledConclusion.isUnjustified : ""

        if (!this.isCommercialResolvedCase()) {
            return <React.Fragment/>
        } else {
            return (
                <React.Fragment>
                    <h6><Label for="scaling-justification-switch"><FormattedMessage
                        id="cases.scaling.conclusion.justification.title"/></Label></h6>
                    <FormSwitchInput color="primary"
                                     key={this.state.selectedStatus}
                                     valueOn={translate.formatMessage({id: "global.dialog.yes"})}
                                     valueOff={translate.formatMessage({id: "global.dialog.no"})}
                                     name="isUnjustified"
                                     id="isUnjustified"
                                     disabled={!this.props.updateMode}
                                     value={isJustified === "true"}
                                     defaultValue={translate.formatMessage({id: "global.dialog.no"})}
                                     onChange={this.handleJustificationState}
                                     classNameToProps={"w-100"}/>
                    {this.renderJustificationCause(isHidden)}
                </React.Fragment>
            )
        }
    }

    public renderJustificationCause(isHidden: boolean): JSX.Element {
        const isUnjustified = this.state.isUnjustified;
        const scaledConclusion = this.props.retrievedCase.finishingTreatmentConclusion;
        if (isUnjustified || (scaledConclusion && scaledConclusion.isUnjustified === "true")) {
            return (
                <React.Fragment>
                    <Row>
                        <h6><Label className={"col-form-label"}>
                            <FormattedMessage id="cases.scaling.conclusion.unjustificationcause"/>
                            <span className="text-danger">*</span>
                        </Label>
                        </h6>
                        <FormSelectInput
                            key={this.state.selectedStatus}
                            value={scaledConclusion ? scaledConclusion.unjustificationCause : ""}
                            validations={isHidden ? {} : {isRequired: ValidationUtils.notEmpty}}
                            name="unjustificationCause" id="unjustificationCause"
                            disabled={!this.props.updateMode}
                            classNameToProps={"w-100"}>
                            <option key="default" value="" disabled
                                    selected/>
                            {Object.keys(UNJUSTIFIED_CAUSE).map(action =>
                                <option key="default"
                                        value={translate.formatMessage({id: `cases.scaling.conclusion.justification.${action}`})}>{translate.formatMessage({id: `cases.scaling.conclusion.justification.${action}`})}</option>
                            )}
                        </FormSelectInput>
                    </Row>
                </React.Fragment>
            )
        } else {
            return (
                <React.Fragment/>
            )
        }
    }


    public render(): JSX.Element {
        const {updateMode} = this.props;
        const {finishingTreatment} = this.props;
        const status = this.props.retrievedCase.status;
        let scalingResolved = false;
        if (status === "RESOLVED" || status === "UNRESOLVED" || status === "CLOSED") {
            scalingResolved = true
        }
        const isHidden = !((scalingResolved && !updateMode) || (finishingTreatment && updateMode && !scalingResolved));
        return (
            <div ref={(ref) => this.props.setScalingConclusionRef(ref)}>
                <Card hidden={isHidden}>
                    <CardHeader>
                        <span className="icon-gradient icon-contract mr-2"/>
                        <FormattedMessage
                            id="cases.scaling.conclusion.title"/>
                    </CardHeader>
                    <CardBody>
                        <Row className={"text-center border-right"}>
                            <Col>
                                <CaseStatusComponent handleStatusChange={this.handleCaseStatus}
                                                     value={updateMode ? this.state.selectedStatus : status}
                                                     disabled={!this.props.updateMode}
                                                     isHidden={isHidden}/>
                            </Col>
                            <Col className={"pl-5"}>
                                {this.renderJustificationPart(isHidden)}
                                {this.renderData(isHidden)}
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </div>
        )
    }
}
const mapDispatchToProps = {
    setScalingConclusionRef
};
const mapStateToProps = (state: AppState) => ({
    retrievedCase: state.case.currentCase,
    finishingTreatment: state.casePage.finishingTreatment,
    updateMode: state.casePage.updateMode
})

export default connect(mapStateToProps, mapDispatchToProps)(ScaledCaseConclusion)
