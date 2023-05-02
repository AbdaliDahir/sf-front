import * as React from "react";
import {ChangeEvent} from "react";

import {connect} from "react-redux";
import {AppState} from "../../../store";
import {Case} from "../../../model/Case";
import {translate} from "../../../components/Intl/IntlGlobalProvider";
import {
    AntiChurnClientProposalEnum,
    AntiChurnClientResponse,
    AntiChurnPossibilityAct,
    AntiChurnProposalMode, AntiChurnProposalWithoutCommitment
} from "./AntiChurnEnum";
import {Col, FormGroup, Label, Row} from "reactstrap";
import {FormattedMessage} from "react-intl";
import FormSelectInput from "../../../components/Form/FormSelectInput";
import ValidationUtils from "../../../utils/ValidationUtils";
import {AntiChurnActResponseDTO} from "../../../model/acts/antichurn/AntiChurnActResponseDTO";
import FormTextInput from "../../../components/Form/FormTextInput";
import Tooltip from "reactstrap/lib/Tooltip";
import {fetchAndStoreAntiChurnSettings} from "../../../store/actions/AntiChurnAction";
import AntiChurnButtonRadio from "./AntiChurnButtonRadio";
import ActService from "../../../service/ActService";
import "./AntiChurn.scss"

interface State {
    disabled: boolean
    actAntiChurnData?: AntiChurnActResponseDTO
    antiChurnPossibility: string
    antiChurnClientProposal: string
    antiChurnClientTerminationIntention: boolean
    antiChurnActType?: string
    antiChurnActDetail?: string
    antiChurnProposalDetail: string
    tooltipOpenProposalDetail: boolean
    tooltipOpenOrderReference: boolean
    antiChurnClientResponse: string
    antiChurnProposalMode: string
    antiChurnOrderReference: string
    antiChurnProposalWithoutCommitment?: string

}

interface Props {
    context?: string,
    idAct?: string,
    updateMode,
    currentCase: Case,
    authorizations,
    resetAntiChurnForm,
    antiChurnSettings,
    fetchAndStoreAntiChurnSettings: () => void
}

class AntiChurnData extends React.Component<Props, State> {

    private actService: ActService = new ActService(true);

    constructor(props: Props) {
        super(props);
        this.state = {
            disabled: true,
            antiChurnPossibility: "",
            antiChurnClientProposal: "",
            antiChurnClientTerminationIntention: false,
            antiChurnActType: "",
            antiChurnActDetail: "",
            antiChurnProposalDetail: "",
            tooltipOpenProposalDetail: false,
            tooltipOpenOrderReference: false,
            antiChurnClientResponse: "",
            antiChurnProposalMode: "",
            antiChurnOrderReference: "",
            antiChurnProposalWithoutCommitment: ""
        }
    }

    public onAntiChurnPossibilityChange = (event: ChangeEvent<HTMLInputElement>) => {
        const antiChurnPossibilityValue: string = event.currentTarget.value
        this.setState({
            antiChurnPossibility: antiChurnPossibilityValue,
            antiChurnClientProposal: "",
            antiChurnActType: "",
            antiChurnActDetail: "",
            antiChurnClientResponse: ""
        })
    }

    public onAntiChurnClientProposalChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({
            antiChurnClientProposal: event.currentTarget.value,
            antiChurnActType: "",
            antiChurnActDetail: ""
        })
    }

    public onClientTerminationIntentionChange = (valueSelected: string) => {
        if (valueSelected === "YES") {
            this.setState({antiChurnClientTerminationIntention: true})
        }
        if (valueSelected === "NO") {
            this.setState({antiChurnClientTerminationIntention: false})
        }
    }

    public onAntiChurnActTypeChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({
            antiChurnActType: event.currentTarget.value,
            antiChurnActDetail: ""
        })
    }

    public onAntiChurnActDetailChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({antiChurnActDetail: event.currentTarget.value})
    }

    public onAntiChurnProposalDetailChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({antiChurnProposalDetail: event.currentTarget.value})
    }

    public onAntiChurnClientResponseChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({antiChurnClientResponse: event.currentTarget.value})
    }

    public onAntiChurnProposalModeChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({antiChurnProposalMode: event.currentTarget.value})
    }

    public onAntiChurnOrderReferenceChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({antiChurnOrderReference: event.currentTarget.value})
    }

    public onAntiChurnProposalWithoutCommitmentChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({antiChurnProposalWithoutCommitment: event.currentTarget.value})
    }

    public componentDidMount = async () => {
        console.warn('check parent store', !this.props.antiChurnSettings)
        if (!this.props.antiChurnSettings) {
            await this.props.fetchAndStoreAntiChurnSettings()
        }
        if (this.props.idAct) {
            const actAntiChurnData = await this.actService.getActAntiChurn(this.props.idAct);
            this.setState({
                actAntiChurnData,
                antiChurnPossibility: actAntiChurnData.antiChurnData.possibility,
                antiChurnClientProposal: actAntiChurnData.antiChurnData.clientProposal,
                antiChurnClientTerminationIntention: actAntiChurnData.antiChurnData.clientTerminationIntention.code,
                antiChurnActType: actAntiChurnData.antiChurnData.actType?.code,
                antiChurnActDetail: actAntiChurnData.antiChurnData.actDetail?.code,
                antiChurnProposalDetail: actAntiChurnData.antiChurnData.proposalDetail,
                antiChurnClientResponse: actAntiChurnData.antiChurnData.clientResponse,
                antiChurnProposalMode: actAntiChurnData.antiChurnData.proposalMode,
                antiChurnOrderReference: actAntiChurnData.antiChurnData.orderReference,
                antiChurnProposalWithoutCommitment: actAntiChurnData.antiChurnData.proposalWithoutCommitment?.code
            });

        }
    }

    public componentDidUpdate = async (prevProps: Readonly<Props>) => {
        if(prevProps.idAct !== this.props.idAct) {
            if (this.props.idAct) {
                const actAntiChurnData = await this.actService.getActAntiChurn(this.props.idAct);
                this.setState({
                    actAntiChurnData,
                    antiChurnPossibility: actAntiChurnData.antiChurnData.possibility,
                    antiChurnClientProposal: actAntiChurnData.antiChurnData.clientProposal,
                    antiChurnClientTerminationIntention: actAntiChurnData.antiChurnData.clientTerminationIntention.code,
                    antiChurnActType: actAntiChurnData.antiChurnData.actType?.code,
                    antiChurnActDetail: actAntiChurnData.antiChurnData.actDetail?.code,
                    antiChurnProposalDetail: actAntiChurnData.antiChurnData.proposalDetail,
                    antiChurnClientResponse: actAntiChurnData.antiChurnData.clientResponse,
                    antiChurnProposalMode: actAntiChurnData.antiChurnData.proposalMode,
                    antiChurnOrderReference: actAntiChurnData.antiChurnData.orderReference,
                    antiChurnProposalWithoutCommitment: actAntiChurnData.antiChurnData.proposalWithoutCommitment?.code
                });

            }
        }
    }

    public toggleTooltipProposalDetail = () => this.setState(prevState => ({tooltipOpenProposalDetail: !prevState.tooltipOpenProposalDetail}));

    public toggleTooltipOrderReference = () => this.setState(prevState => ({tooltipOpenOrderReference: !prevState.tooltipOpenOrderReference}));

    public getListOfAntiChurnPossibilityAct = (): JSX.Element[] => {
        const antiChurnPossibilityActOptions: JSX.Element[] = [];
        Object.keys(AntiChurnPossibilityAct).map(antiChurnPossibility=>{
            antiChurnPossibilityActOptions.push(<option key={antiChurnPossibility}
                                                        value={antiChurnPossibility}>
                {translate.formatMessage({id: antiChurnPossibility})}
            </option>);
        })

        return antiChurnPossibilityActOptions;
    };

    public getListOfAntiChurnClientProposal = (): JSX.Element[] => {
        const antiChurnClientProposalOptions: JSX.Element[] = [];
        for (const antiChurnClientProposal in AntiChurnClientProposalEnum) {
            if (AntiChurnClientProposalEnum.hasOwnProperty(antiChurnClientProposal)) {
                antiChurnClientProposalOptions.push(<option key={antiChurnClientProposal}
                                                            value={antiChurnClientProposal}>{translate.formatMessage({id: antiChurnClientProposal})}</option>);
            }
        }
        return antiChurnClientProposalOptions;
    };


    public getListOfActType = (): JSX.Element[] => {
        const ActTypeOptions: JSX.Element[] = [];
        const {antiChurnSettings} = this.props;
        if (antiChurnSettings && antiChurnSettings.settingMongo) {
            antiChurnSettings.settingMongo
                .filter((clientProposal) => clientProposal.code === this.state.antiChurnClientProposal)
                .map((clientProposal) => clientProposal.actType)
                .flat()
                .forEach((element) => {
                    ActTypeOptions.push(<option key={element.code}
                                                value={element.code}>{element.label}</option>);
                })
        }
        return ActTypeOptions
    }


    public getListOfActDetail = (): JSX.Element[] => {
        const ActDetailOptions: JSX.Element[] = [];
        const {antiChurnSettings} = this.props;
        if (antiChurnSettings && antiChurnSettings.settingMongo) {
            antiChurnSettings.settingMongo
                .filter((clientProposal) => clientProposal.code === this.state.antiChurnClientProposal)
                .map((clientProposal) => clientProposal.actType)
                .flat()
                .filter((actType) => actType.code === this.state.antiChurnActType)
                .map((actType) => actType.detail)
                .flat()
                .forEach((actDetail) => {
                    ActDetailOptions.push(<option key={actDetail.code}
                                                  value={actDetail.code}>{actDetail.label}</option>);
                })
        }
        return ActDetailOptions
    }

    public getListOfAntiChurnClientResponse = (): JSX.Element[] => {
        const antiChurnClientResponseOptions: JSX.Element[] = [];
        for (const antiChurnClientResponse in AntiChurnClientResponse) {
            if (AntiChurnClientResponse.hasOwnProperty(antiChurnClientResponse)) {
                antiChurnClientResponseOptions.push(<option key={antiChurnClientResponse}
                                                            value={antiChurnClientResponse}>{translate.formatMessage({id: antiChurnClientResponse})}</option>);
            }
        }
        return antiChurnClientResponseOptions;
    };

    public getListOfAntiChurnProposalMode = (): JSX.Element[] => {
        const antiChurnProposalModeOptions: JSX.Element[] = [];
        for (const antiChurnProposalMode in AntiChurnProposalMode) {
            if (AntiChurnProposalMode.hasOwnProperty(antiChurnProposalMode)) {
                antiChurnProposalModeOptions.push(<option key={antiChurnProposalMode}
                                                          value={antiChurnProposalMode}>{translate.formatMessage({id: antiChurnProposalMode})}</option>);
            }
        }
        return antiChurnProposalModeOptions;
    };

    public getListOfAntiChurnProposalWithoutCommitment = (): JSX.Element[] => {
        const antiChurnProposalWithoutCommitmentOptions: JSX.Element[] = [];
        for (const antiChurnProposalWithoutCommitment in AntiChurnProposalWithoutCommitment) {
            if (AntiChurnProposalWithoutCommitment.hasOwnProperty(antiChurnProposalWithoutCommitment)) {
                antiChurnProposalWithoutCommitmentOptions.push(<option key={antiChurnProposalWithoutCommitment}
                                                                       value={antiChurnProposalWithoutCommitment}>{translate.formatMessage({id: antiChurnProposalWithoutCommitment})}</option>);
            }
        }
        return antiChurnProposalWithoutCommitmentOptions;
    };

    public getOrderReferenceToDisplay = (): string => {
        const {proposalMode, orderReference} = this.state.actAntiChurnData!.antiChurnData
        return AntiChurnProposalMode.ORDER_FINISHED === proposalMode && !orderReference ? translate.formatMessage({id: "not communicated"}) : orderReference
    }

    public render(): JSX.Element {
        const {actAntiChurnData, antiChurnProposalMode} = this.state
        const disableInputsOfForm = (this.props.authorizations.indexOf("ADG_ANTICHURN") === -1) ? true : (!!this.props.context && this.props.context === "ViewCasePage" && !this.props.updateMode);
        const resetForm = this.props.resetAntiChurnForm
        return (
            <div>
                <FormGroup>
                    <Row>
                        <Col md={3}>
                            <Label>
                                <FormattedMessage id="acts.antichurn.possibility"/>
                                <span className="text-danger">*</span>
                            </Label>
                            <div id={"antiChurnPossibilityForm"}
                                 className={disableInputsOfForm ? 'antiChurnFormPossibility disabled' : 'antiChurnFormPossibility'}>
                                <FormSelectInput name="antiChurnDataForm.possibility"
                                                 className={disableInputsOfForm ? 'disableFirstInput' : ''}
                                                 id="antiChurnDataForm.possibility"
                                                 validations={{isRequired: ValidationUtils.notEmpty}}
                                                 value={!resetForm && actAntiChurnData ? actAntiChurnData.antiChurnData.possibility : ""}
                                                 disabled={disableInputsOfForm}
                                                 onChange={this.onAntiChurnPossibilityChange}>
                                    <option selected disabled value=""/>
                                    {
                                        this.getListOfAntiChurnPossibilityAct()
                                    }
                                </FormSelectInput>
                            </div>
                        </Col>
                        {this.state.antiChurnPossibility === AntiChurnPossibilityAct.OUI &&
                        <Col md={4}>
                            <Label>
                                <FormattedMessage id="acts.antichurn.clientProposal"/>
                                <span className="text-danger">*</span>
                            </Label>
                            <div id={"antiChurnClientProposalForm"}
                                 className={disableInputsOfForm ? 'antiChurnClientProposalForm disabled' : 'antiChurnClientProposalForm'}>
                                <FormSelectInput name="antiChurnDataForm.clientProposal"
                                                 id="antiChurnDataForm.clientProposal"
                                                 validations={{isRequired: ValidationUtils.notEmpty}}
                                                 value={!resetForm && actAntiChurnData ? actAntiChurnData.antiChurnData.clientProposal : this.state.antiChurnClientProposal}
                                                 disabled={disableInputsOfForm}
                                                 onChange={this.onAntiChurnClientProposalChange}>
                                    <option selected disabled value=""/>
                                    {
                                        this.getListOfAntiChurnClientProposal()
                                    }
                                </FormSelectInput>
                            </div>
                        </Col>
                        }
                        {((this.state.antiChurnPossibility && this.state.antiChurnClientProposal !== "") ||
                            this.state.antiChurnPossibility === AntiChurnPossibilityAct.CHECK_COM_KO ||
                            this.state.antiChurnPossibility === AntiChurnPossibilityAct.NON ||
                            this.state.antiChurnPossibility === AntiChurnPossibilityAct.CHECK_TECH_KO) &&
                        <Col md={4}>
                            <Label className="ml-1">
                                <FormattedMessage id="acts.antichurn.clientTerminationIntention"/>
                                <span className="text-danger">*</span>
                            </Label>
                            <AntiChurnButtonRadio buttonGroupName={"antiChurnDataForm.clientTerminationIntention"}
                                                  context={"clientTerminationIntention"}
                                                  handleButtonChange={this.onClientTerminationIntentionChange}
                                                  updateMode={this.props.updateMode}
                                                  value={!resetForm && actAntiChurnData ? String(actAntiChurnData.antiChurnData.clientTerminationIntention.code) : ""}
                                                  disabled={disableInputsOfForm}/>
                        </Col>
                        }
                    </Row>
                    {this.state.antiChurnPossibility === AntiChurnPossibilityAct.OUI &&
                    <Row>
                        {this.state.antiChurnClientProposal !== "" &&
                        <Col md={3}>
                            <Label>
                                <FormattedMessage id="acts.antichurn.actType"/>
                                <span className="text-danger">*</span>
                            </Label>
                            <div id={"antiChurnActType"}
                                 className={disableInputsOfForm ? 'antiChurnClientActTypeForm disabled' : 'antiChurnClientActTypeForm'}>
                                <FormSelectInput name="antiChurnDataForm.actType"
                                                 id="antiChurnDataForm.actType"
                                                 validations={{isRequired: ValidationUtils.notEmpty}}
                                                 value={!resetForm && actAntiChurnData ? actAntiChurnData.antiChurnData.actType?.code : this.state.antiChurnActType}
                                                 disabled={disableInputsOfForm}
                                                 onChange={this.onAntiChurnActTypeChange}>
                                    <option selected disabled value=""/>
                                    {
                                        this.getListOfActType()
                                    }
                                </FormSelectInput>
                            </div>
                        </Col>
                        }
                        {this.state.antiChurnClientProposal === AntiChurnClientProposalEnum.REENGAGEMENT &&
                        <Col md={4}>
                            <Label>
                                <FormattedMessage id="acts.antichurn.actDetail"/>
                                <span className="text-danger">*</span>
                            </Label>
                            <div id={"antiChurnActDetail"}
                                 className={disableInputsOfForm ? 'antiChurnClientActDetailForm disabled' : 'antiChurnClientActDetailForm'}>
                                <FormSelectInput name="antiChurnDataForm.actDetail"
                                                 id="antiChurnDataForm.actDetail"
                                                 validations={{isRequired: ValidationUtils.notEmpty}}
                                                 value={!resetForm && actAntiChurnData ? actAntiChurnData.antiChurnData.actDetail?.code : this.state.antiChurnActDetail}
                                                 disabled={disableInputsOfForm}
                                                 onChange={this.onAntiChurnActDetailChange}>
                                    <option selected disabled value=""/>
                                    {
                                        this.getListOfActDetail()
                                    }
                                </FormSelectInput>
                            </div>
                        </Col>
                        }
                        {this.state.antiChurnClientProposal !== "" &&
                        <Col md={5}>
                            <Label>
                                {!resetForm && actAntiChurnData &&
                                    <Tooltip placement="bottom" isOpen={this.state.tooltipOpenProposalDetail}
                                             autohide={false}
                                             className="antiChurnTooltip"
                                             target={"antiChurnProposalDetail"}
                                             toggle={this.toggleTooltipProposalDetail}>
                                        {actAntiChurnData.antiChurnData.proposalDetail}
                                    </Tooltip>
                                }
                                <FormattedMessage id="acts.antichurn.proposalDetail"/>
                                <span className="text-danger">*</span>
                            </Label>
                            <div id={"antiChurnProposalDetail"}
                                 className={disableInputsOfForm ? 'antiChurnProposalDetailForm disabled' : 'antiChurnProposalDetailForm'}>

                                <FormTextInput name="antiChurnDataForm.proposalDetail"
                                               id="antiChurnDataForm.proposalDetail"
                                               validations={{isRequired: ValidationUtils.notEmpty,
                                                   "inputMaxLength": 100}}
                                               value={!resetForm && actAntiChurnData ? actAntiChurnData.antiChurnData.proposalDetail : this.state.antiChurnProposalDetail}
                                               disabled={disableInputsOfForm}
                                               onChange={this.onAntiChurnProposalDetailChange}
                                />
                            </div>
                        </Col>
                        }
                    </Row>
                    }
                    {this.state.antiChurnPossibility === AntiChurnPossibilityAct.OUI &&
                    <Row>
                        {this.state.antiChurnClientProposal !== "" &&
                        <Col md={3}>
                            <Label>
                                <FormattedMessage id="acts.antichurn.clientResponse"/>
                                <span className="text-danger">*</span>
                            </Label>
                            <div id={"antiChurnClientResponseForm"}
                                 className={disableInputsOfForm ? 'antiChurnClientResponseForm disabled' : 'antiChurnClientResponseForm'}>
                                <FormSelectInput name="antiChurnDataForm.clientResponse"
                                                 id="antiChurnDataForm.clientResponse"
                                                 validations={{isRequired: ValidationUtils.notEmpty}}
                                                 value={!resetForm && actAntiChurnData ? actAntiChurnData.antiChurnData.clientResponse : this.state.antiChurnClientResponse}
                                                 disabled={disableInputsOfForm}
                                                 onChange={this.onAntiChurnClientResponseChange}>
                                    <option selected disabled value=""/>
                                    {
                                        this.getListOfAntiChurnClientResponse()
                                    }
                                </FormSelectInput>
                            </div>
                        </Col>
                        }
                        {this.state.antiChurnClientResponse === AntiChurnClientResponse.ACCEPTED &&
                        <Col md={4}>
                            <Label>
                                <FormattedMessage id="acts.antichurn.proposalMode"/>
                                <span className="text-danger">*</span>
                            </Label>
                            <div id={"antiChurnProposalModeForm"}
                                 className={disableInputsOfForm ? 'antiChurnProposalModeForm disabled' : 'antiChurnProposalModeForm'}>
                                <FormSelectInput name="antiChurnDataForm.proposalMode"
                                                 id="antiChurnDataForm.proposalMode"
                                                 validations={{isRequired: ValidationUtils.notEmpty}}
                                                 value={!resetForm && actAntiChurnData ? actAntiChurnData.antiChurnData.proposalMode : this.state.antiChurnProposalMode}
                                                 disabled={disableInputsOfForm}
                                                 onChange={this.onAntiChurnProposalModeChange}>
                                    <option selected disabled value=""/>
                                    {
                                        this.getListOfAntiChurnProposalMode()
                                    }
                                </FormSelectInput>
                            </div>
                        </Col>
                        }
                        {this.state.antiChurnClientResponse === AntiChurnClientResponse.ACCEPTED &&
                        <Col md={5}>
                            <Label>
                                {!resetForm && actAntiChurnData &&
                                <Tooltip placement="bottom" isOpen={this.state.tooltipOpenOrderReference}
                                         autohide={false}
                                         className="antiChurnTooltip"
                                         target={"antiChurnOrderReference"}
                                         toggle={this.toggleTooltipOrderReference}>
                                    {actAntiChurnData.antiChurnData.orderReference}
                                </Tooltip>
                                }
                                <FormattedMessage id="acts.antichurn.orderReference"/>
                                { AntiChurnProposalMode.ORDER_FINISHED === antiChurnProposalMode && <span className="text-danger">*</span> }
                            </Label>
                            <div id={"antiChurnOrderReference"}
                                 className={disableInputsOfForm ? 'antiChurnOrderReferenceForm disabled' : 'antiChurnOrderReferenceForm'}>

                                <FormTextInput name="antiChurnDataForm.orderReference"
                                               id="antiChurnDataForm.orderReference"
                                               validations={AntiChurnProposalMode.ORDER_FINISHED !== antiChurnProposalMode ? {"inputMaxLength": 100} : {isRequired: ValidationUtils.notEmpty, "inputMaxLength": 100}}
                                               value={!resetForm && actAntiChurnData ? this.getOrderReferenceToDisplay() : this.state.antiChurnOrderReference}
                                               disabled={disableInputsOfForm}
                                               onChange={this.onAntiChurnOrderReferenceChange}
                                />
                            </div>
                        </Col>
                        }
                        {this.state.antiChurnClientResponse === AntiChurnClientResponse.REFUSED &&
                        <Col md={5}>
                            <Label>
                                <FormattedMessage id="acts.antichurn.proposalWithoutCommitment"/>
                                <span className="text-danger">*</span>
                            </Label>
                            <div id={"antiChurnProposalWithoutCommitmentForm"}
                                 className={disableInputsOfForm ? 'antiChurnProposalWithoutCommitmentForm disabled' : 'antiChurnProposalWithoutCommitmentForm'}>
                                <FormSelectInput name="antiChurnDataForm.proposalWithoutCommitment"
                                                 id="antiChurnDataForm.proposalWithoutCommitment"
                                                 validations={{isRequired: ValidationUtils.notEmpty}}
                                                 value={!resetForm && actAntiChurnData ? actAntiChurnData.antiChurnData.proposalWithoutCommitment?.code : this.state.antiChurnProposalWithoutCommitment}
                                                 disabled={disableInputsOfForm}
                                                 onChange={this.onAntiChurnProposalWithoutCommitmentChange}>
                                    <option selected disabled value=""/>
                                    {
                                        this.getListOfAntiChurnProposalWithoutCommitment()
                                    }
                                </FormSelectInput>
                            </div>
                        </Col>
                        }
                    </Row>
                    }
                    <FormTextInput name="antiChurnDataForm.isConsultation"
                                   id="antiChurnDataForm.isConsultation"
                                   value={disableInputsOfForm}
                                   type="hidden"
                    />
                </FormGroup>
            </div>
        )
    }
}

const mapStateToProps = (state: AppState) => ({
    currentCase: state.case.currentCase,
    updateMode: state.casePage.updateMode,
    resetAntiChurnForm: state.casePage.resetAntiChurnForm,
    authorizations: state.authorization.authorizations,
    antiChurnSettings: state.antiChurn.antiChurnSettings
});

const mapDispatchToProps = {
    fetchAndStoreAntiChurnSettings
}


export default connect(mapStateToProps, mapDispatchToProps)(AntiChurnData)
