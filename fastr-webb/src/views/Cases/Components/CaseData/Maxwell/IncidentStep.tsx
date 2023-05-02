import * as React from 'react';

import {GenericIncident} from "../../../../../model/GenericIncident";
import {connect} from "react-redux";
import {AppState} from "../../../../../store";
import {CasesQualificationSettings} from "../../../../../model/CasesQualificationSettings";
import IncidentDataInput from "./IncidentDataInput";
import FormGroup from "reactstrap/lib/FormGroup";
import {StepProps} from "../../../../../components/Form/StepForm/StepForm";

interface Props extends StepProps{
    changeValidation?: (isValid: boolean) => void
    theme:CasesQualificationSettings,
    incidentSelected?: GenericIncident,
    setIncidentSelected?: (incident: GenericIncident) => void
    incidents: GenericIncident[]

}
interface State {
    collapse: boolean;
    initial: boolean;
}
class IncidentStep extends React.Component<Props,State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            collapse: false,
            initial: false
        }
    }


    public componentDidMount = async () => {
        if (this.props.changeValidation && !this.props.incidentSelected) {
            this.props.changeValidation(false)
        }
    }


    public handleincidentSelectChange = (incidentSelected :GenericIncident) => {
        if (this.props.changeValidation) {
            this.props.changeValidation(incidentSelected ? true : false);
        }
        if(this.props.setIncidentSelected) {
            this.props.setIncidentSelected(incidentSelected);

        }
    }

     public  renderData = () => {
        const incidentsList = this.props.incidents
            .filter(incident => incident.refCTT !== "Format: CXXXXXXXX")
            .map((element,i) => (
                <IncidentDataInput  key = {i} incident={element} incidentSelected={this.props.incidentSelected} onChange={this.handleincidentSelectChange}/>));

        return (incidentsList)
    };


    public render() {

        return (
            <div>
                <FormGroup>
                {this.renderData()}
                </FormGroup>
            </div>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    incidents: state.casePage.incidents

});

export default connect(mapStateToProps, null)(IncidentStep)