import * as React from "react";
import Modal from "react-bootstrap/Modal";
import {FormattedMessage} from "react-intl";
import {Row} from "reactstrap";
import ActService from "../../../../service/ActService";
import "../../View/ViewCase.scss"
import "../../View/Elements/ActsHistoryWebsapModal.scss"
import {WebsapActResponseDTO} from "../../../../model/acts/websap/WebsapActResponseDTO";

interface Props {
    actId: string // ACTID in mongo
    openModal: boolean
    shutModal: (openModal: boolean) => void
    date,
    functionalActId
}

interface State {
    actId: string
    historyModalIsOpen: boolean,
    actOk: boolean,
    dateToDisplay,
    elementsToDisplay?:JSX.Element[]
}


export class ActsHistoryWebsapModal extends React.Component<Props, State> {

    private actService: ActService = new ActService(false);

    constructor(props: Props) {
        super(props);
        this.state = {
            actId: this.props.actId,
            historyModalIsOpen: this.props.openModal,
            dateToDisplay:"",
            actOk: false
        }
    }

    public componentDidMount() {
        this.updateActInformation();
    }

    public componentDidUpdate(prevProps: Props, prevState: State) {
        if (prevProps.actId !== this.props.actId) {
            this.updateActInformation();
        }
        if (prevProps.openModal !== this.props.openModal) {
            this.setState({historyModalIsOpen: this.props.openModal});
        }
    }

    public async updateActInformation() {
        const elementsToDisplay:JSX.Element[]= [];
        this.setState({actId: this.props.actId});
        const result:WebsapActResponseDTO = await this.actService.getActWebsap(this.props.actId)
        Object.keys(result.websapData.formElementsDataObject).forEach((key)=>{
            elementsToDisplay.push(
                <Row><label>{key}</label>: {result.websapData.formElementsDataObject[key]}</Row>
            )
        });
        const dateToformat = new Date(this.props.date);
        this.setState({
            actOk: result.websapData.actOk,
            elementsToDisplay: elementsToDisplay,
            dateToDisplay: dateToformat.toLocaleDateString('fr',{hour:'numeric',minute:'numeric'})
        });
    }

    public toggle = () => {
        this.props.shutModal(!this.props.openModal)
    };

    public render() {
        // const reactStringReplace = require('react-string-replace');
        const {actOk, elementsToDisplay, dateToDisplay} = this.state;
        return (
            <Modal show={this.props.openModal} onHide={this.toggle}dialogClassName="lg" className={"text-smaller"}>
                <Modal.Header onHide={this.toggle} className={"text-center font-weight-bold test-width"} closeButton>
                    <div className={"text-center font-weight-bold"}><FormattedMessage id={"acts.history.act.title"}/>
                    </div>
                </Modal.Header>
                <Modal.Body className="acts-history-websap-modal__modal-body">
                    <Row>
                        <label><FormattedMessage id={"acts.history.websap.modal.act.type"}/></label> <FormattedMessage id={"act.history.label."+this.props.functionalActId}/>
                    </Row>
                    <Row>
                        <label><FormattedMessage id={"acts.history.websap.modal.act.date"}/></label>{dateToDisplay}
                    </Row>
                    <Row>
                        <label><FormattedMessage id={"acts.history.websap.modal.act.realise"}/></label> {actOk?"Oui":"Non"}
                    </Row>
                    {elementsToDisplay}
                </Modal.Body>
            </Modal>
        )
    }


}
