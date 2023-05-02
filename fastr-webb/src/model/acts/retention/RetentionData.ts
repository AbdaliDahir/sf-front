import {MotifDTO} from "./MotifDTO";
import {RetentionId} from "./RetentionId";

export interface RetentionData {
      intentionByClient: boolean;
      motif?: MotifDTO;
      sousMotif?:MotifDTO;
      outOfPerim: boolean;
      eliRetention: boolean;
      causeOfIneligibility?: string; // supposed to be a code
      proposal?: string;
      proposalDetail?: string;
      refCommande?: string;
      adressResil?: boolean;
      clientAnswer?: string;
      motifRefus?: MotifDTO;
      sousMotifRefus?:MotifDTO;
      proposalWithoutCommitment?: RetentionId;
}