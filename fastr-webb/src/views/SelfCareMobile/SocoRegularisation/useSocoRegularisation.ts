import { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import { Action } from "src/model/actions/Action";
import { ActiviteRegul } from "src/model/service";
import { RegularisationFixeAdgDetail } from "src/model/service/RegularisationFixAdgDetail";
import { TimeLineRegularisationItem } from "src/model/TimeLine";
import ActionService from "src/service/ActionService";
import ActService from "src/service/ActService";
import ClientService from "src/service/ClientService";
import { isAllowedAutorisation } from "src/utils/AuthorizationUtils";
import { eventRegulToTimeLineRegulMapper } from "../tools/time_regularisation_mapper";

const TWO_YEARS_BY_DAY_DEPTH = '720';
const TWO_YEARS_BY_MONTH_DEPTH = '24';

export const useSocoRegularisation = (
    refSiebel: string,
    authorizarions: string[]
) => {
    const actService = new ActService(true);
    const actionService = new ActionService(true);
    const clientService = new ClientService();
    const [regularisations, setRegularisation] = useState<
        TimeLineRegularisationItem[]
    >([]);
    const [actDetailed, setActDetailed] = useState<RegularisationFixeAdgDetail[]>(
        []
    );
    const [isActRegulLoaded, setIsActRegulLoaded] = useState<boolean>(false);
    const [isActionRegulLoaded, setIsActionRegulLoaded] =
        useState<boolean>(false);
    const [isGcoGcuRegulLoaded, setIsGcoGcuRegulLoaded] =
        useState<boolean>(false);
    const [actions, setActions] = useState<Action[]>([]);

    const [isActiviteRegulLoaded, setIsActiviteRegulLoaded] = useState<boolean>(false);
    useEffect(() => {
        if (
            refSiebel &&
            isAllowedAutorisation(authorizarions, "is_access_regul_suivi_commercial")
        ) {
            loadActsRegul();
            loadActionsRegul();
            loadGcoGcuRegul();
            loadActiviteRegul();
        }
    }, [refSiebel, authorizarions]);

    const loadActsRegul = async () => {

        try {
            if (!isActRegulLoaded) {
                const actRegulDetailed: RegularisationFixeAdgDetail[] =
                    refSiebel.slice(0, 1) === "1"
                        ? await actService.getListActRegularisationDetailedFixeForLastTwoYears(refSiebel)
                        : [];
                if (actRegulDetailed.length > 0) {
                    setActDetailed(actRegulDetailed);
                    setRegularisation((prev) => [
                        ...prev,
                        ...eventRegulToTimeLineRegulMapper(actRegulDetailed),
                    ]);
                    setIsActRegulLoaded(true);
                }
            }
        } catch (e) {
            NotificationManager.error(
                "L'information des ADG de régularisation n'est pas disponible actuellement"
            );
        }
    };

    const loadActionsRegul = async () => {

        try {
            if (!isActionRegulLoaded) {
                const actionRegul =
                    await actionService.getRegulFixeActionsBySiebelAccountWithDepthInDays(
                        refSiebel,
                        TWO_YEARS_BY_DAY_DEPTH);
                if (actionRegul.length > 0) {
                    setRegularisation((prev) => [
                        ...prev,
                        ...eventRegulToTimeLineRegulMapper(actionRegul),
                    ]);
                    setIsActionRegulLoaded(true);
                    setActions(actionRegul);
                }
            }
        } catch (e) {
            NotificationManager.error(
                "L'information des actions de régularisation n'est pas disponible actuellement"
            );
        }
    };
    const loadGcoGcuRegul = async () => {

        try {
            if (!isGcoGcuRegulLoaded) {
                const gcoGcuRegul =
                    await clientService.findAllGcuGcoByRefSiebelAndRange(refSiebel, TWO_YEARS_BY_DAY_DEPTH);
                if (gcoGcuRegul.length > 0) {
                    setRegularisation((prev) => [...prev, ...eventRegulToTimeLineRegulMapper(gcoGcuRegul)]);
                    setIsGcoGcuRegulLoaded(true);
                }

            }
        } catch (e) {
            NotificationManager.error("L'information des GCO / GCU de régularisation n'est pas disponible actuellement");
        }
    }

    const loadActiviteRegul = async () => {
        try {
            if (!isActiviteRegulLoaded) {
                const activiteReguls: ActiviteRegul[] = refSiebel.slice(0, 1) === "1" ?
                    await clientService.findAllActiviteRegularisationByRefAndDepthInMonth(refSiebel, TWO_YEARS_BY_MONTH_DEPTH)
                    : [];
                if (activiteReguls.length > 0) {
                    setRegularisation((prev) => [
                        ...prev,
                        ...eventRegulToTimeLineRegulMapper(activiteReguls),
                    ]);
                    setIsActiviteRegulLoaded(true);
                }
            }
        } catch (e) {
            NotificationManager.error(
                "L'information des Activites de regularisation n'est pas disponible actuellement"
            );
        }
    };

    return [regularisations, actions, actDetailed];
};
