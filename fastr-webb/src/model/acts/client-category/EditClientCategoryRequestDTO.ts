import {ClientCategory} from "./ClientCategory";
import {ServiceCategoryDTO} from "./ServiceCategoryDTO";

export interface EditClientCategoryRequestDTO {

    clientCategory: ClientCategory,
    vip: boolean,
    serviceCategories: Array<ServiceCategoryDTO>

}
