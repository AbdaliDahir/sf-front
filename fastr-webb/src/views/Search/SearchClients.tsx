import * as React from "react";
import {Button, Col, FormGroup, InputGroup, InputGroupAddon, Row} from "reactstrap";
import {translate} from "../../components/Intl/IntlGlobalProvider";
import {BlockingContext} from "../App";
import {Client} from "../../model/person";
import {NotificationManager} from "react-notifications";
import {FormattedMessage} from "react-intl";
import SearchInput from "./SearchInput";
import ClientService from "../../service/ClientService";
import ResultBox from "./ResultBox";
import {ChangeEvent} from "react";

interface State {
    clients: Client[],
    query: string,
    selectedClient?: string
}

interface Props {
    onSelect: (client: Client | undefined) => void,
    previousQuery?: string,
    saveData?: (event: ChangeEvent<HTMLInputElement>) => void,
    excludedIds?: string[]
}

interface Query {
    query: string
}

export default class SearchClients extends React.Component<Props, State> {
    public static contextType = BlockingContext;
    private clientService: ClientService = new ClientService();


    constructor(props: Readonly<Props>) {
        super(props);
        this.state = {
            clients: [],
            query: this.props.previousQuery ? this.props.previousQuery : ""
        }
    }

    public onSearch = async () => {
        try {
            let clients: Client[] = await this.clientService.searchClients(this.state.query);
            if (this.props.excludedIds) {
                clients = clients.filter(c => !this.props.excludedIds!.includes(c.id))
                if (clients.length === 0) {
                    NotificationManager.error(translate.formatMessage({id: "acts.holder.search.results.same.owner"}))
                    return
                }
            }
            this.setState({
                clients,
            });
        } catch (e) {
            NotificationManager.error((await e).message);
            console.error(e);
        }
    };

    public onInvalidSearch = (model: Query) => {
        NotificationManager.error(<FormattedMessage id="validation.general.message"/>);
    };

    public getQuery = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({query: event.currentTarget.value});
        if (this.props.saveData) {
            this.props.saveData(event)
        }
    };

    public onSelect = (c?: Client) => {
        this.props.onSelect(c);

        if (c) {
            const id = c.id;
            this.setState({selectedClient: id})
        } else {
            this.setState({selectedClient: undefined})
        }
    };

    public render(): JSX.Element {
        return (
            <div>
                <br/>
                <Col md={{size: '10', offset: 1}}>
                    <Row>
                        <FormGroup className="w-100">
                            <InputGroup size="sm">
                                <SearchInput type="text" id="query" name="query" value={this.state.query}
                                             placeholder={translate.formatMessage({id: "search.page.placeholder"})}
                                             onChange={this.getQuery}/>
                                <InputGroupAddon addonType="append">
                                    <Button id="searchClients.onsearch.button.id" color="primary" onClick={this.onSearch}>
                                        <span className="icon-white icon-search"/>
                                    </Button>
                                </InputGroupAddon>
                            </InputGroup>
                        </FormGroup>

                    </Row>
                    <Row className={this.state.clients?.length > 0 ? "mt-3" : ""}>
                        {this.renderResults()}
                    </Row>
                </Col>

            </div>
        );
    }

    private renderResults(): JSX.Element[] {
        return this.state.clients.map(e => this.state.selectedClient === e.id ?
            <ResultBox key={e.id} client={e} onClick={this.onSelect} selected={true}/> :
            <ResultBox key={e.id} client={e} onClick={this.onSelect} selected={false}/>)
    }
}