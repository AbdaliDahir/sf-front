import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { NotificationManager } from "react-notifications";
import Button from "reactstrap/lib/Button";
import Label from "reactstrap/lib/Label";
import { translate } from 'src/components/Intl/IntlGlobalProvider';
import Loading from 'src/components/Loading';
import { useTypedSelector } from 'src/components/Store/useTypedSelector';
import { useLocalClientContext } from 'src/hooks';
import { ActionsAndActsSettingsResponse } from 'src/model/acts/ActionsAndActsSettingsResponse';
import { HistoRapideSetting } from 'src/model/HistoRapideSetting';
import CaseService from 'src/service/CaseService';
import './HistoRapideButtons.scss';

interface HistoButtonsProps {
    histoRapideSettings: HistoRapideSetting[];
    handleClick: (event: any) => void
}
const HistoRapideButtons = (props: HistoButtonsProps) => {
    const { histoRapideSettings, handleClick } = props;
    const [client] = useLocalClientContext();
    const authorizations = useTypedSelector(state => state.store.applicationInitialState.authorizations);
    const casesService: CaseService = new CaseService(true);
    const [loading, setLoading] = useState(true);
    const [allowedHistoRapid, setAllowedHistoRapid] = useState<HistoRapideSetting[]>([]);
    const [actAndActions, setActAndActions] = useState<ActionsAndActsSettingsResponse[]>([]);
    const [actAndActionsLoaded, setActAndActionsLoaded] = useState<boolean>(false);
    useEffect(() => {
        if (client.service && authorizations.length > 0 && actAndActionsLoaded) {
            setAllowedHistoSettings();
        }
    }, [client?.clientData?.id, authorizations.length, histoRapideSettings.length, actAndActionsLoaded])

    useEffect(() => {
        if (client.service) {
            fetchAllowedActionsAndActs();
        }
    }, [client?.clientData?.id]);

    const fetchAllowedActionsAndActs = async () => {
        const request = {
            caseId: "",
            clientCategory: client?.clientData?.corporation ? "CORPORATION" : "PERSON",
            serviceType: client?.service?.serviceType ? client?.service?.serviceType : "",
            clientId: client?.clientData?.id,
            offreId: client?.serviceId
        }
        try {
            const list = await casesService.getAllowedActionsAndActsToDisplay(request);
            setActAndActions([...list]);
            setActAndActionsLoaded(true);
        } catch (err) {
            setAllowedHistoRapid([]);
            setLoading(false);
            setActAndActionsLoaded(true);
            NotificationManager.error(translate.formatMessage({ id: "get.actionsAndActsbuttons.failure" }));
        }

    }
    const setAllowedHistoSettings = () => {
        const histoWithoutADG = histoRapideSettings.filter(histo => !histo.hasADG || histo.codeADGorAction.length === 0);
        if (actAndActions.length > 0) {
            let allowedHisto: HistoRapideSetting[] = histoWithoutADG;
            actAndActions
                .filter(element => authorizations.some(authorization => authorization === element.actAuthorization))
                .map(elementAuth => histoRapideSettings.map(histo => {
                    if (histo.hasADG && histo.codeADGorAction === elementAuth.actCode) {
                        allowedHisto = [...allowedHisto, histo];
                    }
                }))
            setAllowedHistoRapid(allowedHisto.sort((a, b) => a.name > b.name ? 1 : -1));
            setLoading(false);
        }
        if (actAndActionsLoaded && actAndActions.length == 0) {
            setAllowedHistoRapid(histoWithoutADG.sort((a, b) => a.name > b.name ? 1 : -1));
            setLoading(false);
        }
    }
    return (
        <div className="d-flex flex-wrap">
            {allowedHistoRapid.length > 0 ? allowedHistoRapid.map(histoRapideSetting =>
                <section className="histo-rapide__button" key={histoRapideSetting.code}>
                    <Button id={histoRapideSetting.name}
                        color="primary"
                        className="btn-lg"
                        value={histoRapideSetting.code}
                        onClick={handleClick}>
                        <span className={`icon-white ${histoRapideSetting.icon}`} />
                    </Button>
                    <Label className="m-2 text-center font-weight-bold"> <FormattedMessage
                        id={histoRapideSetting.name} /></Label>
                </section>
            ) :
                <>
                    {loading ? <Loading /> :
                        <Label className="w-100 text-center font-weight-bold mt-1">
                            <FormattedMessage id="histo.rapide.empty.list.activity.message" />
                        </Label>}
                </>}
        </div>
    )
}

export default HistoRapideButtons
