import {
    RecipientResponseDTO,
    TemplatePreviewResponseDTO
} from "../model/acts/send-communication/SendCommunicationResponseDTO"
import AbstractService from "./AbstractService"
import {GingerTemplateModel} from "../model/acts/send-communication/GingerTemplateModel"
import {
    ModelRequestDTO,
    RecipientRequestDTO,
    TemplatePreviewRequestDTO
} from "../model/acts/send-communication/SendCommunicationRequestDTO"


class NotifService extends AbstractService {

    public async fetchModels(modelRequestDTO: ModelRequestDTO): Promise<Array<GingerTemplateModel>> {
        return this.post <ModelRequestDTO, Array<GingerTemplateModel>>(`/fastr-notif/notif/ginger/tpl/templates`,
            modelRequestDTO);
    }


    public async fetchRecipient(recipientRequestDTO: RecipientRequestDTO): Promise<RecipientResponseDTO> {
        return this.post <RecipientRequestDTO, RecipientResponseDTO>(`/fastr-notif/notif/ginger/tpl/recipient`,
            recipientRequestDTO);
    }


    public async fetchTemplatePreview(templatePreviewRequestDTO: TemplatePreviewRequestDTO): Promise<TemplatePreviewResponseDTO> {
        return this.post <TemplatePreviewRequestDTO, TemplatePreviewResponseDTO>(`/fastr-notif/notif/ginger/message/sendByTemplate/preview`,
            templatePreviewRequestDTO);
    }


}

const notifService = new NotifService(true);

export default notifService;