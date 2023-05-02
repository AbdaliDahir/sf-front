import {withFormsy} from "formsy-react"
import * as React from 'react';
import {connect} from "react-redux"
import StepForm from "../../../components/Form/StepForm/StepForm"
import {translate} from "../../../components/Intl/IntlGlobalProvider"
import {
	GingerTemplateModel,
	RecipientMedia
} from "../../../model/acts/send-communication/GingerTemplateModel"
import {PreviewParameters} from "../../../model/acts/send-communication/SendCommunicationRequestDTO"
import Payload from "../../../model/Payload"
import {Client} from "../../../model/person"
import {Service} from "../../../model/service"
import notifService from "../../../service/NotifService"
import {AppState} from "../../../store"
import MediaAndReceiverChoice from "./Steps/MediaAndReceiverChoice"
import ModelChoice from "./Steps/ModelChoice"
import SumUp from "./Steps/SumUp"
import TemplateVisualization from "./Steps/TemplateVisualization"
import {setFormIncomplete} from "../../../store/actions"
import "./sendCommunication.css"
import {NotificationManager} from "react-notifications";
import {PassDownProps} from "formsy-react/dist/Wrapper";

interface Props extends PassDownProps {
	payload: Payload
	client: Client
	service: Service
	setFormIncomplete: () => void
}

export interface SendCommState {
	loading: boolean
	models?: Array<GingerTemplateModel>
	selected?: GingerTemplateModel
	recipientMedia?: RecipientMedia
	validForm?: PreviewParameters
}

class SendCommunication extends React.Component<Props, SendCommState> {
	private NOTIFICATION_TYPECODE_COMMCLIENT = "COMMCLIENT"

	constructor(props: Props) {
		super(props)
		this.state = {
			loading: false
		}
	}

	public componentDidMount = async () => {
		this.props.setFormIncomplete()
		try {

			const models: Array<GingerTemplateModel> = await notifService.fetchModels(
				{
					activityCode: this.props.payload.activite && this.props.payload.activite.code,
					idPerson: this.props.payload.idClient,
					idService: this.props.payload.idService,
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
					clientId: this.props.payload.idClient,
					serviceId: this.props.payload.idService,
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
					<MediaAndReceiverChoice key="MediaAndReceiverChoice" chosenModel={this.state.selected}
					                        loading={this.state.loading}
					                        recipientMedia={this.state.recipientMedia}
					                        setRecipientMedia={this.setRecipientMedia}/>
					<TemplateVisualization key="TemplateVisualization" model={this.state.selected} media={media}
					                       payload={this.props.payload} setValidForm={this.setValidForm}
					                       validForm={this.state.validForm}
					                       client={this.props.client} service={this.props.service}/>
					<SumUp key="SumUp" chosenModel={this.state.selected} recipientMedia={this.state.recipientMedia}
					       form={this.state.validForm ? this.state.validForm : []}/>
				</StepForm>
			</div>
		);
	}
}

const mapStateToProps = (state: AppState) => ({
	client: state.client.data,
	service: state.client.service
})


const mapDispatchToProps = {
	setFormIncomplete
}

export default connect(mapStateToProps, mapDispatchToProps)(withFormsy(SendCommunication));