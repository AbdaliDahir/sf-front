import * as React from "react";
import {ChangeEvent} from "react";

import {connect} from "react-redux";
import {Col, FormGroup, Label, Row, UncontrolledAlert} from "reactstrap";
import {FormattedMessage} from "react-intl";
import Tooltip from "reactstrap/lib/Tooltip";
import "./RetentionMotifsV2.scss"
import {RetentionActResponseDTO} from "../../../../model/acts/retention/RetentionActResponseDTO";
import {Case} from "../../../../model/Case";
import {RetentionSetting} from "../../../../model/acts/retention/RetentionSetting";
import {RetentionIneligibilityCausesSetting} from "../../../../model/acts/retention/RetentionIneligibilityCausesSetting";
import ActService from "../../../../service/ActService";
import {translate} from "../../../../components/Intl/IntlGlobalProvider";
import {RetentionProposal, RetentionProposalWithoutCommitment} from "../../../Acts/Retention/RetentionEnums";
import FormSelectInput from "../../../../components/Form/FormSelectInput";
import ValidationUtils from "../../../../utils/ValidationUtils";
import FormTextInput from "../../../../components/Form/FormTextInput";
import RetentionButtonRadio from "../../../Acts/Retention/RetentionButtonRadio";
import RetentionMotifsV2 from "./RetentionMotifsV2";
import {AppState} from "../../../../store";
import FormSwitchInputV2 from "../../../../components/Form/FormSwitchInputV2";

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
    caseId: string,
    disabled: boolean
    idAct?: string,
    currentCase: Case,
    authorizations,
    retentionSetting?: RetentionSetting,
    retentionIneligibilityCausesSetting?: RetentionIneligibilityCausesSetting,
    currentService
}

class EditRetentionDataV2 extends React.Component<Props, State> {

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
        if (this.props.idAct) {
            const actRetentionData = await this.actService.getActRetention(this.props.idAct);
            this.setState({
                actRetentionData,
                clientRefusal: actRetentionData.retentionData.clientAnswer === "REJECT",
                isRetProposalFilled: !!actRetentionData.retentionData.proposal,
                isOutOfPerimeter: actRetentionData.retentionData.outOfPerim,
                isCauseIneligbility: !!actRetentionData.retentionData.causeOfIneligibility,
                proposalWithoutCommitment: actRetentionData.retentionData.proposalWithoutCommitment?.code
            });
        }
    }

    public componentDidUpdate = async (prevProps: Readonly<Props>) => {
        if (prevProps.idAct !== this.props.idAct) {
            if (this.props.idAct) {
                const actRetentionData = await this.actService.getActRetention(this.props.idAct);
                this.setState({
                    actRetentionData,
                    clientRefusal: actRetentionData.retentionData.clientAnswer === "REJECT",
                    isRetProposalFilled: !!actRetentionData.retentionData.proposal,
                    isOutOfPerimeter: actRetentionData.retentionData.outOfPerim,
                    isCauseIneligbility: !!actRetentionData.retentionData.causeOfIneligibility,
                    proposalWithoutCommitment: actRetentionData.retentionData.proposalWithoutCommitment?.code
                });
            } else { // !_!
                // reset state?
            }
        }
    }

    // TODO HANDLE CALL FOR GETTING MOTIF/SOUSMOTIF SETTINGS
    // TODO HANDLE IN GENERIC COMPONENT
    public getListOfRetentionProposal = (): JSX.Element[] => {
        const retentionProposalOptions: JSX.Element[] = [];
        this.props.retentionSetting?.retentionProposals
            .forEach((retentProposal) => {
                if (retentProposal) {
                    // sorting is done here, using settings
                    retentionProposalOptions[retentProposal.index] =
                        <option key={retentProposal.code}
                                value={retentProposal.code}>
                            {translate.formatMessage({id: retentProposal.code})}
                        </option>;
                }
            })
        return retentionProposalOptions;
    };

    public getListOfRetentionCauses = (): JSX.Element[] => {
        const retentionCausesOptions: JSX.Element[] = [];
        const filteredIneligibilityCauses = this.props
            .retentionIneligibilityCausesSetting?.ineligibilityCauses
            .sort((a, b) => a.label.localeCompare(b.label))
            .filter((cause) => {
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
        this.setState({
            resiliationIntention: isOutOfPerimDisabled,
            isOutOfPerimDisabled,
            isOutOfPerimeter: isOutOfPerimDisabled ? false : this.state.isOutOfPerimeter
        })
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
        this.props.retentionIneligibilityCausesSetting?.ineligibilityCauses
            .sort((a, b) => a.label.localeCompare(b.label))
            .forEach((retentCause) => {
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

    public renderCauseOfInegibility = () => {
        const {actRetentionData} = this.state
        const disableInputsOfForm = this.props.disabled;
        return !disableInputsOfForm ? (
            <div id={"tooltipRetentionDataFormCauseOfInegibility"} className={'retentionDataFormCauseInegibility'}>
                <FormSelectInput name="retentionData.causeOfIneligibility"
                                 id="retentionData.causeOfIneligibility"
                                 label={translate.formatMessage({id: "acts.retention.cause.ineligebility"})}
                                 validations={{isRequired: ValidationUtils.notEmpty}}
                                 value={actRetentionData ? actRetentionData.retentionData.causeOfIneligibility : ""}
                                 disabled={false}
                                 bsSize={"sm"}>
                    <option selected disabled value=""/>
                    {
                        this.getListOfRetentionCauses()
                    }
                </FormSelectInput>
            </div>
        ) : (
            <div id={"tooltipRetentionDataFormCauseOfInegibility"}
                 className={'retentionDataFormCauseInegibility disabled'}>
                <FormTextInput name="retentionData.causeOfIneligibility"
                               id="retentionData.causeOfIneligibility"
                               label={translate.formatMessage({id: "acts.retention.cause.ineligebility"})}
                               validations={{isRequired: ValidationUtils.notEmpty}}
                               disabled={true}
                               bsSize={"sm"}
                               value={actRetentionData ? this.getRetentionCauseInegibilityLabel() : ""}
                />
            </div>
        )
    }

    public renderRetentionProposal = () => {
        const {actRetentionData} = this.state
        const disableInputsOfForm = this.props.disabled;

        return (
            <div id={"tooltipRetentionDataFormProposal"}
                 className={'retentionDataFormProposal' + disableInputsOfForm ? ' disabled' : ''}>
                <FormSelectInput name="retentionData.proposal" id="retentionData.proposal"
                                 label={translate.formatMessage({id: "acts.retention.proposal"})}
                                 value={actRetentionData ? actRetentionData.retentionData.proposal : ""}
                                 disabled={disableInputsOfForm}
                                 validations={disableInputsOfForm ? {isRequired: ValidationUtils.canBeEmpty} : {isRequired: ValidationUtils.notEmpty}}
                                 onChange={this.onRetProposalChange}
                                 bsSize={"sm"}>
                    <option selected value="" disabled/>
                    {
                        this.getListOfRetentionProposal()
                    }
                </FormSelectInput>
            </div>
        )
    }

    public renderClientAnswer = () => {
        const {actRetentionData} = this.state
        const disableInputsOfForm = this.props.disabled;

        return !disableInputsOfForm ? (
            <FormSelectInput name="retentionData.clientAnswer"
                             id="retentionData.clientAnswer"
                             label={translate.formatMessage({id: "acts.retention.clientAnswer"})}
                             validations={{isRequired: ValidationUtils.notEmpty}}
                             value={actRetentionData ? actRetentionData.retentionData.clientAnswer : ""}
                             disabled={false}
                             bsSize={"sm"}
                             onChange={this.onAnswerChange}>
                <option selected disabled value=""/>
                <option value="ACCEPT">{translate.formatMessage({id: "ACCEPT"})}</option>
                <option value="REJECT">{translate.formatMessage({id: "REJECT"})}</option>
            </FormSelectInput>
        ) : (
            <FormTextInput name="retentionData.clientAnswer"
                           id="retentionData.clientAnswer"
                           label={translate.formatMessage({id: "acts.retention.clientAnswer"})}
                           disabled={true}
                           value={actRetentionData ? translate.formatMessage({id: actRetentionData.retentionData.clientAnswer}) : ""}
            />
        )
    }

    public getProposalWithoutCommitmentOpt = () => {
        return Object.keys(RetentionProposalWithoutCommitment)
            .sort((a, b) =>
                translate.formatMessage({id: `retention.${a}`})
                    .localeCompare(translate.formatMessage({id: `retention.${b}`})))
            .map((proposalWithoutCommitment) => <option key={proposalWithoutCommitment}
                                                        value={proposalWithoutCommitment}>{translate.formatMessage({id: `retention.${proposalWithoutCommitment}`})}</option>)
    }

    public renderProposalWithoutCommitment = () => {
        const {actRetentionData, proposalWithoutCommitment} = this.state
        const disableInputsOfForm = this.props.disabled;

        return !disableInputsOfForm ? (
            <FormSelectInput name="retentionData.proposalWithoutCommitment"
                             id="retentionData.proposalWithoutCommitment"
                             label={translate.formatMessage({id: "acts.retention.proposalWithoutCommitment"})}
                             validations={{isRequired: ValidationUtils.notEmpty}}
                             disabled={false}
                             bsSize={"sm"}
                             value={proposalWithoutCommitment}>
                <option selected disabled value=""/>
                {this.getProposalWithoutCommitmentOpt()}
            </FormSelectInput>
        ) : (
            <FormTextInput name="retentionData.proposalWithoutCommitment"
                           id="retentionData.proposalWithoutCommitment"
                           label={translate.formatMessage({id: "acts.retention.proposalWithoutCommitment"})}
                           disabled={true}
                           bsSize={"sm"}
                           value={actRetentionData ? actRetentionData.retentionData.proposalWithoutCommitment?.label : ""}
            />
        )
    }

    public renderAdressResil = () => {
        const {actRetentionData} = this.state
        const disableInputsOfForm = this.props.disabled;

        return this.state.resiliationIntention ? (
            <Col xs={4}>
                <Label className="ml-1">
                    <FormattedMessage id="acts.retention.isAdressResil"/>
                    {!disableInputsOfForm && <span className="text-danger">*</span>}
                </Label>
                <RetentionButtonRadio buttonGroupName={"retentionData.adressResil"}
                                      label={translate.formatMessage({id: "acts.retention.isAdressResil"})}
                                      value={actRetentionData ? String(actRetentionData.retentionData.adressResil) : ""}
                                      disabled={disableInputsOfForm}/>
            </Col>
        ) : (
            <Col xs={4}> <Label className="ml-1">
                <FormattedMessage
                    id="acts.retention.isAdressResil"/></Label>
                <br/>
                <RetentionButtonRadio buttonGroupName={"retentionData.adressResil"}
                                      label={translate.formatMessage({id: "acts.retention.isAdressResil"})}
                                      value={"false"}
                                      disabled={true}/>
            </Col>
        );
    }

    public render(): JSX.Element {
        const {actRetentionData, isOutOfPerimDisabled, isCauseIneligbility, blockRetentionInsideGrid} = this.state
        const disableInputsOfForm = this.props.disabled;
        const disabled = isOutOfPerimDisabled || disableInputsOfForm;
        return blockRetentionInsideGrid ? (
            <Row>
                <Col xs={12}>
                    <UncontrolledAlert color="danger" fade={false}>
                        <FormattedMessage id="acts.retention.disable.inside.GridAdg"/>
                    </UncontrolledAlert>
                </Col>
            </Row>
        ) : (
            <FormGroup className={"mb-0"}>
                <Row>
                    <Col xs={4} className={"d-flex justify-content-between"}>
                        <div>
                            <Label className="ml-1">
                                <FormattedMessage id="acts.retention.intention"/>
                                {!disableInputsOfForm && <span className="text-danger">*</span>}
                            </Label>
                            <RetentionButtonRadio buttonGroupName={"retentionData.intentionByClient"}
                                                  label={translate.formatMessage({id: "acts.retention.intention"})}
                                                  context={"intentionResiliation"}
                                                  handleButtonChange={this.onIntentionChange}
                                                  value={actRetentionData ? String(actRetentionData.retentionData.intentionByClient) : ""}
                                                  disabled={disableInputsOfForm}/>
                        </div>
                        <div>
                            <Label className="ml-1">
                                <FormattedMessage id="acts.retention.isOutPerimeter"/>
                            </Label>
                            <FormSwitchInputV2 color="primary"
                                               thickness={"sm"}
                                               valueOn={translate.formatMessage({id: "global.dialog.yes"})}
                                               valueOff={translate.formatMessage({id: "global.dialog.no"})}
                                               value={disabled ? actRetentionData?.retentionData.outOfPerim : undefined}
                                               forcedValue={actRetentionData ? actRetentionData.retentionData.outOfPerim : (isOutOfPerimDisabled ? false : undefined)}
                                               disabled={disabled}
                                               onClick={this.onClickPerimeter}
                                               name="retentionData.outOfPerim"
                                               id="retentionData.outOfPerim"/>
                        </div>
                    </Col>
                    {!this.state.isOutOfPerimeter &&
                        <RetentionMotifsV2
                            retentionMotif={actRetentionData ? actRetentionData.retentionData.motif : ''}
                            retentionSousMotif={actRetentionData ? actRetentionData.retentionData.sousMotif : ''}
                            disabled={disableInputsOfForm}
                            context="Appel"/>
                    }
                </Row>

                <Row>
                    <Col xs={4}>
                        <Label className="ml-1">
                            <FormattedMessage id="acts.retention.eligibility"/>
                            {!disableInputsOfForm && <span className="text-danger">*</span>}
                        </Label>
                        <RetentionButtonRadio buttonGroupName={"retentionData.eliRetention"}
                                              label={translate.formatMessage({id: "acts.retention.eligibility"})}
                                              handleButtonChange={this.onEliRetentionChange}
                                              value={actRetentionData ? String(actRetentionData.retentionData.eliRetention) : ""}
                                              disabled={disableInputsOfForm}/>
                    </Col>
                    {!isCauseIneligbility &&
                        <Col xs={4}>
                            <Label>
                                <FormattedMessage id="acts.retention.cause.ineligebility"/>
                                {!disableInputsOfForm && <span className="text-danger">*</span>}
                            </Label>

                            {actRetentionData &&
                                <Tooltip placement="bottom" isOpen={this.state.tooltipOpenCauseInegibility}
                                         autohide={false}
                                         className="retentionTooltip"
                                         target={"tooltipRetentionDataFormCauseOfInegibility"}
                                         toggle={this.toggleTooltipRetentionCauseInegibility}>
                                    {this.getRetentionCauseInegibilityLabel()}
                                </Tooltip>
                            }

                            {this.renderCauseOfInegibility()}
                        </Col>
                    }
                </Row>

                <Row>
                    <Col xs={4}>
                        <Label>
                            <FormattedMessage id="acts.retention.proposal"/>
                            {!disableInputsOfForm && <span className="text-danger">*</span>}
                        </Label>

                        {actRetentionData &&
                            <Tooltip placement="bottom" isOpen={this.state.tooltipOpenProposal} autohide={false}
                                     className="retentionTooltip"
                                     target={"tooltipRetentionDataFormProposal"}
                                     toggle={this.toggleTooltipRetentionProposal}>
                                {translate.formatMessage({id: this.state.actRetentionData?.retentionData.proposal})}
                            </Tooltip>
                        }

                        {this.renderRetentionProposal()}
                    </Col>

                    <Col xs={4}>
                        <Label for="ownerPerson.firstName">
                            <FormattedMessage id="acts.retention.proposal.detail"/>
                        </Label>
                        {actRetentionData &&
                            <Tooltip placement="bottom" isOpen={this.state.tooltipOpen} autohide={false}
                                     className="retentionTooltip"
                                     target={"tooltipforretentionDataFormproposalDetail"}
                                     toggle={this.toggleTooltipretentionProposalDetail}>
                                {actRetentionData.retentionData.proposalDetail}
                            </Tooltip>
                        }
                        <div id={"tooltipforretentionDataFormproposalDetail"}>
                            <FormTextInput name="retentionData.proposalDetail"
                                           id="retentionData.proposalDetail"
                                           value={actRetentionData ? actRetentionData.retentionData.proposalDetail : ""}
                                           disabled={disableInputsOfForm}
                                           bsSize={"sm"}
                            />
                        </div>
                    </Col>

                    <Col xs={4}>
                        <Label for="ownerPerson.firstName">
                            <FormattedMessage id="acts.retention.order.reference"/>
                        </Label>
                        {actRetentionData &&
                            <Tooltip placement="bottom" isOpen={this.state.tooltipOpenRefCommande} autohide={false}
                                     className="retentionTooltip"
                                     target={"tooltipRetentionDataFormRefCommande"}
                                     toggle={this.toggleTooltipRetentionRefCommande}>
                                {actRetentionData.retentionData.refCommande}
                            </Tooltip>
                        }
                        <div id={"tooltipRetentionDataFormRefCommande"}
                             className={disableInputsOfForm ? 'retentionDataFormRefCommande disabled' : 'retentionDataFormRefCommande '}>
                            <FormTextInput name="retentionData.refCommande"
                                           id="retentionData.refCommande"
                                           value={actRetentionData ? actRetentionData.retentionData.refCommande : ""}
                                           disabled={disableInputsOfForm}
                                           bsSize={"sm"}
                            />
                        </div>
                    </Col>
                </Row>

                <Row>
                    {this.state.isRetProposalFilled && !this.state.isRetNoProposal &&
                        <Col xs={4}>
                            <Label>
                                <FormattedMessage id="acts.retention.clientAnswer"/>
                                {!disableInputsOfForm && <span className="text-danger">*</span>}
                            </Label>
                            {this.renderClientAnswer()}
                        </Col>
                    }

                    {this.state.clientRefusal &&
                        <React.Fragment>
                            <RetentionMotifsV2
                                retentionMotif={actRetentionData ? actRetentionData.retentionData.motifRefus : ''}
                                retentionSousMotif={actRetentionData ? actRetentionData.retentionData.sousMotifRefus : ''}
                                disabled={disableInputsOfForm}
                                context="Refus"/>
                            <Col xs={4}>
                                <Label>
                                    <FormattedMessage id="acts.retention.proposalWithoutCommitment"/>
                                    {!disableInputsOfForm && <span className="text-danger">*</span>}
                                </Label>
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

                <FormTextInput name="retentionData.isConsultation"
                               id="retentionData.isConsultation"
                               value={disableInputsOfForm}
                               type="hidden"
                />
            </FormGroup>
        )
    }
}

const mapStateToProps = (state: AppState, ownProps: Props) => ({
    currentCase: state.store.cases[ownProps.caseId]?.currentCase,
    retentionSetting: state.store.applicationInitialState.retentionSettings?.retentionSetting?.settingDetail,
    retentionIneligibilityCausesSetting: state.store.applicationInitialState.retentionSettings?.retentionIneligibilitySetting.settingDetail,
    currentService: state.store.client.currentClient?.service,
    authorizations: state.store.applicationInitialState.authorizations,
});

export default connect(mapStateToProps)(EditRetentionDataV2)
