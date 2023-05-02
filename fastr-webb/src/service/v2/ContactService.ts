import {AddNoteRequestDTO} from "../../model/AddNoteRequestDTO";
import {Case} from "../../model/Case";
import {Contact} from "../../model/Contact";
import AbstractService from "../AbstractService";
import {ContactDTO} from "../../model/ContactDTO";

export default class ContactService extends AbstractService {

    public async newContact(id: string, noteDto: AddNoteRequestDTO): Promise<Case> {
        return this.put<AddNoteRequestDTO, Case>(`/fastr-cases/cases/${id}/contact/`, noteDto);
    }

    public async getNextContactSequence(): Promise<number> {
        return this.get<number>(`/fastr-cases/contacts/next/sequence`);
    }

    public async getContact(contactId: string): Promise<Contact> {
        return this.get<Contact>(`/fastr-cases/contacts/${contactId}`);
    }

    public async createContact(contact: ContactDTO): Promise<Contact> {
        return this.post<ContactDTO,Contact>(`/fastr-cases/contacts` , contact);
    }

}