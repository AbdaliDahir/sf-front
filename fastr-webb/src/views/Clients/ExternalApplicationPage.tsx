import React, {useImperativeHandle} from "react";
import DisrcExternalApplicatationService from "../../service/DisrcExternalApplicationService";
import {NotificationManager} from "react-notifications";
import {translate} from "../../components/Intl/IntlGlobalProvider";
import {ExternalAppContextValue} from '../../model/ExternalAppContextValue';
import {ExternalApplication} from '../../model/disrcExternalApps/ExternalApplication'
import {useDispatch} from "react-redux";
import {actFioriOpenedInExternalApps} from "../../store/actions/ExternalAppsAction";
import {isFioriIdApp} from "../Commons/Acts/ActsUtils";

export interface IdParams {
    clientId?: string,
    serviceId?: string,
    caseId?: string,
    contactId?: string
    actId?: string
    idApp?: string
    password?: string
    perId?: string
    CodeTAC?: string
    authorization?: string,
    idsrcDem?: string,
    refSiebel?: string
}


export interface Props{
    appCode: string,
    appPage?: string,
    idParams: IdParams
}

const ExternalApplicationPage = React.forwardRef((props : Props , ref) => {

    const externalApplicationService: DisrcExternalApplicatationService = new DisrcExternalApplicatationService();
    let externalApplication: ExternalApplication;
    const dispatch = useDispatch();

    const getApplication = async () => {
        try {
            const params: Map<ExternalAppContextValue, string> = new Map<ExternalAppContextValue, string>();
            if(props.idParams.clientId){
                params.set(ExternalAppContextValue.ID_EXTERNE_PERSONNE, props.idParams.clientId)
            }
            params.set(ExternalAppContextValue.SERVICE_ID, props.idParams.serviceId!)
            if(props.appPage) {
                params.set(ExternalAppContextValue.CODE_ADG_EXTRANET, props.appPage)
            }
            if(props.idParams.caseId) {
                params.set(ExternalAppContextValue.CASE_ID, props.idParams.caseId)
            }
            if(props.idParams.idApp) {
                params.set(ExternalAppContextValue.ID_APP, props.idParams.idApp)
            }
            if(props.idParams.actId) {
                params.set(ExternalAppContextValue.ACT_ID, props.idParams.actId)
            }
            if(props.idParams.contactId) {
                params.set(ExternalAppContextValue.CONTACT_ID, props.idParams.contactId!)
            }
            if(props.idParams.password){
                params.set(ExternalAppContextValue.PASSWORD, props.idParams.password)
                params.set(ExternalAppContextValue.PASSWORD_SIMPLE, props.idParams.password)
            }
            if(props.idParams.perId) {
                params.set(ExternalAppContextValue.PER_ID, props.idParams.perId)
            }
            if(props.idParams.CodeTAC) {
                params.set(ExternalAppContextValue.Code_TAC, props.idParams.CodeTAC)
            }
            if(props.idParams.authorization) {
                params.set(ExternalAppContextValue.AUTHORIZATION, props.idParams.authorization)
            }
            if(props.idParams.idsrcDem) {
                params.set(ExternalAppContextValue.IDSRC_DEM, props.idParams.idsrcDem)
            }

            externalApplication = await externalApplicationService.getExternalAppAction(props.appCode, props.idParams.refSiebel!, params);
        } catch (err) {
            NotificationManager.error(translate.formatMessage({id: "act.external.app.fetch.error"}), null, 20000);
            console.error(err);
        }
    }

    useImperativeHandle(ref, () => ({
        async open() {
            await getApplication();
            if (externalApplication !== undefined) {
                if(isFioriIdApp(props.idParams.idApp)) {
                    dispatch(actFioriOpenedInExternalApps(true));
                }
                const form = document.createElement("form");
                form.id = "ext_apps_open_form";
                form.method = externalApplication.method;
                form.action = externalApplication.url;
                form.target = "_blank";
                Object.keys(externalApplication.paramToValue).forEach(param => {
                    const element = document.createElement("input");
                    element.name = param;
                    element.value = externalApplication.paramToValue[param];
                    element.type = "hidden"
                    form.appendChild(element)
                });

                const oldForm = document.getElementById("ext_apps_open_form");
                if(oldForm){
                    document.body.replaceChild(form ,oldForm);
                }else{
                    document.body.appendChild(form);
                }
                form.submit();
                const f = document.getElementById("ext_apps_open_form");
                if(f) {
                    f.parentNode?.removeChild(f);
                }
             }
        }
    }));

    return (
        <div className="d-none"></div>
    );

})
export default ExternalApplicationPage;
