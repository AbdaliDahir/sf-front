import * as React from "react";
import Modal from "reactstrap/lib/Modal";
import ModalHeader from "reactstrap/lib/ModalHeader";
import ModalBody from "reactstrap/lib/ModalBody";
import {FormattedMessage} from "react-intl";
import {Row} from "reactstrap";
import Col from "reactstrap/lib/Col";
import ActService from "../../../../service/ActService";
import {ManagementActGingerDTO} from "../../../../model/service/ManagementActGingerDTO";
import Container from "reactstrap/lib/Container";
import {CaseResource} from "../../../../model/CaseResource";
import {format} from "date-fns"


interface Props {
    resource: CaseResource
    openModal: boolean
    shutModal: (openModal: boolean) => void
}

interface State {
    historyModalIsOpen: boolean,
    actDetail: ManagementActGingerDTO
}


export class ActsHistoryGingerModal extends React.Component<Props, State> {

    private actService: ActService = new ActService(false);

    constructor(props: Props) {
        super(props);
        this.state = {
            historyModalIsOpen: this.props.openModal,
            actDetail: {}
        }

    }

    public async componentDidMount() {
        const result = await this.actService.getActsGingerHistory(this.props.resource.id)
        this.setState({actDetail: result,
            historyModalIsOpen: this.props.openModal})

    }

    public async componentDidUpdate(prevProps: Readonly<Props>) {
        if(prevProps.resource !== this.props.resource) {
            const result = await this.actService.getActsGingerHistory(this.props.resource.id)
            this.setState({
                actDetail: result,
                historyModalIsOpen: this.props.openModal
            })
        }

    }

    public toggle = () => {
        this.props.shutModal(!this.props.openModal)
    };

    public render() {
        return (
            <Modal isOpen={this.props.openModal} centered toggle={this.toggle} size={"lg"} className={"text-smaller"}>
                <ModalHeader toggle={this.toggle} className={"text-center font-weight-bold test-width"}>
                    <div className={"text-center font-weight-bold"}><FormattedMessage id={"acts.history.communication.act.title"}/>
                    </div>
                </ModalHeader>
                <ModalBody>
                    <Container>
                        <Row className={"border-bottom  pb-2"}>
                            <Col>
                                <div className={"text-left font-weight-bold"}>
                                    <FormattedMessage id={"acts.history.communication.act.type"}/>
                                </div>
                            </Col>
                            <Col><FormattedMessage id={"act.history.label." + this.props.resource.description}/></Col>
                        </Row>

                        <Row className={"border-bottom  pb-2"}>
                            <Col>
                                <div className={"text-left font-weight-bold"}>
                                    <FormattedMessage id={"acts.history.communication.act.dateEnvoi"}/>
                                </div>
                            </Col>

                            <Col>{format(new Date(this.props.resource.creationDate), "dd/MM/yyyy HH:mm")}</Col>
                        </Row>

                        {this.state.actDetail.media !== 'SMS' &&
                        <Row className={"border-bottom  pb-2"}>
                            <Col>
                                <div className={"text-left font-weight-bold"}>
                                    <FormattedMessage id={"acts.history.communication.act.objet"}/>
                                </div>
                            </Col>
                            <Col>{this.getObject()}</Col>
                        </Row>
                        }

                        <Row className={"border-bottom  pb-2"}>
                            <Col>
                                <div className={"text-left font-weight-bold"}>
                                    <FormattedMessage id={"acts.history.communication.act.media"}/>
                                </div>
                            </Col>
                            <Col>{this.state.actDetail.media}</Col>
                        </Row>

                        <Row className={"border-bottom  pb-2"}>
                            <Col>
                                <div className={"text-left font-weight-bold"}>
                                    <FormattedMessage id={"acts.history.communication.act.destinataire"}/>
                                </div>
                            </Col>
                            <Col>{this.state.actDetail.adresseDest}</Col>
                        </Row>

                        <Row className={"border-bottom  pb-2"}>
                            <Col>
                                <div className={"text-left font-weight-bold"}>
                                    <FormattedMessage id={"acts.history.communication.act.statutEnvoi"}/>
                                </div>
                            </Col>
                            <Col>{this.getStatus()}</Col>
                        </Row>

                        <Row className={"border-bottom  pb-2"}>
                            <Col>
                                <div className={"text-left font-weight-bold"}>
                                    <FormattedMessage id={"acts.history.communication.act.template"}/>
                                </div>
                            </Col>
                            <Col>{this.state.actDetail.templateDescription + ' (' + this.state.actDetail.templateName + ')'}</Col>
                        </Row>

                    </Container>
                </ModalBody>
            </Modal>
        )
    }

    private getStatus() {
        if (this.state.actDetail.ackNetworkCode === "0"){
            return "OK";
        } else if(this.state.actDetail.ackGingerCode === "1000") {
            return "EN COURS";
        } else {
            return "KO";
        }
    }

    private getObject() {
        if (this.state.actDetail.media === 'EMAIL'){
            return this.state.actDetail.objetMessage;
        } else if (this.state.actDetail.media === 'SMS'){
            return this.state.actDetail.templateDescription;
        }

        return null;
    }
}
