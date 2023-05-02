import HistoriqueDisplay from "src/model/historique/HistoriqueDisplay";
import { HistoriqueRequest } from "src/views/Clients/Historique/model/HistoriqueRequest";
import AbstractService from "./AbstractService"; 

export default class HistoriqueService extends AbstractService {

  constructor() {
    super(true);
  }

  public async getMobileHistorique(request : HistoriqueRequest): Promise<Array<HistoriqueDisplay>> {
    if(!request.idLigne || !request.idTitulaire || !request.dataType) {
      return [];
    };
    return this.post(`/fastr-cases/historique/mobile/detail`, request);
  }

}
