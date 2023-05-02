import * as React from "react";
import {FormattedMessage} from "react-intl"
import {CardHeader, Card, CardBody} from "reactstrap"
import {CaseDataProperty} from "../../../../../model/CaseDataProperty"
import {setFormMaxellIncomplete} from "../../../../../store/actions";
import CaseDataInput from "../Fields/CaseDataInput"
import AdditionalDataStep from "./AdditionalDataStep"
import StepForm from "../../../../../components/Form/StepForm/StepForm"
import IncidentStep from "./IncidentStep";
import {GenericIncident} from "../../../../../model/GenericIncident";

import {connect} from "react-redux";
import {withFormsy} from "formsy-react";
import UploadComponent from "./UploadComponent";
import {PassDownProps} from "../../../../../@types/formsy-react/Wrapper";


interface Props extends PassDownProps {
    data: CaseDataProperty[]
    readOnly?: boolean
    onChange?: (id?: string, val?: string) => void
    setFormMaxellIncomplete: () => void
}

export interface MaxwellSectionState {
    incidentSelected?: GenericIncident
    // TODO PUT PJS HERE OR ON REDUX(AS YOU WISH)
}

class MaxwellSection extends React.Component<Props, MaxwellSectionState> {

    constructor(props: Props) {
        super(props)
        this.state = {}
    }

    public componentDidMount = async () => {
        this.props.setFormMaxellIncomplete()

    }

    public renderData = () => {
        return this.props.data && this.props.data.map((element, i) => (
                <CaseDataInput key={element.id} data={element} index={i}
                               disabled={this.props.readOnly}
                               onChange={this.props.onChange}/>)
            );
    }

    public handleSelectIncident = (incidentSelected: GenericIncident) => {
        this.setState({
            incidentSelected
        })
    }

    public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<MaxwellSectionState>): void {
        if (prevState.incidentSelected !== this.state.incidentSelected) {
            const {incidentSelected} = this.state
            this.props.setValue(incidentSelected)
        }
    }

    public render = () => {
        const {data} = this.props;

        if (data && !data.length) {
            return null
        }

        return (
            <Card className="mt-1">
                <CardHeader>
                    <span className="icon-gradient icon-diag mr-2"/><FormattedMessage
                    id={"cases.elements.additionnalData.maxwell"}/>
                </CardHeader>
                <CardBody>
                    {/* TODO: tmessaoudi 2019-09-20 l10n à faire dans tout maxwell*/}
                    <StepForm stepNames={["Questionnement", "Incidents", "Pièces jointes"]}>
                        <AdditionalDataStep  {...this.props}/>
                        <IncidentStep incidentSelected={this.state.incidentSelected}
                                      setIncidentSelected={this.handleSelectIncident}/>
                        <UploadComponent/>
                    </StepForm>
                </CardBody>
            </Card>
        )
    }
}

const mapDispatchToProps = {
    setFormMaxellIncomplete
}

export default connect(null, mapDispatchToProps)(withFormsy(MaxwellSection))
