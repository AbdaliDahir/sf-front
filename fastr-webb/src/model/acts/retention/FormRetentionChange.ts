
export  default interface FormRetentionChange {
    intentionByClient: string;
    motifAppel?: string;
    sousMotifAppel?:string;
    outOfPerim: boolean;
    eliRetention: string;
    causeOfIneligibility?: string;
    proposal?: string;
    proposalDetail?: string;
    refCommande?: string;
    adressResil: string;
    clientAnswer?: string;
    motifRefus?: string;
    sousMotifRefus?: string;
    isConsultation: boolean;
    proposalWithoutCommitment: string;
}