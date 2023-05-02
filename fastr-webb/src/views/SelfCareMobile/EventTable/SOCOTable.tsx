import * as React from "react";
import {connect} from "react-redux";
import {Button} from "reactstrap";
import Modal from "reactstrap/lib/Modal";
import ModalHeader from "reactstrap/lib/ModalHeader";
import Table from "reactstrap/lib/Table";
import CardBody from "reactstrap/lib/CardBody";
import Collapse from "reactstrap/lib/Collapse";
import Col from "reactstrap/lib/Col";
import CardHeader from "reactstrap/lib/CardHeader";
import Card from "reactstrap/lib/Card";
import Row from "reactstrap/lib/Row";
import Badge from "reactstrap/lib/Badge";
import {FormattedMessage} from "react-intl";
import {translate} from "../../../components/Intl/IntlGlobalProvider";
import {SOCO} from "../../../model/TimeLine/SOCO";
import * as moment from "moment"
import {AppState} from "../../../store";
import Iframe from 'react-iframe'
import './SOCOTable.scss';

interface State {
    collapse: boolean
    iframeURL: string
    modal: boolean
}

interface Props {
    commercialSolicitation: SOCO | undefined
    authorizations: Array<string>
    showSOCO: boolean
}

class SOCOTable extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            collapse: true,
            iframeURL: "",
            modal: false
        }
    }

    public toggle = () => {
        this.setState(prevState => ({
            collapse: !prevState.collapse,
        }))
    }

    // tslint:disable-next-line:no-any
    public popup = (event: any) => {
        // window.open(event.currentTarget.id, "_blank", "menubar=no,location=no,resizable=no,scrollbars=yes,status=yes, modal=yes")
        this.setState({iframeURL: event.currentTarget.id, modal: true})
    }

    public renderSms = (event: any) => {
        return (
            <React.Fragment>
                <span className="font-weight-bold"><FormattedMessage id={"sms.commercial.offer"} /></span>: {event.offreCom}<br />
                <span className="font-weight-bold"><FormattedMessage id={"sms.object"} /></span>: {event.object}
            </React.Fragment>
        );
    }

    public renderSOCO() {
        const {commercialSolicitation} = this.props;
        // TODO: faire le typage
        // tslint:disable-next-line:no-any
        let SOCOToDisplay: any[] = []
        SOCOToDisplay = SOCOToDisplay.concat(commercialSolicitation?.emails ? commercialSolicitation.emails : []);
        SOCOToDisplay = SOCOToDisplay.concat(commercialSolicitation?.sms ? commercialSolicitation.sms : []);
        SOCOToDisplay.sort((a, b): number => moment(a.sendDate).valueOf() - moment(b.sendDate).valueOf());

        // TODO SORT BY DATE
        if (SOCOToDisplay.length>0) {
            return (
                <CardBody>
                    <Table bordered className="table table-sm mt-2 table-hover text-center">
                        <thead title={translate.formatMessage({id: "note.list"})}>
                        <tr>
                            <th className="align-middle"><FormattedMessage id="send.date"/></th>
                            <th className="align-middle"><FormattedMessage id="mail.sms.content"/></th>
                            <th className="align-middle"><FormattedMessage id="media"/></th>
                            <th className="align-middle"><FormattedMessage id="target"/></th>
                            <th className="align-middle"><FormattedMessage id="content"/></th>
                        </tr>
                        </thead>
                        <tbody>
                        {SOCOToDisplay.map((event, index) => (
                                <tr key={index}>
                                    <td className="align-middle">{event.sendDate ? moment(event.sendDate).format("DD/MM/YYYY") : ''}</td>
                                    <td className="align-middle">{event.subject ? event.subject : this.renderSms(event)}</td>
                                    <td className="align-middle">{event.type === "email" ? "Mail" : "SMS"}</td>
                                    <td className="align-middle">{event.type === "email" ? event.recipientEmail : event.recipient}</td>
                                    <td className="align-middle">{event.type === "email" ?
                                        <span className="background-magnifying-glass" id={event.url.toString()}
                                              onClick={this.popup}><span
                                            className="icon-white icon-search "/></span> : ""}</td>
                                </tr>
                            )
                        )}
                        </tbody>
                    </Table>
                </CardBody>
            )
        } else {
            return (
                <CardBody>
                    <Table bordered className="table table-sm mt-2 table-hover text-center">
                        <thead title={translate.formatMessage({id: "note.list"})}>
                        <tr>
                            <th><FormattedMessage id="send.date"/></th>
                            <th><FormattedMessage id="mail.sms.content"/></th>
                            <th><FormattedMessage id="media"/></th>
                            <th><FormattedMessage id="target"/></th>
                            <th><FormattedMessage id="content"/></th>
                        </tr>
                        </thead>
                    </Table>
                </CardBody>
            )
        }
    }

    public toggleModale = () => {
        this.setState(prevState => ({
            modal: !prevState.modal
        }))
    };

    public render(): JSX.Element {
        const {collapse} = this.state;
        if (this.props.authorizations && this.props.authorizations.indexOf('is_access_SOCO') > -1) {
            return (
                <div>
                    <Card>
                        <CardHeader>
                            <Row>
                                <Col className="align-middle" md={11}>
                                    <Badge color="primary" className="m-1"/>
                                    <h4><FormattedMessage id="bios.soco.mobile.table.title"/>
                                    </h4>
                                </Col>
                                <Col md={1}>
                                    <Button id="socoTable.toggle.button.id" color="primary" className="btn-sm p-1" onClick={this.toggle}>
                                        <span className="icon-white icon-down p-0"/>
                                    </Button>
                                </Col>
                            </Row>
                        </CardHeader>
                        <Collapse isOpen={collapse}>
                            {this.renderSOCO()}
                        </Collapse>
                    </Card>

                    <Modal isOpen={this.state.modal} toggle={this.toggleModale} className={"sizeForModal"}>
                        <ModalHeader toggle={this.toggleModale}>Contenu de l'email</ModalHeader>
                        <Iframe url={this.state.iframeURL}
                                width="900px"
                                height="1070px"
                                id="myId"
                                className="myClassname"
                                display="inline"
                                position="relative"/>
                    </Modal>
                </div>
            );
        } else {
            return <React.Fragment/>
        }
    }
}

const mapStateToProps = (state: AppState) => ({authorizations: state.authorization.authorizations, showSOCO: state.persisted.showSOCO});

export default connect(mapStateToProps)(SOCOTable)
