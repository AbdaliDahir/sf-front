import * as React from "react";
import {FormattedMessage} from "react-intl";
import {Button, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row} from "reactstrap";
import {Address} from "../../../../model/person";
import Table from "reactstrap/lib/Table";
import Label from "reactstrap/lib/Label";
import {translate} from "../../../../components/Intl/IntlGlobalProvider";

interface Props {
    standardizedAddressesFromFflint: Address[],
    modal: boolean
    toggle: () => void
    setNewSelectedAddress: (address: Address, normalisee: boolean) => void
    addressToStandardize: Address
}

interface State {
    selectedStandardAddress: Address,
    normalisee: boolean
    canBeSubmitted: boolean
}

export default class StandardizedAddressModal extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            selectedStandardAddress: this.props.addressToStandardize,
            normalisee: false,
            canBeSubmitted: false
        }
    }


    public getSelectedAddress = (addressFromWs: Address, normaliseeByUser: boolean) => () => {
        addressFromWs.countryCode = this.props.addressToStandardize.countryCode;
        this.setState({selectedStandardAddress: addressFromWs, normalisee: normaliseeByUser, canBeSubmitted: true});
    };

    public getAddressListTable(): JSX.Element[] {
        const {standardizedAddressesFromFflint} = this.props;
        return (standardizedAddressesFromFflint.map((address, index) =>
            <tr key={index}>
                <td>
                    <input className="mr-1" type="radio" title={translate.formatMessage({id:"select.to.modify"})} name="radAnswer"
                           onClick={this.getSelectedAddress(address, true)}/>
                </td>
                <td className="w-50">{address.address1} {address.postalBox !== undefined ? " / " + address.postalBox : ""}</td>
                <td>{address.zipcode}</td>
                <td>{address.city}</td>
            </tr>
        ))

    }

    public submitSelectedAddress = () => {
        const {selectedStandardAddress, normalisee} = this.state;
        this.setState({canBeSubmitted: false});
        this.props.setNewSelectedAddress(selectedStandardAddress, normalisee);
    };

    public render(): JSX.Element {
        const {modal, toggle, addressToStandardize} = this.props;
        const {canBeSubmitted} = this.state;
        return (
            <Modal isOpen={modal} toggle={toggle} backdrop="static">
                <ModalHeader><h4>selection de l'adresse</h4></ModalHeader>
                <ModalBody>
                    <Table bordered responsive
                           className="w-100 mt-1 table-hover table-sm">
                        <thead>
                        <tr>
                            <th/>
                            <th data-sortable="true">No libelle voie/lieu dit/BP</th>
                            <th data-sortable="true">CP</th>
                            <th data-sortable="true">Ville</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.getAddressListTable()}
                        </tbody>
                    </Table>

                    <br/>

                    <Label><FormattedMessage id="act.address.not.standardized"/> </Label>
                    <Table bordered responsive className="w-100 mt-1 table-hover table-sm">
                        <tbody>
                        <tr>
                            <td><input className="m-0 p-0" type="radio" title={translate.formatMessage({id: "Select to edit"})}
                                       name="radAnswer"
                                       onClick={this.getSelectedAddress(addressToStandardize, false)}/></td>
                            <td>
                                {addressToStandardize.address1} {addressToStandardize.postalBox !== undefined ? " " + addressToStandardize.postalBox : ""}
                                {addressToStandardize.zipcode}
                                {" " + addressToStandardize.city}</td>
                        </tr>
                        </tbody>
                    </Table>

                </ModalBody>
                <ModalFooter>
                    <Row>
                        <Col className="text-right">
                            <Button id="stdAddressModal.cancel.button.id" color="primary" onClick={toggle}>
                                <FormattedMessage id="cases.create.cancel"/></Button>
                            <Button id="stdAddressModal.submit.button.id" className="ml-3" color="primary" type="submit" onClick={this.submitSelectedAddress}
                                    disabled={!canBeSubmitted}>
                                <FormattedMessage id="cases.button.submit"/></Button>

                        </Col>
                    </Row>
                </ModalFooter>
            </Modal>
        )
    }
}