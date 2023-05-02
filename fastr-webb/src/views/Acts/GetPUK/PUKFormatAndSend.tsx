import ActService from "../../../service/ActService";
import TransactionDTO from "../../../model/acts/TransactionDTO";

export const formatDataForPUK = (): Promise<TransactionDTO> => {
    const actService: ActService = new ActService(true);
    return actService.postCodePUKWasRead()
}
