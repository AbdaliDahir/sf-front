// Components
import AbstractService from "./AbstractService";
import {CasesQualificationSettings} from "../model/CasesQualificationSettings";
import {ServiceType} from "../model/ServiceType";
import {ActionRequestCLO} from "../model/actions/ActionRequestCLO";
import {Action} from "../model/actions/Action";
import {ActionProgressStatusRequestCLO} from "../model/actions/ActionProgressStatusRequestCLO";
import {ActionProgressStatusResponseCLO} from "../model/actions/ActionProgressStatusResponseCLO";
import {ActionConclusionStatusResponseCLO} from "../model/actions/ActionConclusionStatusResponseCLO";
import {SpecificActionRoutingRule} from "../model/SpecificActionRoutingRule";
import {ActionTreatmentRequest} from "../model/actions/ActionTreatmentRequest";
import {ActionMonitoringRequest} from "../model/ActionMonitoringRequest";
import {ProgressStatus} from "../model/actions/ProgressStatus";

export default class ActionService extends AbstractService {

    public async getRootThemesByThemeType(themeType: string, serviceType: ServiceType | string): Promise<Array<CasesQualificationSettings>> {
        return this.get<Array<CasesQualificationSettings>>(`/fastr-actions/actions/qualification/by-theme-type/${themeType}/themes?serviceType=${serviceType}`);
    }

    public async checkActionsDuplicatedThemes(serviceId: string, themeCode: string ): Promise<Array<CasesQualificationSettings>> {
        return this.get<Array<CasesQualificationSettings>>(`/fastr-actions/actions/check-duplicate-theme/${serviceId}/${themeCode}`);
    }

    public async saveAction(request: ActionRequestCLO): Promise<Action> {
        return this.post<ActionRequestCLO | undefined, Action>(`/fastr-actions/actions`, request);
    }

    public async getAllActionsByCaseId(caseId: string): Promise<Array<Action>> {
        return this.get<Array<Action>>(`/fastr-actions/actions/all?caseId=${caseId}`);
    }

    public async getInProgressAndResolvedUnresolvedActionsBy(caseId: string, monitoringActivityCode: string): Promise<Array<Action>> {
        return this.get<Array<Action>>(`/fastr-actions/actions/in-progress-and-resolved-unresolved-actions-by?caseId=${caseId}&monitoringActivityCode=${monitoringActivityCode}`);
    }

    public async getActionProgressStatus(request: ActionProgressStatusRequestCLO): Promise<ActionProgressStatusResponseCLO[]> {
        return this.post<ActionProgressStatusRequestCLO, ActionProgressStatusResponseCLO[]>(`/fastr-actions/settings/progress-status`, request);
    }

    public async getActionConclusions(request: ActionProgressStatusRequestCLO): Promise<ActionConclusionStatusResponseCLO[]> {
        return this.post<ActionProgressStatusRequestCLO, ActionConclusionStatusResponseCLO[]>(`/fastr-actions/settings/conclusion-status`, request);
    }

    public async getCalculateRegulFixeRoutingRules(activityCode: string, siteCode: string, regulAmount: number, bankRefund: boolean ): Promise<SpecificActionRoutingRule> {
        return this.get<SpecificActionRoutingRule>(`/fastr-actions/regul-fixe/calculate?activity=${activityCode}&site=${siteCode}&regulAmount=${regulAmount}&bankRefund=${bankRefund}`);
    }

    public async treatmentCancel(actionTreatmentRequest: ActionTreatmentRequest): Promise<boolean> {
        return this.post<ActionTreatmentRequest, boolean>(`/fastr-actions/actions/treatment/cancel`, actionTreatmentRequest);
    }

    public async actionTreatment(actionTreatmentRequest: ActionTreatmentRequest): Promise<Action> {
        return this.post<ActionTreatmentRequest, Action>(`/fastr-actions/actions/treatment`, actionTreatmentRequest);
    }

    public async treatmentAutoAssign(actionTreatmentRequest: ActionTreatmentRequest): Promise<boolean> {
        return this.post<ActionTreatmentRequest, boolean>(`/fastr-actions/actions/treatment/auto-assign`, actionTreatmentRequest);
    }

    public async monitoringStart(actionMonitoringRequest: ActionMonitoringRequest): Promise<boolean> {
        return this.post<ActionMonitoringRequest, boolean>(`/fastr-actions/actions/monitoring/start`, actionMonitoringRequest);
    }

    public async monitoringStop(actionId: string): Promise<boolean> {
        return this.get<boolean>(`/fastr-actions/actions/monitoring/stop?actionId=${actionId}`);
    }

    public async getRegulFixeActionsBySiebelAccountWithDepthInDays(serviceId: string, depthInDays: string): Promise<Action[]> {
        return this.get<Action[]>(`/fastr-actions/actions/regulFixe?siebelAccount=${serviceId}&depthInDays=${depthInDays}`);
    }

    /* Bannette Actions - Filtres - ProcessStatus */
    public async getActionsFilterProgressStatus(activityCode: string, ownerLogin? : string) : Promise<Array<ProgressStatus>> {
        if(ownerLogin){
            return this.get<ProgressStatus[]>(`/fastr-actions/actions/tray/filter/processStatus?activityCode=${activityCode}&ownerLogin=${ownerLogin}`);
        }else {
            return this.get<ProgressStatus[]>(`/fastr-actions/actions/tray/filter/processStatus?activityCode=${activityCode}`);
        }
    }
    public async getActionsMonitoringFilterProgressStatus(activityCode: string, ownerLogin? : string) : Promise<Array<ProgressStatus>> {
        if(ownerLogin){
            return this.get<ProgressStatus[]>(`/fastr-actions/actions/tray/monitoring/filter/processStatus?activityCode=${activityCode}&ownerLogin=${ownerLogin}`);
        }else {
            return this.get<ProgressStatus[]>(`/fastr-actions/actions/tray/monitoring/filter/processStatus?activityCode=${activityCode}`);
        }

    }
}
