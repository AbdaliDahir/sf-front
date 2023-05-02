import * as React from "react";
import {ChangeEvent} from "react";

import {connect} from "react-redux";
import {AppState} from "../../../store";
import {translate} from "../../../components/Intl/IntlGlobalProvider";
import {Col, FormGroup, Label, Row, UncontrolledAlert} from "reactstrap";
import {FormattedMessage} from "react-intl";
import FormSwitchInput from "../../../components/Form/FormSwitchInput";
import Container from "reactstrap/lib/Container";
import {RetentionProposal, RetentionProposalWithoutCommitment} from "./RetentionEnums";

import ValidationUtils from "../../../utils/ValidationUtils";
import FormSelectInput from "../../../components/Form/FormSelectInput";
import FormTextInput from "../../../components/Form/FormTextInput";
import RetentionButtonRadio from "./RetentionButtonRadio";
import ActService from "../../../service/ActService";
import {RetentionActResponseDTO} from "../../../model/acts/retention/RetentionActResponseDTO";
import {Case} from "../../../model/Case";
import {fetchAndStoreRetentionSettings} from "../../../store/actions";
import RetentionMotifs from "./RetentionMotifs";
import Tooltip from "reactstrap/lib/Tooltip";
import "./RetentionMotifs.scss"
import {fetchAndStoreRetentionIneligibilityCausesSettings} from "../../../store/actions/RetentionAction";
import {RetentionIneligibilityCausesSetting} from "../../../model/acts/retention/RetentionIneligibilityCausesSetting";
import {RetentionSetting} from "../../../model/acts/retention/RetentionSetting";


interface State {
    disabled: boolean
    isOutOfPerimDisabled: boolean
    isOutOfPerimeter: boolean
    resiliationIntention: boolean
    actRetentionData?: RetentionActResponseDTO
    isCauseIneligbility: boolean
    blockRetentionInsideGrid: boolean
    tooltipOpen: boolean
    tooltipOpenProposal: boolean
    tooltipOpenRefCommande: boolean
    tooltipOpenCauseInegibility: boolean
    clientRefusal: boolean
    isRetProposalFilled: boolean
    isRetNoProposal: boolean
    proposalWithoutCommitment?: string
}

interface Props {
    context?: string,
    idAct?: string,
    updateMode,
    currentCase: Case,
    resetFormRetention,
    authorizations,
    retentionSetting?: RetentionSetting,
    retentionIneligibilityCausesSetting: RetentionIneligibilityCausesSetting,
    fetchAndStoreRetentionSettings: () => void,
    fetchAndStoreRetentionIneligibilityCausesSettings: () => void,
    currentService
}

class EditRetentionData extends React.Component<Props, State> {

    private actService: ActService = new ActService(true);

    constructor(props: Props) {
        super(props);
        this.state = {
            disabled: true,
            isOutOfPerimDisabled: false,
            isOutOfPerimeter: false,
            isCauseIneligbility: false,
            blockRetentionInsideGrid: false,
            tooltipOpen: false,
            tooltipOpenProposal: false,
            tooltipOpenRefCommande: false,
            tooltipOpenCauseInegibility: false,
            resiliationIntention: true,
            clientRefusal: false,
            isRetProposalFilled: false,
            isRetNoProposal: false,
            proposalWithoutCommitment: ""
        }
    }

    public componentDidMount = async () => {
        console.warn('check parent store', !this.props.retentionSetting)
        if (!this.props.retentionSetting) {
            await this.props.fetchAndStoreRetentionSettings()
        }
        await this.props.fetchAndStoreRetentionIneligibilityCausesSettings();
        if (this.props.idAct) {
            const actRetentionData = await this.actService.getActRetention(this.props.idAct);
            this.setState({
                actRetentionData: actRetentionData,
                clientRefusal: actRetentionData.retentionData.clientAnswer === "REJECT",
                isRetProposalFilled: !!actRetentionData.retentionData.proposal,
                isOutOfPerimeter: actRetentionData.retentionData.outOfPerim,
                isCauseIneligbility: !!actRetentionData.retentionData.causeOfIneligibility,
                proposalWithoutCommitment: actRetentionData.retentionData.proposalWithoutCommitment?.code
            });

        }
        /*        if (this.props.context === "ADGInsideCase" && this.props.currentCase) {
                    this.setState({
                        blockRetentionInsideGrid: this.props.context === "ADGInsideCase" && isActRetentionPresent(this.props.currentCase)
                    })
                }*/

    }

    public componentDidUpdate = async (prevProps: Readonly<Props>) => {
        if(prevProps.idAct !== this.props.idAct) {
            if (this.props.idAct) {
                const actRetentionData = await this.actService.getActRetention(this.props.idAct);
                this.setState({
                    actRetentionData: actRetentionData,
                    clientRefusal: actRetentionData.retentionData.clientAnswer === "REJECT",
                    isRetProposalFilled: !!actRetentionData.retentionData.proposal,
                    isOutOfPerimeter: actRetentionData.retentionData.outOfPerim,
                    isCauseIneligbility: !!actRetentionData.retentionData.causeOfIneligibility,
                    proposalWithoutCommitment: actRetentionData.retentionData.proposalWithoutCommitment?.code
                });

            }
        }
    }

    // TODO HANDLE CALL FOR GETTING MOTIF/SOUSMOTIF SETTINGS
    // TODO HANDLE IN GENERIC COMPONENT
    public getListOfRetentionProposal = (): JSX.Element[] => {
        const retentionProposalOptions: JSX.Element[] = [];
        this.props.retentionSetting?.retentionProposals.forEach((retentProposal) => {
            if (retentProposal) {
                retentionProposalOptions[retentProposal.index] = <option key={retentProposal.code}
                                                                         value={retentProposal.code}>{translate.formatMessage({id: retentProposal.code})}</option>;
            }
        })
        return retentionProposalOptions;
    };

    public getListOfRetentionCauses = (): JSX.Element[] => {
        const retentionCausesOptions: JSX.Element[] = [];
        const filteredIneligibilityCauses = this.props
            .retentionIneligibilityCausesSetting?.ineligibilityCauses.filter((cause) => {
                return cause.serviceTypes.includes(this.props.currentService!.serviceType)
            })
        filteredIneligibilityCauses?.forEach((cause) => {
            retentionCausesOptions.push(<option key={cause.code}
                                                value={cause.code}>{cause.label}</option>);
        })
        return retentionCausesOptions;
    };

    public toggleTooltipretentionProposalDetail = () => this.setState(prevState => ({tooltipOpen: !prevState.tooltipOpen}));
    public toggleTooltipRetentionProposal = () => this.setState(prevState => ({tooltipOpenProposal: !prevState.tooltipOpenProposal}));
    public toggleTooltipRetentionRefCommande = () => this.setState(prevState => ({tooltipOpenRefCommande: !prevState.tooltipOpenRefCommande}));
    public toggleTooltipRetentionCauseInegibility = () => this.setState(prevState => ({tooltipOpenCauseInegibility: !prevState.tooltipOpenCauseInegibility}));

    public onClickPerimeter = e => {
        this.setState(prevState => ({isOutOfPerimeter: !prevState.isOutOfPerimeter}))
    }

    public onIntentionChange = (valueSelected: string) => {
        const isOutOfPerimDisabled = valueSelected === "YES";
        this.setState({resiliationIntention: isOutOfPerimDisabled})
        this.setState({isOutOfPerimDisabled});
    }

    public onEliRetentionChange = (valueSelected: string) => {
        const isCauseIneligbility = valueSelected === "YES";
        this.setState({isCauseIneligbility});
    }

    public forceOutOfPerim = (value: boolean) => {
        const isOutOfPerimeter = value;
        this.setState({isOutOfPerimeter});
    }

    public onAnswerChange = (event: ChangeEvent<HTMLInputElement>) => {
        const clientRefusal = event.currentTarget.value === "REJECT"
        this.setState({clientRefusal})
    }

    public onRetProposalChange = (event: ChangeEvent<HTMLInputElement>) => {
        const isRetProposalFilled: boolean = !!event.currentTarget.value
        this.setState({
            isRetProposalFilled,
            isRetNoProposal: event.currentTarget.value === RetentionProposal.NO_PROPOSAL
        });
        if (!isRetProposalFilled) {
            this.setState({clientRefusal: false})
        }
    }

    public getRetentionCauseInegibilityArr = (): {}[] => {
        const retentionCause: {}[] = [];
        this.props
            .retentionIneligibilityCausesSetting
            .ineligibilityCauses.forEach((retentCause) => {
            retentionCause.push({
                code: retentCause.code,
                label: retentCause.label
            });
        })
        return retentionCause;
    };

    public getRetentionCauseInegibilityLabel = () => {
        let retentionCauseLabel;
        const retentionCauseArr = this.getRetentionCauseInegibilityArr()
        if (retentionCauseArr) {
            // @ts-ignore
            retentionCauseLabel = retentionCauseArr.filter(el => el.code === this.state.actRetentionData?.retentionData.causeOfIneligibility)
        }
        return retentionCauseLabel[0] ? retentionCauseLabel[0].label : this.state.actRetentionData?.retentionData.causeOfIneligibility
    }

    public mustDisableInputs = () => {
        return -1 === this.props.authorizations.indexOf("ADG_RETENTION") || "ViewCasePage" === this.props.context && !this.props.updateMode
    }

    public renderCauseOfInegibility = () => {
        const {actRetentionData} = this.state
        const disableInputsOfForm = this.mustDisableInputs();
        const resetForm = this.props.resetFormRetention
        return !disableInputsOfForm ? (
            <div id={"tooltipRetentionDataFormCauseOfInegibility"} className={'retentionDataFormCauseInegibility'}>
                <FormSelectInput name="retentionDataForm.causeOfIneligibility"
                                 id="retentionDataForm.causeOfIneligibility"
                                 validations={{isRequired: ValidationUtils.notEmpty}}
                                 value={!resetForm && actRetentionData ? actRetentionData.retentionData.causeOfIneligibility : ""}
                                 disabled={false}>
                    <option selected disabled value=""/>
                    {
                        this.getListOfRetentionCauses()
                    }
                </FormSelectInput>
            </div>
        ) : (
            <div id={"tooltipRetentionDataFormCauseOfInegibility"}
                 className={'retentionDataFormCauseInegibility disabled'}>
                <FormTextInput name="retentionDataForm.causeOfIneligibility"
                               id="retentionDataForm.causeOfIneligibility"
                               validations={{isRequired: ValidationUtils.notEmpty}}
                               disabled={true}
                               value={!resetForm && actRetentionData ? this.getRetentionCauseInegibilityLabel() : ""}
                />
            </div>
        )
    }

    public renderRetentionProposal = () => {
        const {actRetentionData} = this.state
        const disableInputsOfForm = this.mustDisableInputs();
        const resetForm = this.props.resetFormRetention

        return <div id={"tooltipRetentionDataFormProposal"}
                    className={'retentionDataFormProposal' + disableInputsOfForm ? ' disabled' : ''}>
            <FormSelectInput name="retentionDataForm.proposal" id="retentionDataForm.proposal"
                             value={!resetForm && actRetentionData ? actRetentionData.retentionData.proposal : ""}
                             disabled={disableInputsOfForm}
                             validations={disableInputsOfForm?{isRequired: ValidationUtils.canBeEmpty}:{isRequired: ValidationUtils.notEmpty}}
                             onChange={this.onRetProposalChange}>
                <option selected value="" disabled/>
                {
                    this.getListOfRetentionProposal()
                }
            </FormSelectInput>
        </div>
    }

    public renderClientAnswer = () => {
        const {actRetentionData} = this.state
        const disableInputsOfForm = this.mustDisableInputs();
        const resetForm = this.props.resetFormRetention

        return !disableInputsOfForm ? (
            <FormSelectInput name="retentionDataForm.clientAnswer"
                             id="retentionDataForm.clientAnswer"
                             validations={{isRequired: ValidationUtils.notEmpty}}
                             value={!resetForm && actRetentionData ? actRetentionData.retentionData.clientAnswer : ""}
                             disabled={false}
                             onChange={this.onAnswerChange}>
                <option selected disabled value=""/>
                <option
                    value="ACCEPT">{translate.formatMessage({id: "ACCEPT"})}</option>
                <option
                    value="REJECT">{translate.formatMessage({id: "REJECT"})}</option>

            </FormSelectInput>
        ) : (
            <FormTextInput name="retentionDataForm.clientAnswer"
                           id="retentionDataForm.clientAnswer"
                           disabled={true}
                           value={!resetForm && actRetentionData ? translate.formatMessage({id: actRetentionData.retentionData.clientAnswer}) : ""}
            />
        )
    }

    public getProposalWithoutCommitmentOpt = () => {
        const proposalWithoutCommitmentOpt: JSX.Element[] = [];
        for (const proposalWithoutCommitment in RetentionProposalWithoutCommitment) {
            proposalWithoutCommitmentOpt.push(
                <option key={proposalWithoutCommitment}
                        value={proposalWithoutCommitment}>{translate.formatMessage({id: `retention.${proposalWithoutCommitment}`})}</option>);
        }
        return proposalWithoutCommitmentOpt;
    }

    public onProposalWithoutCommitmentChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({proposalWithoutCommitment: event.currentTarget.value})
    }

    public renderProposalWithoutCommitment = () => {
        const {actRetentionData, proposalWithoutCommitment} = this.state
        const disableInputsOfForm = this.mustDisableInputs();

        return !disableInputsOfForm ? (
            <FormSelectInput name="retentionDataForm.proposalWithoutCommitment"
                             id="retentionDataForm.proposalWithoutCommitment"
                             validations={{isRequired: ValidationUtils.notEmpty}}
                             disabled={false}
                             value={proposalWithoutCommitment}
                             onChange={this.onProposalWithoutCommitmentChange}>
                <option selected disabled value=""/>
                {this.getProposalWithoutCommitmentOpt()}
            </FormSelectInput>
        ) : (
            <FormTextInput name="retentionDataForm.proposalWithoutCommitment"
                           id="retentionDataForm.proposalWithoutCommitment"
                           disabled={true}
                           value={actRetentionData ? actRetentionData.retentionData.proposalWithoutCommitment?.label : ""}
            />
        )
    }

    public renderAdressResil = () => {
        const {actRetentionData} = this.state
        const disableInputsOfForm = this.mustDisableInputs();
        const resetForm = this.props.resetFormRetention

        return this.state.resiliationIntention ?
            <Col md={4}>
                <Label className="ml-1"><FormattedMessage
                    id="acts.retention.isAdressResil"/><span
                    className="text-danger">*</span></Label>
                <RetentionButtonRadio buttonGroupName={"retentionDataForm.adressResil"}
                                      context={this.props.context}
                                      updateMode={this.props.updateMode}
                                      value={!resetForm && actRetentionData ? String(actRetentionData.retentionData.adressResil) : ""}
                                      disabled={disableInputsOfForm}/>
            </Col> :
            <Col md={4}> <Label className="ml-1">
                <FormattedMessage
                    id="acts.retention.isAdressResil"/></Label>
                <br/>
                <RetentionButtonRadio buttonGroupName={"retentionDataForm.adressResil"}
                                      context={this.props.context}
                                      updateMode={this.props.updateMode}
                                      value={"false"}
                                      disabled={true}/>
            </Col>

    }

    public render(): JSX.Element {
        const {actRetentionData, isOutOfPerimDisabled, isCauseIneligbility, blockRetentionInsideGrid} = this.state
        const disableInputsOfForm = this.mustDisableInputs();
        const resetForm = this.props.resetFormRetention
        return (
            <Container>

                {blockRetentionInsideGrid ?
                    <Row>
                        <Col md={12}>
                            <UncontrolledAlert color="danger" fade={false}><FormattedMessage
                                id="acts.retention.disable.inside.GridAdg"/></UncontrolledAlert>
                        </Col>
                    </Row> :
                    <FormGroup>
                        <Row>
                            <Col md={3}>
                                <Label className="ml-1"><FormattedMessage
                                    id="acts.retention.intention"/><span className="text-danger">*</span></Label>
                                <RetentionButtonRadio buttonGroupName={"retentionDataForm.intentionByClient"}
                                                      context={"intentionResiliation"}
                                                      handleButtonChange={this.onIntentionChange}
                                                      updateMode={this.props.updateMode}
                                                      value={!resetForm && actRetentionData ? String(actRetentionData.retentionData.intentionByClient) : ""}
                                                      disabled={disableInputsOfForm}/>

                            </Col>
                            <Col md={3}>
                                <Label className="ml-1"><FormattedMessage
                                    id="acts.retention.isOutPerimeter"/></Label>
                                <FormSwitchInput color="primary"
                                                 valueOn={translate.formatMessage({id: "global.dialog.yes"})}
                                                 valueOff={translate.formatMessage({id: "global.dialog.no"})}
                                                 value={!resetForm && actRetentionData ? actRetentionData.retentionData.outOfPerim : false}
                                                 forcedValue={isOutOfPerimDisabled ? false : undefined}
                                                 onForce={this.forceOutOfPerim}
                                                 disabled={isOutOfPerimDisabled || disableInputsOfForm}
                                                 onClick={this.onClickPerimeter}
                                                 name="retentionDataForm.outOfPerim"
                                                 id="retentionDataForm.outOfPerim"/>

                            </Col>
                            {!this.state.isOutOfPerimeter &&
                            <RetentionMotifs
                                retentionMotif={actRetentionData ? actRetentionData.retentionData.motif : ''}
                                retentionSousMotif={actRetentionData ? actRetentionData.retentionData.sousMotif : ''}
                                disabled={disableInputsOfForm}
                                context="Appel"/>
                            }
                        </Row>
                        <Row>
                            <Col md={4}>
                                <Label className="ml-1"><FormattedMessage
                                    id="acts.retention.eligibility"/><span className="text-danger">*</span></Label>
                                <RetentionButtonRadio buttonGroupName={"retentionDataForm.eliRetention"}
                                                      handleButtonChange={this.onEliRetentionChange}
                                                      context={this.props.context}
                                                      updateMode={this.props.updateMode}
                                                      value={!resetForm && actRetentionData ? String(actRetentionData.retentionData.eliRetention) : ""}
                                                      disabled={disableInputsOfForm}/>

                            </Col>
                            {!isCauseIneligbility ?
                                <Col md={4}>
                                    <Label><FormattedMessage
                                        id="acts.retention.cause.ineligebility"/><span
                                        className="text-danger">*</span></Label>
                                    {!resetForm && actRetentionData &&
                                    <Tooltip placement="bottom" isOpen={this.state.tooltipOpenCauseInegibility}
                                             autohide={false}
                                             className="retentionTooltip"
                                             target={"tooltipRetentionDataFormCauseOfInegibility"}
                                             toggle={this.toggleTooltipRetentionCauseInegibility}>
                                        {this.getRetentionCauseInegibilityLabel()}
                                    </Tooltip>
                                    }
                                    {this.renderCauseOfInegibility()}
                                </Col> : <React.Fragment/>}

                        </Row>

                        <Row>
                            <Col md={4}>
                                <Label><FormattedMessage
                                    id="acts.retention.proposal"/><span className="text-danger">{disableInputsOfForm?"":"*"}</span></Label>
                                {!resetForm && actRetentionData &&
                                <Tooltip placement="bottom" isOpen={this.state.tooltipOpenProposal} autohide={false}
                                         className="retentionTooltip"
                                         target={"tooltipRetentionDataFormProposal"}
                                         toggle={this.toggleTooltipRetentionProposal}>
                                    {translate.formatMessage({id: this.state.actRetentionData?.retentionData.proposal})}
                                </Tooltip>
                                }
                                {this.renderRetentionProposal()}
                            </Col>

                            <Col md={4}>
                                <Label for="ownerPerson.firstName"><FormattedMessage
                                    id="acts.retention.proposal.detail"/></Label>
                                {!resetForm && actRetentionData &&
                                <Tooltip placement="bottom" isOpen={this.state.tooltipOpen} autohide={false}
                                         className="retentionTooltip"
                                         target={"tooltipforretentionDataFormproposalDetail"}
                                         toggle={this.toggleTooltipretentionProposalDetail}>
                                    {actRetentionData.retentionData.proposalDetail}
                                </Tooltip>
                                }
                                <div id={"tooltipforretentionDataFormproposalDetail"}>
                                    <FormTextInput name="retentionDataForm.proposalDetail"
                                                   id="retentionDataForm.proposalDetail"
                                                   value={!resetForm && actRetentionData ? actRetentionData.retentionData.proposalDetail : ""}
                                                   disabled={disableInputsOfForm}
                                    />
                                </div>
                            </Col>

                            <Col md={4}>
                                <Label for="ownerPerson.firstName"><FormattedMessage
                                    id="acts.retention.order.reference"/></Label>
                                {!resetForm && actRetentionData &&
                                <Tooltip placement="bottom" isOpen={this.state.tooltipOpenRefCommande} autohide={false}
                                         className="retentionTooltip"
                                         target={"tooltipRetentionDataFormRefCommande"}
                                         toggle={this.toggleTooltipRetentionRefCommande}>
                                    {actRetentionData.retentionData.refCommande}
                                </Tooltip>
                                }
                                <div id={"tooltipRetentionDataFormRefCommande"}
                                     className={disableInputsOfForm ? 'retentionDataFormRefCommande disabled' : 'retentionDataFormRefCommande '}>
                                    <FormTextInput name="retentionDataForm.refCommande"
                                                   id="retentionDataForm.refCommande"
                                                   value={!resetForm && actRetentionData ? actRetentionData.retentionData.refCommande : ""}
                                                   disabled={disableInputsOfForm}
                                    />
                                </div>
                            </Col>

                        </Row>

                        <Row>
                            {this.state.isRetProposalFilled && !this.state.isRetNoProposal &&
                            <Col md={2}>
                                <Label><FormattedMessage
                                    id="acts.retention.clientAnswer"/><span className="text-danger">*</span></Label>
                                {this.renderClientAnswer()}
                            </Col>
                            }

                            {this.state.clientRefusal &&
                            <React.Fragment>
                                <RetentionMotifs
                                    retentionMotif={actRetentionData ? actRetentionData.retentionData.motifRefus : ''}
                                    retentionSousMotif={actRetentionData ? actRetentionData.retentionData.sousMotifRefus : ''}
                                    disabled={disableInputsOfForm}
                                    context="Refus"/>
                                <Col md={4}>
                                    <Label><FormattedMessage
                                        id="acts.retention.proposalWithoutCommitment"/><span
                                        className="text-danger">{disableInputsOfForm ? "" : "*"}</span></Label>
                                    {this.renderProposalWithoutCommitment()}
                                </Col>
                            </React.Fragment>
                            }

                            {!this.state.clientRefusal &&
                                this.renderAdressResil()
                            }
                        </Row>

                        {this.state.clientRefusal &&
                        <Row>
                            {this.renderAdressResil()}
                        </Row>
                        }

                        <FormTextInput name="retentionDataForm.isConsultation"
                                       id="retentionDataForm.isConsultation"
                                       value={disableInputsOfForm}
                                       type="hidden"
                        />

                    </FormGroup>}
            </Container>
        )
    }

}

const mapStateToProps = (state: AppState) => ({
    currentCase: state.case.currentCase,
    updateMode: state.casePage.updateMode,
    resetFormRetention: state.casePage.resetRetentionForm,
    authorizations: state.authorization.authorizations,
    retentionSetting: state.retention.retentionSetting,
    retentionIneligibilityCausesSetting: state.retention.retentionIneligibilityCausesSetting,
    currentService: state.client.service
});


const mapDispatchToProps = {
    fetchAndStoreRetentionSettings,
    fetchAndStoreRetentionIneligibilityCausesSettings
}


export default connect(mapStateToProps, mapDispatchToProps)(EditRetentionData)
