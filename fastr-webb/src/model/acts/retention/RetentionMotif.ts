import {MotifID} from "./MotifID";

export interface RetentionMotif {
    motif:MotifID;
    sousMotifs:Array<MotifID>;
}