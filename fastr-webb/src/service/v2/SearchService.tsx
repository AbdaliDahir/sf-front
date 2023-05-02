import AbstractService from "../AbstractService";
import {SearchResult} from "../../model/person/SearchResult";
import {Commande} from "../../model/commande/Commande";
import {ByMsisdnOrNdi} from "../../model/commande/ByMsisdnOrNdi";
import {ByTitulaire} from "../../model/commande/ByTitulaire";

export default class SearchService extends AbstractService {

    constructor() {
        super(true);
    }

    public async cxpSearch(query: string): Promise<SearchResult[]> {
        return this.get<SearchResult[]>(`/fastr-clients/clients/search?q=${query}`);
    }

    public async getCommandeByOrderId(orderId: string): Promise<Commande[]> {
        return this.get<Commande[]>(`/fastr-orders/search/orders/${orderId}`);
    }

    public async getCommandeByICCID(iccid: string): Promise<Commande[]> {
        return this.get<Commande[]>(`/fastr-orders/search/orders/by/iccid/${iccid}`);
    }

    public async getCommandeByMsisdnOrNdi(query: ByMsisdnOrNdi): Promise<Commande[]> {
        return this.post<ByMsisdnOrNdi,Commande[]>(`/fastr-orders/search/orders/by/msisdn/or/ndi` , query);
    }

    public async getCommandeByTitulaire(query: ByTitulaire): Promise<Commande[]> {
        return this.post<ByTitulaire,Commande[]>(`/fastr-orders/search/orders/by/titulaire` , query);
    }

}