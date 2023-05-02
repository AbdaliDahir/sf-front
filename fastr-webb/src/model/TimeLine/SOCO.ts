export interface SOCO {
    status: string
    "emails": Email[],
    "sms": SMS[]
}

export interface Email {
    "idsol": string,
    "url": string,
    "sendDate": string,
    "recipientEmail": string,
    "msisdn": string,
    "subject": string
    "type": string,
}

export interface SMS {
    "offreCom": string,
    "object": string,
    "sendDate": string,
    "smsText": string,
    "recipient_msisdn": string
    "type": string,
}
