import * as React from "react";
import Modal from "react-bootstrap/Modal";
import {CaseResource} from "../../../../model/CaseResource";
import {FormattedMessage} from "react-intl";
import "../../List/Elements/DuplicateBillingsSummary.scss"
import * as moment from "moment";

interface Props {
    resource: CaseResource
    openModal: boolean
    shutModal: (openModal: boolean) => void
    caseId?: string
}

interface State {
    historyModalIsOpen: boolean,
    actDetail?
}


export class InvalidActsHistoryModal extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            historyModalIsOpen: this.props.openModal
        }

    }

    public componentDidUpdate(prevProps: Props, prevState: State) {
        if (prevProps.openModal !== this.props.openModal) {
            this.setState({historyModalIsOpen: this.props.openModal});
        }
    }

    public toggle = () => {
        this.props.shutModal(!this.props.openModal)
    };

    public renderModalHeader = () => {
        return <Modal.Header onHide={this.toggle}
                             className={"text-center font-weight-bold test-width duplicate-billings-summary-header"}
                             closeButton>
            <div className={"text-center font-weight-bold"}><FormattedMessage
                id={"act.title.".concat(this.props.resource?.description)}/>
            </div>
        </Modal.Header>
    }

    public renderModalBody = () => {
        const DATETIME_FORMAT = process.env.REACT_APP_FASTR_DATETIME_FORMAT;
        return <div className={"ml-3 font-weight-bold error-text"}>
            <FormattedMessage
                id={"acts.history.adg.fixe.modal.act.creation.error"}/> {this.props.resource?.failureReason } ({moment(this.props.resource?.creationDate).format(DATETIME_FORMAT)})
        </div>
    }

    public render() {
        return (
            <Modal show={this.props.openModal} onHide={this.toggle} dialogClassName="lg" className={"text-smaller"}>
                {this.renderModalHeader()}
                <Modal.Body>
                    {this.renderModalBody()}
                </Modal.Body>
            </Modal>
        )
    }
}
