import React, {Component} from 'react';
import {connect} from "react-redux";
import Col from "reactstrap/lib/Col";
import Row from "reactstrap/lib/Row";
import {Case} from "../../../../model/Case";
import ClientRequest from "../Elements/ClientRequest";
import GenericCardToggle from "../../../../components/Bootstrap/GenericCardToggle";

interface Props {
    retrievedCase: Case
    updateMode: boolean
    idAct?: string
    handleFormChanges
}

class ClientRequestAndNote extends Component<Props> {
    public render() {
        return (
            <GenericCardToggle icon={"icon-document"} title={"cases.create.description"}>
                        <Row>
                            <Col>
                                <ClientRequest caseToBeUpdated={this.props.retrievedCase}
                                               getClientRequestChanges={this.props.handleFormChanges}
                                               updateMode={this.props.updateMode}
                                               idAct={this.props.idAct}/>
                            </Col>
                        </Row>
            </GenericCardToggle>
        );
    }
}

function mapStateToProps(state) {
    return {
        retrievedCase: state.case.currentCase,
        updateMode: state.casePage.updateMode,

    }
}

export default connect(mapStateToProps)(ClientRequestAndNote)
