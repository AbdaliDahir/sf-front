import * as React from 'react';
import {Button, Col, Row} from "reactstrap";
import Collapse from "reactstrap/lib/Collapse";
import {GenericIncident} from "../../../../../model/GenericIncident";
import Label from "reactstrap/lib/Label";
import {connect} from "react-redux";
import {setGenericIncidentSelected} from "../../../../../store/actions/CasePageAction";

interface Props {
    incident:GenericIncident,
    incidentSelected?:GenericIncident
    onChange?: (incidentSelected : GenericIncident) => void
    setGenericIncidentSelected : (incidentSelected : GenericIncident) => void
}
interface State {
    collapse: boolean;
    initial: boolean;
}
class IncidentDataInput extends React.Component<Props,State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            collapse: true,
            initial: false,
        }

    }

    public toggleNotes = () => {
        if (!this.state.collapse && this.state.initial) {
            this.setState({collapse: false, initial: false});
        } else {
            this.setState({collapse: !this.state.collapse, initial: false});
        }
    };

    public handleSelectIncident = () => {
       if(this.props.onChange !== undefined) {
           this.props.onChange(this.props.incident);
       }
       // set selected Generic Incident on Redux
       this.props.setGenericIncidentSelected(this.props.incident)
    }


    public render() {
        const collapse = this.state.collapse;
        return (
            <section className="bg-light p-2 rounded mt-3 mb-3">
                <Row>
                    <Col md={1}>
                        <div className="custom-control custom-radio">

                            <input type="radio" name={this.props.incident.refCTT}
                                   onClick={this.handleSelectIncident}
                                   checked={this.props.incidentSelected && this.props.incident.incidentID === this.props.incidentSelected.incidentID}
                                   disabled={!this.props.incident.creationIng}
                                   className="custom-control-input"
                                   id={this.props.incident.incidentID}
                            />
                            <Label className="custom-control-label" for={this.props.incident.incidentID}/>

                        </div>
                    </Col>

                    <Col md={10} className={this.props.incident.unknown ? "text-muted" : ""}>
                        <h5 className="font-weight-bold">{this.props.incident.intitule}</h5>
                        {!this.props.incident.unknown ?
                            <h6> Référence d'incident : {this.props.incident.refCTT}</h6>
                            : <React.Fragment/>}
                        {!this.props.incident.unknown ?
                            <Collapse isOpen={collapse}>
                                <h6>Description :</h6> {this.props.incident.description}
                                <h6>Traitement :</h6> {this.props.incident.traitement}
                                <h6>Actions : </h6> {this.props.incident.actions}
                                <h6>Discours Client :</h6> {this.props.incident.discoursClient}
                            </Collapse>
                            : <React.Fragment/>}
                    </Col>

                    <Col md={1}>
                        {!this.props.incident.unknown ?
                            <Button color="primary" className="btn-sm  p-1" onClick={this.toggleNotes}>
                                <span className="icon-white icon-down m-0 p-0"/>
                            </Button>
                            : <React.Fragment/>}
                    </Col>
                </Row>
            </section>
        );
    }
}

const mapDispatchToProps = {
    setGenericIncidentSelected
}
export default connect(null, mapDispatchToProps)(IncidentDataInput)