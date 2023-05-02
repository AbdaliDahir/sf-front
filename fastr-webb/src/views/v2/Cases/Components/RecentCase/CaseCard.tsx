import * as React from "react";
import {useEffect, useRef, useState} from "react";
import {Button, Card, CardHeader, Col, Collapse, Row} from "reactstrap";
import Onglet from "./CaseCardComponents/Onglet";
import {Case} from "../../../../../model/Case";
import CaseSynthese from "./CaseCardHeader/CaseSynthese";
import CaseRequestAnswer from "./CaseCardHeader/CaseRequestAnswser";
import {useTypedSelector} from "../../../../../components/Store/useTypedSelector";
import {FormattedMessage} from "react-intl";
import SelectedCaseSummaryV3 from "../../../../Cases/List/Elements/SelectedCaseSummaryV3";
import CaseService from "../../../../../service/CaseService";
import {Action} from "../../../../../model/actions/Action";
import {AppState} from "../../../../../store";
import {ApplicationMode} from "../../../../../model/ApplicationMode";
import {isAuthorizedBebOrBebCoFixe} from "../../../../../utils/AuthorizationUtils";
import { TabCategory } from "src/model/utils/TabCategory";

interface Props {
    index: number
    recentCase?: Case
    title: string
    handleReprendre?: (caseId: string) => void
    fillSelectedCase?: (recentCase: Case, index: number) => void
    recentCaseRef?
    idParamFromUrl?: string
    selectedCaseIndex?: number,
    fromSummary: boolean,
    toggleTab?: (tab: TabCategory) => void
}

const caseService = new CaseService(true);

const CaseCard = (props: Props) => {
    const {index, recentCase, title, recentCaseRef, selectedCaseIndex, idParamFromUrl, fromSummary, toggleTab} = props;
    const sessionIsFrom = useTypedSelector((state) => state.store.applicationInitialState.sessionIsFrom)
    const authorizations = useTypedSelector((state) => state.store.applicationInitialState.authorizations)
    const userActivity = useTypedSelector((state: AppState) => state.store.applicationInitialState.user!.activity)
    const userLogin = useTypedSelector((state: AppState) => state.store.applicationInitialState.user!.login)
    const [sectionToForceOpen, setSectionToForceOpen] = useState()
    const [forceOpenActionsHistoryTrigger, setForceOpenActionsHistoryTrigger] = useState(0)
    const [isScalingV2, setIsScalingV2] = useState<boolean>(false);
    const [isOpened, setIsOpened] = useState<boolean>(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const [isPastScaling, setIsPastScaling] = useState<boolean>();
    const [editableScaling, setEditableScaling] = useState<boolean | undefined>(false);
    const [isInProgressAction, setIsInProgressAction] = useState(false);
    const [isScalingOrActionEditable, setIsScalingOrActionEditable] = useState<boolean>(false);
    const [caseCLOState, setCaseCLOState] = useState();

    useEffect(() => {
        setSectionToForceOpen("HISTORY")
        if(idParamFromUrl && index === selectedCaseIndex) {
            openCard()
        }

    }, [])

    useEffect(() => {
        checkEditableScalingOrActions()
    }, [recentCase?.updateDate,isInProgressAction])

    useEffect(() => {
        if (recentCase && recentCase.scaleDetails && recentCase.scaleDetails.length > 0) {
            const scaledDetailFromCase = recentCase.scaleDetails[recentCase.scaleDetails.length - 1];
            const isScalingV2temp = scaledDetailFromCase.step !== "" && scaledDetailFromCase.step !== null && scaledDetailFromCase.step !== undefined;
            setIsScalingV2(isScalingV2temp);
            if (isScalingV2temp) {
                setIsPastScaling(scaledDetailFromCase.progressStatus === "TREATMENT_END" || scaledDetailFromCase.step === "ANNULATION")
            } else {
                if (recentCase.finishingTreatmentConclusion) {
                    setIsPastScaling(Object.keys(recentCase.finishingTreatmentConclusion).length > 0 &&
                        (recentCase.status === "RESOLVED" ||
                            recentCase.status === "UNRESOLVED" ||
                            recentCase.status === "CLOSED")
                    )
                }
            }
        }
    }, [recentCase])

    const checkEditableScalingOrActions = async () => {
        if(recentCase?.caseId) {
            const caseCLO = await caseService.getCaseCLO(recentCase.caseId);
            const scalingSection = caseCLO.sections.find((s) => s.code === "SCALING")
            const isScalingSectionEditable = caseCLO.currentCase.category === "SCALED" && scalingSection && scalingSection.editable
            setCaseCLOState(caseCLO);
            setIsScalingOrActionEditable(isScalingSectionEditable || isInProgressAction)
            setEditableScaling(isScalingSectionEditable)
        }
    }
    const isFromGoFastr = (): boolean => {
        return sessionIsFrom === ApplicationMode.GOFASTR;
    }

    const isfromDisrc = (): boolean => {
        return sessionIsFrom === ApplicationMode.DISRC;
    }
    const filterCasesForDISRC = (): boolean => {
        if (sessionIsFrom === ApplicationMode.DISRC) {
            return recentCase?.category !== "SCALED"
        }
        return true;
    }

    const handleReprendreClick = () => {
        if (recentCase?.caseId && props.handleReprendre) {
            setIsOpened(false);
            props.handleReprendre(recentCase?.caseId);
        }
    }

    const handleFillSelectedCase = () => {
        setIsOpened(true)
        cardRef.current?.scrollIntoView(true)
    }

    const openCard = () => {
        // click from synthese 
        if (fromSummary && toggleTab) {
            // showCasesTab();
            toggleTab(TabCategory.CASES);
        } else { // click from list of cases
            setIsOpened(!isOpened)
            cardRef.current?.scrollIntoView(true)
            setSectionToForceOpen("HISTORY")
        }
    }

    const checkInProgressActions = (bool) => {
        setIsInProgressAction(bool)
    }

    const forceOpenActionsHistory = () => {
        setSectionToForceOpen("HISTORY")
        setForceOpenActionsHistoryTrigger(forceOpenActionsHistoryTrigger + 1)
    }

    const areActionsActivitiesMatching = (actionStatus, assigneeActivity, assigneeLogin) => {
        const qualifiedActionsTest = actionStatus === 'QUALIFIED' && (assigneeActivity?.code === userActivity?.code)
        const onGoingActionsTest = actionStatus === 'ONGOING' && (assigneeActivity?.code === userActivity?.code) && (assigneeLogin === userLogin)
        return qualifiedActionsTest || onGoingActionsTest
    }

    const updateActionsDetails = async (caseId, actionsDetailsList: Action[]) => {
        const actionsAlerts = actionsDetailsList.filter(action => {
            const actionStatus = action?.processCurrentState?.status;
            const assigneeActivity = action?.processCurrentState?.assignee?.activity;
            const assigneeLogin = action?.processCurrentState?.assignee?.login;
            return areActionsActivitiesMatching(actionStatus, assigneeActivity, assigneeLogin)
        });



        if(actionsAlerts?.length && checkInProgressActions) {
            checkInProgressActions(true);
        } else {
            const scalingSection =  caseCLOState?.sections.find((s) => s.code === "SCALING")
            const isScalingSectionEditable = scalingSection && caseCLOState && caseCLOState.currentCase.category === "SCALED" &&  scalingSection.editable
            setIsScalingOrActionEditable(isScalingSectionEditable);
        }
    }

    return (
        <div className="w-100 d-flex justify-content-between mb-3 h-100" ref={cardRef}>
            <Onglet title={title}
                    fullHeight={fromSummary}
                    lastUpdateDate={recentCase?.updateDate}
                    lastModifier={recentCase?.events[0]?.author}
                    alerting={isScalingOrActionEditable}
            />
            <Card className="CaseCard w-100">
                <CardHeader className="p-0 h-100">
                    <Row className="m-0">
                        <Col md={4} className="caseBlockContainer">
                            <CaseSynthese
                                recentCase={recentCase}
                                caseCardRef={cardRef}
                                isScalingV2={isScalingV2}
                                isPastScaling={isPastScaling}
                                sectionSetter={setSectionToForceOpen}
                                openDetails={handleFillSelectedCase}
                               forceOpenActionsHistory={forceOpenActionsHistory}/>
                        </Col>
                        <Col md={8} className="caseBlockContainer caseRequestAnswer">
                            <Row>
                                <Col md={9}>
                                    <CaseRequestAnswer recentCase={recentCase}/>
                                </Col>
                                <Col md={3}>
                                    <div className="d-flex flex-column justify-content-between align-items-end py-1 h-100">
                                        <div>
                                            {recentCase?.status !== "CLOSED" && (filterCasesForDISRC() || isFromGoFastr()) && (isAuthorizedBebOrBebCoFixe(authorizations) || isfromDisrc()) &&
                                                <Button id="selectedCase.update.redirect.id" color="primary"
                                                        outline
                                                        size={"sm"}
                                                        onClick={handleReprendreClick}>
                                                    <FormattedMessage id={"cases.list.recent.case.reprendre"}/>
                                                </Button>
                                            }
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row className={"detail-bloc"} onClick={openCard}>
                                <Col>
                                    <div ref={index === 0 ? recentCaseRef : null} className="d-flex justify-content-center align-items-center opencard">
                                        <span className="text-primary font-size-12 font-weight-normal">Détails</span>
                                        <span className={`arrow ${isOpened ? 'arrow-up' : 'arrow-down-red'}`}
                                              style={{width: "24px", height: "24px", display: "inline-block"}}/>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </CardHeader>
                <div>
                    <Collapse isOpen={isOpened}>
                        <SelectedCaseSummaryV3 case={recentCase}
                                               isScalingV2={isScalingV2}
                                               isPastScaling={isPastScaling}
                                               editableScaling={editableScaling}
                                               alerting={isScalingOrActionEditable}
                                               sectionToForceOpen={sectionToForceOpen}
                                               idService={recentCase?.serviceId}
                                               authorizations={authorizations}
                                               isOpened={isOpened}
                                               checkInProgressActions={checkInProgressActions}
                                               updateActionsDetails={updateActionsDetails}
                                               forceOpenActionsHistory={forceOpenActionsHistoryTrigger}
                        />
                    </Collapse>
                </div>
            </Card>
        </div>
    )
}
export default CaseCard