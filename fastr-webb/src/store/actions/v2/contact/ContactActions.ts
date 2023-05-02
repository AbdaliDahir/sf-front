import * as actionsTypes from "./ContactActionsTypes"
import ContactService from "../../../../service/v2/ContactService";
import {ContactDTO} from "../../../../model/ContactDTO";
import {Contact} from "../../../../model/Contact";
import {Channel} from "../../../../model/Channel";


const contactService = new ContactService(true);
export const createAndStoreContactV2 = (contact: ContactDTO) => {
    return async dispatch => {
        const createdContact:Contact = await contactService.createContact(contact);
        dispatch(storeContactV2(createdContact))
        sessionStorage.setItem("contactId" , createdContact.contactId );
    }
}

const storeContactV2 = (contact: Contact | undefined) => (
    {
        type: actionsTypes.STORE_NEW_CONTACT_V2,
        payload: contact
    }
)
export const storeContactChannelV2 = (contactChannel: Channel | undefined) => (
    {
        type: actionsTypes.STORE_CONTACT_CHANNEL_V2,
        payload: contactChannel
    }
)

export const storeMediaCurrentContact = (type: string | undefined, direction: string | undefined) => (
    {
        type: actionsTypes.STORE_MEDIA_CURRENT_CONTACT,
        payload: {type, direction}
    }
)

export const catchChangedContact = (contactStatus: boolean | undefined) => (
    {
        type: actionsTypes.CONTACT_MEDIA_CHANGED,
        payload: {contactStatus}
    }
)

// for when contactId is given in payload (iframe)
export const storePartialContactV2 = (contactId: string) => (
    {
        type: actionsTypes.STORE_NEW_CONTACT_V2,
        payload: {contactId}
    }
)
