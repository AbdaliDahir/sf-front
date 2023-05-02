import * as _ from "lodash";
import {ChangeEvent} from "react";
import * as React from "react";
import {FormattedMessage} from "react-intl";
import {Button, ButtonGroup, Container} from "reactstrap";
import {Client} from "../../model/person";
import AdvancedSearchClients from "./AdvancedSearchClients";
import SearchClients from "./SearchClients";

interface State {
    quickSearch: boolean,
    query: string,
    searchForm: SearchForm
}

export interface SearchForm {
    lastname: string,
    firstname: string,
    birthDate?: Date,
    city: string,
    zipcode: string,
    pro: boolean,
    corporateName: string,
    corporateZipcode: string
}

interface Props {
    onSelect: (client: Client) => void,
    reset?: () => void,
    excludedIds?: string[]
}

export default class ExtendedSearchClients extends React.Component<Props, State> {

    constructor(props: Readonly<Props>) {
        super(props)
        this.state = {
            quickSearch: true,
            query: "",
            searchForm: {
                lastname: "",
                firstname: "",
                birthDate: undefined,
                city: "",
                zipcode: "",
                pro: false,
                corporateName: "",
                corporateZipcode: ""
            }
        }
    }

    public displayQuickSearch = () => {
        this.setState({quickSearch: true})
        if (this.props.reset) {
            this.props.reset()
        }
    }

    public displayAdvancedSearch = () => {
        this.setState({quickSearch: false})
        if (this.props.reset) {
            this.props.reset()
        }
    }

    public saveData = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({query: event.currentTarget.value})
    }

    // tslint:disable-next-line:no-any TODO A CORRIGER
    public saveFormData = (key: string, value: any) => {
        this.setState(prevState => {
            return {searchForm: _.set<SearchForm>(prevState.searchForm, key, value)};
        })
    }

    public render(): JSX.Element {
        const {quickSearch} = this.state;
        return (
            <Container>
                <ButtonGroup className={"d-flex justify-content-center align-items-center"}>
                    <Button id="extendedSearchClient.displayquickSearch.button.id" size={"sm"} color="primary" outline={!quickSearch} active={quickSearch}
                            onClick={this.displayQuickSearch}><FormattedMessage
                        id="Quick search"/></Button>
                    <Button id="extendedSearchClient.displayAdvancedSearch.button.id" size={"sm"} color="primary" outline={quickSearch} active={!quickSearch}
                            onClick={this.displayAdvancedSearch}><FormattedMessage
                        id="Advanced search"/></Button>
                </ButtonGroup>
                {this.renderSearchForm()}
            </Container>
        )
    }

    private renderSearchForm(): JSX.Element {
        return this.state.quickSearch ? (
            <SearchClients onSelect={this.props.onSelect} saveData={this.saveData}
                           previousQuery={this.state.query} excludedIds={this.props.excludedIds}/>
        ) : (
            <AdvancedSearchClients onSelect={this.props.onSelect} previousSearchForm={this.state.searchForm}
                                   saveData={this.saveFormData} excludedIds={this.props.excludedIds}/>
        )
    }
}