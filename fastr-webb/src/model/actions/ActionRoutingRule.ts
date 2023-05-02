import {Activity} from "../Activity";
import {Site} from "../Site";

export interface ActionRoutingRule {
    routingMode: string;
    transmitterActivity: Activity;
    receiverActivity: Activity;
    transmitterSite: Site;
    receiverSite: Site;
    estimatedResolutionDateOfCase?:string
    monitoringReceiverActivity?:string
    monitoringReceiverSite?:string
    monitoringCriteria?: []
    autoAssign?: boolean
    ifReassignedPreviousMonitoringTeam?: boolean;
}