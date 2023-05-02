import React, {Component} from 'react';
import {FormGroup, Label} from "reactstrap";
import {FormattedMessage} from "react-intl";
import FormSelectInput from "../../../../components/Form/FormSelectInput";
import ValidationUtils from "../../../../utils/ValidationUtils";
import {translate} from "../../../../components/Intl/IntlGlobalProvider";
import FormSwitchInput from "../../../../components/Form/FormSwitchInput";
import {connect} from "react-redux";
import {AppState} from "../../../../store";
import {setCallTransferStatusOK, setHasCallTransfer} from "../../../../store/actions";
import CaseService from "../../../../service/CaseService";
import {Activity} from "../../../../model/Activity";
import FormTextInput from "../../../../components/Form/FormTextInput";
import './CallTransfer.scss'

interface Props {
    isCallTransferStatusOK: boolean
    setCallTransferStatusOK: (value: boolean) => void
    setHasCallTransfer: (value: boolean) => void
    caseId?: string
    contactId?: string
}

interface State {
    receiverActivities: Activity[],
    activityLabel: string,
    activityCode: string,
    failureReason: string
}

class CallTransfer extends Component<Props, State> {
    private caseService: CaseService = new CaseService(true);

    constructor(props: Props) {
        super(props);
        this.state = {
            receiverActivities: [],
            activityLabel: "",
            activityCode: "",
            failureReason: ""
        }
    }

    public componentDidMount = async () => {
        const receiverActivities: Activity[] = await this.caseService.getReceiverActivitiesForTransfer();
        receiverActivities.sort((a, b) => a.label.localeCompare(b.label));
        this.setState({receiverActivities});
    };

    public render() {
        const {isCallTransferStatusOK} = this.props;
        return (
            <section className="bg-light rounded call-transfer">
                <section className="call-transfer__form-element">
                    <FormGroup>
                        <Label for="receiverActivity"><FormattedMessage
                            id="cases.transfer.receiverActivity"/><span className="text-danger">*</span></Label>
                        <FormSelectInput name="callTransfer.receiverActivity.code" id="receiverActivity"
                                         value={this.state.activityCode}
                                         validations={{isRequired: ValidationUtils.notEmpty}}
                                         onChange={this.handleTransferActivity}>
                            <option value="" disabled selected/>
                            {
                                this.state.receiverActivities.map(activity =>
                                    <option key={activity.code} value={activity.code}>{activity.label}</option>)
                            }
                        </FormSelectInput>
                        <FormTextInput hidden={true} name="callTransfer.receiverActivity.label"
                                       value={this.state.activityLabel}/>
                    </FormGroup>
                </section>
                <section className="call-transfer__form-element">
                    <FormGroup className="my-0">
                        <Label for="call-transfer-result" className="text-nowrap"><FormattedMessage
                            id="cases.transfer.result"/></Label>
                        <FormSwitchInput color="primary"
                                         value={isCallTransferStatusOK}
                                         valueOn={translate.formatMessage({id: "global.ok"})}
                                         valueOff={translate.formatMessage({id: "global.ko"})}
                                         name="callTransfer.transferOk"
                                         id="call-transfer-result"
                                         defaultChecked={isCallTransferStatusOK}
                                         onChange={this.handleCallTransferStatus}/>
                    </FormGroup>
                </section>
                {!isCallTransferStatusOK &&
                <section className="call-transfer__form-element">
                    <FormGroup>
                        <Label for="receiverActivity"><FormattedMessage
                            id="cases.transfer.failureReason.label"/><span
                            className="text-danger">*</span></Label>
                        <FormSelectInput name="callTransfer.failureReason" id="failureReason"
                                         value={this.state.failureReason}
                                         onChange={this.handleFailureReason}
                                         validations={{isRequired: ValidationUtils.notEmpty}}>
                            <option value="" disabled selected/>
                            <option
                                value={translate.formatMessage({id: "cases.transfer.failureReason.refusal"})}>{translate.formatMessage({id: "cases.transfer.failureReason.refusal"})}</option>
                            <option
                                value={translate.formatMessage({id: "cases.transfer.failureReason.unavailable"})}>{translate.formatMessage({id: "cases.transfer.failureReason.unavailable"})}</option>
                        </FormSelectInput>
                    </FormGroup>
                </section>
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

    private handleCallTransferStatus = (event: React.FormEvent<HTMLInputElement>) => {
        this.props.setCallTransferStatusOK(event.currentTarget.checked);
    };
}

const mapStateToProps = (state: AppState) => ({
    isCallTransferStatusOK: state.casePage.isCallTransferStatusOK,
    caseId: state.case.currentCase?.caseId,
    contactId: state.casePage.currentContactId
});

const mapDispatchToProps = {
    setCallTransferStatusOK,
    setHasCallTransfer
};


export default connect(mapStateToProps, mapDispatchToProps)(CallTransfer);
