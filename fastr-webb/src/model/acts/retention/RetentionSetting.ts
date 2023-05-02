import {RetentionMotif} from "./RetentionMotif";
import {RetentionProposalSetting} from "./RetentionProposalSetting";

export  interface RetentionSetting {
    retentionMotifs: Array<RetentionMotif>;
    retentionProposals: Array<RetentionProposalSetting>;
}