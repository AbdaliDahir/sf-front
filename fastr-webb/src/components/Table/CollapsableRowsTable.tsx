import * as React from 'react';
import {Collapse, Row, Col, Table} from "reactstrap/lib";
import classnames from 'classnames';

interface Props {
    rowsData: any
    renderHeader: () => any
    renderTableThead: () => any
    renderTableRows: () => any
}

interface State {
    collapse: boolean;
}

class CollapsableRowsTable extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            collapse: false,
        }
    }

    public render = () => {
        const {collapse} = this.state;
        const {rowsData} = this.props;
        return (
                <div>

                        <Row>
                            <Col md={11}>
                                {this.props.renderHeader()}
                            </Col>
                        </Row>

                    <div className={classnames({'d-none': rowsData.length === 0})}>
                        <Collapse isOpen={!collapse}>

                                <Table bordered responsive
                                       className="w-100 mt-1 table-hover table-sm">
                                    <thead className={"collapsable-row-table__table-header thead-dark"}>
                                        {this.props.renderTableThead()}
                                    </thead>
                                    <tbody>
                                        {this.props.renderTableRows}
                                    </tbody>
                                </Table>

                        </Collapse>
                    </div>
                </div>
        )
    }
}

export default CollapsableRowsTable