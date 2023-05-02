import React, {useEffect, useState} from "react";
import Button from "reactstrap/lib/Button";
import {FormattedMessage} from "react-intl";
import Row from "reactstrap/lib/Row";
import Col from "reactstrap/lib/Col";
import {MaxwellProcess} from "../../../../model/enums/MaxwellProcess";
import Loader from "react-loaders";
import {useDispatch, useSelector} from "react-redux";
import {AppState} from "../../../../store";
import {CaseState} from "../../../../store/reducers/v2/case/CasesPageReducerV2";


import {
    createTroubleTicketMaxwellV2FromADG,
    createTroubleTicketMaxwellV2FromIncidentsList,
    resolveActWithoutIncident,
    setBoucleADGV2,
    setCaseHasInProgressIncident,
    setCaseHasInProgressIncidentExceptWaiting,
    setCaseHasNotInProgressIncident,
    setFormMaxwellIncompleteV2,
    setIncidentsIdsWithWaitingStatus,
    setMaxwellIncidentsListOpened
} from "../../../../store/actions/v2/case/CaseActions";
import {TroubleTicketResponse} from "../../../../model/TroubleTicketResponse";
import {EMaxwellCallOrigin} from "../../../../model/maxwell/enums/EMaxwellCallOrigin";
import {Container} from "reactstrap";
import {useTypedSelector} from "../../../../components/Store/useTypedSelector";
import {Contact} from "../../../../model/Contact";
import {IncidentsListItem} from "../../../../model/IncidentsList";
import {
    isInProgressIncident,
    isInProgressIncidentExceptWaiting,
    isWaitingIncident
} from "../../../../utils/MaxwellUtilsV2";
import CaseService from "../../../../service/CaseService";
const MaxwellValidationStep = (props) => {
    const dispatch = useDispatch();

    const caseService: CaseService = new CaseService(true)
    const currentCase: CaseState = useSelector((state: AppState) => state.store.cases.casesList[props.caseId])

    // all process state
    const troubleTicketProcess: MaxwellProcess = useSelector((state: AppState) => state.store.cases.casesList[props.caseId].maxwellIncident?.troubleTicketProcess)
    const uploadFilesProcess: MaxwellProcess = useSelector((state: AppState) => state.store.cases.casesList[props.caseId].maxwellIncident.UploadFilesProcess)
    const createOrUpdateADGProcess: MaxwellProcess = useSelector((state: AppState) => state.store.cases.casesList[props.caseId].maxwellIncident.createOrUpdateADGProcess)

    const troubleTicketResponse: TroubleTicketResponse = useSelector((state: AppState) => state.store.cases.casesList[props.caseId].maxwellIncident.troubleTicketResponse)
    const maxwellCallOrigin: EMaxwellCallOrigin = useSelector((state: AppState) => state.store.cases.casesList[props.caseId].maxwellIncident.callOrigin)
    const actIdToFinalize: EMaxwellCallOrigin = useSelector((state: AppState) => state.store.cases.casesList[props.caseId]?.maxwellIncident?.actIdToFinalize)
    const currentContact: Contact | undefined = useTypedSelector((state: AppState) => state.store.contact?.currentContact)
    const lastSavedMaxwellActId: string = useSelector((state: AppState) => state.store.cases.casesList[props.caseId]?.maxwellIncident?.lastSavedMaxwellActId)
    const idActMaxwell = actIdToFinalize && actIdToFinalize !== undefined ? actIdToFinalize : lastSavedMaxwellActId


    const isLinkedToParentTicket: string = useSelector((state: AppState) => state.store.cases.casesList[props.caseId]?.maxwellIncident?.selectedIncidentMaxwell.refCTT)

    const [disableTerminateButton, setDisableTerminateButton] = useState(true);
    const [hideTaskTableFromIncidentsList, SetHideTaskTableFromIncidentsList] = useState(true);
    const [hideTaskTableFromADG, SetHideTaskTableFromADG] = useState(true);
    const [showTaskWithoutIncident, SetShowTaskWithoutIncident] = useState(false);

    const renderProcessResult = (process: MaxwellProcess): JSX.Element => {
        switch (process) {
            case MaxwellProcess.PROCESS_LOADING:
                return <Loader active type="ball-pulse" color="#da3832"/>;
            case MaxwellProcess.PROCESS_OK:
                return <span className="icon icon-check"/>
            case MaxwellProcess.PROCESS_KO:
                return <span className="icon icon-close"/>
            case MaxwellProcess.PROCESS_TO_VALIDATE:
                return <span className="icon icon-warning"/>
            case MaxwellProcess.PROCESS_IGNORED:
                return <span><FormattedMessage id="act.ADG_MAXWELL.step.validation.ignoredStep"/></span>
            default :
                return <React.Fragment/>
        }
    }

    const renderID = (id: string) => {
        return (
            <React.Fragment>
                <span className={"font-weight-bold"}>
                 N° {id}
                </span>
            </React.Fragment>
        )
    }

    /**
     * Grille des ADG : Etapes de validation de l'ADG Maxwell
     *
     * <ul>
     *     <li>Création d'un ticket Clarify TT</li>
     *     <li>Création d'un ADG_MAXWELL dans le case</li>
     *      <li>Dépôt des PJ sur le serveur des fichiers</li>
     * </ul>
     */
    const handleValidationFromADG = () => {
        props.hidePreviousButton()
        SetHideTaskTableFromADG(false)
        dispatch(createTroubleTicketMaxwellV2FromADG(currentCase, currentContact, idActMaxwell))
        dispatch(setFormMaxwellIncompleteV2(currentCase.caseId))
    }

    useEffect(() => { // refresh incidents section after adg creation
        if (props.callOrigin === EMaxwellCallOrigin.FROM_ADG && troubleTicketProcess === MaxwellProcess.PROCESS_OK && createOrUpdateADGProcess === MaxwellProcess.PROCESS_OK) {
            refreshIncidents();
            props.closeGrid();
            props.setShowGridADG(false);


        }
    }, [troubleTicketProcess, createOrUpdateADGProcess])

    const refreshIncidents = async () => {
        try {
            const incidentsArr: IncidentsListItem[] = await caseService.getIncidentsList(props.caseId)
            if (incidentsArr && incidentsArr.length > 0 && incidentsArr.find(incident => isInProgressIncident(incident))) {
                dispatch(setCaseHasInProgressIncident(props.caseId));
            }

            // les statuts en cours hors waiting
            if (incidentsArr && incidentsArr.length > 0 && incidentsArr.find(incident => isInProgressIncidentExceptWaiting(incident))) {
                dispatch(setCaseHasInProgressIncidentExceptWaiting(props.caseId));
            }

            const ids: Array<string> = incidentsArr.filter(incident => isWaitingIncident(incident)).map(incident => incident.actId);
            dispatch(setIncidentsIdsWithWaitingStatus(props.caseId, ids));
        } catch (e) {
            dispatch(setCaseHasNotInProgressIncident(props.caseId));
            const error = await e;
            console.error(error)
        }
    }

    /**
     * Reprise ATIF : Etapes de résolution de l'ADG Maxwell avec la création d'un incident
     *
     * <ul>
     *     <li>Création d'un ticket Clarify TT</li>
     *     <li>Mise à jour de l'ADG_MAXWELL du case</li>
     *     <li>Dépôt des PJ sur le serveur des fichiers</li>
     * </ul>
     */
    const handleValidationFromIncidentList = () => {
        props.hidePreviousButton()
        SetHideTaskTableFromIncidentsList(false)
        dispatch(createTroubleTicketMaxwellV2FromIncidentsList(currentCase, actIdToFinalize, currentContact, idActMaxwell))
        setDisableTerminateButton(false);
        dispatch(setFormMaxwellIncompleteV2(currentCase.caseId))
    }

    const handleAbandon = () => {
        if (props.callOrigin === EMaxwellCallOrigin.FROM_INCIDENTS_LIST) {
            dispatch(setMaxwellIncidentsListOpened(props.caseId))
        } else {
            dispatch(setBoucleADGV2(props.caseId, false))
        }
    }

    /**
     * Reprise ATIF : Etapes de résolution de l'ADG Maxwell sans la création d'un incident
     *
     * <ul>
     *     <li>Mise à jour de l'ADG_MAXWELL du case</li>
     *     <li>Dépôt des PJ sur le serveur des fichiers</li>
     * </ul>
     */
    const handleResolveActWithoutIncident = () => {
        if (props.callOrigin === EMaxwellCallOrigin.FROM_INCIDENTS_LIST) {
            props.hidePreviousButton()
            SetShowTaskWithoutIncident(true)
            dispatch(resolveActWithoutIncident(currentCase, props.caseId, actIdToFinalize, currentContact ? currentContact.contactId : ""))
            setDisableTerminateButton(false);
            dispatch(setFormMaxwellIncompleteV2(currentCase.caseId))
        }
    }

    function messageBeforeValidation() {
        return <Container>
            <br/>
            <Row className={"border-bottom border-top text-center"}>
                <Col md="auto">
                    <h6><FormattedMessage
                        id="act.ADG_MAXWELL.step.validation.messageBeforeValidation"/>
                    </h6>
                </Col>
            </Row>
            <br/>
        </Container>;
    }

    function tableRenderFromList() {
        return !hideTaskTableFromIncidentsList ? renderTable() : messageBeforeValidation()
    }


    function tableRenderWhenValidationWithoutTicket() {
        return <div>
            <Row className={"text-center border-bottom  pb-3 pt-3"}>
                <Col md="6" className={"border-right"}>
                    <h6><FormattedMessage
                        id="act.ADG_MAXWELL.step.validation.saveIncidentProcess.update"/></h6>
                </Col>
                <Col md="3" className={"border-right"}>
                    {renderProcessResult(createOrUpdateADGProcess)}
                </Col>
                <Col md="3">
                    {createOrUpdateADGProcess === MaxwellProcess.PROCESS_OK ? renderID(actIdToFinalize) : ""}
                </Col>
            </Row>

            <Row className={"border-bottom text-center pb-3 pt-3"}>
                <Col md="6" className={"border-right"}>
                    <h6><FormattedMessage
                        id="act.ADG_MAXWELL.step.validation.attachmentsProcess"/></h6>
                </Col>
                <Col md="3" className={"border-right"}>
                    {renderProcessResult(uploadFilesProcess)}
                </Col>
                <Col md="3">
                    {uploadFilesProcess === MaxwellProcess.PROCESS_OK ? deductIdToRender() : ""}
                </Col>
            </Row>
        </div>;
    }

    const deductIdToRender = () => {
        return maxwellCallOrigin === EMaxwellCallOrigin.FROM_INCIDENTS_LIST ? renderID(actIdToFinalize) : renderID(lastSavedMaxwellActId);
    }

    function renderTable() {
        return <div>
            <Row className={"border-bottom text-center pb-3 pt-3"}>
                <Col md="6" className={"border-right"}>
                    <h6><FormattedMessage
                        id="act.ADG_MAXWELL.step.validation.createTicketProcess"/></h6>
                </Col>
                <Col md="3" className={"border-right"}>
                    {renderProcessResult(troubleTicketProcess)}
                </Col>
                <Col md="3">
                    {troubleTicketProcess === MaxwellProcess.PROCESS_OK ? renderID(troubleTicketResponse.refCtt) : ""}
                </Col>
            </Row>
            <Row className={"text-center border-bottom  pb-3 pt-3"}>
                <Col md="6" className={"border-right"}>
                    <h6>{maxwellCallOrigin === EMaxwellCallOrigin.FROM_INCIDENTS_LIST ? <FormattedMessage
                        id="act.ADG_MAXWELL.step.validation.saveIncidentProcess.update"/> : <FormattedMessage
                        id="act.ADG_MAXWELL.step.validation.saveIncidentProcess.creation"/>} </h6>
                </Col>
                <Col md="3" className={"border-right"}>
                    {renderProcessResult(createOrUpdateADGProcess)}
                </Col>
                <Col md="3">
                    {createOrUpdateADGProcess === MaxwellProcess.PROCESS_OK ? deductIdToRender() : ""}
                </Col>
            </Row>
            <Row className={"border-bottom text-center pb-3 pt-3"}>
                <Col md="6" className={"border-right"}>
                    <h6><FormattedMessage
                        id="act.ADG_MAXWELL.step.validation.attachmentsProcess"/></h6>
                </Col>
                <Col md="3" className={"border-right"}>
                    {renderProcessResult(uploadFilesProcess)}
                </Col>
                <Col md="3">
                    {uploadFilesProcess === MaxwellProcess.PROCESS_OK ? deductIdToRender() : ""}
                </Col>
            </Row>
        </div>;
    }

    function tableRenderFromADG() {
        return !hideTaskTableFromADG ? renderTable() : messageBeforeValidation()
    }

    function buttonsRender() {
        return <div className="text-right">
            {maxwellCallOrigin === EMaxwellCallOrigin.FROM_INCIDENTS_LIST &&
                <>
                    <Button id="caseNavbar.cancel.button.id" size="lg" className="mr-2" color="light"
                            hidden={troubleTicketProcess === MaxwellProcess.PROCESS_OK}
                            disabled={troubleTicketProcess === MaxwellProcess.PROCESS_LOADING}
                            onClick={handleAbandon}>
                        <FormattedMessage id="act.ADG_MAXWELL.step.validation.buttons.cancel"/>
                    </Button>

                    {!props.readOnly && !isLinkedToParentTicket &&
                        <Button color="primary" className="m-1" id={"cancelADG"}
                                hidden={troubleTicketProcess === MaxwellProcess.PROCESS_OK}
                                onClick={handleResolveActWithoutIncident}
                                disabled={troubleTicketProcess === MaxwellProcess.PROCESS_LOADING}>
                            <FormattedMessage id="act.ADG_MAXWELL.step.validation.buttons.cancelIncident"/>
                        </Button>}

                    {!props.readOnly && <Button color="primary" className="m-1"
                                                hidden={troubleTicketProcess === MaxwellProcess.PROCESS_OK}
                                                disabled={troubleTicketProcess === MaxwellProcess.PROCESS_LOADING}
                                                onClick={handleValidationFromIncidentList}>
                        <FormattedMessage id="act.ADG_MAXWELL.step.validation.buttons.createIncident"/>
                    </Button>}

                    <br/>

                    <Button color="primary" className="m-1" id={"cancelADG"}
                            hidden={troubleTicketProcess !== MaxwellProcess.PROCESS_OK}
                            onClick={handleAbandon} disabled={disableTerminateButton}>
                        <FormattedMessage
                            id="act.ADG_MAXWELL.step.validation.buttons.terminer.text1"/><br/><FormattedMessage
                        id="act.ADG_MAXWELL.step.validation.buttons.terminer.text2"/>
                    </Button>
                </>
            }
            {maxwellCallOrigin === EMaxwellCallOrigin.FROM_ADG &&
                <Button color="primary" className="m-1"
                        onClick={handleValidationFromADG} hidden={troubleTicketProcess === MaxwellProcess.PROCESS_OK}>
                    <FormattedMessage id="act.ADG_MAXWELL.step.validation.buttons.createIncident"/>
                </Button>
            }
        </div>;
    }

    return (
        <React.Fragment>
            {maxwellCallOrigin === EMaxwellCallOrigin.FROM_INCIDENTS_LIST && !showTaskWithoutIncident && tableRenderFromList()}
            {maxwellCallOrigin === EMaxwellCallOrigin.FROM_INCIDENTS_LIST && showTaskWithoutIncident && tableRenderWhenValidationWithoutTicket()}
            {maxwellCallOrigin === EMaxwellCallOrigin.FROM_ADG && tableRenderFromADG()}
            {buttonsRender()}
        </React.Fragment>
    )
}

export default MaxwellValidationStep