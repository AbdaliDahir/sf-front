import * as React from "react";
import {Button, Col, Container, FormGroup, InputGroup, InputGroupAddon, Modal, Row} from "reactstrap";
import {BlockingContext} from "../../App";
import {Client} from "../../../model/person";
import {NotificationManager} from "react-notifications";
import SearchInput from "./SearchInput";
import Formsy from "formsy-react";
import {Service} from "../../../model/service";
import ResultBoxSearch from "../../Search/ResultBoxSearch";
import Loading from "../../../components/Loading";
import ValidationUtils from "../../../utils/ValidationUtils";
import {fetchAndStoreClientV2, selectClientV2} from "../../../store/actions/v2/client/ClientActions";
import {connect} from "react-redux";
import './SearchClients.scss';
import {DataLoad} from "../../../store/actions/ClientContextActions";
import {SearchResult} from "../../../model/person/SearchResult";
import SearchService from "../../../service/v2/SearchService";
import {translate} from "../../../components/Intl/IntlGlobalProvider";

interface State {
  clients?: SearchResult[],
  loading: boolean,
}

interface Query {
  query: string
}

interface Props {
  q?: string | null | undefined;
  fetchAndStoreClientV2: (clientId: string, serviceId: string, howToLoad: DataLoad) => void;
  selectClientV2: (clientId: string, serviceId: string) => void;
}

class SearchClients extends React.Component<Props, State> {
  public static contextType = BlockingContext;
  private searchService: SearchService = new SearchService();

  constructor(props: Readonly<Props>) {
    super(props);
    this.state = {
      loading: false,
      clients: undefined,
    }
  }

  public componentDidMount() {
    if (this.props.q) {
      this.onSearch({query: this.props.q});
    }
  }

  public componentDidUpdate(prevProps) {
    if (!this.state.loading && this.props.q && prevProps.q !== this.props.q) {
      this.onSearch({query: this.props.q});
    }
  }

  public onSearch = async (query: Query): Promise<void> => {
    try {
      this.setState({
        loading: true,
        clients: [],
      });
      const results: SearchResult[] = (await this.searchService.cxpSearch(this.phoneNumberHandling(query.query))).sort((a, b) => b.score - a.score);
      const clients: SearchResult[] = [];
      results.forEach(r => {
        const client = clients.find(c => c.id === r.id);
        if (client) {
          client.services.push(...r.services);
        } else {
          clients.push(r);
        }
      });
      if(clients.length === 1){
        const client = clients.find(() => true)
        if(client){
          if(client.services.length === 1){
            const service = client.services.find(() => true)
            if(service) {
              await this.onSelect(client, service)
            }
          }

        }
      }
      this.setState({
        clients,
      });
    } catch (e) {
      NotificationManager.error((await e).message);
      console.error(e);
    } finally {
      this.setState({
        loading: false,
      });
    }
  };

  public onSelect = async (c: Client, s: Service) => {
    try {
      this.setState({
        loading: true,
      });
      await this.props.fetchAndStoreClientV2(c.id, s.id, DataLoad.ALL_SERVICES);
      this.props.selectClientV2(c.id, s.id);
    } catch (e) {
      // TODO gestion erreur
    } finally {
      this.setState({
        loading: false,
      });
    }
  };

  public render(): JSX.Element {
    return (
        <Container className={"searchClientContainer mb-5"}>
          <Modal isOpen={this.state.loading} centered={true}>
            <Loading/>
          </Modal>
          <Formsy onValidSubmit={this.onSearch}>
            <FormGroup className="w-100">
              <InputGroup size="lg">
                <SearchInput type="text" id="query" name="query" value={this.props.q}
                             placeholder={translate.formatMessage({id: "search.page.placeholder"})}
                             validations={{isRequired: ValidationUtils.notEmpty}}/>
                <InputGroupAddon addonType="append">
                  <Button color="primary">
                    <span className="icon-white icon-search"/>
                  </Button>
                </InputGroupAddon>
              </InputGroup>
            </FormGroup>
          </Formsy>
          <Row className="mt-3">
            {this.renderResults()}
          </Row>
        </Container>
    );
  }

  private renderResults() {
    const nbResults = this.state.clients?.length || 0;
    if (!this.state.loading && this.state.clients && nbResults === 0) {
      return (
          <Col xs={12} className="mt-4 text-danger">
            Aucun résultat
          </Col>
      );
    } else if (this.state.clients && nbResults > 0) {
      return (
          <React.Fragment>
            <Col xs={12} className="mt-4">
              {nbResults > 50 ? "+ de 50" : nbResults} résultat{nbResults > 1 ? "s" : ""} trouvé{nbResults > 1 ? "s" : ""}
            </Col>
            {
              this.state.clients?.map((e, i) => <ResultBoxSearch key={"card_client_" + e.id + "_" + i} client={e}
                                                                 onClick={this.onSelect}/>)
            }
          </React.Fragment>
      )
    } else {
      return <React.Fragment/>;
    }
  }

  private phoneNumberHandling(query: string): string {
    // looks like phoneNumber & replace space for search
    const matches = query.match(/(?:(?:\+|00)\d{2}|0)*[1-9](?:[\s.-]*\d{2}){4}/g);

    matches?.forEach(m => query = query.replace(m, m.replace(/[\s.-]/g, "")));

    return query;
  }
}

const mapDispatchToProps = {
  fetchAndStoreClientV2,
  selectClientV2
};

export default connect(undefined, mapDispatchToProps)(SearchClients)