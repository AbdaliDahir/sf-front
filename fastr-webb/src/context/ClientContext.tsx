import React, {Component} from 'react';
import ClientService from "../service/ClientService";
import {Client} from "../model/person";

export interface ClientContextInterface {
    data?: Client,
    loadServiceOwner: (idPerson: string, idService: string, howToLoad: DataLoad) => Promise<void>
}

export const ClientContext = React.createContext<ClientContextInterface | null>(null);

interface State {
    serviceOwner?: Client
}

export enum DataLoad {
    ALL_SERVICES,
    ONE_SERVICE,
    ALL_SERVICES_LIGHT
}

export class ClientContextProvider extends Component<object, State> {
    private clientService: ClientService = new ClientService();

    constructor(props: object) {
        super(props);
        this.state = {serviceOwner: undefined}
    }

    public loadClientData = async (idPerson: string, idService: string, howToLoad: DataLoad) => {
        switch (howToLoad) {
            case DataLoad.ALL_SERVICES:
                await this.getServiceOwner(idPerson, idService);
                break;
            case DataLoad.ONE_SERVICE:
                await this.getServiceOwnerWithService(idPerson, idService);
                break;
        }
    };

    public getServiceOwnerWithService = async (idPerson: string, idService: string) => {
        const value = await this.clientService.getClientByServiceId(idPerson,idService);
        this.setState({serviceOwner: value})
    };

    public getServiceOwner = async (idPerson: string, idService: string) => {
        const value = await this.clientService.getClientWithAllServices(idPerson);
        this.setState({serviceOwner: value})
    };


    public render = () => {
        const contextValue: ClientContextInterface = {
            data: this.state.serviceOwner,
            loadServiceOwner: this.loadClientData
        };
        return <ClientContext.Provider value={contextValue}>{this.props.children}</ClientContext.Provider>
    }

}
