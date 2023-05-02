import {Case} from "../model/Case";
import {CaseResource} from "../model/CaseResource";
import {ResourceType} from "../model/ResourceType";
import {ACT_ID} from "../model/actId";
import {CaseRoutingRule} from "../model/CaseRoutingRule";
import {Incident} from "../model/Incident";
import {CaseCategory} from "../model/CaseCategory";

export enum MANDATORY_ADGS { RETENTION = ACT_ID.ADG_RETENTION, ANTICHURN = ACT_ID.ADG_ANTICHURN }

export default class CaseUtils {

    public static isAct = (resource: CaseResource): boolean => {
        return resource.resourceType && resource.resourceType.toLowerCase().startsWith("ACT_".toLowerCase());
    };

    public static isAction = (resource: CaseResource): boolean => {
        return resource.resourceType && resource.resourceType.toLowerCase().startsWith("ACTION_".toLowerCase());
    };

    public static isComunication = (resource: CaseResource): boolean => {
        return resource.resourceType && resource.resourceType == "ADG_SMSI";
    };
    public static isADGMAxwell = (resource: CaseResource): boolean => {
        return resource.resourceType && resource.resourceType === "ADG_MAXWELL";
    };

    public static retrieveLastAdg = (fastrCase: Partial<Case>): CaseResource | undefined => {
        if (!fastrCase || !fastrCase.resources) {
            return undefined;
        }

        const actResources: CaseResource[] = fastrCase.resources.filter(r => CaseUtils.isAct(r));
        if (actResources.length === 0) {
            return undefined;
        }

        actResources.sort((r1, r2) => {
            return new Date(r2.creationDate).getTime() - new Date(r1.creationDate).getTime();
        });

        return actResources[0];
    }

}


export const isCaseResolvedOrUnresolved = (currentCase: Case): boolean => {
    return (currentCase.status === "RESOLVED" || currentCase.status === "UNRESOLVED")

}

export const isNotScaledCase = (currentCase: Case): boolean => {
    return (currentCase?.category !== CaseCategory.SCALED)
}

export const retrieveActResource = (currentCase: Case, resourceType: ResourceType, resourceDescription: string): CaseResource | undefined => {
    const {resources} = currentCase;
    return resources.find(resource => resource.resourceType === resourceType && resource.description === resourceDescription);
}

export const retrieveLastMandatoryResources = (currentCase: Case): Map<ACT_ID, CaseResource> => {
    const lastMandatoryResources: Map<ACT_ID, CaseResource> = new Map()
    Object.keys(MANDATORY_ADGS).forEach(key => {
        const lastResource: CaseResource | undefined = retrieveLastResource(currentCase, "ACT_FASTR", MANDATORY_ADGS[key])
        if (lastResource) {
            lastMandatoryResources.set(MANDATORY_ADGS[key], lastResource)
        }
    })
    return lastMandatoryResources
}

export const  retrieveLastResource = (currentCase: Case, resourceType: ResourceType, resourceDescription: string): CaseResource | undefined => {
    if (!currentCase || !currentCase.resources) {
        return undefined;
    }
    const resources: CaseResource[] = currentCase.resources.filter(
        r => resourceType === r.resourceType && resourceDescription === r.description);

    if (!resources || !resources.length) {
        return undefined;
    }
    resources.sort((r1, r2) => {
        return new Date(r2.creationDate).getTime() - new Date(r1.creationDate).getTime();
    });
    return resources[0];
}

export const isActRetentionPresent = (currentCase: Case): boolean => {
    const {resources} = currentCase
    return resources.filter(resource => CaseUtils.isAct(resource) && resource.resourceType === "ACT_FASTR" && resource.description === "ADG_RETENTION").length > 0
}

export const getActsLength = (resources?: Array<CaseResource>) : number => {
    return resources? resources.filter(resouce => resouce.resourceType !== "ADG_SMSI" && resouce.resourceType !== "ACTION_FASTR").length : 0;
};

export const getActionsLength = (resources?: Array<CaseResource>) : number => {
    return resources? resources.filter(resouce =>resouce.resourceType === "ACTION_FASTR").length : 0;
};

export const getCommunicationsLength = (resources?: Array<CaseResource>) : number  => {
    return resources ? resources.filter(resouce =>resouce.resourceType === "ADG_SMSI").length : 0;
};

export const forceAutoAssign = (userActivity, isMaxwellCase: Incident | undefined, isScalingMode: boolean, validRoutingRule : CaseRoutingRule, isCaseOnGoing: boolean) => {
    const receiverActivity = validRoutingRule?.receiverActivity?.code;
    const isActivitiesMatching = receiverActivity === userActivity;
    return (!isMaxwellCase && isActivitiesMatching && isScalingMode && validRoutingRule && !isCaseOnGoing);
};
