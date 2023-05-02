import * as React from "react";
import {Button, Col, FormGroup, InputGroup, InputGroupAddon, Row} from "reactstrap";
import {BlockingContext} from "../App";
import {Client} from "../../model/person";
import {NotificationManager} from "react-notifications";
import SearchInput from "./SearchInput";
import ClientService from "../../service/ClientService";
import Formsy from "formsy-react";
import {Service} from "../../model/service";
import {RouterProps} from "react-router";
import ResultBoxSearch from "./ResultBoxSearch";

interface State {
    clients: Client[],
}

interface Query {
    query: string
}

export default class SearchClients extends React.Component<RouterProps, State> {
    public static contextType = BlockingContext;
    private clientService: ClientService = new ClientService();


    constructor(props: Readonly<RouterProps>) {
        super(props);
        this.state = {
            clients: [],
        }
    }

    public onSearch = async (query: Query) => {
        try {
            const clients: Client[] = await this.clientService.searchClients(query.query);
            this.setState({
                clients,
            });
        } catch (e) {
            NotificationManager.error((await e).message);
            console.error(e);
        }
    };


    public onSelect = (c: Client, service: Service) => {
        this.props.history.push(`/clients/${c.id}/services/${service.id}`)
    };

    public render(): JSX.Element {
        return (
            <div>
                <br/>
                <Col md={{size: '10', offset: 1}}>
                    <Formsy onSubmit={this.onSearch}>
                        <Row>
                            <FormGroup className="w-100">
                                <InputGroup size="lg">
                                    <SearchInput type="text" id="query" name="query"
                                                 placeholder="Recherche..."/>
                                    <InputGroupAddon addonType="append">
                                        <Button color="primary">
                                            <span className="icon-white icon-search"/>
                                        </Button>
                                    </InputGroupAddon>
                                </InputGroup>
                            </FormGroup>
                        </Row>
                    </Formsy>
                    <Row className="mt-3">
                        {this.renderResults()}
                    </Row>
                </Col>
            </div>
        );
    }

    private renderResults(): JSX.Element[] {
        return this.state.clients.map(e => <ResultBoxSearch key={e.id} client={e} onClick={this.onSelect}/>)
    }
}