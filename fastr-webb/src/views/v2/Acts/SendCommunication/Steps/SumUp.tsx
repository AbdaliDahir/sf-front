import * as React from "react";
import {Button, Modal, ModalBody, ModalHeader} from "reactstrap"
import Visualization from "./TemplateVisualization/Visualization"
import {StepProps} from "../../../../../components/Form/StepForm/StepForm";
import {GingerTemplateModel, RecipientMedia} from "../../../../../model/acts/send-communication/GingerTemplateModel";
import {PreviewParameters} from "../../../../../model/acts/send-communication/SendCommunicationRequestDTO";
import notifService from "../../../../../service/NotifService";

interface Props extends StepProps {
    chosenModel?: GingerTemplateModel
    recipientMedia?: RecipientMedia
    form: PreviewParameters
}
// TODO: fichier de langue
const SumUp: React.FunctionComponent<Props> = (props: Props) => {
    const media = props.recipientMedia && props.recipientMedia.media && props.recipientMedia.media.toString()
    const [modal, setModal] = React.useState<boolean>(false)
    const [content, setContent] = React.useState()
    const toggle = () => setModal(prevState => !prevState)

    const onVisuClick = (e) => {
        e.preventDefault();
        toggle()
    };

    React.useEffect(() => {
        notifService.fetchTemplatePreview({
            templateName: props.chosenModel && props.chosenModel.name,
            previewParameters: props.form,
            templateMedia: media
        })
            .then(res => setContent(res.content))
            .then(res => props.changeValidation && props.changeValidation(true))
            .catch(err => console.error(err))
    }, [])

    const modelDescription = props.chosenModel && (props.chosenModel.description + ' (' + props.chosenModel.name + ')')
    return (
        <div className="d-flex justify-content-between">
            <div>
                <strong>Modèle choisi :</strong> {modelDescription} <br/>
                <strong>Média choisi :</strong> {media}<br/>
                <strong>Destinataire :
                </strong> {props.recipientMedia && props.recipientMedia.recipientByMediaMap && props.recipientMedia.recipientByMediaMap[media ? media : "SMS"]}
            </div>
            <div>
                <Button id="stepSumUp.show.button.id" size="sm" onClick={onVisuClick}>Visualiser</Button>
            </div>
            <Modal isOpen={modal} toggle={toggle} className="comm-modal">
                <ModalHeader className="bg-light font-weight-bold" toggle={toggle}>
                    Envoi de communication : Saisie des paramètres, média <em>{media}</em>
                </ModalHeader>
                <ModalBody>
                    <Visualization content={content}/>
                </ModalBody>
            </Modal>
        </div>
    )

}
export default SumUp;
