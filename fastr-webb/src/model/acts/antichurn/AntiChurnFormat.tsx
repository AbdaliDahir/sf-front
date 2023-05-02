import FASTRAct from "../../../model/acts/FASTRAct";
import * as moment from "moment";
import {AntiChurnActRequestDTO} from "./AntiChurnActRequestDTO";
import {FormAntiChurnChange} from "./FormAntiChurnChange";
import {AntichurnSettings} from "../../../store/reducers/AntiChurnReducer";
import {translate} from "../../../components/Intl/IntlGlobalProvider";


export const formatDataForAntiChurnChange = (form, antiChurnSettings, payload) => {
    if (!form.antiChurnDataForm) {
        return;
    }
    const request: FASTRAct<AntiChurnActRequestDTO> = {
        act: populateAntiChurnRequest(form.antiChurnDataForm, antiChurnSettings),
        actName: "ADG_ANTICHURN",
        notification: false,
        dueDate: moment().toDate(),
        personId: payload.idClient,
        serviceId: payload.idService,
    };
    return request
};

export const populateAntiChurnRequest = (form: FormAntiChurnChange, antiChurnSetting: AntichurnSettings): AntiChurnActRequestDTO => {
    return {
        antiChurnData: {
            possibility: form.possibility,
            clientProposal: form.clientProposal,
            clientTerminationIntention: formatClientTerminationIntention(form.clientTerminationIntention === "YES"),
            actType: findActTypeObject(antiChurnSetting, form.actType, form.clientProposal),
            actDetail: findActDetailObject(antiChurnSetting, form.actDetail, form.actType, form.clientProposal),
            proposalDetail: form.proposalDetail,
            clientResponse: form.clientResponse,
            proposalMode: form.proposalMode,
            orderReference: form.orderReference,
            proposalWithoutCommitment: formatProposalWithoutCommitment(form.proposalWithoutCommitment)
        }
    }

    function findActTypeObject(antiChurnSettings: AntichurnSettings, actTypeCode: string, clientProposal: string) {
        const actDetailSelected = antiChurnSettings.settingMongo.find(element => element.code === clientProposal)
            ?.actType.find(element => element.code === actTypeCode)

        return actDetailSelected ? {
            code: actDetailSelected?.code,
            label: actDetailSelected?.label
        } : undefined
    }

    function findActDetailObject(antiChurnSettings: AntichurnSettings, actDetailCode: string, actTypeCode: string, clientProposal: string) {
        const actTypeSelected = antiChurnSettings.settingMongo.find(element => element.code === clientProposal)
            ?.actType.find(element => element.code === actTypeCode)
            ?.detail?.find(element => element.code === actDetailCode)

        return actTypeSelected ? {
            code: actTypeSelected?.code,
            label: actTypeSelected?.label
        } : undefined
    }

    function formatProposalWithoutCommitment(proposalWithoutCommitmentCode: string) {
        return proposalWithoutCommitmentCode ? {
            code: proposalWithoutCommitmentCode,
            label: translate.formatMessage({id: proposalWithoutCommitmentCode})
        } : undefined
    }

    function formatClientTerminationIntention(clientTerminationIntention: boolean) {

        return {
            code: clientTerminationIntention,
            label: clientTerminationIntention ? "Oui" : "Non"
        }
    }

}

export function findActTypeObjectV2(antiChurnSettings?, actTypeCode?: string, clientProposal?: string) {
    const actDetailSelected = antiChurnSettings?.settingDetail.find(element => element.code === clientProposal)
        ?.actType.find(element => element.code === actTypeCode)

    return actDetailSelected ? {
        code: actDetailSelected?.code,
        label: actDetailSelected?.label
    } : undefined
}

export function findActDetailObjectV2(antiChurnSettings?, actDetailCode?: string, actTypeCode?: string, clientProposal?: string) {
    const actTypeSelected = antiChurnSettings.settingDetail.find(element => element.code === clientProposal)
        ?.actType.find(element => element.code === actTypeCode)
        ?.detail?.find(element => element.code === actDetailCode)

    return actTypeSelected ? {
        code: actTypeSelected?.code,
        label: actTypeSelected?.label
    } : undefined
}