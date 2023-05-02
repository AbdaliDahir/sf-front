import {AntiChurnBooleanId} from "./AntiChurnBooleanId";
import {AntiChurnId} from "./AntiChurnId";

export interface AntiChurnData {
    possibility: string;
    clientProposal: string;
    clientTerminationIntention: AntiChurnBooleanId;
    actType?: AntiChurnId;
    actDetail?: AntiChurnId;
    proposalDetail: string;
    clientResponse: string;
    proposalMode: string;
    orderReference: string;
    proposalWithoutCommitment?: AntiChurnId;
}