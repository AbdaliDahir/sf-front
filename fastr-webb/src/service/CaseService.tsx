// Components
import {Case} from "../model/Case";
import {TroubleTicketRequest} from "../model/TroubleTicketRequest";
import {TroubleTicketResponse} from "../model/TroubleTicketResponse";


import {Page} from "../model/utils/Page"
import {Pagination} from "../store/types/Pagination"
import AbstractService from "./AbstractService";
import { GdprCommentDto } from "src/model";
import {CasesQualificationSettings} from "../model/CasesQualificationSettings";
import {AddNoteRequestDTO} from "../model/AddNoteRequestDTO";
import {CaseRequestDTO} from "../model/CaseRequestDTO";
import {CaseRequestDTODefault} from "../model/CaseRequestDTODefault";
import {CaseUpdateDTO} from "../model/CaseUpdateDTO";
import {Activity} from "src/model/Activity";
import {CaseRoutingRule} from "../model/CaseRoutingRule";
import {ManageCaseRequestDTO} from "../model/ManageCaseRequestDTO";
import {ViewCaseRequestDTO} from "../model/ViewCaseRequestDTO";
import {CaseAmountIndicators} from "../model/Tray/CaseAmountIndicators";
import {GenericIncident} from "../model/GenericIncident";
import {Contact} from "../model/Contact";
import {CaseCLO} from "../model/CaseCLO";
import {CaseRequestCLO} from "../model/CaseRequestCLO";
import {ScaledConclusionSetting} from "../model/ScaledConclusionSetting";
import {ActCollection} from "../model/service/ActCollection";
import {IncidentsListItem} from "../model/IncidentsList";
import {MaxwellAct} from "../model/maxwell/MaxwellAct";
import {CaseCounters} from "../model/CaseCounters";
import {ActionsAndActsSettingsResponse} from "../model/acts/ActionsAndActsSettingsResponse";
import {ActionsAndActsSettingsRequest} from "../model/acts/ActionsAndActsSettingsRequest";
import {MaxwellStepDTO} from "../model/maxwell/MaxwellStepDTO";
import {Action} from "../model/actions/Action";
import {DiagAnalysisCLO} from "../model/DiagAnalysisCLO";
import {DiagAnalysisRequestCLO} from "../model/DiagAnalysisRequestCLO";
import {ActionAmountIndicators} from "../model/Tray/ActionAmountIndicators";
import {ActionMonitoringAmountIndicators} from "../model/Tray/ActionMonitoringAmountIndicators";
import {MaxwellIncidentUpdateRequest} from "../model/maxwell/MaxwellIncidentUpdateRequest";
import {Site} from "../model/Site";
import {CaseProgressStatusResponseCLO} from "../model/case/CaseProgressStatusResponseCLO";
import { CaseProgressStatus } from "src/model/CaseProgressStatus";

export default class CaseService extends AbstractService {

    public async createCase(caseDto): Promise<Case> {
        return this.post<CaseRequestDTO, Case>(`/fastr-cases/cases/`, caseDto);
    }

    public async createCaseDefault(caseDto): Promise<Case> {
        return this.post<CaseRequestDTO, Case>(`/fastr-cases/cases/default`, caseDto);
    }

    public async finalizeCase(caseDto, id: string): Promise<Case> {
        return this.put<CaseUpdateDTO, Case>(`/fastr-cases/cases/finalize/${id}`, caseDto);
    }

    public async finalizeCaseQA(caseDto): Promise<Case> {
        return this.post<CaseRequestDTO, Case>(`/fastr-cases/cases/finalizeQA`, caseDto);
    }

    public async createDefaultCase(caseDto): Promise<Case> {
        return this.post<CaseRequestDTODefault, Case>(`/fastr-cases/cases/`, caseDto);
    }

    // TODO REMOVE AND USE INSTEAD getUserActivity (SessionService.tsx)
    // this one only returns activity code, the other one an Activity object
    public async getUserActivitieFromSession(sessionId: string): Promise<string> {
        return this.getValue(`/fastr-cases/cases/qualification/session/${sessionId}/userActivitie`)
    }

    public async createCaseLastStep(caseDto): Promise<Case> {
        return this.post<CaseRequestDTO, Case>(`/fastr-cases/cases/lastStep`, caseDto);
    }

    public async updateCase(caseDto: CaseUpdateDTO, id: string): Promise<Case> {
        return this.put<CaseUpdateDTO, Case>(`/fastr-cases/cases/${id}`, caseDto);
    }

    public async getCase(id: string): Promise<ViewCaseRequestDTO> {
        return this.get<ViewCaseRequestDTO>(`/fastr-cases/cases/${id}`);
    }

    public async addNote(id: string, noteDto: AddNoteRequestDTO): Promise<Case> {
        return this.post<AddNoteRequestDTO, Case>(`/fastr-cases/cases/${id}/notes/`, noteDto);
    }

    public async newContact(id: string, noteDto: AddNoteRequestDTO): Promise<Case> {
        return this.put<AddNoteRequestDTO, Case>(`/fastr-cases/cases/${id}/contact/`, noteDto);
    }

    public async getNextContactSequence(): Promise<number> {
        return this.get<number>(`/fastr-cases/contacts/next/sequence`);
    }

    public async getContact(contactId: string): Promise<Contact> {
        return this.get<Contact>(`/fastr-cases/contacts/${contactId}`);
    }

    public async manageCase(id: string, manageCaseRequestDTO: ManageCaseRequestDTO): Promise<Case> {
        return this.post<ManageCaseRequestDTO, Case>(`/fastr-cases/cases/${id}/manage/`, manageCaseRequestDTO);
    }

    public async getRecentCasesList(idClient: string, idService: string, recent: boolean = true): Promise<Array<Case>> {
        return this.get<Array<Case>>(`/fastr-cases/cases/list?serviceId=${idService}&clientId=${idClient}&recent=${recent}`);
    }

    public async getEligibilityToDuplicateCase(): Promise<boolean> {
        return this.get<boolean>('/fastr-cases/cases/create/management/eli');
    }

    public async getCaseQualifSettings(qualificationCode: string): Promise<CasesQualificationSettings> {
        return this.get<CasesQualificationSettings>(`/fastr-cases/cases/qualification/${qualificationCode}`);
    }

    public async getActivities(): Promise<Array<Activity>> {
        return this.get<Array<Activity>>(`/fastr-cases/cases/activities/backoffice`);
    }

    public async getSyntheticTrayCases(activityCodeSelected: string, isSupervisor: boolean, isCCMaxwell: boolean): Promise<Array<Case>> {
        return this.get<Array<Case>>(`/fastr-cases/cases/tray/list/synthetic?activitySelected=${activityCodeSelected}&isSuperVisor=${isSupervisor}&isCCMaxwell=${isCCMaxwell}`);
    }


    public async getAgentTrayCasesForCSV(activityCodeSelected: string, isSupervisor: boolean, isCCMaxwell: boolean): Promise<Array<Case>> {
        return this.get<Array<Case>>(`/fastr-cases/cases/list/tray?activitySelected=${activityCodeSelected}&isSuperVisor=${isSupervisor}&isCCMaxwell=${isCCMaxwell}`);
    }

    public async getTrayCases(activityCodeSelected: string, pagination: Pagination, site?: string): Promise<Page<Case>> {
        let url = `/fastr-cases/cases/tray/detailed/page?activitySelected=${activityCodeSelected}`;
        if (site) {
            url = `${url}&site=${site}`;
        }
        return this.post<object, Page<Case>>(url, pagination);
    }

    public async getTrayActions(activityCodeSelected: string, pagination: Pagination, site?: string): Promise<Page<Action>> {
        let url = `/fastr-actions/actions/tray/detailed/page?activitySelected=${activityCodeSelected}`;
        if (site) {
            url = `${url}&site=${site}`;
        }
        return this.post<object, Page<Action>>(url, pagination);
    }

    public async getAgentTrayActions(activityCodeSelected: string, themeSelection: string): Promise<Array<Action>> {
        return this.get<Array<Action>>(`/fastr-actions/actions/tray/detailed/agent/list?activitySelected=${activityCodeSelected}&themeSelection=${encodeURIComponent(themeSelection)}`);
    }

    public async exportSupervisorTrayActions(activityCodeSelected: string): Promise<Blob> {
        return this.getFile<Blob>(`/fastr-actions/actions/tray/detailed/supervisor/export?activitySelected=${activityCodeSelected}`);
    }

    public async exportAgentTrayActions(activityCodeSelected: string): Promise<Blob> {
        return this.getFile<Blob>(`/fastr-actions/actions/tray/detailed/agent/export?activitySelected=${activityCodeSelected}`);
    }

    public async getTrayActionMonitorings(activityCodeSelected: string, pagination: Pagination, site?: string): Promise<Page<Action>> {
        let url = `/fastr-actions/actions/tray/detailed/monitoring/page?activitySelected=${activityCodeSelected}`;
        if (site) {
            url = `${url}&site=${site}`;
        }
        return this.post<object, Page<Action>>(url, pagination);
    }


    public async exportSupervisorTrayActionsMonitoring(activityCodeSelected: string): Promise<Blob> {
        return this.getFile<Blob>(`/fastr-actions/actions/tray/detailed/supervisor/monitoring/export?activitySelected=${activityCodeSelected}`);
    }

    public async exportAgentTrayActionsMonitoring(activityCodeSelected: string): Promise<Blob> {
        return this.getFile<Blob>(`/fastr-actions/actions/tray/detailed/agent/monitoring/export?activitySelected=${activityCodeSelected}`);
    }


    public async getCaseAmountIndicators(activityCodeSelected: string, themeSelection: string, isSupervisor: boolean, isCCMaxwell: boolean, site?: string): Promise<CaseAmountIndicators> {
        let url: string = `/fastr-cases/cases/tray/count?activityCodeSelected=${activityCodeSelected}&themeSelection=${encodeURIComponent(themeSelection)}&isSupervisor=${isSupervisor}&isCCMaxwell=${isCCMaxwell}`;
        if (site) {
            url = `${url}&site=${site}`
        }
        return this.get<CaseAmountIndicators>(url);
    }

    public async getActionAmountIndicators(activityCodeSelected: string, themeSelection: string, isSupervisor: boolean, site?: string): Promise<ActionAmountIndicators> {
        let url = `/fastr-actions/actions/tray/count?activityCodeSelected=${activityCodeSelected}&themeSelection=${encodeURIComponent(themeSelection)}&isSupervisor=${isSupervisor}`;
        if (site) {
            url = `${url}&site=${site}`;
        }
        return this.get<ActionAmountIndicators>(url);
    }

    public async getActionMonitoringAmountIndicators(activityCodeSelected: string, themeSelection: string, isSupervisor: boolean, site?: string): Promise<ActionMonitoringAmountIndicators> {
        let url = `/fastr-actions/actions/tray/monitoring/count?activityCodeSelected=${activityCodeSelected}&themeSelection=${encodeURIComponent(themeSelection)}&isSupervisor=${isSupervisor}`;
        if (site) {
            url = `${url}&site=${site}`;
        }
        return this.get<ActionMonitoringAmountIndicators>(url);
    }

    public async getThemesFromStock(activitySelected: string): Promise<Array<Array<string>>> {
        return this.get<Array<Array<string>>>(`/fastr-cases/cases/tray/stock/${activitySelected}/allthemes`);
    }

    public async getThemesFromTray(activitySelected: string, site?: string): Promise<Array<Array<string>>> {
        let url = `/fastr-cases/cases/tray/${activitySelected}/allthemes`;
        if (site) {
            url = `${url}?site=${site}`
        }
        return this.get<Array<Array<string>>>(url);
    }

    public async getActionThemesFromTray(activitySelected: string): Promise<Array<Array<string>>> {
        return this.get<Array<Array<string>>>(`/fastr-actions/actions/tray/${activitySelected}/allthemes`);
    }

    public async getActionThemesFromStock(activitySelected: string): Promise<Array<Array<string>>> {
        return this.get<Array<Array<string>>>(`/fastr-actions/actions/tray/stock/${activitySelected}/allthemes`);
    }

    public async getActionMonitoringThemesFromTray(activitySelected: string): Promise<Array<Array<string>>> {
        return this.get<Array<Array<string>>>(`/fastr-actions/actions/tray/monitoring/${activitySelected}/allthemes`);
    }

    public async getActionMonitoringThemesFromStock(activitySelected: string): Promise<Array<Array<string>>> {
        return this.get<Array<Array<string>>>(`/fastr-actions/actions/tray/monitoring/stock/${activitySelected}/allthemes`);
    }

    public async assignCase(activityCodeSelected: string, themeSelection: string, isCCMaxwell: boolean): Promise<Case> {
        return this.put<null, Case>(`/fastr-cases/cases/tray/assign?activitySelected=${activityCodeSelected}&themeSelection=${encodeURIComponent(themeSelection)}&isCCMaxwell=${isCCMaxwell}`, null);
    }

    public async assignAction(activityCodeSelected: string, themeSelection: string): Promise<Action> {
        return this.put<null, Action>(`/fastr-actions/actions/tray/assign?activitySelected=${activityCodeSelected}&themeSelection=${encodeURIComponent(themeSelection)}`, null);
    }

    public async assignActionMonitoring(activityCodeSelected: string, themeSelection: string): Promise<Action> {
        return this.put<null, Action>(`/fastr-actions/actions/tray/monitoring/assign?activitySelected=${activityCodeSelected}&themeSelection=${encodeURIComponent(themeSelection)}`, null);
    }

    public async getCaseAmount(activityCodeSelected: string): Promise<number> {
        return this.get<number>(`/fastr-cases/cases/count/tray?activitySelected=${activityCodeSelected}`);
    }

    public async existTray(): Promise<boolean> {
        return this.get<boolean>(`/fastr-cases/cases/tray/access`);
    }

    public async assignCasesByLogin(activitySelected: Activity, caseIds: string[], login: string): Promise<Array<Case>> {
        return this.put<object, Array<Case>>(`/fastr-cases/cases/assign/supervisor`, {
            activitySelected,
            caseIds,
            login
        });
    }

    public async assignActionByLogin(activitySelected: Activity, actionIds: string[], login: string): Promise<Array<Action>> {
        return this.put<object, Array<Action>>(`/fastr-actions/actions/tray/assign/supervisor`, {
            activitySelected,
            actionIds,
            login
        });
    }

    public async assignActionMonitoringByLogin(activitySelected: Activity, actionIds: string[], login: string): Promise<Array<Action>> {
        return this.put<object, Array<Action>>(`/fastr-actions/actions/tray/monitoring/assign/supervisor`, {
            activitySelected,
            actionIds,
            login
        });
    }

    public async getLoginsWithPrefixAndActivity(prefix: string, activityCodeSelected: string): Promise<string[]> {
        return this.get<string[]>(`/fastr-cases/cases/list/CC/prefix/${prefix}/${activityCodeSelected}`);
    }

    // ___________________Case______________________Scaling___________________Themes____________


    public async getQualifFromSessionId(sessionId: string, serviceType: string): Promise<Array<CasesQualificationSettings>> {
        return this.get(`/fastr-cases/cases/qualification/session/${sessionId}?serviceType=${serviceType}`)
    }

    public async getQualifFromSessionIdAndAncestor(sessionId: string, idOfTheParentQualification: string, serviceType: string): Promise<Array<CasesQualificationSettings>> {
        return this.get(`/fastr-cases/cases/qualification/session/${sessionId}/next/${idOfTheParentQualification}?serviceType=${serviceType}`)
    }

    public async getRootThemes(qualificationCode: string, sessionId: string, serviceType: string): Promise<Array<CasesQualificationSettings>> {
        return this.get<Array<CasesQualificationSettings>>(`/fastr-cases/cases/qualification/${qualificationCode}/${sessionId}/themes?serviceType=${serviceType}`);
    }


    public async getThemeByAncestor(idTheme: string, serviceType: string): Promise<Array<CasesQualificationSettings>> {
        return this.get<Array<CasesQualificationSettings>>(`/fastr-cases/cases/qualification/themes/${idTheme}/next?serviceType=${serviceType}`);
    }

    public async isCurrentUserTheOwner(login: string): Promise<boolean> {
        return this.get<boolean>(`/fastr-cases/cases/user/${login}/isowner`);
    }


    public async atLeastOneThemeContainRoutingRule(qualifCode: string, serviceType: string): Promise<boolean> {
        return this.get<boolean>(`/fastr-cases/cases/qualification/${qualifCode}/routingrule?serviceType=${serviceType ? serviceType : 'UNKNOWN'}`);
    }

    public async isUserActivityMatching(receiverActivity: string): Promise<boolean> {
        return this.get<boolean>(`/fastr-cases/cases/user/${receiverActivity}/ismatching`);
    }

    public async isOwnerLoginMatchingCCLongin(login: string): Promise<boolean> {
        return this.get<boolean>(`/fastr-cases/cases/user/${login}/ismatchingLogin`);
    }

    /**
     * Get all cases with idPerson and idService
     * @param idPerson
     * @param idService
     */
    public async getCases(idPerson: string, idService: string, page: number = 0) {
        return this.get<Array<Case>>(`/fastr-cases/cases/listAll?serviceId=${idService}&clientId=${idPerson}&page=${page}`);
    }


    // ____________________________Table de routage_______________________

    public async getReceiverSiteFromleafTheme(themeCode: string, serviceType: string, activity?: string): Promise<CaseRoutingRule> {
        return this.get<CaseRoutingRule>(`/fastr-cases/cases/qualification/${themeCode}/receiverSite?activitySelected=${activity}&serviceType=${serviceType}`);
    }

    public async autoAssignCaseToCurrentUser(id: string, forcePrendreEnCharge?: boolean, currentContactId?: string): Promise<Case> {
        let url: string = `/fastr-cases/cases/${id}/autoAssignCase?forcePrendreEnCharge=${forcePrendreEnCharge ? forcePrendreEnCharge : false}`;
        if (!(currentContactId == null)) {
            url = url.concat(`&currentContactId=${currentContactId}`)
        }
        return this.get<Case>(url);
    }

    public async autoAssignCaseToSystem(id: string, site: Site, activity: Activity) : Promise<Case> {
        const url : string = `/fastr-cases/v2/cases/autoAssignCaseSystem/${id}`;
        return this.post(url, {activity, site});
    }

    // __________________________Call___Transfer___________________________
    public async getReceiverActivitiesForTransfer(): Promise<Activity[]> {
        return this.get<Activity[]>('/fastr-cases/cases/transfer/receiverActivities');
    }



    public async getIncidentsByTheme(codeTheme: string) {
        return this.get<Array<GenericIncident>>(`/fastr-cases/cases/incidents?codeTheme=${codeTheme}`);
    }

    public async getIncidentByRefCTT(refCTT: string) {
        return this.get<GenericIncident>(`/fastr-cases/cases/incident?refCTT=${refCTT}`);
    }

    // __________________________Maxwell___________________________
    public async createTroubleTicket(troubleticketDto: TroubleTicketRequest, ciblage? : boolean): Promise<TroubleTicketResponse> {
        return this.post<TroubleTicketRequest, TroubleTicketResponse>(`/fastr-cases/cases/troubleticket`, troubleticketDto);
    }

    public async executeADG(act): Promise<Case> {
        return this.post(`/fastr-cases/cases/act`, act)
    }

    public async uploadFiles(files: File[], caseId: string, ticketId: string, attachementDir: string): Promise<string> {
        return this.postFiles<File, string>(`/fastr-cases/cases/upload/attachements/${caseId}/${ticketId}/${attachementDir}`, files);
    }

    public async uploadFilesV2(files: File[], caseId: string, ticketId: string, attachementDir: string): Promise<string> {
        return this.postFiles<File, string>(`/fastr-cases/v2/cases/upload/attachements/${caseId}/${ticketId}/${attachementDir}`, files);
    }

    public async uploadMaxwellAttachments(files: File[], caseId: string, actId: string, contactId: string): Promise<ActCollection> {
        return this.postFiles<File, ActCollection>(`/fastr-cases/acts/upload-attachments-maxwell/${caseId}/${actId}/${contactId}`, files);
    }

    public async resolveMaxwellActWithoutIncident(maxwellIncidentUpdateRequest: MaxwellIncidentUpdateRequest): Promise<string> {
        return this.post(`/fastr-cases/acts/resolve-maxwell-act-without-incident`, maxwellIncidentUpdateRequest);
    }

    public async addStepsDetailsToMaxwellAct(stepsDetails: Array<MaxwellStepDTO>, actId: string): Promise<string> {
        return this.post(`/fastr-cases/acts/add-step-detail-to-maxwell-act/${actId}`, stepsDetails);
    }

    public async finalizeMaxwellAct(maxwellFinalizeRequest: MaxwellIncidentUpdateRequest): Promise<string> {
        return this.post(`/fastr-cases/acts/finalize-maxwell-act`, maxwellFinalizeRequest);
    }

    public async getNextCaseNumberSequence(): Promise<string> {
        return this.get<string>(`/fastr-cases/cases/next/sequence`);
    }

    public async getCaseQualificationSettingsHierarchy(label, category, serviceType) {
        const caseQualificationSettingsRequest = {
            label,
            category,
            serviceTypes: [serviceType]
        }
        return await this.post<any, Array<CasesQualificationSettings>>(`/fastr-cases/cases/qualification/search`, caseQualificationSettingsRequest);
    }

    // top 7
    public async getAdgStatsByActivities(offerCategorie: string, typePerson: string): Promise<Array<string>> {
        return this.get<Array<string>>(`/fastr-cases/statistics/acts/${offerCategorie}/${typePerson}`);
    }

    public async getAllowedActionsAndActsToDisplay(request: ActionsAndActsSettingsRequest): Promise<Array<ActionsAndActsSettingsResponse>> {
        return this.post(`/fastr-cases/settings/retrieveEligibleActionsAndActs/`, request);
    }

    /// V2 case
    public async getNewCaseWithoutSave(): Promise<CaseCLO> {
        return this.get<CaseCLO>(`/fastr-cases/v2/cases/new`);
    }

    public async getCaseCLO(caseId: string): Promise<CaseCLO> {
        return this.get<CaseCLO>(`/fastr-cases/v2/cases/${caseId}`);
    }

    public async getOrNewCaseCLO(caseId: string): Promise<CaseCLO> {
        return this.get<CaseCLO>(`/fastr-cases/v2/cases/getOrNew/${caseId}`);
    }

    public async checkValidScalingTheme(histoCode: string, activityCode?: string, serviceType?: string): Promise<boolean> {
        return this.get<boolean>(`/fastr-cases/v2/cases/checkValidScalingTheme/${histoCode}/${activityCode}/${serviceType}`);
    }

    public async createOrUpdateCaseV2(caseDto: CaseRequestCLO): Promise<CaseCLO> {
        return this.post<CaseRequestCLO, CaseCLO>(`/fastr-cases/v2/cases`, caseDto);
    }

    public async initHistoRapideCase(prequalifCode?: string, caseRequest?: CaseRequestCLO): Promise<CaseCLO> {
        return this.post<CaseRequestCLO | undefined, CaseCLO>(`/fastr-cases/v2/cases/newHistoRapide/${prequalifCode}`, caseRequest);
    }

    public async getScaledConclusionSettings(activityCode?: string, serviceType?, caseType?): Promise<Map<string, ScaledConclusionSetting[]>> {
        return this.get<Map<string, ScaledConclusionSetting[]>>(`/fastr-cases/settings/scaledConclusion?activityCode=${activityCode}&serviceType=${serviceType}&caseType=${caseType}`);
    }

    public async isUnjustifiedFieldMandatory(activityCode: string, serviceType): Promise<boolean> {
        return this.get<boolean>(`/fastr-cases/settings/isUnjustifiedFieldMandatory?activityCode=${activityCode}&serviceType=${serviceType}`);
    }

    public async getIncidentsList(caseId: string): Promise<Array<IncidentsListItem>> {
        return this.get<Array<IncidentsListItem>>(`/fastr-cases/v2/cases/get-maxwell-incidents/${caseId}`);
    }

    public async getActDetailByActId(actId: string): Promise<Array<MaxwellAct>> {
        return this.get<Array<MaxwellAct>>(`/fastr-acts/acts/maxwell/${actId}`);
    }

    public async downloadMaxwellAttachment(actId: string, fileName: string): Promise<Blob> {
        return this.getFile<Blob>(`/fastr-cases/acts/get-maxwell-attachment/${actId}/${fileName}`);
    }

    public async getMaxwellFileNames(actId: string): Promise<Array<string>> {
        return this.get<Array<string>>(`/fastr-cases/acts/get-maxwell-attachment-names/${actId}`);
    }

    ////// Counters for recent cases list ihmV2

    public async getAllCaseCounters(caseId: string): Promise<CaseCounters> {
        return this.get<CaseCounters>(`/fastr-cases/cases/${caseId}/allCasesCounter/`);
    }

    // Action spécifique - Demande de régularisation fixe
    public async getDiagArbeoAnalysis(request: DiagAnalysisRequestCLO): Promise<DiagAnalysisCLO> {
        return this.post<DiagAnalysisRequestCLO, DiagAnalysisCLO>(`/fastr-cases/diag/analyze`, request);
    }

    public async getLogicalSites(activityId: string): Promise<Site[]> {
        return this.get<Site[]>(`/fastr-cases/v2/cases/sites/${activityId}`);
    }

    public async getGdprComments(serviceId?: string, siebelAccount?: string): Promise<GdprCommentDto[]> {
        let url = `/fastr-cases/comment?serviceId=${serviceId}`;
        if(siebelAccount){
            url += `&siebelAccount=${siebelAccount}`;
        }
        return this.get<GdprCommentDto[]>(url);
    }

    public async updateGdprComment(comment: GdprCommentDto) {
        return this.postWithCustomHeader(`/fastr-cases/comment`, comment,[]);
    }
    public async getCaseProgressStatusList(activityCode: string): Promise<CaseProgressStatusResponseCLO[]> {
        return this.get<CaseProgressStatusResponseCLO[]>(`/fastr-cases/settings/progress-status?activityCode=${activityCode}`);
    }

    public async updateCaseProgressStatus(caseId: string, progressStatus: CaseProgressStatus): Promise<Case> {
        return this.put(`/fastr-cases/cases/${caseId}/progress/${progressStatus}`,{});
    }
}
