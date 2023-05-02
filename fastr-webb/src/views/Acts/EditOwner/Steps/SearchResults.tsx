import * as React from "react";
import filterFactory from "react-bootstrap-table2-filter";
import paginationFactory from "react-bootstrap-table2-paginator";
import BootstrapTable from 'react-bootstrap-table-next';
import {translate} from "../../../../components/Intl/IntlGlobalProvider";
import {FormattedMessage} from "react-intl";
import {Client} from "../../../../model/person";
import {withFormsy} from "formsy-react";
import {PassDownProps} from "formsy-react/dist/Wrapper";

type PropType = PassDownProps

interface Props extends PropType {
    data: Client[],
    storeSelectedClientId: (id: string) => void
}

interface State {
    displayedData: object
}

class SearchResults extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {displayedData: []}
    }

    public componentDidMount() {
        // tslint:disable-next-line:no-any TODO: To correct
        const persons: any[] = [];
        for (const element of this.props.data) {
            for (const service of element.services) {
                const displayElement = {
                    holder: element.ownerPerson.lastName + ' ' + element.ownerPerson.firstName,
                    address: element.ownerPerson.address.address1,
                    phone: service.label,
                    contract: service.id,
                    segment: '',
                    status: service.status,
                    client: element
                };
                persons.push(displayElement);
            }
        }
        this.setState({displayedData: persons});

        if (persons.length === 1) {
            this.props.storeSelectedClientId(persons[0].contract);
        }
    }

    // tslint:disable-next-line:no-any TODO: a typer (ou a virer, y'a déjà une recherche)
    public storeValue = (event: any) => {
        this.props.storeSelectedClientId(event.client.id);
    };

    public render(): JSX.Element {

        const columns = [{
            dataField: 'holder',
            text: translate.formatMessage({id: "search.table.holder"}),
            sort: true,
        }, {
            dataField: 'address',
            text: translate.formatMessage({id: "search.table.address"}),
        }, {
            dataField: 'phone',
            text: translate.formatMessage({id: "search.table.phone"}),
            sort: true,
        }, {
            dataField: 'contract',
            text: translate.formatMessage({id: "search.table.contract"}),
        }, {
            dataField: 'segment',
            text: translate.formatMessage({id: "search.table.segment"}),
        }, {
            dataField: 'status',
            text: translate.formatMessage({id: "search.table.status"}),
        }];

        const selectRow = {
            mode: 'radio',
            clickToSelect: true,
            classes: 'table-success',
            hideSelectColumn: true,
            onSelect: this.storeValue
        };

        const customTotal = (from: number, to: number, size: number) => (
            <span className="font-weight-bold ml-2">
                {from} <FormattedMessage id="global.dialog.to"/> {to} <FormattedMessage
                id="global.pagination.total"/> {size}
            </span>
        );

        const paginationOptions = {
            sizePerPageList: [{
                text: '5', value: 5
            }, {
                text: '10', value: 10
            }],
            sizePerPage: 5,
            prePageText: translate.formatMessage({id: "global.pagination.previous"}),
            nextPageText: translate.formatMessage({id: "global.pagination.next"}),
            prePageTitle: translate.formatMessage({id: "global.pagination.previous.title"}),
            nextPageTitle: translate.formatMessage({id: "global.pagination.next.title"}),
            alwaysShowAllBtns: true,
            showTotal: true,
            paginationTotalRenderer: customTotal,
            hidePageListOnlyOnePage: true
        };

        function noDataIndication() {
            return <FormattedMessage id="global.table.nothing"/>
        }

        const {displayedData} = this.state;

        return (
            <BootstrapTable
                keyField='holder'
                data={displayedData}
                columns={columns}
                selectRow={selectRow}
                filter={filterFactory()}
                pagination={paginationFactory(paginationOptions)}
                striped
                hover
                noDataIndication={noDataIndication}
            />
        )

        // TODO: en option, mettre un label vert/rouge pour la colonne actif + table overlay
    }
}

export default withFormsy(SearchResults);