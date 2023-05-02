import React, {useImperativeHandle} from "react";
import ExternalApplicationsService from "../../../../service/ExternalApplicationService";
import {ExternalApplication} from "../../../../model/externalApplications/ExternalApplication";
import {ClientContextSliceState} from "../../../../store/ClientContextSlice";
import {CaseQualification} from "../../../../model/CaseQualification";
import {useTypedSelector} from "../../../../components/Store/useTypedSelector";
import {translate} from "../../../../components/Intl/IntlGlobalProvider";
import {NotificationManager} from "react-notifications";
import {Base64} from "js-base64";


export interface Props{
    applicationCode: string,
    actionCode: string,
    caseId: string
}

const ExternalApplicationPageV2 = React.forwardRef((props : Props , ref) => {

    const externalApplicationsService : ExternalApplicationsService = new ExternalApplicationsService(true);
    let externalApplication:ExternalApplication | undefined ;
    const client : ClientContextSliceState = useTypedSelector(state => state.store.clientContext);
    const motif: CaseQualification | undefined = useTypedSelector(state => state.store.cases.casesList[props.caseId].motif);
    const userActivityCode: string | undefined = useTypedSelector(state => state.store.applicationInitialState.user?.activity.code);
    const websap = useTypedSelector(state => state.websap);


    const getApplication = async () =>{
        if (externalApplication === undefined) {
            try {
                externalApplication = await externalApplicationsService.getExternalApplicationAction(props.applicationCode, props.actionCode);
            } catch (err) {
                NotificationManager.error(translate.formatMessage({id: "act.external.app.fetch.error"}), null, 20000);
                console.error(err);
            }
        }
    }

    useImperativeHandle(ref, () => ({
        async open() {
            await getApplication();
            if (externalApplication !== undefined) {
                const form = document.createElement("form");
                form.id = "ext_apps_open_form";
                form.method = externalApplication.method;
                form.action = externalApplication.url;
                form.target = "_blank";
                externalApplication.parameters.forEach(param => {
                    const element = document.createElement("input");
                    element.name = param.name;
                    if(param.isFunction){
                        // let paramValue = getParamValue(param.value)
                        element.value = getParamValue(param.value);
                    }else{
                        element.value = param.value;
                    }
                    element.type = "hidden";
                    form.appendChild(element)

                });

                const oldForm = document.getElementById("ext_apps_open_form");
                if(oldForm){
                    document.body.replaceChild(form ,oldForm);
                }else{
                    document.body.appendChild(form);
                }
                form.submit();
            }
        },

        async connect() {
            await getApplication();
            if (externalApplication !== undefined && externalApplication.code === "WSAP") {
                const sapUser = websap!.websapAccessData!.sapUser ? websap!.websapAccessData!.sapUser : "";
                const sapPassword = websap!.websapAccessData!.sapPassword ? Base64.decode(JSON.stringify(websap!.websapAccessData!.sapPassword)) :"";
                const connectionUrl = externalApplication.urlConnexion +"?sap-user="+sapUser+"&sap-password="+sapPassword;
                const strWindowFeatures = "menubar=no,location=yes,resizable=yes,scrollbars=yes,status=yes";
                window.open(connectionUrl, "SAP RMCA", strWindowFeatures);
            }
        }
    }));

    const getParamValue = (param) =>{
        switch(param) {
            case "no_ligne" :{
                return client!.service!.label ? client!.service!.label : "" ;
            }
            case "no_cpt_fact" : {
                return client!.service!.billingAccount!.id ? client!.service!.billingAccount!.id : "";
            }
            case "motif_feuille" : {
                return  motif && motif!.code ?  motif!.code : "";
            }
            case "libelle_motif_4" : {
                return  motif && motif.tags &&  motif!.tags!.length === 4 ?  motif!.tags![3] : "";
            }
            case "libelle_motif_3" : {
                return   motif!.tags!.length >= 3 ?  motif!.tags![2] : "";
            }
            case "libelle_motif_2" : {
                return motif && motif.tags &&   motif!.tags!.length >= 2 ? motif!.tags![1] : "";
            }
            case "libelle_motif_1" : {
                return   motif && motif.tags && motif!.tags!.length >= 1 ?  motif!.tags![0] : "";
            }
            case "no_cc_titu" : {
                return client!.service!.additionalData.accountId ? client!.service!.additionalData.accountId : "";
            }
            case "raison_soc" : {
                return client!.service!.billingAccount!.businessName ? client!.service!.billingAccount!.businessName : "";
            }
            case "siren" : {
                return client!.clientData!.siren ? client!.clientData!.siren : "";
            }
            case "idc_nom" : {
                const {corporation, ownerPerson, ownerCorporation} = client.clientData!;
                return corporation ? ownerCorporation.name : `${ownerPerson.civility} ${ownerPerson.firstName} ${ownerPerson.lastName}`;
            }
            case "idc_num" : {
                return client!.service!.additionalData.accountId ? client!.service!.additionalData.accountId : "";
            }
            case "DureeGel" : {
                const gelDurationApplicationSettings = websap!.websapSetting!.websapADGSettings.filter(app => app.adgCode === "ADG_WEBSAP_GEL_RELANCE")[0];
                const activityDuration = gelDurationApplicationSettings.durations.filter(duration => duration.activityCode === userActivityCode);
                if(activityDuration.length > 0){
                    return activityDuration[0].duration;
                }else{
                    return gelDurationApplicationSettings.defaultDuration;
                }
            }
            default : return "";
        }
    }


    return (
        <div/>
    );

})
export default ExternalApplicationPageV2;