export interface FastMessage {
    event: string
    error: boolean
    size?: string
    idCase?: string
    contact?: ContactMessage
    urlUpdate?: string
    fastTabId?: string
    serviceId?: string
    clientId?: string
    actNumber? : number
    resourceId? : string
    codeAct? : string
    mode? : string
    category?: string
    comment?: string
    shouldntClose?:boolean
}

export interface ContactMessage {
    idContact?: string
    mediaType?: string
    mediaDirection?: string
    contactStartDate?: string
    contactCreationDate?: string
}

export default class FastService {

    public static async postRedirectMessage(jsonMessage: Partial<FastMessage>) {
        await this.postMessage(jsonMessage, "redirect");
    }

    public static async postOpenDemaneMessage(jsonMessage: Partial<FastMessage>) {
        await this.postMessage(jsonMessage, "opendDemandeFastFixe");
    }

    public static async postUpdateContactIdMessage(jsonMessage: Partial<FastMessage>) {
        await this.postMessage(jsonMessage, "newContactFastr");
    }

    public static async postOpenADGOrDemandeRestitMessage(jsonMessage: Partial<FastMessage>,eventId: string) {
        await this.postMessage(jsonMessage, eventId);
    }

    public static postResizeMessage(jsonMessage: Partial<FastMessage>) {
        console.warn(jsonMessage);
        jsonMessage.event = "resize";
        window.parent.postMessage(JSON.stringify(jsonMessage), '*');
    }

    public static postSubmitMessage(jsonMessage: Partial<FastMessage>) {
        this.postMessage(jsonMessage, "submit");
    }

    public static postAbortMessage(jsonMessage: Partial<FastMessage>) {
        this.postMessage(jsonMessage, "abort");
    }

    public static async postOpenNewTabMessage(jsonMessage: Partial<FastMessage>) {
        await this.postMessage(jsonMessage, "createCaseInNewFastTab");
    }

    public static async postResreshFastCasesCounter(jsonMessage: Partial<FastMessage>) {
        await this.postMessage(jsonMessage, "refreshRecentCaseTab");
    }

    private static postMessage(jsonMessage: Partial<FastMessage>, type: string) {
        jsonMessage.event = type;
        window.parent.postMessage(jsonMessage, '*');
    }


}
