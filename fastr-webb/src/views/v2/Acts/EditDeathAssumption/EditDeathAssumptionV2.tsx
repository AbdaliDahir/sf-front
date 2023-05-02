import * as moment from "moment";
import * as React from "react";
import {FormattedMessage} from "react-intl";
import {connect} from "react-redux";
import {Col, Container, FormGroup, Label, Row} from "reactstrap";
import {ClientContextSliceState} from "../../../../store/ClientContextSlice";
import {AppState} from "../../../../store";
import Loading from "../../../../components/Loading";
import FormSelectInput from "../../../../components/Form/FormSelectInput";
import {translate} from "../../../../components/Intl/IntlGlobalProvider";

// http://localhost:3000/acts/client/death?sessionId=dummy&payload=eyJpZENsaWVudCI6Ijg4ODkyMjg5IiwgImlkU2VydmljZSI6IjA5LVFBNDNHOSIsICJpZFRlY2huaXF1ZUFkcmVzc2VUaXR1bGFpcmUiOiIyNDg5ODM1NDciLCAiaWRUZWNobmlxdWVBZHJlc3NlVGl0dWxhaXJlQ1NVIjoiMjk0MzgxNjA0In0=

interface State {
    disabled: boolean,
    // tslint:disable-next-line:no-any TODO: a typer
    dataForTheForm: any
}

interface Props {
    // tslint:disable-next-line:no-any TODO: a typer
    data?: any,
    disableButton: boolean,
    client: ClientContextSliceState
}

class EditDeathAssumptionV2 extends React.Component<Props, State> {
    // private actService: ActService = new ActService(true);

    constructor(props: Props) {
        super(props);
        this.state = {disabled: true, dataForTheForm: null}
    }

    public componentDidMount = async () => {
        const data = {dueDate: moment().toISOString(), notification: true};
        const dataForTheForm = Object.assign(data, this.props.client.clientData);
        this.setState({dataForTheForm})
    };

    public render(): JSX.Element {
        if (this.state.dataForTheForm) {
            return (
                <Container>
                    <Row>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="physicalPerson.probablyDeceased"><FormattedMessage
                                    id={"acts.deathAssumption.status"}/></Label>
                                <FormSelectInput
                                    bsSize={"sm"}
                                    name="physicalPerson.probablyDeceased"
                                    id="physicalPerson.probablyDeceased"
                                    value={true}>
                                    <option value={'true'}>
                                        {translate.formatMessage({id: "acts.deathAssumption.status.likely"})}
                                    </option>
                                </FormSelectInput>
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <Label for={"physicalPerson.informationSource"}><FormattedMessage
                                    id={"acts.deathAssumption.information.source"}/></Label>
                                <FormSelectInput
                                    bsSize={"sm"}
                                    name="physicalPerson.informationSource"
                                    id="physicalPerson.informationSource"
                                    value={"PROCHE"}>
                                    <option
                                        value={translate.formatMessage({id: "acts.deathAssumption.information.source.relative.value"})}>
                                        {translate.formatMessage({id: "acts.deathAssumption.information.source.relative.message"})}
                                    </option>
                                </FormSelectInput>
                            </FormGroup>
                        </Col>
                    </Row>
                </Container>
            )
        } else {
            return (<Loading/>)
        }
    }

}

const mapStateToProps = (state: AppState) => ({
    client: state.store.client.currentClient
});


export default connect(mapStateToProps)(EditDeathAssumptionV2)

