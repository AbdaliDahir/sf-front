import * as React from 'react';
import {connect} from "react-redux";
import {CasesQualificationSettings} from "../../../../model/CasesQualificationSettings";
import {GenericIncident} from "../../../../model/GenericIncident";
import {StepProps} from "../../../../components/Form/StepForm/StepForm";
import {FormGroup} from "reactstrap";
import {AppState} from "../../../../store";
import IncidentDataInputV2 from "./IncidentDataInputV2";
import {setBlockingUIV2} from "../../../../store/actions/v2/ui/UIActions";
import {EMaxwellCallOrigin} from "../../../../model/maxwell/enums/EMaxwellCallOrigin";
import ValidationUtils from "../../../../utils/ValidationUtils";

interface Props extends StepProps {
    changeValidation?: (isValid: boolean) => void
    theme: CasesQualificationSettings,
    incidentSelected?: GenericIncident,
    setIncidentSelected?: (incident: any) => void
    incidents: GenericIncident[]
    caseId: string
    readOnly: boolean
    setBlockingUIV2
    callOrigin?: EMaxwellCallOrigin
    is4steps?: boolean
    payload?: any
}

class IncidentStepV2 extends React.Component<Props> {

    constructor(props: Props) {
        super(props);
    }

    public componentDidMount = async () => {
        if (this.props.callOrigin === EMaxwellCallOrigin.FROM_CASE) {
            this.props.setBlockingUIV2(true)
        }

        if (this.props.changeValidation && !this.props.incidentSelected && !this.props.payload?.refCTT) {
            this.props.changeValidation(false)
        }
        if (this.props.changeValidation && this.props.callOrigin === EMaxwellCallOrigin.FROM_HISTORY) {
            this.props.changeValidation(true)
        }
    }

    public handleIncidentSelectChange = (incidentSelected :GenericIncident) => {
        if (this.props.changeValidation) {
            this.props.changeValidation(!!incidentSelected);
        }
        if (this.props.setIncidentSelected) {
            this.props.setIncidentSelected(incidentSelected);
        }
    }

    public handleParentIdInputChanged = (id: string) => {
        const isValid = ValidationUtils.respectPattern(/^C\d{8}$/)([id], id);
        if (this.props.changeValidation) {
            this.props.changeValidation(typeof isValid === "string" ? false : isValid);
        }
    }

    public renderData = () => {
        if (this.props.payload && this.props.payload.refCTT) {
            const inc = this.props.incidents.filter((elt) => {
                return elt.refCTT === this.props.payload.refCTT
            })
            if (inc.length > 0) {
                return (
                    <IncidentDataInputV2 caseId={this.props.caseId}
                                         readOnly={this.props.readOnly}
                                         incident={inc[0]}
                                         is4steps={this.props.is4steps}
                                         incidentSelected={inc[0]}
                                         incidents={inc}
                                         onChange={this.handleIncidentSelectChange}
                                         onParentIdInputChange={this.handleParentIdInputChanged}
                                         callOrigin={this.props.callOrigin}
                    />)
            }
            else {
                return this.props.incidents
                    .map((element, i) => (
                        <IncidentDataInputV2 caseId={this.props.caseId}
                                             readOnly={this.props.readOnly}
                                             key={i}
                                             incident={element}
                                             is4steps={this.props.is4steps}
                                             incidentSelected={this.props.incidentSelected}
                                             incidents={this.props.incidents}
                                             onChange={this.handleIncidentSelectChange}
                                             onParentIdInputChange={this.handleParentIdInputChanged}
                                             callOrigin={this.props.callOrigin}
                        />));
            }
        }
        else {
            return this.props.incidents
                .map((element, i) => (
                    <IncidentDataInputV2 caseId={this.props.caseId}
                                         readOnly={this.props.readOnly}
                                         key={i}
                                         incident={element}
                                         is4steps={this.props.is4steps}
                                         incidentSelected={this.props.incidentSelected}
                                         incidents={this.props.incidents}
                                         onChange={this.handleIncidentSelectChange}
                                         onParentIdInputChange={this.handleParentIdInputChanged}
                                         callOrigin={this.props.callOrigin}
                    />));
        }
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

const mapStateToProps = (state: AppState, ownProps: Props) => ({
    incidents: state.store.cases.casesList[ownProps.caseId].maxwellIncident.incidentsMaxwell,
    callOrigin: state.store.cases.casesList[ownProps.caseId].maxwellIncident.callOrigin,
    payload: state.payload.payload
});

const mapDispatchToProps = {
    setBlockingUIV2
}

export default connect(mapStateToProps, mapDispatchToProps)(IncidentStepV2)