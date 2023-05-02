import React, {Component} from 'react';
import {Modal} from "reactstrap";
import Button from "reactstrap/lib/Button";
import ModalBody from "reactstrap/lib/ModalBody";
import ModalFooter from "reactstrap/lib/ModalFooter";
import ModalHeader from "reactstrap/lib/ModalHeader";

interface State {
    isModalOpen: boolean
}

class ClientErrorModal extends Component<object, State> {

    constructor(props) {
        super(props);
        this.state = {
            isModalOpen: true
        }
    }

    public toggleModal = () => {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        })
    };

    public render(): JSX.Element {
        return (
            <Modal isOpen={this.state.isModalOpen}
                   toggle={this.toggleModal}
                   centered={true}
                   backdrop="static">
                <ModalHeader><strong><i className={"icon icon-warning mr-2"}/>Erreur technique</strong></ModalHeader>
                <ModalBody>
                    Un problème technique est survenu lors de la récupération des données client. Il est possible que
                    toutes les fonctions ne soient pas disponibles. <br/>Merci de réessayer dans quelques instants.
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={this.toggleModal} className="center">Fermer</Button>
                </ModalFooter>
            </Modal>
        )
    }
}


export default ClientErrorModal;