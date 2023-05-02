import {CommandeStatut} from "../enums/CommandeStatut";

export interface Commande {
    acte: string;
    articles: string[];
    avancement: string;
    canal: string;
    civiliteTitulaire: string;
    dateAnniversaireTitulaire: string;
    dateEnregistrement: string;
    nomTitulaire: string;
    offresCibles: string[];
    orderNumber: string;
    prenomTitulaire: string;
    statut: CommandeStatut;
    idTitulaire: string;
    idService: string;
    address: string;
    addressCompletion: string;
    zipcode: string;
    city: string;
    email: string;
}