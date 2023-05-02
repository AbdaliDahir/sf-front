import FASTRAct from "../../../model/acts/FASTRAct";
import * as moment from "moment";
import {RetentionActRequestDTO} from "../../../model/acts/retention/RetentionActRequestDTO";
import {RetentionData} from "../../../model/acts/retention/RetentionData";
import FormRetentionChange from "../../../model/acts/retention/FormRetentionChange";
import {RetentionSetting} from "../../../model/acts/retention/RetentionSetting";
import {MotifID} from "../../../model/acts/retention/MotifID";
import {MotifDTO} from "../../../model/acts/retention/MotifDTO";
import {translate} from "../../../components/Intl/IntlGlobalProvider";

export const formatDataForRetentionChange = (form,retentionSetting:RetentionSetting,retentionSettingRefus:RetentionSetting, payload) => {
    if (!form.retentionDataForm) {
        return;
    }
    const request: FASTRAct<RetentionActRequestDTO> = {
        act: populateRetentionRequest(form.retentionDataForm,retentionSetting,retentionSettingRefus),
        actName: "ADG_RETENTION",
        notification: false,
        dueDate: moment().toDate(),
        personId: payload.idClient,
        serviceId: payload.idService,
    };
    return request
};

export const  populateRetentionRequest = (form: FormRetentionChange,retentionSetting:RetentionSetting,retentionSettingRefus:RetentionSetting): RetentionActRequestDTO =>  {
    return {
        retentionData: populateRetentionData(form,retentionSetting,retentionSettingRefus)
    }
}

function populateRetentionData(form: FormRetentionChange,retentionSetting:RetentionSetting,retentionSettingRefus:RetentionSetting): RetentionData {
    return {
        intentionByClient: form.intentionByClient === "YES" ? true : false,
        motif: form.motifAppel ? findMotifObject(retentionSetting, form.motifAppel,undefined): undefined,
        sousMotif: form.sousMotifAppel ? findMotifObject(retentionSetting, form.motifAppel,form.sousMotifAppel ): undefined,
        outOfPerim: form.outOfPerim,
        causeOfIneligibility:form.causeOfIneligibility,
        eliRetention: form.eliRetention === "YES" ? true : false,
        proposal: form.proposal,
        proposalDetail: form.proposalDetail,
        refCommande: form.refCommande,
        adressResil: form.adressResil === "YES" ? true : false,
        clientAnswer: form.clientAnswer,
        motifRefus: form.motifRefus ? findMotifObject(retentionSettingRefus,form.motifRefus,undefined): undefined,
        sousMotifRefus: form.sousMotifRefus ? findMotifObject(retentionSettingRefus, form.motifRefus, form.sousMotifRefus): undefined,
        proposalWithoutCommitment: form.proposalWithoutCommitment ? formatProposalWithoutCommitment(form.proposalWithoutCommitment) : undefined
    }
}

function formatProposalWithoutCommitment(proposalWithoutCommitmentCode: string) {
    return {
        code: proposalWithoutCommitmentCode,
        label: translate.formatMessage({id: `retention.${proposalWithoutCommitmentCode}`})
    }
}

export function findMotifObject(retentionSetting: RetentionSetting, motif?: string, sousMotif?: string) {
    const motifSelected = retentionSetting.retentionMotifs.find(element => element.motif.code === motif)
    if (sousMotif && motifSelected) {
        const sousMotifSelected = motifSelected.sousMotifs.find(element => element.code === sousMotif)
        return sousMotifSelected ? populateMotifDTO(sousMotifSelected) : undefined
    }
    return motifSelected ? populateMotifDTO(motifSelected.motif) : undefined
}

function populateMotifDTO(motif: MotifID): MotifDTO {
    return {
        code: motif.code,
        label: motif.label
    }
}


export function formatRetentionMotif(retentionSetting: RetentionSetting, motif?: string, sousMotif?: string, refus?:boolean) {
    const motifSelected = retentionSetting.retentionMotifs.find(element => element.motif.code === motif)
    const sousMotifSelected = motifSelected?.sousMotifs.find(element => element.code === sousMotif)

    const result:any = {};
    if(motifSelected){
        result.motif = {
            code: motifSelected.motif.code,
            label: motifSelected.motif.label
        }
    }
    if(sousMotifSelected){
        result.sousMotif = {
            code: sousMotifSelected.code,
            label: sousMotifSelected.label
        }
    }
    if(refus){
        return {
            sousMotifRefus:result.sousMotif,
            motifRefus:result.motif
        }
    }
    return result;
}