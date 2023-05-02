import {Activity} from "./Activity";
import {Site} from "./Site";

export interface SpecificActionRoutingRule {

    estimatedAssignmentDelay?: number;

    receiverActivity: Activity;

    receiverSite: Site;

    estimatedResolutionDateOfCase?: Date;

    settingCode?:string

    actCode?:string

}