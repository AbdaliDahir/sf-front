import * as React from "react";
import {ChangeEvent} from "react";

import {connect} from "react-redux";
import {Col, FormGroup, Label, Row} from "reactstrap";
import {FormattedMessage} from "react-intl";
import Tooltip from "reactstrap/lib/Tooltip";
import "./AntiChurn.scss"
import {AntiChurnActResponseDTO} from "../../../../model/acts/antichurn/AntiChurnActResponseDTO";
import {Case} from "../../../../model/Case";
import ActService from "../../../../service/ActService";
import {
    AntiChurnClientProposalEnum,
    AntiChurnClientResponse,
    AntiChurnPossibilityAct,
    AntiChurnProposalMode,
    AntiChurnProposalWithoutCommitment
} from "../../../Acts/AntiChurn/AntiChurnEnum";
import {translate} from "../../../../components/Intl/IntlGlobalProvider";
import FormSelectInput from "../../../../components/Form/FormSelectInput";
import ValidationUtils from "../../../../utils/ValidationUtils";
import AntiChurnButtonRadio from "../../../Acts/AntiChurn/AntiChurnButtonRadio";
import FormTextInput from "../../../../components/Form/FormTextInput";
import {AppState} from "../../../../store";
import {AntiChurnClientProposal} from "../../../../model/acts/antichurn/AntiChurnClientProposal";

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
    caseId: string
    disabled: boolean
    context?: string,
    idAct?: string,
    currentCase: Case,
    authorizations,
    antiChurnSettings: AntiChurnClientProposal[] | undefined
}

class AntiChurnDataV2 extends React.Component<Props, State> {

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
        if (this.props.idAct) {

            const actAntiChurnData: any = await this.actService.getActAntiChurn(this.props.idAct);
            this.setState({
                actAntiChurnData,
                antiChurnPossibility: actAntiChurnData.antiChurnData.possibility,
                antiChurnClientProposal: actAntiChurnData.antiChurnData.clientProposal,
                antiChurnClientTerminationIntention: actAntiChurnData.antiChurnData.clientTerminationIntention?.code,
                antiChurnActType: actAntiChurnData.antiChurnData.actType,
                antiChurnActDetail: actAntiChurnData.antiChurnData.actDetail,
                antiChurnProposalDetail: actAntiChurnData.antiChurnData.proposalDetail,
                antiChurnClientResponse: actAntiChurnData.antiChurnData.clientResponse,
                antiChurnProposalMode: actAntiChurnData.antiChurnData.proposalMode,
                antiChurnOrderReference: actAntiChurnData.antiChurnData.orderReference,
                antiChurnProposalWithoutCommitment: actAntiChurnData.antiChurnData.proposalWithoutCommitment?.code
            });

        }
    }

    public componentDidUpdate = async (prevProps: Readonly<Props>) => {
        if (prevProps.idAct !== this.props.idAct) {
            if (this.props.idAct) {
                const actAntiChurnData: any = await this.actService.getActAntiChurn(this.props.idAct);
                this.setState({
                    actAntiChurnData,
                    antiChurnPossibility: actAntiChurnData.antiChurnData.possibility,
                    antiChurnClientProposal: actAntiChurnData.antiChurnData.clientProposal,
                    antiChurnClientTerminationIntention: actAntiChurnData.antiChurnData.clientTerminationIntention.code,
                    antiChurnActType: actAntiChurnData.antiChurnData.actType,
                    antiChurnActDetail: actAntiChurnData.antiChurnData.actDetail,
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
        Object.keys(AntiChurnPossibilityAct)
            .sort((a, b) =>
                translate.formatMessage({id: a})
                    .localeCompare(translate.formatMessage({id: b})))
            .map(antiChurnPossibility => {
                antiChurnPossibilityActOptions.push(<option key={antiChurnPossibility}
                                                            value={antiChurnPossibility}>
                    {translate.formatMessage({id: antiChurnPossibility})}
                </option>);
            })

        return antiChurnPossibilityActOptions;
    };

    public getListOfAntiChurnClientProposal = (): JSX.Element[] => {
        return Object.keys(AntiChurnClientProposalEnum)
            .sort((a, b) =>
                translate.formatMessage({id: a})
                    .localeCompare(translate.formatMessage({id: b})))
            .map((antiChurnClientProposal) => <option key={antiChurnClientProposal}
                                                      value={antiChurnClientProposal}>{translate.formatMessage({id: antiChurnClientProposal})}</option>)
    };

    public getListOfActType = (): JSX.Element[] => {
        const ActTypeOptions: JSX.Element[] = [];
        const {antiChurnSettings} = this.props;
        if (antiChurnSettings) {
            const targetClientProposal = this.props.antiChurnSettings?.find((clientProposal) =>
                clientProposal.code === this.state.antiChurnClientProposal);
            if (targetClientProposal) {
                targetClientProposal.actType
                    .sort((a, b) =>
                        a.label.localeCompare(b.label))
                    .forEach((element) => {
                        ActTypeOptions.push(<option key={element.code}
                                                    value={element.code}>{element.label}</option>);
                    })
            }
        }
        return ActTypeOptions
    }

    public getListOfActDetail = (): JSX.Element[] => {
        const ActDetailOptions: JSX.Element[] = [];
        const {antiChurnSettings} = this.props;
        if (antiChurnSettings) {
            const targetClientProposal = this.props.antiChurnSettings?.find((clientProposal) =>
                clientProposal.code === this.state.antiChurnClientProposal);
            if (targetClientProposal) {
                const targetActType = targetClientProposal.actType.find((at) => at.code === this.state.antiChurnActType);
                if (targetActType) {
                    targetActType.detail
                        .sort((a, b) =>
                            a.label.localeCompare(b.label)
                        )
                        .forEach((actDetail) => {
                            ActDetailOptions.push(<option key={actDetail.code}
                                                          value={actDetail.code}>{actDetail.label}</option>);
                        })
                }
            }
        }
        return ActDetailOptions
    }

    public getListOfAntiChurnClientResponse = (): JSX.Element[] => {
        return Object.keys(AntiChurnClientResponse)
            .sort((a, b) =>
                translate.formatMessage({id: a})
                    .localeCompare(translate.formatMessage({id: b})))
            .map((antiChurnClientResponse) => <option key={antiChurnClientResponse}
                                                      value={antiChurnClientResponse}>{translate.formatMessage({id: antiChurnClientResponse})}</option>)
    };

    public getListOfAntiChurnProposalMode = (): JSX.Element[] => {
        return Object.keys(AntiChurnProposalMode)
            .sort((a, b) =>
                translate.formatMessage({id: a})
                    .localeCompare(translate.formatMessage({id: b})))
            .map((antiChurnProposalMode) => <option key={antiChurnProposalMode}
                                                    value={antiChurnProposalMode}>{translate.formatMessage({id: antiChurnProposalMode})}</option>)
    };

    public getListOfAntiChurnProposalWithoutCommitment = (): JSX.Element[] => {
        return Object.keys(AntiChurnProposalWithoutCommitment)
            .sort((a, b) =>
                translate.formatMessage({id: a})
                    .localeCompare(translate.formatMessage({id: b})))
            .map((antiChurnProposalWithoutCommitment) => <option key={antiChurnProposalWithoutCommitment}
                                                                 value={antiChurnProposalWithoutCommitment}>{translate.formatMessage({id: antiChurnProposalWithoutCommitment})}</option>)
    };

    public getOrderReferenceToDisplay = (): string => {
        const {proposalMode, orderReference} = this.state.actAntiChurnData!.antiChurnData
        return AntiChurnProposalMode.ORDER_FINISHED === proposalMode && !orderReference ? translate.formatMessage({id: "not communicated"}) : orderReference
    }

    public render(): JSX.Element {
        const {actAntiChurnData, antiChurnProposalMode} = this.state
        const disableInputsOfForm = this.props.disabled;
        return (
            <FormGroup className={"mb-0"}>
                <Row>
                    <Col md={3}>
                        <Label>
                            <FormattedMessage id="acts.antichurn.possibility"/>
                            <span className="text-danger">*</span>
                        </Label>
                        <div id={"antiChurnPossibilityForm"}
                             className={disableInputsOfForm ? 'antiChurnFormPossibility disabled' : 'antiChurnFormPossibility'}>
                            <FormSelectInput name="antiChurnData.possibility"
                                             className={disableInputsOfForm ? 'disableFirstInput' : ''}
                                             label={translate.formatMessage({id: "acts.antichurn.possibility"})}
                                             bsSize={"sm"}
                                             id="antiChurnData.possibility"
                                             validations={this.props.disabled ? {} : {isRequired: ValidationUtils.notEmpty}}
                                             value={actAntiChurnData ? actAntiChurnData.antiChurnData.possibility : ""}
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
                                <FormSelectInput name="antiChurnData.clientProposal"
                                                 id="antiChurnData.clientProposal"
                                                 label={translate.formatMessage({id: "acts.antichurn.clientProposal"})}
                                                 bsSize={"sm"}
                                                 validations={this.props.disabled ? {} : {isRequired: ValidationUtils.notEmpty}}
                                                 value={actAntiChurnData ? actAntiChurnData.antiChurnData.clientProposal : ""}
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
                            <AntiChurnButtonRadio buttonGroupName={"antiChurnData.clientTerminationIntention"}
                                                  context={"clientTerminationIntention"}
                                                  label={translate.formatMessage({id: "acts.antichurn.clientTerminationIntention"})}
                                                  handleButtonChange={this.onClientTerminationIntentionChange}
                                                  value={actAntiChurnData ? String(actAntiChurnData.antiChurnData.clientTerminationIntention.code) : ""}
                                                  disabled={disableInputsOfForm}/>
                        </Col>
                    }
                </Row>
                {this.state.antiChurnPossibility === AntiChurnPossibilityAct.OUI &&
                    <Row>
                        {(this.state.antiChurnClientProposal === AntiChurnClientProposalEnum.REENGAGEMENT ||
                                this.state.antiChurnClientProposal === AntiChurnClientProposalEnum.VAL_CREATION) &&
                            <Col md={3}>
                                <Label>
                                    <FormattedMessage id="acts.antichurn.actType"/>
                                    <span className="text-danger">*</span>
                                </Label>
                                <div id={"antiChurnActType"}
                                     className={disableInputsOfForm ? 'antiChurnClientActTypeForm disabled' : 'antiChurnClientActTypeForm'}>
                                    <FormSelectInput name="antiChurnData.actType"
                                                     id="antiChurnData.actType"
                                                     bsSize={"sm"}
                                                     label={translate.formatMessage({id: "acts.antichurn.actType"})}
                                                     validations={this.props.disabled ? {} : {isRequired: ValidationUtils.notEmpty}}
                                                     value={actAntiChurnData ? actAntiChurnData.antiChurnData.actType?.code : ""}
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
                                    <FormSelectInput name="antiChurnData.actDetail"
                                                     id="antiChurnData.actDetail"
                                                     label={translate.formatMessage({id: "acts.antichurn.actDetail"})}
                                                     bsSize={"sm"}
                                                     validations={this.props.disabled ? {} : {isRequired: ValidationUtils.notEmpty}}
                                                     value={actAntiChurnData ? actAntiChurnData.antiChurnData.actDetail?.code : ""}
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
                                    {actAntiChurnData &&
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

                                    <FormTextInput name="antiChurnData.proposalDetail"
                                                   id="antiChurnData.proposalDetail"
                                                   label={translate.formatMessage({id: "acts.antichurn.proposalDetail"})}
                                                   bsSize={"sm"}
                                                   validations={this.props.disabled ? {} : {
                                                       isRequired: ValidationUtils.notEmpty,
                                                       "inputMaxLength": 100
                                                   }}
                                                   value={actAntiChurnData ? actAntiChurnData.antiChurnData.proposalDetail : ""}
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
                                    <FormSelectInput name="antiChurnData.clientResponse"
                                                     id="antiChurnData.clientResponse"
                                                     bsSize={"sm"}
                                                     label={translate.formatMessage({id: "acts.antichurn.clientResponse"})}
                                                     validations={this.props.disabled ? {} : {isRequired: ValidationUtils.notEmpty}}
                                                     value={actAntiChurnData ? actAntiChurnData.antiChurnData.clientResponse : ""}
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
                            this.state.antiChurnClientProposal !== AntiChurnClientProposalEnum.GCU_SANS_ENGAGEMENT &&
                            <Col md={4}>
                                <Label>
                                    <FormattedMessage id="acts.antichurn.proposalMode"/>
                                    <span className="text-danger">*</span>
                                </Label>
                                <div id={"antiChurnProposalModeForm"}
                                     className={disableInputsOfForm ? 'antiChurnProposalModeForm disabled' : 'antiChurnProposalModeForm'}>
                                    <FormSelectInput name="antiChurnData.proposalMode"
                                                     id="antiChurnData.proposalMode"
                                                     label={translate.formatMessage({id: "acts.antichurn.proposalMode"})}
                                                     bsSize={"sm"}
                                                     validations={this.props.disabled ? {} : {isRequired: ValidationUtils.notEmpty}}
                                                     value={actAntiChurnData ? actAntiChurnData.antiChurnData.proposalMode : ""}
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
                            this.state.antiChurnClientProposal !== AntiChurnClientProposalEnum.GCU_SANS_ENGAGEMENT &&
                            <Col md={5}>
                                <Label>
                                    {actAntiChurnData &&
                                        <Tooltip placement="bottom" isOpen={this.state.tooltipOpenOrderReference}
                                                 autohide={false}
                                                 className="antiChurnTooltip"
                                                 target={"antiChurnOrderReference"}
                                                 toggle={this.toggleTooltipOrderReference}>
                                            {actAntiChurnData.antiChurnData.orderReference}
                                        </Tooltip>
                                    }
                                    <FormattedMessage id="acts.antichurn.orderReference"/>
                                    {AntiChurnProposalMode.ORDER_FINISHED === antiChurnProposalMode &&
                                        <span className="text-danger">*</span>}
                                </Label>
                                <div id={"antiChurnOrderReference"}
                                     className={disableInputsOfForm ? 'antiChurnOrderReferenceForm disabled' : 'antiChurnOrderReferenceForm'}>

                                    <FormTextInput name="antiChurnData.orderReference"
                                                   id="antiChurnData.orderReference"
                                                   bsSize={"sm"}
                                                   label={translate.formatMessage({id: "acts.antichurn.orderReference"})}
                                                   validations={this.props.disabled ? {} : AntiChurnProposalMode.ORDER_FINISHED !== antiChurnProposalMode ? {"inputMaxLength": 100} : {
                                                       isRequired: ValidationUtils.notEmpty,
                                                       "inputMaxLength": 100
                                                   }}
                                                   value={actAntiChurnData ? this.getOrderReferenceToDisplay() : ""}
                                                   disabled={disableInputsOfForm}
                                                   onChange={this.onAntiChurnOrderReferenceChange}
                                    />
                                </div>
                            </Col>
                        }
                        {this.state.antiChurnClientResponse === AntiChurnClientResponse.REFUSED &&
                            this.state.antiChurnClientProposal !== AntiChurnClientProposalEnum.GCU_SANS_ENGAGEMENT &&
                            <Col md={5}>
                                <Label>
                                    <FormattedMessage id="acts.antichurn.proposalWithoutCommitment"/>
                                    <span className="text-danger">*</span>
                                </Label>
                                <div id={"antiChurnProposalWithoutCommitmentForm"}
                                     className={disableInputsOfForm ? 'antiChurnProposalWithoutCommitmentForm disabled' : 'antiChurnProposalWithoutCommitmentForm'}>
                                    <FormSelectInput name="antiChurnData.proposalWithoutCommitment"
                                                     id="antiChurnData.proposalWithoutCommitment"
                                                     label={translate.formatMessage({id: "acts.antichurn.proposalWithoutCommitment"})}
                                                     bsSize={"sm"}
                                                     validations={this.props.disabled ? {} : {isRequired: ValidationUtils.notEmpty}}
                                                     value={actAntiChurnData ? actAntiChurnData.antiChurnData.proposalWithoutCommitment?.code : ""}
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
                <FormTextInput name="antiChurnData.isConsultation"
                               id="antiChurnData.isConsultation"
                               classNameToProps={"m-0"}
                               value={disableInputsOfForm}
                               type="hidden"
                />
            </FormGroup>
        )
    }
}

const mapStateToProps = (state: AppState, ownProps: Props) => ({
    currentCase: state.store.cases[ownProps.caseId]?.currentCase,
    authorizations: state.store.applicationInitialState.authorizations,
    antiChurnSettings: state.store.applicationInitialState.antichurnSetting?.settingDetail
});

export default connect(mapStateToProps)(AntiChurnDataV2)
