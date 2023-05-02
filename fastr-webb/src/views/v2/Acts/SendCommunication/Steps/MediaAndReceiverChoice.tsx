import * as React from "react";
import {Col, FormGroup, Input, Label, Row} from "reactstrap"
import {StepProps} from "../../../../../components/Form/StepForm/StepForm";
import {
	GingerMedia,
	GingerTemplateModel,
	RecipientMedia
} from "../../../../../model/acts/send-communication/GingerTemplateModel";
import Loading from "../../../../../components/Loading";

interface Props extends StepProps {
	loading: boolean
	chosenModel?: GingerTemplateModel
	recipientMedia?: RecipientMedia
	setRecipientMedia: (media: RecipientMedia) => void
}

const MediaAndReceiverChoice: React.FunctionComponent<Props> = (props: Props) => {
	if (!props.recipientMedia || props.loading) {
		return <Loading />
	}

	const {recipientMedia, setRecipientMedia, chosenModel} = props

	React.useEffect(() => {
		if (props.changeValidation && recipientMedia && !props.loading) {
			props.changeValidation(true)
		}

	}, [props.currentStep, props.recipientMedia, props.loading])


	const onRadioClick = e => setRecipientMedia({
		media: e.currentTarget.name,
		recipientByMediaMap: props.recipientMedia && props.recipientMedia.recipientByMediaMap
	})


	const media = recipientMedia && recipientMedia.media

	const getRecipient = (mediaType: GingerMedia) => recipientMedia && recipientMedia.recipientByMediaMap && recipientMedia.recipientByMediaMap[mediaType]

	// TODO: fichier de langue
	return (
		<Row>
			<Col>
				<p><strong>Modèle choisi :</strong> {chosenModel && (chosenModel.description + ' (' + chosenModel.name + ')')}</p>
				<strong>Destinataire</strong>
				<FormGroup tag="fieldset">
					<FormGroup check hidden={!getRecipient("EMAIL")}>
						<Label check>
							<Input type="radio" name="EMAIL"
								   checked={media === "EMAIL"}
								   onChange={onRadioClick}/>{' '}
							Email : {getRecipient("EMAIL")}
						</Label>
					</FormGroup>

					<FormGroup hidden={!getRecipient("SMS")} check>
						<Label check>
							<Input type="radio" name="SMS"
								   checked={media === "SMS"}
								   onChange={onRadioClick}/>{' '}
							SMS : {getRecipient("SMS")}
						</Label>
					</FormGroup>
				</FormGroup>
			</Col>
		</Row>
	)

}
export default MediaAndReceiverChoice;