export const isAuthorizedSendCommQA = (authorizations: string[]) => {
    return authorizations.indexOf("ADG_COMM_MANUEL_QA") !== -1;
}

export const isAllowedAutorisation = (authorizations: string[], autorisation: string) => {
    return authorizations.indexOf(autorisation) !== -1;
}

export const isAllowedAutorisations = (authorizations: string[], strArr: string[]) => {
    return  strArr.every((val) => authorizations.includes(val))
}

const isAuthorizedBeb = (authorizations: string[]) => {
    return authorizations.includes("isActiviteBeB");
}

const isAuthorizedBebCoFixe = (authorizations: string[]) => {
    return authorizations.includes("isActiviteBeBCoFixe");
}

export const isAuthorizedBebOrBebCoFixe = (authorizations: string[]) => {
    return isAuthorizedBeb(authorizations) || isAuthorizedBebCoFixe(authorizations);
}
export const isAuthorizedSuperviseur = (authorizations: string[]) => {
    return authorizations.includes("isSuperviseur");
}
export const isAuthorizedTrayThemeSelection = (authorizations: string[]) => {
    return authorizations.includes("BEB_TRAY_THEME_SELECTION");
}
