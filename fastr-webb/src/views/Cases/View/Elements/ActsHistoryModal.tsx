import * as React from "react";
import Modal from "react-bootstrap/Modal";
import {FormattedMessage} from "react-intl";
import {Row} from "reactstrap";
import Col from "reactstrap/lib/Col";
import ActService from "../../../../service/ActService";
import {ManagementActDTO} from "../../../../model/service/ManagementActDTO";
import Container from "reactstrap/lib/Container";
import * as moment from "moment";
import "../../View/ViewCase.scss"

interface Props {
    actId: string
    openModal: boolean
    shutModal: (openModal: boolean) => void
    actDetailsModalHeader?: object
}

interface State {
    actId: string
    historyModalIsOpen: boolean,
    actDetail: ManagementActDTO
}


export class ActsHistoryModal extends React.Component<Props, State> {

    private actService: ActService = new ActService(false);

    private DATETIME_FORMAT = process.env.REACT_APP_FASTR_DATETIME_FORMAT;

    constructor(props: Props) {
        super(props);
        this.state = {
            actId: this.props.actId,
            historyModalIsOpen: this.props.openModal,
            actDetail: {
                modificationLists: []
            }
        }
    }

    public componentDidMount() {
        this.updateActInformation();
    }

    public componentDidUpdate(prevProps: Props, prevState: State) {
        if (prevProps.actId !== this.props.actId) {
            this.setState({actDetail:{modificationLists:[]}})
            this.updateActInformation();
        }
        if (prevProps.openModal !== this.props.openModal) {
            this.setState({historyModalIsOpen: this.props.openModal});
        }
    }

    public async updateActInformation() {
        this.setState({actId: this.props.actId});
        const result = await this.actService.getActsHistory(this.props.actId)
        this.setState({actDetail: result})
    }

    public toggle = () => {
        this.props.shutModal(!this.props.openModal)
    };

    public render() {
        const reactStringReplace = require('react-string-replace');
        // @ts-ignore
        const {actLabel, actCreationDate} = this.props.actDetailsModalHeader
        return (
            <Modal show={this.props.openModal} onHide={this.toggle} dialogClassName="lg" className={"text-smaller"}>
                <Modal.Header onHide={this.toggle} className={"text-center font-weight-bold test-width"} closeButton>
                    {actLabel &&
                        <div>
                            <span className={"text-center font-weight-bold"}><FormattedMessage id={"acts.history.act.header"}/> : </span>
                            <span className={"text-center font-weight-bold"}><FormattedMessage id={"act.history.label." + actLabel}/> </span>
                            <span className={"text-center font-weight-bold"}>du </span>
                        </div>
                    }
                    {actCreationDate &&
                        <div className={"text-center font-weight-bold"}>&nbsp;{moment(actCreationDate).format(this.DATETIME_FORMAT)}</div>
                    }
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Row className={"border-bottom  pb-2"}>
                            <Col>
                                <div className={"text-left font-weight-bold"}><FormattedMessage
                                    id={"acts.history.act.id"}/>
                                </div>
                                {this.state.actDetail.id}</Col>
                            <Col>
                                <div className={"text-left font-weight-bold"}><FormattedMessage
                                    id={"acts.history.act.origineADG"}/></div>
                                {this.state.actDetail.origineADG}</Col>
                        </Row>
                        <Row className={"border-bottom  pb-2"}>
                            <Col>
                                <div className={"text-left font-weight-bold"}><FormattedMessage
                                    id={"acts.history.act.statutADG"}/></div>
                                {this.state.actDetail.statutADG}</Col>
                            <Col>
                                <div className={"text-left font-weight-bold"}><FormattedMessage
                                    id={"acts.history.act.idDemande"}/></div>
                                {this.state.actDetail.idDemande}</Col>
                        </Row>
                        <Row className={"border-bottom  pb-2"}>
                            <Col>
                                <div className={"text-left font-weight-bold"}><FormattedMessage
                                    id={"acts.history.act.dateCreation"}/></div>
                                {this.state.actDetail.dateCreation}</Col>
                            <Col>
                                <div className={"text-left font-weight-bold"}><FormattedMessage
                                    id={"acts.history.act.idCf"}/></div>
                                {this.state.actDetail.idComptesFacturations}</Col>
                        </Row>
                        <Row className={"border-bottom  pb-2"}>
                            <Col>
                                <div className={"text-left font-weight-bold"}><FormattedMessage
                                    id={"acts.history.act.dateEcheance"}/></div>
                                {this.state.actDetail.dateEcheance}</Col>
                            <Col>
                                <div className={"text-left font-weight-bold"}><FormattedMessage
                                    id={"acts.history.act.dateTraitement"}/></div>
                                {this.state.actDetail.dateTraitement}</Col>
                        </Row>
                        <Row className={"border-bottom  pb-2"}>
                            <Col>
                                <div className={"text-left font-weight-bold"}><FormattedMessage
                                    id={"acts.history.act.idRUM"}/></div>
                                {this.state.actDetail.idRum}</Col>
                            <Col>
                                <div className={"text-left font-weight-bold"}><FormattedMessage
                                    id={"acts.history.act.impacts"}/></div>
                                {this.state.actDetail.impacts}</Col>
                        </Row>

                        <Row className={"border-bottom  pb-2"}>
                            <Col>
                                <div className={"text-left font-weight-bold"}><FormattedMessage
                                    id={"acts.history.act.champ"}/></div>
                            </Col>
                            <Col>
                                <div className={"text-left font-weight-bold"}><FormattedMessage
                                    id={"acts.history.act.oldValue"}/></div>
                            </Col>
                            <Col>
                                <div className={"text-left font-weight-bold"}><FormattedMessage
                                    id={"acts.history.act.newValue"}/></div>
                            </Col>
                        </Row>
                            {this.state.actDetail.modificationLists.map((object, i) =>
                                <Row className={"border-bottom  pb-2"} key={i}>
                                    <Col>{object.champ}</Col>
                                    <Col>{reactStringReplace(object.ancienneValeur, ',', (match, t) => (
                                        <br/>
                                    ))}
                                    </Col>
                                    <Col>{reactStringReplace(object.nouvelleValeur, ',', (match, t) => (
                                        <br/>
                                    ))}
                                    </Col>
                                </Row>
                            )}
                    </Container>
                </Modal.Body>
            </Modal>
        )
    }


}
