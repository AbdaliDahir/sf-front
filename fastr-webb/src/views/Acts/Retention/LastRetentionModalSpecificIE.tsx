import * as React from "react";
import Modal from "react-bootstrap/Modal";
import ActService from "../../../service/ActService";
import {RetentionActResponseDTO} from "../../../model/acts/retention/RetentionActResponseDTO";
import {FormattedMessage} from "react-intl";
import {Col, Row} from "reactstrap";
import {translate} from "../../../components/Intl/IntlGlobalProvider";
import "./LastRetentionModalSpecificIE.scss"


interface Props {
    resourceId: string,
    openModal: boolean,
    shutModal: (openModal: boolean) => void
}

interface State {
    isModalOpen: boolean,
    datas: RetentionActResponseDTO | undefined
}

export class LastRetentionModalSpecificIE extends React.Component<Props, State> {

    private actService: ActService = new ActService(true);

    constructor(props: Props) {
        super(props);
        this.state = {
            datas: undefined,
            isModalOpen: this.props.openModal,
        }
    }

    public componentDidMount = async () => {
        const retentionData = await this.actService.getActRetention(this.props.resourceId);
        this.setState({
            datas: retentionData,
            isModalOpen: this.props.openModal
        });
    };

    public async componentDidUpdate(prevProps: Readonly<Props>) {
        if(prevProps.resourceId !== this.props.resourceId) {
            const retentionData = await this.actService.getActRetention(this.props.resourceId);
            this.setState({
                datas: retentionData,
                isModalOpen: this.props.openModal
            });
        }

    }

    public toggle = () => {
        this.props.shutModal(!this.props.openModal)
    };

    public render() {
        // @ts-ignore
        //const {retentionData} = this.state.retentionData
        return (
            <Modal show={this.state.isModalOpen} onHide={this.toggle} contentClassName={"vlg"} dialogClassName="vlg">
                <Modal.Header onHide={this.toggle} className={"text-center font-weight-bold test-width"} closeButton>
                    <div className={"text-center font-weight-bold"}><FormattedMessage id={"acts.history.act.title"}/>
                    </div>
                </Modal.Header>
                <Modal.Body className="last-Retention-ModalSpecificIE__modal-body">
                    {this.state.datas ?
                        <Row>
                            <Col>
                                <div className="mb-2">
                                <span className="font-weight-bold"><FormattedMessage
                                    id="acts.retention.intention"/> :</span>
                                    <br/>
                                    {this.state.datas.retentionData.intentionByClient ? "Oui" : "Non"}
                                </div>
                                <div className="mb-2">
                                <span className="font-weight-bold"><FormattedMessage
                                    id="acts.retention.isOutPerimeter"/> :</span>
                                    <br/>
                                    {this.state.datas.retentionData.outOfPerim ? "Oui" : "Non"}
                                </div>
                                {this.state.datas.retentionData.motif &&
                                    <div className="mb-2">
                                    <span className="font-weight-bold"><FormattedMessage
                                        id="retentionDataForm.motifAppel"/> :</span>
                                        <br/>
                                        {this.state.datas.retentionData.motif.label}
                                    </div>
                                }
                                {this.state.datas.retentionData.sousMotif &&
                                    <div className="mb-2">
                                    <span className="font-weight-bold"><FormattedMessage
                                        id="retentionDataForm.sousMotifAppel"/> :</span>
                                        <br/>
                                        {this.state.datas.retentionData.sousMotif.label}
                                    </div>
                                }
                                <div className="mb-2">
                                <span className="font-weight-bold"><FormattedMessage
                                    id="acts.retention.eligibility"/> :</span>
                                    <br/>
                                    {this.state.datas.retentionData.eliRetention ? "Oui" : "Non"}
                                </div>
                                {this.state.datas.retentionData.proposal &&
                                    <div>
                                        <span className="font-weight-bold"><FormattedMessage id="acts.retention.proposal"/> :</span>
                                        <br/>
                                        {translate.formatMessage({id: this.state.datas.retentionData.proposal})}
                                    </div>
                                }
                            </Col>
                            <Col>
                                {this.state.datas.retentionData.proposalDetail &&
                                    <div className="mb-2">
                                    <span className="font-weight-bold"><FormattedMessage
                                        id="acts.retention.proposal.detail"/> :</span>
                                            <br/>
                                            {translate.formatMessage({id: this.state.datas.retentionData.proposalDetail})}
                                        </div>
                                }
                                <div className="mb-2">
                                <span className="font-weight-bold"><FormattedMessage
                                    id="acts.retention.order.reference"/> :</span>
                                    <br/>
                                    {this.state.datas.retentionData.refCommande}
                                </div>
                                {this.state.datas.retentionData.clientAnswer &&
                                    <div className="mb-2">
                                    <span className="font-weight-bold"><FormattedMessage
                                        id="acts.retention.clientAnswer"/> :</span>
                                        <br/>
                                        {translate.formatMessage({id: this.state.datas.retentionData.clientAnswer})}
                                    </div>
                                }
                                {this.state.datas.retentionData.motifRefus &&
                                    <div className="mb-2">
                                    <span className="font-weight-bold"><FormattedMessage
                                        id="retentionDataForm.motifRefus"/> :</span>
                                        <br/>
                                        {this.state.datas.retentionData.motifRefus.label}
                                    </div>
                                }
                                {this.state.datas.retentionData.sousMotifRefus &&
                                    <div className="mb-2">
                                    <span className="font-weight-bold"><FormattedMessage
                                        id="retentionDataForm.sousMotifRefus"/> :</span>
                                        <br/>
                                        {this.state.datas.retentionData.sousMotifRefus.label}
                                    </div>
                                }
                                {this.state.datas.retentionData.proposalWithoutCommitment &&
                                <div className="mb-2">
                                    <span className="font-weight-bold"><FormattedMessage
                                        id="acts.retention.proposalWithoutCommitment"/> :</span>
                                    <br/>
                                    {this.state.datas.retentionData.proposalWithoutCommitment.label}
                                </div>
                                }
                                <div>
                                <span className="font-weight-bold"><FormattedMessage
                                    id="acts.retention.isAdressResil"/> :</span>
                                    <br/>
                                    {this.state.datas.retentionData.adressResil ? "Oui" : "Non"}
                                </div>
                            </Col>
                        </Row> : <React.Fragment/>}
                </Modal.Body>
            </Modal>
        )
    }


}