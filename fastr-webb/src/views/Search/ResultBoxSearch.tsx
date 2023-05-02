import * as React from "react";
import {Card, CardBody, Col, ListGroup, Row} from "reactstrap";
import {BlockingContext} from "../App";
import {Client} from "../../model/person";
import ResultServiceLine from "./ResultServiceLine";
import {Service} from "../../model/service";
import {connect} from "react-redux";
import {SearchResult} from "../../model/person/SearchResult";

interface Props {
    client: SearchResult,
    onClick: (client: Client, service: Service) => void,
}

interface State {
    clicked: boolean
}

class ResultBoxSearch extends React.Component<Props, State> {
    public static contextType = BlockingContext;

    constructor(props: Readonly<Props>) {
        super(props);
        this.state = {
            clicked: false
        }
    }

    public onClick = (client: Client, service: Service) => {
        if (!this.state.clicked) {
            this.setState({
                clicked: true
            });
            this.props.onClick(client, service);
            this.setState({
                clicked: false
            });
        }
    };

    public render(): JSX.Element {
        return (
            <Col xs={6} md={6} sm={6} lg={6} xl={3} className="mt-4">
                <Card outline>
                    <CardBody>
                        <Row className={"h4"}>
                            {this.displayName()}
                        </Row>
                        <Row className={"p-1"}>
                            <Col xs={2} lg={1}>
                                <span className="icon icon-home"/>
                            </Col>
                            <Col>
                                {this.renderIfPresent(this.props.client.ownerPerson.address.address1)}
                                {this.renderIfPresent(this.props.client.ownerPerson.address.address2)}
                                {this.renderIfPresent(this.props.client.ownerPerson.address.postalBox)}
                                {this.props.client.ownerPerson.address.zipcode + " "} {this.props.client.ownerPerson.address.city}
                            </Col>
                        </Row>
                        <Row className={"p-1"}>
                            <Col xs={2} lg={1}>
                                <span className="icon icon-email"/>
                            </Col>
                            <Col>
                                {this.props.client.contactEmail}
                            </Col>
                        </Row>
                        <ListGroup flush className={"pt-3"}>
                            {this.renderResultServices()}
                        </ListGroup>
                    </CardBody>
                </Card>
            </Col>
        );
    }

    private compareServiceOrder = (a: Service, b: Service) => {
        if (a.status === "ACTIVE") {
            return -1;
        } else if (a.status === b.status) {
            return 0;
        } else if (b.status === "ACTIVE") {
            return 1;
        } else {
            return 1;
        }
    };

    private displayName = () => {
        if (this.props.client.corporation) {
            return (
                <React.Fragment>
                    <Col xs={2} lg={1}>
                        <span className="icon icon-pro"/>
                    </Col>
                    <Col xs={10}>
                        <strong>{this.props.client.ownerCorporation.name}</strong>
                    </Col>
                </React.Fragment>
            );
        } else {
            return (
                <React.Fragment>
                    <Col xs={2} lg={1}>
                        <span className={"icon icon-user"}/>
                    </Col>
                    <Col xs={10}>
                        <strong>{this.props.client.ownerPerson.lastName} </strong>{this.props.client.ownerPerson.firstName}
                    </Col>
                </React.Fragment>
            );
        }
    }

    private renderResultServices(): JSX.Element[] {
        return this.props.client.services?.sort(this.compareServiceOrder).map(e => <ResultServiceLine
            key={"card_client_" + this.props.client.id + "_" + e.id} onClick={this.onClick}
            client={this.props.client} service={e}/>);
    }

    private renderIfPresent(element?: string): JSX.Element | null {
        if (element !== undefined && element !== null && element !== "") {
            return (<span>{element}<br/></span>)
        } else {
            return null
        }
    }
}

export default connect()(ResultBoxSearch)