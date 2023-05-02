import * as React from 'react';
import {Card} from 'reactstrap';
import FacetButton from './FacetButton';

export interface FacetData {
    label: string
    filterFns: FilterFnData[]
}

export interface FilterFnData {
    label: string
    // tslint:disable-next-line:no-any
    value: any
    fnCompare: (data, ...params) => boolean
    field: string
}

interface Props {
    // tslint:disable-next-line:no-any
    data?: any[]
    facetData: FacetData
    selectFilterFn: (e) => void
}

interface State {
    filterButtonsSelected: FilterFnData[]
}

export default class Facet extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)
        this.state = {
            filterButtonsSelected: []
        }
    }


    public renderCount(flb: FilterFnData): number {
        return this.props.data ? this.props.data
            .filter(elem => flb.fnCompare(elem[flb.field], flb.value))
            .length : 0
    }

    public renderFilterLinks() {
        const links: JSX.Element[] = []
        this.props.facetData.filterFns.forEach(filterFn => {
            links.push(<FacetButton key={JSON.stringify(filterFn)} name={filterFn.label} selectFilterFn={this.props.selectFilterFn} count={this.renderCount(filterFn)} />)
        })
        return links
    }

    public render() {
        return (
            <Card className="facet">
                <h6>{this.props.facetData.label}</h6>
                {this.renderFilterLinks()}
            </Card>
        );
    }
}
