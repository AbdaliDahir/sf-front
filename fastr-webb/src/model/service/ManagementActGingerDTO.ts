
import {GingerMedia} from "../acts/send-communication/GingerTemplateModel";

export interface ManagementActGingerDTO {

    ackGingerCode?: string;
    ackGingerMessage?: string;
    ackGingerTime?: string;
    ackNetworkCode?: string;
    ackNetworkMessage?: string;
    ackNetworkTime?: string;
    ackUserCode?: string;
    ackUserMessage?: string;
    ackUserTime?: string;
    adresseDest?: string;
    adresseExp?: string;
    idAsc?: string;
    idClient?: string;
    idCommand?: string;
    idCsu?: string;
    idSiebel?: string;
    idmt?: string;
    media?: GingerMedia;
    objetMessage?: string;
    templateDescription?: string;
    templateName?: string;
    yourRef?: string;

}
