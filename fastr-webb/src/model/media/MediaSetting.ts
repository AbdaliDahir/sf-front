import {MediaKind} from "../MediaKind";
import {MediaDirection} from "../MediaDirection";

export  interface MediaSetting {
    associatedActivity:string[] ;
    mediaType:MediaKind ;
    mediaSens:MediaDirection ;
    mediaTypesList?: string[];
}