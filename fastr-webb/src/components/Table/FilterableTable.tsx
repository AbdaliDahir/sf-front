import * as React from 'react';

import Table from 'react-bootstrap-table-next';
import filterFactory from 'react-bootstrap-table2-filter';
import paginationFactory from "react-bootstrap-table2-paginator";

import Facet, {FacetData, FilterFnData} from './Facet';
// import {Col, Row} from "reactstrap";

// interface ColumnType {
//     dataField: string
//     text: string
//     sort?: boolean
//     filter?: () => void
// }

interface Props {
    // tslint:disable-next-line:no-any
    data: any[]
    // tslint:disable-next-line:no-any
    columns?: any[]
    selectable?: boolean
    numberPerPage?: number
    keyField: string
    facetDatas: FacetData[]
    paginated?: boolean
    onSelectCase?: (row, isSelect, rowIndex, e) => void
    selected?: string[]
}

interface State {
    // tslint:disable-next-line:no-any
    displayedData: any[]
    selectedCell: null
    filterFnsSelected: Array<FilterFnData>
}

class FilterableTable extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            displayedData: this.props.data,
            selectedCell: null,
            filterFnsSelected: []
        }
    }

    public componentWillReceiveProps(props: Props) {
        if (props.data.length) {
            this.setState({
                displayedData: props.data
            })
        }
    }

    public _uniqBy(a, key) {
        const seen = {};
        return a.filter((item) => {
            const k = key(item);
            return seen.hasOwnProperty(k) ? false : (seen[k] = true);
        })
    }

    public selectFilterButton = (e) => {
        const labelFromButtonName = e.currentTarget.name
        const {data} = this.props
        this.setState((prevstate) => {
                const selectedFilters: Array<FilterFnData> = [...prevstate.filterFnsSelected]
                const filterFnCliked = selectedFilters.filter(filterFn => filterFn.label === labelFromButtonName)[0]

                if (filterFnCliked) {
                    // If the filter clicked is already in the selectedFilter, remove it
                    selectedFilters.splice(selectedFilters.indexOf(selectedFilters.filter(filterFn => filterFn.label === labelFromButtonName)[0]), 1)
                } else {
                    // If not add it to the selectedFilter
                    let filterFnToAdd;
                    this.props.facetDatas.forEach(facetData => {
                        if (facetData.filterFns.some(filterFn => filterFn.label === labelFromButtonName)) {
                            filterFnToAdd = facetData.filterFns.filter(filterFn => filterFn.label === labelFromButtonName)[0]
                        }
                    })
                    selectedFilters.push(filterFnToAdd)
                }
                let newData = selectedFilters.length ? [] : data;
                selectedFilters.forEach(filterfn =>
                    newData = [...newData, ...data.filter(elem => filterfn.fnCompare(elem[filterfn.field], filterfn.value))]
                )
                // remove duplicate with same id
                newData = this._uniqBy(newData, elem => elem[this.props.keyField])
                return {
                    displayedData: newData,
                    filterFnsSelected: selectedFilters
                }
            }
        )
    }

    public renderFacets() {
        const facets: JSX.Element[] = []
        this.props.facetDatas.forEach(facetData => {
            facets.push(<Facet key={JSON.stringify(facetData)}
                               facetData={facetData}
                               data={this.state.displayedData}
                               selectFilterFn={this.selectFilterButton}/>)
        })
        return facets
    }

    public render() {
        const options = {
            paginationSize: this.props.numberPerPage
        }
        return (
            <div>
                {/*<Row>*/}
                {/*    <Col md="12">*/}
                <Table
                    bootstrap4
                    keyField={this.props.keyField}
                    data={this.state.displayedData}
                    columns={this.props.columns}
                    selectRow={this.props.selectable && {
                        mode: 'checkbox',
                        clickToSelect: true,
                        onSelect: this.props.onSelectCase,
                        selected: this.props.selected
                    }}
                    pagination={this.props.paginated && paginationFactory(options)}
                    filter={filterFactory()}
                />
                {/*    </Col>*/}
                {/*    /!*<Col md="3">*!/*/}
                {/*    /!*    {this.renderFacets()}*!/*/}
                {/*    /!*</Col>*!/*/}
                {/*</Row>*/}
            </div>
        );
    }
}

export default FilterableTable