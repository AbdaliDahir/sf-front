import * as React from "react";
import Loader from "react-loaders";


import {connect} from "react-redux";

import Col from "reactstrap/lib/Col";
import Modal from "reactstrap/lib/Modal";
import ModalBody from "reactstrap/lib/ModalBody";

import ModalHeader from "reactstrap/lib/ModalHeader";
import Row from "reactstrap/lib/Row";
import {MaxwellProcess} from "../../../model/enums/MaxwellProcess";
import {TicketCreationState} from "../../../model/TicketCreationState";
import {AppState} from "../../../store";
import {FormattedMessage} from "react-intl"


import {
    closeMaxwellModal,
    openMaxwellModal

} from "../../../store/actions/CasePageAction";

import {Payload} from "./CreateCasePage";


interface Props {
    payload: Payload
    ticketCreationProcess: TicketCreationState
    uploadingFilesProcess: MaxwellProcess
    maxwellCaseCreationProcess: MaxwellProcess
    idCase: string
    maxwellModalOpen: boolean
    canBeClosed: boolean
    openMaxwellModal: () => void
    closeMaxwellModal: () => void

}


class ModalMaxwell extends React.Component<Props> {

    constructor(props: Props) {
        super(props);
    }

    public toggle = () => {
        if (this.props.canBeClosed) {
            this.props.maxwellModalOpen ? this.props.closeMaxwellModal() : this.props.openMaxwellModal()
        }
    };


    public renderProcessResult(process: MaxwellProcess): JSX.Element {
        if (process === MaxwellProcess.PROCESS_LOADING) {
            return (
                <Loader active type="ball-pulse" color="#da3832"/>
            )
        }
        else if (process === MaxwellProcess.PROCESS_OK) {
            return (
                <span className="icon icon-check"/>
            )
        }
        else if (process === MaxwellProcess.PROCESS_KO) {
            return (
                <span className="icon icon-close"/>
            )
        }
        else {
            return <React.Fragment/>
        }
    }


    public renderID(id: string): JSX.Element {
        return (
            <React.Fragment>
                <span className={"font-weight-bold"}>
                 N° {id}
                </span>
            </React.Fragment>
        )
    }


    public render(): JSX.Element {

        const {ticketCreationProcess} = this.props
        const {uploadingFilesProcess} = this.props
        const {maxwellCaseCreationProcess} = this.props

        const caseId = this.props.payload.idCase ? this.props.payload.idCase : this.props.idCase
        const msgStyle = {
            color: 'red',
        }
        return (
            <Modal isOpen={this.props.maxwellModalOpen} size="lg" centered
                   toggle={this.toggle}
                   onEscapeKeyDown={this.toggle}>
                <ModalHeader toggle={this.toggle} className={"border-bottom>"}>
                    <h5><FormattedMessage
                        id="cases.maxwell.modal.title"/></h5>
                </ModalHeader>
                <ModalBody>
                    <Row className={"border-bottom text-center pb-3 pt-3"}>
                        <Col md="6" className={"border-right"}>
                            <h6><FormattedMessage
                                id="cases.maxwell.modal.ticket.creation.msg"/></h6>
                        </Col>
                        <Col md="3" className={"border-right"}>
                            {this.renderProcessResult(ticketCreationProcess.state)}
                        </Col>
                        <Col md="3">
                            {ticketCreationProcess.idTicket !== "" ? this.renderID(ticketCreationProcess.idTicket) : ""}
                        </Col>
                    </Row>
                    <Row className={"text-center border-bottom  pb-3 pt-3"}>
                        <Col md="6" className={"border-right"}>
                            <h6><FormattedMessage
                                id="cases.maxwell.modal.creation.msg"/></h6>
                        </Col>
                        <Col md="3" className={"border-right"}>
                            {this.renderProcessResult(maxwellCaseCreationProcess)}
                        </Col>
                        <Col md="3">
                            {maxwellCaseCreationProcess === MaxwellProcess.PROCESS_OK ? this.renderID(caseId) : ""}
                        </Col>
                    </Row>
                    <Row className={"border-bottom text-center pb-3 pt-3"}>
                        <Col md="6" className={"border-right"}>
                            <h6><FormattedMessage
                                id="cases.maxwell.modal.upload.msg"/></h6>
                        </Col>
                        <Col md="3" className={"border-right"}>
                            {this.renderProcessResult(uploadingFilesProcess)}
                        </Col>
                        <Col md="3"/>
                    </Row>
                    <Row className={"text-center pb-3 pt-5"}>
                        <Col style={msgStyle}>
                            {ticketCreationProcess.state === MaxwellProcess.PROCESS_KO ?
                                <FormattedMessage
                                    id="case.maxwell.ko.msg"/> :
                                <React.Fragment/>
                            }
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>

        );
    }
}


const mapStateToProps = (state: AppState) => ({
    ticketCreationProcess: state.casePage.ticketCreationProcess,
    uploadingFilesProcess: state.casePage.uploadingFilesProcess,
    maxwellCaseCreationProcess: state.casePage.maxwellCaseCreationProcess,
    maxwellModalOpen: state.casePage.maxwellModalOpen,
});


const mapDispatchToProps = {
    openMaxwellModal,
    closeMaxwellModal
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalMaxwell)
