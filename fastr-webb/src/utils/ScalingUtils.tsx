import * as moment from "moment-timezone";
import {translate} from "../components/Intl/IntlGlobalProvider";
import {AddNoteRequestDTO} from "../model/AddNoteRequestDTO";
import {Case} from "../model/Case";
import {CaseCategory} from "../model/CaseCategory";
import {CaseRoutingRule} from "../model/CaseRoutingRule";
import {CaseThemeQualification} from "../model/CaseThemeQualification";
import {Props} from "../views/Cases/View/ViewCasePage";
import {isCaseResolvedOrUnresolved} from "./CaseUtils";
import {buildScalingConclusion, getEmptyScalingConclusion} from "./ConclusionUtils";
import DateUtils from "./DateUtils";
import {NotificationManager} from "react-notifications";


export const buildScalingSuccessMsg = (scaledCase: Case) => {
    const scalingSuccess = translate.formatMessage({id: "case.number"})
        .concat(' ', scaledCase.caseId)
        .concat(' ', translate.formatMessage({id: "case.scaled.destination.site"}))
        .concat(' ', (scaledCase.caseOwner.site ? scaledCase.caseOwner.site.label : ""))
    // scenario Auto Assign with creation
    if (scaledCase.status === 'ONGOING') {
        scalingSuccess
            .concat(' ', translate.formatMessage({id: "case.scaled.assign"}))
            .concat(' ', scaledCase.caseOwner.login)
    }
    return scalingSuccess;
}


export const handleScalingBusinessLogic = (currentCase: Case, dto: AddNoteRequestDTO, props: Props) => {

    if (currentCase.category !== CaseCategory.SCALED) {
        populateCaseWhenScalingFromImmediate(currentCase, dto.themeQualification, props.validRoutingRule)
    } else {
        if (dto.doNotResolveBeforeDate) {
            currentCase.doNotResolveBeforeDate = DateUtils.toGMT0ISOString(moment(dto.doNotResolveBeforeDate));
        } else {
            currentCase.doNotResolveBeforeDate = null;
        }
        if (props.finishingTreatment) {
            handleFinishingTreatmentOnScaledCase(currentCase, dto)
        }
        else if (isCaseResolvedOrUnresolved(currentCase) && !props.revertScalingCaseMode) {
            initStatusAndConclusion(currentCase)
        }
    }
}


const populateCaseWhenScalingFromImmediate = (currentCase: Case, themeQualification: CaseThemeQualification | undefined, validRoutingRule: CaseRoutingRule) => {
    if (themeQualification && themeQualification.code !== '' && !!validRoutingRule.receiverSite
        && validRoutingRule.receiverSite.code !== '') {
        currentCase.themeQualification = themeQualification
        currentCase.category = CaseCategory.SCALED
        currentCase.caseOwner.activity = validRoutingRule.receiverActivity
        currentCase.caseOwner.site = validRoutingRule.receiverSite
        if (!!validRoutingRule.estimatedResolutionDateOfCase) {
            currentCase.estimatedResolutionDate = moment(validRoutingRule.estimatedResolutionDateOfCase).toDate()
        }
    } else {
        currentCase.category = CaseCategory.IMMEDIATE
    }
}

const initStatusAndConclusion = (currentCase: Case) => {
    currentCase.finishingTreatmentConclusion = getEmptyScalingConclusion()
}

const handleFinishingTreatmentOnScaledCase = (currentCase: Case, dto: AddNoteRequestDTO) => {
    currentCase.status = dto.status;
    currentCase.finishingTreatmentConclusion = buildScalingConclusion(dto);
}

export const handleNotificationSuccessMessage = (createdCase: Case) => {
    if (createdCase.category === "IMMEDIATE") {
        NotificationManager.success(translate.formatMessage({id: "global.create.case.success"}))
    } else if (createdCase.category === "SCALED") {
        NotificationManager.success(buildScalingSuccessMsg(createdCase));
    }
}