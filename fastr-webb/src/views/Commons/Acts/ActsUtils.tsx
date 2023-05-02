import {ACT_ID} from "../../../model/actId";
import {BlocksExternalAppsConfig} from "../../Clients/ExternalAppsConfig";
import {Row} from "reactstrap";
import * as React from "react";
import StringUtils from "../../../utils/StringUtils";
import CustomizedPopover from "../CustomizedPopover";

const externalAppsSettings = BlocksExternalAppsConfig.adg.fiori;

export const isAllowedAdgToDisplayValidationButton = (idAct: string): boolean => {
    return isNotAdgSuiviSAV(idAct)
        && isNotAdgFixeChgStatutEqtFastr(idAct)
        && isNotAdgFiori(idAct)
        && isNotAdgMaxwell(idAct);
}

export const isNotAdgFiori = (idAct: string) => {
    return idAct !== ACT_ID.ADG_FIORI_ECHEANCIER
        && idAct !== ACT_ID.ADG_FIORI_AVOIR_MANUEL
        && idAct !== ACT_ID.ADG_FIORI_GEL_RELANCE
        && idAct !== ACT_ID.ADG_FIORI_DEMANDE_SURENDETTEMENT
        && idAct !== ACT_ID.ADG_FIORI_AVANCE_FACTURE
}

export const isFioriIdApp = (idApp: string | undefined) => {
    if(idApp === undefined) {
        return false;
    }

    return idApp === externalAppsSettings.ADG_FIORI_ECHEANCIER[0].value
        || idApp === externalAppsSettings.ADG_FIORI_AVOIR_MANUEL[0].value
        || idApp === externalAppsSettings.ADG_FIORI_GEL_RELANCE[0].value
        || idApp === externalAppsSettings.ADG_FIORI_DEMANDE_SURENDETTEMENT[0].value
        || idApp === externalAppsSettings.ADG_FIORI_AVANCE_FACTURE[0].value
}

const isNotAdgMaxwell = (idAct: string) => {
    return idAct !== ACT_ID.ADG_MAXWELL;
}

const isNotAdgSuiviSAV = (idAct: string) => {
    return idAct !== ACT_ID.ADG_SUIVI_SAV;
}

const isNotAdgFixeChgStatutEqtFastr = (idAct: string) => {
    return idAct !== ACT_ID.ADG_FIXE_CHG_STATUT_EQT_FASTR;
}

// comment render for maxwell incidents
export const commentRender = (comments: Array<string>) => {
    if (comments && comments.length > 0) {
        return comments.map((comment) => <Row>{displayEllipsisIfNecessary(comment)}</Row>)
    }
    return <React.Fragment/>
}

const displayEllipsisIfNecessary = (comment: string): JSX.Element => {
    const truncateComment = StringUtils.truncate(comment, 60);
    return truncateComment.length !== comment.length ?
        (<React.Fragment>
            {truncateComment}
            <span className=" ml-2">...</span>
            <CustomizedPopover text={comment} />
        </React.Fragment>) :  <React.Fragment>{truncateComment}</React.Fragment>;
};