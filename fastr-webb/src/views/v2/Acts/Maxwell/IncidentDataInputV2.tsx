import * as React from 'react';
import {Button, Col, Row} from "reactstrap";
import Collapse from "reactstrap/lib/Collapse";
import Label from "reactstrap/lib/Label";
import {connect} from "react-redux";
import {GenericIncident} from "../../../../model/GenericIncident";
import {setGenericIncidentSelectedV2} from "../../../../store/actions/v2/case/CaseActions";
import {FormattedMessage} from "react-intl";
import {EMaxwellCallOrigin} from "../../../../model/maxwell/enums/EMaxwellCallOrigin";
import "./IncidentDataInputV2.scss";
import ValidationUtils from "../../../../utils/ValidationUtils";
import FormTextInput from "../../../../components/Form/FormTextInput";
import {AppState} from "../../../../store";

interface Props {
    incident: GenericIncident,
    incidentSelected?
    onChange?: (incidentSelected: GenericIncident) => void
    onParentIdInputChange?: (id: string) => void
    caseId: string
    setGenericIncidentSelectedV2: (caseId: string, incidentSelected: GenericIncident) => void
    callOrigin?: EMaxwellCallOrigin
    incidents?: GenericIncident[]
    readOnly: boolean
    is4steps?: boolean
    payload?: any
}

interface State {
    collapse: boolean;
    isChecked: boolean;
    parentTicketId: string;
}

class IncidentDataInputV2 extends React.Component<Props, State> {

    private REFCTT_PATTERN = /^C\d{8}$/;

    constructor(props: Props) {
        super(props);
        this.state = {
            collapse: true,
            isChecked: false,
            parentTicketId: ""
        }

    }

    public componentDidMount = async () => {
        if (this.isThisIncidentSelected()) {
            this.handleSelectIncident()
        }
        this.setState({
            isChecked: this.isThisIncidentSelected(),
            parentTicketId: this.props.incidentSelected?.refCTT
        })
    }

    public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any) {
        if (this.props.onChange && this.props.incidentSelected && this.props.incidentSelected.unknown) {
            this.props.onChange(this.props.incidentSelected)
        }
        if (prevProps.incidentSelected?.incidentID !== this.props.incidentSelected?.incidentID) {
            this.setState({
                isChecked: this.isThisIncidentSelected()
            })
        }
    }

    public toggleNotes = () => {
        this.setState({collapse: !this.state.collapse});
    };

    public handleSelectIncident = () => {
        if (this.props.onChange !== undefined) {
            this.props.onChange(this.props.incident);
        }
        if (this.props.incident.parentTicketIdToSet && this.props.onParentIdInputChange) {
            this.props.onParentIdInputChange(this.state.parentTicketId ? this.state.parentTicketId : "");
        }
        this.props.setGenericIncidentSelectedV2(this.props.caseId, this.props.incident)
    }

    public handleTicketIdUpdated = (event) => {
        const value = event.currentTarget.value;
        this.setState({
            parentTicketId: value
        });
        if (this.props.onChange !== undefined) {
            this.props.onChange({
                ...this.props.incident,
                refCTT: value
            });
        }
        if (this.props.onParentIdInputChange) {
            this.props.onParentIdInputChange(value)
        }
        this.props.setGenericIncidentSelectedV2(this.props.caseId, {
            ...this.props.incident,
            refCTT: value
        });
    }

    public isThisIncidentSelected = () => {
        const noTickets = this.props.incidents?.filter((inc) => !inc.unknown && !inc.parentTicketIdToSet)?.length === 0;
        if (noTickets && this.props.incident.unknown && this.props.incidents?.length === 1) {
            this.handleSelectIncident();
            return true;
        }

        return (this.props.incidentSelected
                && ((this.props.incidentSelected?.parentTicketId && this.props.incidentSelected?.parentTicketId === this.props.incident.refCTT)
                    || (!this.props.incidentSelected?.parentTicketId && this.props.incident?.refCTT === this.props.incidentSelected?.refCTT)
                    || (this.props.incident?.parentTicketIdToSet && this.props.incidentSelected?.parentTicketIdToSet)
                )
            )
            || (this.props.incident?.unknown && noTickets && (!this.props.incidentSelected?.parentTicketId && !this.props.incidentSelected?.refCTT))
    }

    public render() {
        const collapse = this.state.collapse;
        const isTicket = !this.props.incident.unknown && !this.props.incident.parentTicketIdToSet;
        const shouldDisplayParentTicketIdToSet = (this.props.is4steps && this.props.incident.parentTicketIdToSet) || !this.props.incident.parentTicketIdToSet;
        return (shouldDisplayParentTicketIdToSet &&
            <section className="bg-light p-2 rounded mt-3 mb-3">
                <Row>
                    <Col md={1}>
                        <div className="custom-control custom-radio">
                            <input type="radio" name={this.props.incident.refCTT}
                                   onClick={this.handleSelectIncident}
                                   checked={this.state.isChecked}
                                   disabled={!this.props.incident.creationIng || this.props.readOnly}
                                   className="custom-control-input"
                                   id={this.props.incident.incidentID}
                            />
                            <Label className="custom-control-label" for={this.props.incident.incidentID}/>
                        </div>
                    </Col>

                    <Col md={10} className={this.props.incident.unknown ? "text-muted" : ""}>
                        <section className={"incident-data-input__right-block"}>
                            <h5 className="font-weight-bold">{this.props.incident.intitule}</h5>
                            {this.props.incident.parentTicketIdToSet && !this.props.readOnly && this.props.is4steps &&
                            <FormTextInput type={"text"}
                                           name={"setParentTicketId"}
                                           disabled={!this.state.isChecked}
                                           onChange={this.handleTicketIdUpdated}
                                           validations={this.state.isChecked ? {
                                               isRequired: ValidationUtils.notEmpty,
                                               respectPattern: ValidationUtils.respectPattern(this.REFCTT_PATTERN)
                                           } : {}}
                                           forceDirty={true}
                                           placeholder={this.props.incidentSelected?.refCTT}
                            />
                            }
                        </section>
                        {isTicket ?
                            <h6> Référence d'incident : {this.props.incident.refCTT}</h6>
                            : <React.Fragment/>
                        }
                        {isTicket ?
                            <Collapse isOpen={collapse}>
                                {this.props.incident.description && <h6><FormattedMessage id={"act.ADG_MAXWELL.step.incidents.description"}/> :
                                </h6>} {this.props.incident.description}
                                 {this.props.incident.traitement && <h6><FormattedMessage id={"act.ADG_MAXWELL.step.incidents.treatment"}/> :
                                </h6>}{this.props.incident.traitement}
                                {this.props.incident.actions && <h6><FormattedMessage id={"act.ADG_MAXWELL.step.incidents.actions"}/> :
                                </h6>}{this.props.incident.actions}
                                {this.props.incident.discoursClient && <h6><FormattedMessage id={"act.ADG_MAXWELL.step.incidents.customerSpeech"}/> :
                                </h6>}{this.props.incident.discoursClient}
                            </Collapse>
                            : <React.Fragment/>}

                    </Col>

                    <Col md={1}>
                        {isTicket ?
                            <Button size="sm" color="primary" className="p-1" onClick={this.toggleNotes}>
                                <span className={"icon-white m-0 p-0 " + (collapse ? " icon-up" : " icon-down")}/>
                            </Button>
                            : <React.Fragment/>}
                    </Col>
                </Row>
            </section>
        );
    }
}

const mapStateToProps = (state: AppState, ownProps: Props) => ({
    payload: state.payload.payload
})
const mapDispatchToProps = {
    setGenericIncidentSelectedV2
}
export default connect(mapStateToProps, mapDispatchToProps)(IncidentDataInputV2)