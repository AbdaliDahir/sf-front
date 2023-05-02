import * as React from "react";
import Modal from "react-bootstrap/Modal";
import { FormattedMessage } from "react-intl";
import ModalBody from "reactstrap/lib/ModalBody";
import { AppState } from "../../../../store";
import { connect } from "react-redux";
import { HistoRapideSetting } from "../../../../model/HistoRapideSetting";
import "./HistoRapideModal.scss";
import HistoRapideButtons from "./HistoRapide/HistoRapideButtons";

interface Props {
    caseId
    isModalOpen: boolean
    initCase
    shutModal: () => void
    histoRapideSettings: HistoRapideSetting[]
}

class HistoRapideModal extends React.Component<Props> {

    constructor(props: Props) {
        super(props);

    }

    public toggle = () => {
        this.props.shutModal()
    };

    public render() {
        return (
            <Modal show={this.props.isModalOpen} onHide={this.toggle} contentClassName={"vlg"} dialogClassName="vlg">
                <Modal.Header closeButton onHide={this.toggle} className={"border-bottom"}
                    style={{ backgroundColor: "#E8E8E8" }}>
                    <span className="icon-gradient font-size-xl icon-conversations mr-2" />
                    <h4><FormattedMessage id={"cases.list.recent.histo.rapide"} /></h4>
                </Modal.Header>
                <ModalBody className="histo-rapide__modal-body">
                    {
                        this.props.histoRapideSettings && <HistoRapideButtons histoRapideSettings={this.props.histoRapideSettings} handleClick={this.handleClick} />
                    }
                </ModalBody>
            </Modal>
        )
    }

    private handleClick = (event) => {
        this.props.initCase(event);
        this.toggle();
    }

}

const mapStateToProps = (state: AppState) => ({
    histoRapideSettings: state.store.applicationInitialState.histoRapideSettings
})

export default connect(mapStateToProps, {})(HistoRapideModal)
