import {Case} from './Case';
import {CallTransfer} from "./CallTransfer";
import FASTRAct from "./acts/FASTRAct";
import Act from "./acts/Act";

export interface CaseUpdateDTO {

    caseToUpdate: Case;

    autoAssign?: boolean;

    actTransactionIds: Array<string>;

    revertScaledToImmediate?: boolean;

    callTransfer?: CallTransfer

    processing?: boolean

    actBodys?: Array<FASTRAct<Act>>

}
