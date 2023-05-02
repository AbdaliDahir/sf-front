import * as React from "react";
import {Card, CardBody, Col, ListGroup, Row} from "reactstrap";
import {BlockingContext} from "../App";
import {Client} from "../../model/person";
import ResultServiceLine from "./ResultServiceLine";

interface Props {
    client: Client,
    onClick: (client: Client) => void,
    selected: boolean
}

interface State {
    selected: boolean
}

export default class ResultBox extends React.Component<Props, State> {
    public static contextType = BlockingContext;

    public static getDerivedStateFromProps(nextProps: Props, prevState: State) {
        if (nextProps.selected !== prevState.selected) {
            return {selected: nextProps.selected};
        } else {
            return null;
        }
    }

    constructor(props: Readonly<Props>) {
        super(props);
        this.state = {
            selected: this.props.selected
        }
    }

    public componentDidUpdate(prevProps: Props, prevState: State) {
        if (prevProps.selected !== this.props.selected) {
            this.setState({selected: this.props.selected!});
        }
    }

    public onClick = (client: Client) => () => {
        this.props.onClick(client);
    }

    public render(): JSX.Element {
        const color = this.state.selected ? "primary" : ""
        return (
            <Col xs={6} md={6} sm={6} lg={6} xl={3} className={"mt-4"}>
                <Card tag="a" onClick={this.onClick(this.props.client)} style={{ cursor: "pointer" }} outline color={color}>
                    <CardBody>
                        <Row>
                            <Col>
                                <h4>
                                    <Row>
                                        <Col xs={2} lg={1}>
                                            <span className={"icon icon-user"}/>
                                        </Col>
                                        <Col>
                                            <strong>{this.props.client.ownerPerson.lastName} </strong>{this.props.client.ownerPerson.firstName}
                                        </Col>
                                    </Row>
                                </h4>
                                <p>
                                    <Row>
                                        <Col xs={2} lg={1}>
                                            <span className={"icon icon-home"}/>
                                        </Col>
                                        <Col>
                                            {this.renderIfPresent(this.props.client.ownerPerson.address.address1)}
                                            {this.renderIfPresent(this.props.client.ownerPerson.address.address2)}
                                            {this.renderIfPresent(this.props.client.ownerPerson.address.postalBox)}
                                            {this.props.client.ownerPerson.address.zipcode + " "} {this.props.client.ownerPerson.address.city}
                                        </Col>
                                    </Row>
                                </p>
                                <p>
                                    <Row>
                                        <Col xs={2} lg={1}>
                                            <span className={"icon icon-email"}/>
                                        </Col>
                                        <Col>
                                            {this.props.client.contactEmail}
                                        </Col>
                                    </Row>
                                </p>
                            </Col>
                        </Row>
                    </CardBody>
                    <ListGroup flush>
                        {this.renderResultServices()}
                    </ListGroup>
                </Card>
            </Col>
        );
    }

    private renderResultServices(): JSX.Element[] {
        return this.props.client.services.map(e => <ResultServiceLine client={this.props.client} key={e.id} service={e}/>);
    }


    private renderIfPresent(element?: string): JSX.Element | null {
        if (element !== undefined && element !== null && element !== "") {
            return (<span>{element}<br/></span>)
        } else {
            return null
        }
    }

}