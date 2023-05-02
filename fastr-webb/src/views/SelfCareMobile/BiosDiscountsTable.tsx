import * as moment from "moment";
import * as React from "react";
import {connect} from "react-redux";
import {Button} from "reactstrap";
import Table from "reactstrap/lib/Table";
import CardBody from "reactstrap/lib/CardBody";
import Collapse from "reactstrap/lib/Collapse";
import Col from "reactstrap/lib/Col";
import CardHeader from "reactstrap/lib/CardHeader";
import Card from "reactstrap/lib/Card";
import Row from "reactstrap/lib/Row";
import Badge from "reactstrap/lib/Badge";
import {FormattedMessage} from "react-intl";
import {GesteCommercialBios} from "../../model/TimeLine/GesteCommercialBios";
import {translate} from "../../components/Intl/IntlGlobalProvider";
import {AppState} from "../../store";

interface State {
    collapse: boolean
}

interface Props {
    discountMobile: GesteCommercialBios[]
    showGCO: boolean
}

class BiosDiscountsTable extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            collapse: false
        }
    }

    public toggle = () => {
        this.setState(prevState => ({
            collapse: !prevState.collapse,
        }))
    };

    public renderBiosDiscounts() {

        const {discountMobile} = this.props;
        const discountsBiosToDisplay = discountMobile.slice(0, discountMobile.length);
        return (
            <CardBody>
                <Table bordered className="table table-sm mt-2  table-hover text-center">
                    <thead title={translate.formatMessage({id: "note.list"})}>
                    <tr>
                        <th><FormattedMessage id="bios.gestesco.mobile.table.famille"/></th>
                        <th><FormattedMessage id="bios.gestesco.mobile.table.libelle"/></th>
                        <th><FormattedMessage id="bios.gestesco.mobile.table.statut"/></th>
                        <th><FormattedMessage id="bios.gestesco.mobile.table.datedebut"/></th>
                        <th><FormattedMessage id="bios.gestesco.mobile.table.datefin"/></th>
                        <th><FormattedMessage id="bios.gestesco.mobile.table.montant"/></th>
                        <th><FormattedMessage id="bios.gestesco.mobile.table.duree"/></th>
                    </tr>
                    </thead>
                    <tbody>
                    {discountsBiosToDisplay.map((event, index) =>
                        <tr key={index}>
                            <td>{event.libelleFamille ? event.libelleFamille : ''}</td>
                            <td>{event.libelle ? event.libelle : ''}</td>
                            <td>{event.statut ? event.statut : ''}</td>
                            <td>{event.dateDebut ? moment(event.dateDebut).format("DD/MM/YYYY") : ''}</td>
                            <td>{event.dateFinPrevue ? moment(event.dateFinPrevue).format("DD/MM/YYYY") : ''}</td>
                            <td>{event.montant ? event.montant : ''} </td>
                            <td>{event.duree ? event.duree : ''}</td>
                        </tr>
                    )}
                    </tbody>
                </Table>
            </CardBody>
        )
    }

    public render(): JSX.Element {
        const {collapse} = this.state;
        return (
            <Card>
                <CardHeader>
                    <Row>
                        <Col className="align-middle" md={11}>
                            <Badge color="primary" className="m-1"/>
                            <h4><FormattedMessage id="bios.gestesco.mobile.table.title"/>
                            </h4>
                        </Col>
                        <Col md={1}>
                            <Button id="bios.toggle.button.id" color="primary" className="btn-sm p-1" onClick={this.toggle}>
                                <span className="icon-white icon-down p-0"/>
                            </Button>
                        </Col>
                    </Row>
                </CardHeader>
                <Collapse isOpen={!collapse}>
                    {this.renderBiosDiscounts()}
                </Collapse>
            </Card>
        );
    }
}

const mapStateToProps = (state: AppState) => ({showGCO: state.persisted.showGCO})

export default connect(mapStateToProps)(BiosDiscountsTable)
