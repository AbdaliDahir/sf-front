import React, {Component} from 'react';
import {connect} from "react-redux";
import Col from "reactstrap/lib/Col";
import Row from "reactstrap/lib/Row";
import {AppState} from "../../../../store";
import NavBarForNote from "./NavBarForNote";
import NavBarForUpdate from "./NavBarForUpdate";

interface Props {
    location
    updateMode: boolean
}

class ViewCaseNavBarFooter extends Component<Props> {
    public render() {
        return (
            <Row>
                <Col className="d-flex justify-content-end">
                    {this.props.updateMode ?
                        <NavBarForUpdate/>
                        : <NavBarForNote/>}
                </Col>
            </Row>
        );
    }
}

function mapStateToProps (state: AppState) {
    return {updateMode: state.casePage.updateMode}
}

export default connect(mapStateToProps)(ViewCaseNavBarFooter)
