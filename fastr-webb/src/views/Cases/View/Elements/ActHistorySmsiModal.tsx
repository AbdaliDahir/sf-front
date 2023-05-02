import * as React from "react";
import Modal from "react-bootstrap/Modal";
import {CaseResource} from "../../../../model/CaseResource";
import {FormattedMessage} from "react-intl";
import ActService from "../../../../service/ActService";

import ScenarioDataSummary from "../../List/Elements/ScenarioDataSummary";
import ModalBody from "reactstrap/lib/ModalBody";
// @ts-ignore
import {ScenarioActDTO} from '../../../../model/scenario/ScenarioActDTO';



interface Props {
    resource: CaseResource
    openModal: boolean
    shutModal: (openModal: boolean) => void
}

interface State {
    historyModalIsOpen: boolean
    actDetail?: ScenarioActDTO
}

export class ActsHistorySmsiModal extends React.Component<Props, State> {

    private actService: ActService = new ActService(true);

    constructor(props: Props) {
        super(props);
        this.state = {
            historyModalIsOpen: this.props.openModal
        }
    }
    public async componentDidMount() {
        this.updateActInformation();
    }
    public componentDidUpdate(prevProps: Props, prevState: State) {
        if (prevProps.resource.id !== this.props.resource.id) {
            this.setState({actDetail: undefined})
            this.updateActInformation();
        }
        if (prevProps.openModal !== this.props.openModal) {
            this.setState({historyModalIsOpen: this.props.openModal});
        }
    }

    public async updateActInformation() {
        const result = await this.actService.getActSmsi(this.props.resource.id)
        this.setState({actDetail: result})
    }


    public toggle = () => {
        this.props.shutModal(!this.props.openModal)
    };

    public render() {
        return (
            <Modal show={this.props.openModal} onHide={this.toggle} dialogClassName="lg" className={"text-smaller"}>
                <Modal.Header closeButton onHide={this.toggle} className={"border-bottom"}   style={{ backgroundColor: "#E8E8E8" }}>
                    <span className="icon-gradient font-size-xl icon-conversations mr-2"/> <h4><FormattedMessage id={"acts.history.communication.smsi.title"}/></h4>
                </Modal.Header>
                <ModalBody>
                    {this.state.actDetail ?
                        <ScenarioDataSummary scenarioActDTO={this.state.actDetail} creationDate={this.props.resource?.creationDate} />
                        :<React.Fragment/>}
                </ModalBody>
            </Modal>
        )
    }
}
