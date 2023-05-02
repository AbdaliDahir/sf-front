import React, { useEffect, useState } from 'react';
import { NotificationManager } from "react-notifications";
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import Loading from 'src/components/Loading';
import { Payload } from 'src/model/case/CaseActPayload';
import { CaseCLO } from 'src/model/CaseCLO';
import { CasesQualificationSettings } from 'src/model/CasesQualificationSettings';
import { HistoRapideSetting } from 'src/model/HistoRapideSetting';
import CaseService from 'src/service/CaseService';
import { AppState } from 'src/store';
import {
    notifyThemeSelectionActionV2,
    setAdditionalDataV2,
    setCaseHasInProgressIncident,
    setIsCurrentCaseScaledV2,
    setIsThemeSelectedV2,
    setPayloadFromQuickAccessV2,
    storeCaseV2,
    updateSectionsV2
} from 'src/store/actions/v2/case/CaseActions';
import { setBlockingUIV2 } from 'src/store/actions/v2/ui/UIActions';
import CasePageV2 from '../../CasePageV2';

const HistoRapideCaseContainer = (props) => {
    const { clientContext } = props;
    const { histoCode } = useParams() as { histoCode: string }
    const caseService = new CaseService(true);
    const payload = useSelector((state: AppState) => state.payload.payload);
    const historapides = useSelector((state: AppState) => state.store.applicationInitialState.histoRapideSettings);
    const serviceType = useSelector((state: AppState) => state.store.client.currentClient?.service?.serviceType);
    const activityCode = useSelector((state: AppState) => state.store.applicationInitialState.user?.activity.code);
    const [loaded, setLoaded] = useState(false);
    const dispatch = useDispatch();
    const [actId, setActId] = useState('');
    const [selectedHisto, setSelectedHisto] = useState<HistoRapideSetting>();
    const [hasScaledTheme, setHasScaledTheme] = useState<boolean>(false);
    const [hasScaledThemeLoaded, setHasScaledThemeLoaded] = useState<boolean>(false);
    // load actId
    useEffect(() => {
        if (historapides.length > 0) {
            setActId(getActId());
        }
    }, [historapides.length]);

    useEffect(() => {
        if (payload.idClient && selectedHisto && !loaded) {
            const adgQuickAccessPayload = {
                idClient: payload.idClient,
                idService: payload.idService,
                idAct: actId.length > 0 && selectedHisto.hasADG ? actId : null,
                idContact: payload.idContact,
                idCase: payload.idCase,
                fromQA: true,
                histoCode: histoCode
            } as Payload;
            dispatch(setPayloadFromQuickAccessV2(adgQuickAccessPayload));
            setLoaded(true);
        }
    }, [payload, selectedHisto]);

    useEffect(() => {
        (async () => {
            if (selectedHisto && !hasScaledThemeLoaded) {
                await updateScaling();

            }
        })();
    }, [selectedHisto])

    const getActId = () => {
        const historRapid = historapides.filter(histo => histo.code === histoCode);
        if (historRapid.length > 0) {
            setSelectedHisto(historRapid[0]);
            return historRapid[0].codeADGorAction;
        }
        return '';
    }
    const updateScaling = async () => {
        const caseId = payload.idCase;
        const caseCLO: CaseCLO = await caseService.getOrNewCaseCLO(caseId);
        let currentCase = caseCLO.currentCase;
        dispatch(storeCaseV2(currentCase));
        const passed = caseCLO ? true : false;
        if (selectedHisto && serviceType && passed) {
            try {
                const isValidTheme = await caseService.checkValidScalingTheme(histoCode, activityCode, serviceType);
                if (!isValidTheme) {
                    setHasScaledThemeLoaded(true); return;
                }
                let theme: CasesQualificationSettings;
                try {
                    theme = await caseService.getCaseQualifSettings(selectedHisto.themeCode);
                    if (theme && theme.code) {
                        try {
                            const rule = await caseService.getReceiverSiteFromleafTheme(theme.code, serviceType);
                            dispatch(setIsCurrentCaseScaledV2(caseId, true));
                            dispatch(setBlockingUIV2(true));
                            if (theme.incident) {
                                dispatch(setCaseHasInProgressIncident(caseId));
                            }
                            const sections = caseCLO.sections;
                            (sections.find((s) => s.code === "QUALIFICATION") || { editable: false }).editable = true;
                            dispatch(updateSectionsV2(caseId, [...sections]));
                            if (caseCLO.currentCase.data) {
                                dispatch(setAdditionalDataV2(caseId, caseCLO.currentCase.data));
                            }
                            dispatch(notifyThemeSelectionActionV2(caseId, theme, rule));
                            dispatch(setBlockingUIV2(true));
                            dispatch(setIsThemeSelectedV2(caseId));
                            setHasScaledTheme(true);
                        } catch (error) {
                            NotificationManager.error('Erreur au chargement des regles du theme');
                        }
                    }
                } catch (error) {
                    NotificationManager.error('Erreur au chargement du theme')
                }
                setHasScaledThemeLoaded(true);
            } catch (error) {
                setHasScaledThemeLoaded(true);
            }
        }
    }
    return (
        <>
            {payload && payload.idCase && hasScaledThemeLoaded ?
                <CasePageV2
                    caseId={payload.idCase}
                    currentNoteValue={selectedHisto?.description}
                    isHistoRapid={true}
                    clientContext={clientContext}
                    histoRapidIsScaled={hasScaledTheme}
                    currentDescription={selectedHisto?.clientRequest} />
                : <Loading />}
        </>
    )
}

export default HistoRapideCaseContainer