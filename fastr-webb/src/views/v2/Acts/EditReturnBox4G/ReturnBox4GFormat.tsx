import moment from "moment"
import Act from "../../../../model/acts/Act"
import FASTRAct from "src/model/acts/FASTRAct"
import ClientService from "src/service/ClientService"
import StringUtils from "src/utils/StringUtils"
import {store} from '../../../../index'
import { setEquipmentBox4G } from "src/store/actions/v2/client/ClientActions"
import { BoxEquipment } from "src/model/equipment/BoxEquipment"

interface RequestForReturnBox4G extends Act {
  imei: string
  response: string
  failureReason: string
}

export const formatDataForReturnBox4G = async (form: any, payload: any) => {
  const clientService: ClientService = new ClientService()
  let response, failureReason;

  try {
    response = await clientService.modifierStatutRetourEquipement(form.imei, { "idCsu": payload.idService }, [{ key: "idTransaction", value: `ConsulterCSU${form.imei}` }]);

    clientService.getEquipementRestitution(payload.idService).then( (offre: [BoxEquipment]) => {
        if(offre.length > 0) {
          offre[0].serviceId = payload.idService;
          store.dispatch(setEquipmentBox4G(offre[0]));
        }
      }
    );

  } catch (e) {
    const error = await e;
    failureReason = StringUtils.isJsonString(error.message) ? JSON.parse(error.message).message : error.message
  }

  const request: FASTRAct<RequestForReturnBox4G> = {
    "act": {
      imei: form.imei,
      response: response,
      failureReason: failureReason
    },
    dueDate: moment().toDate(),
    notification: true,
    "personId": payload.idClient,
    "caseId": payload.idCase,
    "serviceId": payload.idService,
  }
  return request
}
