import {withFormsy} from "formsy-react"
import * as React from 'react';
import {connect} from "react-redux"
import MediaAndReceiverChoice from "./Steps/MediaAndReceiverChoice"
import ModelChoice from "./Steps/ModelChoice"
import SumUp from "./Steps/SumUp"
import TemplateVisualizationV2 from "./Steps/TemplateVisualization/TemplateVisualizationV2"
import "./sendCommunication.css"
import {NotificationManager} from "react-notifications";
import {PassDownProps} from "formsy-react/dist/Wrapper";
import {Service} from "../../../../model/service";
import {GingerTemplateModel, RecipientMedia} from "../../../../model/acts/send-communication/GingerTemplateModel";
import {PreviewParameters} from "../../../../model/acts/send-communication/SendCommunicationRequestDTO";
import {ClientContextSliceState} from "../../../../store/ClientContextSlice";
import {AppState} from "../../../../store";
import {translate} from "../../../../components/Intl/IntlGlobalProvider";
import StepForm from "../../../../components/Form/StepForm/StepForm";
import notifService from "../../../../service/NotifService";
import {setFormIncompleteV2} from "../../../../store/actions/v2/case/CaseActions";
import {User} from "../../../../model/User";

interface Props extends PassDownProps {
    client: ClientContextSliceState
    service: Service
    setFormIncompleteV2: (caseId:string) => void
    caseId:string
    currentUser: User | undefined
}

export interface SendCommState {
    loading: boolean
    models?: Array<GingerTemplateModel>
    selected?: GingerTemplateModel
    recipientMedia?: RecipientMedia
    validForm?: PreviewParameters
}

class SendCommunicationV2 extends React.Component<Props, SendCommState> {
    private NOTIFICATION_TYPECODE_COMMCLIENT = "COMMCLIENT"

    constructor(props: Props) {
        super(props)
        this.state = {
            loading: false
        }
    }

    public componentDidMount = async () => {
        this.props.setFormIncompleteV2(this.props.caseId);
        try {

            const models: Array<GingerTemplateModel> = await notifService.fetchModels(
                {
                    activityCode: this.props.currentUser?.activity && this.props.currentUser?.activity.code,
                    idPerson: this.props.client.clientData?.id!,
                    idService: this.props.client.serviceId!,
                    notificationTypeCode: this.NOTIFICATION_TYPECODE_COMMCLIENT
                })
            if (!models.length) {
                NotificationManager.error(translate.formatMessage({id: "act.send.communication.error.template"}), null, 20000)
            }
            this.setState({
                models
            })
        } catch (err) {
            err!.then(e => NotificationManager.error(e.message, "Error", 20000))
        }
    }

    public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<SendCommState>): void {
        if (prevState.validForm !== this.state.validForm) {
            const {models, ...formToFormat} = this.state
            this.props.setValue(formToFormat)
        }

        if (prevState.selected !== this.state.selected) {
            if (this.state.selected) {
                this.setState({loading: true})
                notifService.fetchRecipient({
                    clientId: this.props.client.clientData?.id!,
                    serviceId: this.props.client.serviceId!,
                    templateId: this.state.selected && this.state.selected.id
                })
                    .then(res => {
                        this.setState({loading: false})
                        if (!res || !res.defaultMedia && !res.recipientByMediaMap) {
                            throw new Error(translate.formatMessage({id: "act.send.communication.error.media"}))
                        }
                        return res
                    })
                    .then(res => this.setRecipientMedia({
                            media: res.defaultMedia,
                            recipientByMediaMap: res.recipientByMediaMap
                        }
                    ))
                    .catch(err => {
                        Promise.resolve(err).then(e => NotificationManager.error(e.message, null, 20000))
                    })
            }
        }
    }


    public setSelected = selected => this.setState({selected})
    public setRecipientMedia = recipientMedia => this.setState({recipientMedia})
    public setValidForm = validForm => this.setState({validForm})

    public render() {
        const media = this.state.recipientMedia && this.state.recipientMedia.media
        return (
            <div className="act send-communication">
                <StepForm
                    size={"sm"}
                    stepNames={
                        [
                            translate.formatMessage({id: "act.send.communication.first.step"}),
                            translate.formatMessage({id: "act.send.communication.second.step"}),
                            translate.formatMessage({id: "act.send.communication.third.step"}),
                            translate.formatMessage({id: "act.send.communication.fourth.step"})
                        ]
                    }>
                    <ModelChoice key="ModelChoice" selected={this.state.selected} setSelected={this.setSelected}
                                 models={this.state.models}/>
                    <MediaAndReceiverChoice key="MediaAndReceiverChoice"
                                            chosenModel={this.state.selected}
                                            loading={this.state.loading}
                                            recipientMedia={this.state.recipientMedia}
                                            setRecipientMedia={this.setRecipientMedia}/>
                    <TemplateVisualizationV2 key="TemplateVisualization"
                                           model={this.state.selected}
                                           media={media}
                                           caseId={this.props.caseId}
                                           setValidForm={this.setValidForm}
                                           validForm={this.state.validForm}
                                           client={this.props.client.clientData}
                                           service={this.props.service}/>
                    <SumUp key="SumUp" chosenModel={this.state.selected} recipientMedia={this.state.recipientMedia}
                           form={this.state.validForm ? this.state.validForm : []}/>
                </StepForm>
            </div>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    client: state.store.client.currentClient,
    currentUser: state.store.applicationInitialState.user,
    service: state.store.client.currentClient?.service
})


const mapDispatchToProps = {
    setFormIncompleteV2
}

export default connect(mapStateToProps, mapDispatchToProps)(withFormsy(SendCommunicationV2));