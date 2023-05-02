import React, {Component} from 'react';
import {FormGroup, Label} from "reactstrap";
import {FormattedMessage} from "react-intl";
import FormSelectInput from "../../../../components/Form/FormSelectInput";
import ValidationUtils from "../../../../utils/ValidationUtils";
import {translate} from "../../../../components/Intl/IntlGlobalProvider";
import FormSwitchInput from "../../../../components/Form/FormSwitchInput";
import {connect} from "react-redux";
import {AppState} from "../../../../store";
import {setCallTransferStatusOKV2} from "../../../../store/actions/v2/case/CaseActions";
import CaseService from "../../../../service/CaseService";
import {Activity} from "../../../../model/Activity";
import FormTextInput from "../../../../components/Form/FormTextInput";
import './CallTransfertV2.scss'

interface Props {
    isCallTransferStatusOKV2: boolean
    setCallTransferStatusOKV2: (caseId: string, value: boolean) => void
    caseId: string
}

interface State {
    receiverActivities: Activity[],
    activityLabel: string,
    activityCode: string,
    failureReason: string,
    transferStatusInitialValue?: boolean
}

class CallTransferV2 extends Component<Props, State> {
    private caseService: CaseService = new CaseService(true);

    constructor(props: Props) {
        super(props);
        this.state = {
            receiverActivities: [],
            activityLabel: "",
            activityCode: "",
            failureReason: "",
            transferStatusInitialValue: undefined
        }
    }

    public componentDidMount = async () => {
        const receiverActivities: Activity[] = await this.caseService.getReceiverActivitiesForTransfer();
        receiverActivities.sort((a, b) => a.label.localeCompare(b.label));
        this.setState({
            receiverActivities,
            transferStatusInitialValue: true
        });
    };

    public render() {
        const {isCallTransferStatusOKV2} = this.props;
        return (
            <section className="d-flex-column ">
                <FormGroup className={"align-items-baseline justify-content-between mb-0"}>
                    <Label for="receiverActivity" className={"font-weight-bold"}>
                        <FormattedMessage id="cases.transfer.receiverActivity"/><span className="text-danger">*</span>
                    </Label>
                    <FormSelectInput name="transfer.receiverActivity.code" id="receiverActivity"
                                     label={translate.formatMessage({id: "cases.transfer.receiverActivity"})}
                                     forceDirty={true}
                                     validations={{isRequired: ValidationUtils.notEmpty}}
                                     onChange={this.handleTransferActivity}
                                     className={"custom-select-sm mb-1"}>
                        <option value="" disabled selected/>
                        {
                            this.state.receiverActivities.map(activity =>
                                <option key={activity.code} value={activity.code}>{activity.label}</option>)
                        }
                    </FormSelectInput>
                    <FormTextInput hidden
                                   name="transfer.receiverActivity.label"
                                   className={"m-0"}
                                   forcedValue={this.state.activityLabel}/>
                </FormGroup>
                <FormGroup className={"align-items-baseline mb-0 d-flex"}>
                    <Label for="call-transfer-result" className="text-nowrap font-weight-bold">
                        <FormattedMessage id="cases.transfer.result"/>
                    </Label>
                    <FormSwitchInput color="primary"
                                     forcedValue={this.state.transferStatusInitialValue}
                                     onForce={this.handleCallTransferStatus}
                                     valueOn={translate.formatMessage({id: "global.ok"})}
                                     valueOff={translate.formatMessage({id: "global.ko"})}
                                     name="transfer.isTransferOk"
                                     id="call-transfer-result"
                                     defaultChecked={isCallTransferStatusOKV2}
                                     onChange={this.handleCallTransferStatus}
                                     thickness={"sm"}
                                     className={"mb-1"}/>
                </FormGroup>
                {!isCallTransferStatusOKV2 &&
                    <FormGroup className={"align-items-baseline justify-content-between mb-0"}>
                        <Label for="receiverActivity" className={"font-weight-bold"}>
                            <FormattedMessage id="cases.transfer.failureReason.label"/><span className="text-danger">*</span>
                        </Label>
                        <FormSelectInput name="transfer.failureReason" id="failureReason"
                                         label={translate.formatMessage({id: "cases.transfer.failureReason.label"})}
                                         className={"custom-select-sm mb-0"}
                                         forceDirty={true}
                                         onChange={this.handleFailureReason}
                                         validations={{isRequired: ValidationUtils.notEmpty}}>
                            <option value="" disabled selected/>
                            <option
                                value={translate.formatMessage({id: "cases.transfer.failureReason.refusal"})}>{translate.formatMessage({id: "cases.transfer.failureReason.refusal"})}</option>
                            <option
                                value={translate.formatMessage({id: "cases.transfer.failureReason.unavailable"})}>{translate.formatMessage({id: "cases.transfer.failureReason.unavailable"})}</option>
                        </FormSelectInput>
                    </FormGroup>
                }
            </section>
        );
    }

    private handleTransferActivity = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({
            activityLabel: this.state.receiverActivities.filter(a => a.code === event.currentTarget.value)[0].label,
            activityCode: event.currentTarget.value
        });
    }

    private handleFailureReason = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({failureReason: event.currentTarget.value});
    }

    private handleCallTransferStatus = (event) => {
        this.props.setCallTransferStatusOKV2(this.props.caseId, event.currentTarget ? event.currentTarget.checked : event);
    };
}

const mapStateToProps = (state: AppState, ownProps: Props) => ({
    isCallTransferStatusOKV2: state.store.cases.casesList[ownProps.caseId].isCallTransferStatusOKV2
});

const mapDispatchToProps = {
    setCallTransferStatusOKV2,
};

export default connect(mapStateToProps, mapDispatchToProps)(CallTransferV2);
