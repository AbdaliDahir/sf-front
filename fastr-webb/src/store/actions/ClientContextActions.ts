import ClientService from "../../service/ClientService";
import {Dispatch} from "redux";
import {Client} from "../../model/person";
import {Case} from "../../model/Case";
import CaseService from "../../service/CaseService";
import SelfCareService from "../../service/SelfCareService";


export const LOAD_CLIENT_LOADING = 'REDUX_THUNK_LOAD_CLIENT_LOADING';
export const LOAD_CLIENT_SUCCESS = 'REDUX_THUNK_LOAD_CLIENT_SUCCESS';
export const LOAD_CLIENT_ERROR = 'REDUX_THUNK_LOAD_CLIENT_ERROR';


export const LOAD_CLIENT_CASES_LOADING = 'REDUX_THUNK_LOAD_CLIENT_CASES_LOADING';
export const LOAD_CLIENT_CASES_SUCCESS = 'REDUX_THUNK_LOAD_CLIENT_CASES_SUCCESS';
export const LOAD_CLIENT_CASES_ERROR = 'REDUX_THUNK_LOAD_CLIENT_CASES_ERROR';

export const LOAD_BILLS_LOADING = 'REDUX_THUNK_LOAD_BILLS_LOADING';
export const LOAD_BILLS_SUCCESS = 'REDUX_THUNK_LOAD_BILLS_SUCCESS';
export const LOAD_BILLS_ERROR = 'REDUX_THUNK_LOAD_BILLS_ERROR';

export const LOAD_COMMUNICATIONS_LOADING = 'REDUX_THUNK_LOAD_COMMUNICATIONS_LOADING';
export const LOAD_COMMUNICATIONS_SUCCESS = 'REDUX_THUNK_LOAD_COMMUNICATIONS_SUCCESS';
export const LOAD_COMMUNICATIONS_ERROR = 'REDUX_THUNK_LOAD_COMMUNICATIONS_ERROR';

const clientService: ClientService = new ClientService();
const caseService: CaseService = new CaseService(false);
const selfcareService: SelfCareService = new SelfCareService();


export enum DataLoad {
    ALL_SERVICES,
    ONE_SERVICE,
    ALL_SERVICES_LIGHT
}

/*Loading client in 2 different ways :
* 1 : results in CLIENT + All HIS SERVICES
* 2 : results in CLIENT + a SINGLE service by serviceId from PAYLOAD*/
const loadClientData = async (idPerson: string, idService: string, howToLoad: DataLoad): Promise<Client> => {
    switch (howToLoad) {
        case DataLoad.ALL_SERVICES:
            return getClientWithAllServices(idPerson);
        case DataLoad.ALL_SERVICES_LIGHT:
            return getClientWithAllServices(idPerson);
        case DataLoad.ONE_SERVICE:
            return getClientByServiceId(idPerson, idService);
    }
};

const loadCasesFromPersonAndService = async (idPerson: string, idService: string, page: number = 0): Promise<Case[]> => {
    return caseService.getCases(idPerson, idService, page);
};



const getClientWithAllServices = async (idPerson: string): Promise<Client> => {
    return await clientService.getClientWithAllServices(idPerson);
};

const getClientByServiceId = async (idPerson: string, idService: string): Promise<Client> => {
    return await clientService.getClientByServiceId(idPerson, idService);
};




export const fetchAndStoreClient = (clientId: string, serviceId: string, howToLoad: DataLoad) => (dispatch: Dispatch) => {
    dispatch({type: LOAD_CLIENT_LOADING});
    loadClientData(clientId, serviceId, howToLoad)
        .then(
            data => dispatch({type: LOAD_CLIENT_SUCCESS, data, serviceId}),
            error => dispatch({type: LOAD_CLIENT_ERROR, error: error.message || 'Unexpected Error!!!7'})
        )
};

export const fetchAndStoreCasesByPage = (clientId: string, serviceId: string, page: number = 0) => (dispatch: Dispatch) => {
    dispatch({type: LOAD_CLIENT_CASES_LOADING});
    loadCasesFromPersonAndService(clientId, serviceId, page)
        .then(
            data => dispatch({type: LOAD_CLIENT_CASES_SUCCESS, data, serviceId}),
            error => dispatch({type: LOAD_CLIENT_CASES_ERROR, error: error.message || 'Unexpected Error!!!8'})
        )
};



export const loadCommunications = (serviceId: string) => (dispatch: Dispatch) => {
    dispatch({type: LOAD_COMMUNICATIONS_LOADING});
    selfcareService.retrieveSOCOMobile(serviceId, "5")
        .then(
            data => dispatch({type: LOAD_COMMUNICATIONS_SUCCESS, data}),
            error => dispatch({type: LOAD_COMMUNICATIONS_ERROR, error: error.message || 'Unexpected Error!!!9'})
        )
};

