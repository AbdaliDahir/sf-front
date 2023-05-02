import * as React from 'react';
import {CaseDataProperty} from "../../../../../model/CaseDataProperty";
import {Col, FormGroup} from "reactstrap";
import {formatDate} from "../../../../../utils/ActionUtils";

interface Props {
    data: CaseDataProperty
}

class FlatAdditionnalData extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }
    public render() {
        const value = this.props.data.type === "DATE" ? formatDate(this.props.data.value) : this.props.data.value;
        const defaultValue = this.props.data.type === "DATE" ? formatDate(this.props.data.defaultValue) : this.props.data.defaultValue;
        return <FormGroup>
            <Col>
                <div className="d-flex w-100 p0 mt-3 mb-3 flex-wrap">
                    <span className="font-weight-bold w-100">{this.props.data.label}</span>
                    <span>{this.props.data.defaultValue ? defaultValue : value}</span>
                </div>
            </Col>
        </FormGroup>
    }
}

export default FlatAdditionnalData