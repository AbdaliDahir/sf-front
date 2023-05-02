import React, { useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { NotificationManager } from "react-notifications";
import { connect, useDispatch } from "react-redux";
import { RouteComponentProps, useParams } from "react-router";
import SockJsClient from 'react-stomp';
import { useTypedSelector } from "src/components/Store/useTypedSelector";
import { useLocalClientContext } from "src/hooks";
import { Case } from "src/model/Case";
import { CaseQualification } from "src/model/CaseQualification";
import { CaseRequestCLO } from "src/model/CaseRequestCLO";
import { Contact } from "src/model/Contact";
import ErrorModel from "src/model/utils/ErrorModel";
import FastService from "src/service/FastService";
import { AppState } from "src/store";
import { ClientContextSliceState } from "src/store/ClientContextSlice";
import { RecentCaseState } from "src/store/reducers/v2/case/RecentCasesReducerV2";
import { CaseCategory } from "../../../../../model/CaseCategory";
import { CaseBooleans, CaseCLO, CaseSection } from "../../../../../model/CaseCLO";
import { CaseRoutingRule } from "../../../../../model/CaseRoutingRule";
import { CasesQualificationSettings } from "../../../../../model/CasesQualificationSettings";
import { HistoRapideSetting } from "../../../../../model/HistoRapideSetting";
import CaseService from "../../../../../service/CaseService";
import {
    notifyThemeSelectionActionV2,
    setAdditionalDataV2,
    setCaseMotifV2,
    setIsCurrentCaseScaledV2,
    setPayloadFromQuickAccessV2,
    setQualificationLeafV2,
    setQualificationSelectedV2,
    storeCaseBooleansV2,
    storeCaseV2,
    updateSectionsV2
} from "../../../../../store/actions/v2/case/CaseActions";
import { fetchRecentCasesForClientV2, setIsRecentCasesListDisplayedV2 } from "../../../../../store/actions/v2/client/ClientActions";
import HistoRapideButtons from "./HistoRapideButtons";

interface Param {
    id?: string,
}
interface HistoRapidePageProps extends RouteComponentProps<Param> {
    recentCases: RecentCaseState;
    contact: Contact;
    client?: ClientContextSliceState;
    activityCode: string;
    storeCaseV2: (a: Case) => void;
    storeCaseBooleansV2: (caseId: string, value: CaseBooleans) => void;
    setQualificationSelectedV2: (qualification: string) => void;
    setIsCurrentCaseScaledV2: (caseId: string, value: boolean) => void;
    setCaseMotifV2: (caseId: string, motif: CaseQualification) => void;
    setQualificationLeafV2: (caseId: string, qualificationLeaf?) => void;
    notifyThemeSelectionActionV2: (caseId: string, themeSelection?: CasesQualificationSettings, rule?: CaseRoutingRule) => void;
    updateSectionsV2: (caseId: string, sections: CaseSection[]) => void;
    setAdditionalDataV2: (caseId: string, additionalData: any) => void;
    setIsRecentCasesListDisplayedV2: (clientId: string, serviceId: string, state: boolean) => void;
}
const HistoRapidePage = (props: HistoRapidePageProps) => {
    const histoRapideSettings: HistoRapideSetting[] = useTypedSelector(
        (state) => state.store.applicationInitialState.histoRapideSettings
    );
    const dispatch = useDispatch();
    const { clientId, serviceId } = useParams() as { clientId: string, serviceId: string };
    const [client] = useLocalClientContext();
    const caseService: CaseService = new CaseService(true);
    useEffect(() => {
        const loadData = async () => {
            if (clientId && serviceId) {
                await loadRecentCases();
            }
        };
        loadData();
    }, []);

    const loadRecentCases = async () => {
        try {
            dispatch(fetchRecentCasesForClientV2(clientId, serviceId, false));
        } catch (error) {
            return error.then((element: ErrorModel) => {
                NotificationManager.error(element.message);
            });
        }
    }
    const initHistoRapideCase = async (codeClickEvent) => {
        const histoRapideCode = codeClickEvent.currentTarget.value;
        const histRapid = histoRapideSettings.find(
            (hs) => hs.code === histoRapideCode
        );
        const qualifCodeFromHistoRapide = histRapid?.qualificationCode;
        const casesList = props.recentCases?.casesList.length > 0 ? props.recentCases?.casesList :
            props.client?.recentCases.casesList;
        const listCasesMatchingQualification = casesList?.filter(
            (recentCase: Case) => {
                return (
                    recentCase.category === "IMMEDIATE" &&
                    recentCase.status !== "CLOSED" &&
                    qualifCodeFromHistoRapide === recentCase.qualification.code
                );
            }
        );
        try {
            if (listCasesMatchingQualification && listCasesMatchingQualification.length > 0) {
                redirectToSelectedCase(listCasesMatchingQualification[0].caseId);
            } else {
                const caseRequestCLO: CaseRequestCLO = {
                    contact: { id: props.contact?.contactId },
                    clientId: client.clientData!.id,
                    serviceId: client.serviceId!,
                    activityCode: props.activityCode,
                    serviceType: client.service?.serviceType,
                };

                const newCase: CaseCLO = await caseService.initHistoRapideCase(
                    histoRapideCode,
                    caseRequestCLO
                );
                const updatedNewCase = updateCaseWithDefaultValues(
                    newCase,
                    histoRapideCode
                );
                await replaceCase(updatedNewCase);

                const url: string = "/cases/histo/" + histRapid?.code;
                redirectToSelectedCase(newCase.currentCase.caseId, url)

            }
        } catch (errorPromise) {
            const error = await errorPromise;
            if (error.status === 404) {
                try {
                    const caseCLO = await caseService.getNewCaseWithoutSave();
                    const url: string = "/cases/histo/" + histRapid?.code;
                    redirectToSelectedCase(caseCLO.currentCase.caseId, url)
                } catch (err) {
                    NotificationManager.error(err.message);
                }
            }
        }
    };


    const redirectToSelectedCase = async (selectedCaseId: string, url?: string) => {
        FastService.postRedirectMessage({
            urlUpdate: url ? url : '',
            idCase: selectedCaseId,
            serviceId: client.serviceId
        });
    };

    const updateCaseWithDefaultValues = (
        caseCLO: CaseCLO,
        histoRapideCode: string
    ): CaseCLO => {
        const defaultValues = histoRapideSettings.find(
            (hrs) => hrs.code === histoRapideCode
        );
        return {
            ...caseCLO,
            currentCase: {
                ...caseCLO.currentCase,
                processing: defaultValues?.status === "RESOLVED",
                ...defaultValues,
            },
        };
    };

    const replaceCase = async (caseCLO: CaseCLO) => {
        const caseId: string = caseCLO.currentCase.caseId;

        // this.setState({ currentCaseId: caseId });
        props.storeCaseV2(caseCLO.currentCase);
        props.storeCaseBooleansV2(caseCLO.currentCase.caseId, {
            canCCUpdateCurrentCase: caseCLO.canCCUpdateCurrentCase,
            canCCAddNoteToCurrentCase: caseCLO.canCCAddNoteToCurrentCase,
            canCCAutoAssignCurrentCase: caseCLO.canCCAutoAssignCurrentCase,
            canCCReQualifyCurrentCase: caseCLO.canCCReQualifyCurrentCase,
            canCCUpdateMandatoryADGForCurrentCase:
                caseCLO.canCCUpdateMandatoryADGForCurrentCase,
            mustCCReQualifyCurrentCase: caseCLO.mustCCReQualifyCurrentCase,
            canDisplayPrendreEnChargeBtn: caseCLO.canDisplayPrendreEnChargeBtn,
        });
        props.setQualificationSelectedV2(caseId);
        props.setIsCurrentCaseScaledV2(
            caseId,
            caseCLO.currentCase.category === CaseCategory.SCALED
        );
        props.setCaseMotifV2(caseId, caseCLO.currentCase.qualification);
        const rule: CaseRoutingRule = {
            estimatedResolutionDateOfCase:
                caseCLO.currentCase.estimatedResolutionDate?.toString(),
            receiverActivity: caseCLO.currentCase.caseOwner.activity,
            receiverSite: caseCLO.currentCase.caseOwner.site,
            routingMode: "",
            transmitterActivity: caseCLO.currentCase.caseOwner.activity,
            transmitterSite: caseCLO.currentCase.caseOwner.site,
        };
        let caseQualification: CasesQualificationSettings | undefined;
        try {
            caseQualification = await caseService.getCaseQualifSettings(
                caseCLO.currentCase.qualification.code
            );

            props.setQualificationLeafV2(caseId, caseQualification);
        } catch (e) {
            props.setQualificationLeafV2(caseId);
        } finally {
            props.notifyThemeSelectionActionV2(caseId, caseQualification, rule);
        }
        props.updateSectionsV2(caseId, caseCLO.sections);
        if (caseCLO.currentCase.data) {
            props.setAdditionalDataV2(caseId, caseCLO.currentCase.data);
        }
        props.setIsRecentCasesListDisplayedV2(
            client.clientData!.id,
            client.service!.id,
            false
        );
    };

    const onMessage = async (ListCasesFromStomp) => {
        await loadRecentCases();
    }
    return (
        <div>
            <SockJsClient url={process.env.REACT_APP_FASTR_API_URL + "/fastr-cases/subscribe-service/"}
                topics={["/topic/subscribeService-" + serviceId]}
                onMessage={onMessage} />
            <div className="card">
                <div className="card-header">
                    <h4 className="text-center">
                        <FormattedMessage id={"cases.list.recent.histo.rapide"} />
                    </h4>
                </div>
                <div className="card-body">
                    {histoRapideSettings && (
                        <HistoRapideButtons
                            histoRapideSettings={histoRapideSettings}
                            handleClick={initHistoRapideCase}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = (state: AppState, ownProps) => ({
    recentCases: ownProps.clientContext
        ? state.store.client.loadedClients.find(
            (c) =>
                c.clientData?.id === ownProps.clientContext.clientData?.id &&
                c.serviceId === ownProps.clientContext.serviceId
        )?.recentCases
        : state.store.recentCases,
    blockingUI: state.store.ui.blockingUI,
    client: state.store.client.currentClient,
    contact: state.store.contact.currentContact,
    activityCode: state.store.applicationInitialState.user?.activity.code
});

const mapDispatchToProps = {
    setAdditionalDataV2,
    setCaseMotifV2,
    setIsCurrentCaseScaledV2,
    setQualificationLeafV2,
    setQualificationSelectedV2,
    storeCaseV2,
    updateSectionsV2,
    storeCaseBooleansV2,
    setPayloadFromQuickAccessV2,
    notifyThemeSelectionActionV2,
    setIsRecentCasesListDisplayedV2
};
export default connect(mapStateToProps, mapDispatchToProps)(HistoRapidePage);
