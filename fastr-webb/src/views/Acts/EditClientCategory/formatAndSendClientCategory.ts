import ActService from "../../../service/ActService";
import FASTRAct from "../../../model/acts/FASTRAct";
import Payload from "../../../model/Payload";
import {FormForCase} from "../../../model/case/FormForCase";
import {ClientCategory} from "../../../model/acts/client-category/ClientCategory";
import {EditClientCategoryRequestDTO} from "../../../model/acts/client-category/EditClientCategoryRequestDTO";
import {ServiceCategoryDTO} from "../../../model/acts/client-category/ServiceCategoryDTO";
import {store} from '../../../index';
import {get} from "lodash";
import {Client} from "../../../model/person";

export interface ClientCategoryCaseForm extends FormForCase {
    editClientCategory: {
        clientCategory: ClientCategory,
        serviceCategory: Map<string, string>,
        vip: boolean
    }
}

export const formatClientCategory = (form: ClientCategoryCaseForm, payload: Payload, client: Client): FASTRAct<EditClientCategoryRequestDTO> => {
    const serviceCategories = Array<ServiceCategoryDTO>();
    const formServiceCategories = form.editClientCategory.serviceCategory;
    const modifiedServiceIds: Array<string> = get(store.getState(), "adg.modifiedServiceIds");
    if (modifiedServiceIds && modifiedServiceIds.length !== 0) {
        for (const serviceId in formServiceCategories) {
            if (modifiedServiceIds.indexOf(serviceId) !== -1) {
                const service = client.services.find(serviceFromClientContext => serviceFromClientContext.id === serviceId);
                serviceCategories.push({
                    serviceId,
                    category: formServiceCategories[serviceId],
                    billingAccountId: service!.billingAccount.id,
                })
            }
        }
    }

    const request: FASTRAct<EditClientCategoryRequestDTO> = {
        act: {
            clientCategory: client.clientCategory,
            vip: form.editClientCategory.vip,
            serviceCategories
        },
        personId: payload.idClient,
        serviceId: payload.idService,
    };
    return request;
};

export const sendClientCategory = async (request: FASTRAct<EditClientCategoryRequestDTO>, payload: Payload) => {
    const actService: ActService = new ActService(true);
    return await actService.editClientCategory(request, payload.idClient);
};