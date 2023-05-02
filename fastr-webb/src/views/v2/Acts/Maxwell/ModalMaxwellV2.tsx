import React from "react";
import {FormattedMessage} from "react-intl";
import Row from "reactstrap/lib/Row";
import Col from "reactstrap/lib/Col";
import {MaxwellProcess} from "../../../../model/enums/MaxwellProcess";
import Loader from "react-loaders";
import {useDispatch, useSelector} from "react-redux";
import {AppState} from "../../../../store";
import ModalBody from "reactstrap/lib/ModalBody";
import ModalHeader from "reactstrap/lib/ModalHeader";
import Modal from "reactstrap/lib/Modal";
import {setCanNotOpenMaxwellModal} from "../../../../store/actions/v2/case/CaseActions";
import {EMaxwellCallOrigin} from "../../../../model/maxwell/enums/EMaxwellCallOrigin";
import {TroubleTicketResponse} from "../../../../model/TroubleTicketResponse";
import {Button} from "reactstrap";

const ModalMaxwellV2 = (props) => {
    const dispatch = useDispatch();
    const troubleTicketResponse: TroubleTicketResponse = useSelector((state: AppState) => state.store.cases.casesList[props.caseId].maxwellIncident.troubleTicketResponse)
    const troubleTicketProcess: MaxwellProcess = useSelector((state: AppState) => state.store.cases.casesList[props.caseId].maxwellIncident?.troubleTicketProcess)
    const uploadFilesProcess: MaxwellProcess = useSelector((state: AppState) => state.store.cases.casesList[props.caseId].maxwellIncident?.UploadFilesProcess)
    const createOrUpdateADGProcess: MaxwellProcess = useSelector((state: AppState) => state.store.cases.casesList[props.caseId].maxwellIncident?.createOrUpdateADGProcess)
    const canOpenMaxwellModal: boolean = useSelector((state: AppState) => state.store.cases.casesList[props.caseId]?.maxwellIncident?.canOpenMaxwellModal)
    const lastSavedMaxwellActId: EMaxwellCallOrigin = useSelector((state: AppState) => state.store.cases.casesList[props.caseId]?.maxwellIncident?.lastSavedMaxwellActId)
    const payload : any = useSelector((state: AppState) => state.payload.payload);

    const renderProcessResult = (process: MaxwellProcess): JSX.Element => {
        switch (process) {
            case MaxwellProcess.PROCESS_LOADING:
                return <Loader active type="ball-pulse" color="#da3832"/>;
            case MaxwellProcess.PROCESS_OK:
                return <span className="icon icon-check"/>
            case MaxwellProcess.PROCESS_KO:
                return  <span className="icon icon-close"/>
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

    function tableRender() {
        return <div className={"pb-1 pt-1 pr-3 pl-3"}>
            {
                payload?.refCTT ?
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
                    :
                    <></>
            }
            <Row className={"text-center border-bottom  pb-3 pt-3"}>
                <Col md="6" className={"border-right"}>
                    <h6><FormattedMessage
                        id="act.ADG_MAXWELL.step.validation.saveIncidentProcess.creation"/></h6>
                </Col>
                <Col md="3" className={"border-right"}>
                    {renderProcessResult(createOrUpdateADGProcess)}
                </Col>
                <Col md="3">
                    {createOrUpdateADGProcess === MaxwellProcess.PROCESS_OK ? renderID(lastSavedMaxwellActId) : ""}
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
                    {uploadFilesProcess === MaxwellProcess.PROCESS_OK ? renderID(lastSavedMaxwellActId) : ""}
                </Col>
            </Row>
        </div>;
    }


    const toggle = () => {
        if (uploadFilesProcess !== MaxwellProcess.PROCESS_TO_VALIDATE && createOrUpdateADGProcess !== MaxwellProcess.PROCESS_TO_VALIDATE) {
            dispatch(setCanNotOpenMaxwellModal(props.caseId))
        }
    }

    if (payload?.refCTT) {
        return (
            <React.Fragment>
                <Modal isOpen={canOpenMaxwellModal}
                       toggle={toggle} onEscapeKeyDown={toggle}
                       size="lg" centered backdrop={"static"}>
                    <ModalHeader toggle={toggle} className={"border-bottom>"}>
                        <h5><FormattedMessage
                            id="cases.maxwell.modal.title"/></h5>
                        <Button id={"cases.create.cancel"} color="light"
                            onClick={props.cancelCase}
                            disabled={troubleTicketProcess !== MaxwellProcess.PROCESS_KO && troubleTicketProcess !== MaxwellProcess.PROCESS_IGNORED}>
                            <FormattedMessage id="cases.create.cancel"/>
                        </Button>
                        <Button id={"act.QA_ADG_MAXWELL.step.button.retry"} color="primary"
                                onClick={props.updateCase}
                                disabled={troubleTicketProcess !== MaxwellProcess.PROCESS_KO && troubleTicketProcess !== MaxwellProcess.PROCESS_IGNORED}>
                            <FormattedMessage id="act.QA_ADG_MAXWELL.step.button.retry"/>
                        </Button>
                    </ModalHeader>
                    <ModalBody>
                        {tableRender()}
                    </ModalBody>
                </Modal>
            </React.Fragment>
        )
    } else {
        return (
            <React.Fragment>
                <Modal isOpen={canOpenMaxwellModal} toggle={toggle} onEscapeKeyDown={toggle} size="lg" centered>
                    <ModalHeader toggle={toggle} className={"border-bottom>"} >
                        <h5><FormattedMessage
                            id="cases.maxwell.modal.title"/></h5>
                    </ModalHeader>
                    <ModalBody>
                        {tableRender()}
                    </ModalBody>
                </Modal>
            </React.Fragment>
        )
    }
}

export default ModalMaxwellV2