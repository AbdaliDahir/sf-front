import * as React from "react";
import ActService from "../../../service/ActService";
import {AntiChurnActResponseDTO} from "../../../model/acts/antichurn/AntiChurnActResponseDTO";
import {AppState} from "../../../store";
import {fetchAndStoreAntiChurnSettings} from "../../../store/actions/AntiChurnAction";
import {connect} from "react-redux";
import {Col, Row} from "reactstrap";
import {FormattedMessage} from "react-intl";
import {translate} from "../../../components/Intl/IntlGlobalProvider";
import Modal from "react-bootstrap/Modal";


interface State {
    isModalOpen: boolean,
    antiChurnData: AntiChurnActResponseDTO | undefined
    actType: string
    actDetail: string
}

interface Props {
    resourceId: string,
    target: string,
    openModal: boolean,
    shutModal: (openModal: boolean) => void,
    antiChurnSettings,
    fetchAndStoreAntiChurnSettings: () => void
}

export class LastAntiChurnModalSpecificIE extends React.Component<Props, State> {

    private actService: ActService = new ActService(true);

    constructor(props: Props) {
        super(props);
        this.state = {
            isModalOpen: this.props.openModal,
            antiChurnData: undefined,
            actType: "",
            actDetail: ""
        }
    }

    public componentDidMount = async () => {
        if (!this.props.antiChurnSettings) {
            await this.props.fetchAndStoreAntiChurnSettings()
        }
        if (this.props.resourceId) {
            const antiChurnData = await this.actService.getActAntiChurn(this.props.resourceId);
            this.setState({
                antiChurnData,
                isModalOpen: this.props.openModal
            });
        }
        this.props.antiChurnSettings.settingMongo
            .filter((clientProposal) => clientProposal.code === this.state.antiChurnData?.antiChurnData?.clientProposal)
            .map((clientProposal) => clientProposal.actType)
            .flat()
            .forEach((actType) => {
                if (actType.code === this.state.antiChurnData?.antiChurnData?.actType) {
                    this.setState({actType: actType.label})
                    if (actType.detail) {
                        actType.detail.forEach((actDetail) => {
                            if (actDetail.code === this.state.antiChurnData?.antiChurnData?.actDetail) {
                                this.setState({actDetail: actDetail.label})
                            }
                        })
                    }
                }
            })
    }

    public async componentDidUpdate(prevProps: Readonly<Props>) {
        if (prevProps.resourceId !== this.props.resourceId) {
            console.warn('check parent store', !this.props.antiChurnSettings)
            if (!this.props.antiChurnSettings) {
                await this.props.fetchAndStoreAntiChurnSettings()
            }
            if (this.props.resourceId) {
                const antiChurnData = await this.actService.getActAntiChurn(this.props.resourceId);
                this.setState({
                    antiChurnData,
                    isModalOpen: this.props.openModal
                });
            }
            this.props.antiChurnSettings.settingMongo
                .filter((clientProposal) => clientProposal.code === this.state.antiChurnData?.antiChurnData?.clientProposal)
                .map((clientProposal) => clientProposal.actType)
                .flat()
                .forEach((actType) => {
                    if (actType.code === this.state.antiChurnData?.antiChurnData?.actType) {
                        this.setState({actType: actType.label})
                        if (actType.detail) {
                            actType.detail.forEach((actDetail) => {
                                if (actDetail.code === this.state.antiChurnData?.antiChurnData?.actDetail) {
                                    this.setState({actDetail: actDetail.label})
                                }
                            })
                        }
                    }
                })
        }
    }

    public toggle = () => {
        this.props.shutModal(!this.props.openModal)
    };

    public render(): JSX.Element {
        if (!this.state.antiChurnData) {
            return <React.Fragment/>
        }
        const {antiChurnData} = this.state.antiChurnData;
        const actType = this.state.actType;
        const actDetail = this.state.actDetail;

        return (
            <Modal show={this.state.isModalOpen} onHide={this.toggle} contentClassName={"vlg"} dialogClassName="vlg">
                <Modal.Header onHide={this.toggle} className={"text-center font-weight-bold test-width"} closeButton>
                    <div className={"text-center font-weight-bold"}><FormattedMessage id={"last.antichurn"}/>
                    </div>
                </Modal.Header>
                <Modal.Body className="last-AntiChurn-ModalSpecificIE__modal-body">{}
                    {antiChurnData ?
                        <Row>
                            <Col>
                                <div className="mb-2">
                                <span className="font-weight-bold">
                                    <FormattedMessage id="acts.antichurn.possibility"/> :</span>
                                    <br/>
                                    {antiChurnData.possibility ? translate.formatMessage({id: antiChurnData.possibility}) : ""}
                                </div>
                                {antiChurnData.clientProposal &&
                                <div className="mb-2">
                                <span className="font-weight-bold">
                                <FormattedMessage id="acts.antichurn.clientProposal"/> :</span>
                                    <br/>
                                    {translate.formatMessage({id: antiChurnData.clientProposal})}
                                </div>
                                }
                                <div className="mb-2">
                                <span className="font-weight-bold">
                                    <FormattedMessage id="acts.antichurn.clientTerminationIntention"/> :</span>
                                    <br/>
                                    {antiChurnData.clientTerminationIntention.code ? "Oui" : "Non"}
                                </div>
                                {antiChurnData.actType &&
                                <div className="mb-2">
                                <span className="font-weight-bold">
                                    <FormattedMessage id="acts.antichurn.actType"/> :</span>
                                    <br/>
                                    {actType}
                                </div>
                                }
                                {antiChurnData.actDetail &&
                                <div className="mb-2">
                                <span className="font-weight-bold">
                                    <FormattedMessage id="acts.antichurn.actDetail"/> :</span>
                                    <br/>
                                    {actDetail}
                                </div>
                                }
                                {antiChurnData.proposalDetail &&
                                <div className="mb-2">
                                <span className="font-weight-bold">
                                    <FormattedMessage id="acts.antichurn.proposalDetail"/> :</span>
                                    <br/>
                                    {antiChurnData.proposalDetail}
                                </div>
                                }
                                {antiChurnData.clientResponse &&
                                <div className="mb-2">
                                <span className="font-weight-bold"><FormattedMessage
                                    id="acts.antichurn.clientResponse"/> :</span>
                                    <br/>
                                    {translate.formatMessage({id: antiChurnData.clientResponse})}
                                </div>
                                }
                                {antiChurnData.proposalMode &&
                                <div className="mb-2">
                                <span className="font-weight-bold"><FormattedMessage
                                    id="acts.antichurn.proposalMode"/> :</span>
                                    <br/>
                                    {translate.formatMessage({id: antiChurnData.proposalMode})}
                                </div>
                                }
                                {antiChurnData.orderReference &&
                                <div className="mb-2">
                                <span className="font-weight-bold"><FormattedMessage
                                    id="acts.antichurn.orderReference"/> :</span>
                                    <br/>
                                    {antiChurnData.orderReference}
                                </div>
                                }
                                {antiChurnData.proposalWithoutCommitment &&
                                <div className="mb-2">
                                <span className="font-weight-bold"><FormattedMessage
                                    id="acts.antichurn.proposalWithoutCommitment"/> :</span>
                                    <br/>
                                    {antiChurnData.proposalWithoutCommitment.label}
                                </div>
                                }
                            </Col>
                        </Row> : <React.Fragment/>}
                </Modal.Body>
            </Modal>
        )
    }
}

const mapStateToProps = (state: AppState) => ({
    antiChurnSettings: state.antiChurn.antiChurnSettings,
});

const mapDispatchToProps = {
    fetchAndStoreAntiChurnSettings
}

export default connect(mapStateToProps, mapDispatchToProps)(LastAntiChurnModalSpecificIE)