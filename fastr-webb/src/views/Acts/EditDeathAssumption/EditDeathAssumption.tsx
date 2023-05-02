import * as moment from "moment";
import * as React from "react";
import {FormattedMessage} from "react-intl";
import {connect} from "react-redux";
import {Col, Container, FormGroup, Label, Row} from "reactstrap";
import FormSelectInput from "../../../components/Form/FormSelectInput";
import {translate} from "../../../components/Intl/IntlGlobalProvider";
import {Service} from "../../../model/service";
import {AppState} from "../../../store";
import {toggleBlockingUI} from "../../../store/actions";
import {fetchAndStoreClient} from "../../../store/actions/ClientContextActions";
import ClientContextProps from "../../../store/types/ClientContext";
import Loading from "../../../components/Loading";

type PropType = ClientContextProps<Service>

interface State {
    disabled: boolean,
    dataForTheForm: any
}

interface Props extends PropType {
    data?: any,
    disableButton: boolean
}

class EditDeathAssumption extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {disabled: true, dataForTheForm: null}
    }

    public componentDidMount = async () => {
        const data = {dueDate: moment().toISOString(), notification: true};
        const dataForTheForm = Object.assign(data, this.props.client.data);
        this.setState({dataForTheForm})
    };

    public render(): JSX.Element {
        if (this.state.dataForTheForm) {
            return (
                <Container>
                    <Row>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="physicalPerson.probablyDeceased">
                                    <FormattedMessage id={"acts.deathAssumption.status"}/>
                                </Label>
                                <FormSelectInput name="physicalPerson.probablyDeceased"
                                                 id="physicalPerson.probablyDeceased"
                                                 value={true}>
                                    <option value='true'>
                                        {translate.formatMessage({id: "acts.deathAssumption.status.likely"})}
                                    </option>
                                </FormSelectInput>
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <Label for={"physicalPerson.informationSource"}>
                                    <FormattedMessage id={"acts.deathAssumption.information.source"}/>
                                </Label>
                                <FormSelectInput name="physicalPerson.informationSource"
                                                 id="physicalPerson.informationSource"
                                                 value={"PROCHE"}>
                                    <option value={translate.formatMessage({id: "acts.deathAssumption.information.source.relative.value"})}>
                                        {translate.formatMessage({id: "acts.deathAssumption.information.source.relative.message"})}
                                    </option>
                                </FormSelectInput>
                            </FormGroup>
                        </Col>
                    </Row>
                </Container>
            )
        } else {
            return <Loading/>
        }
    }
}

const mapStateToProps = (state: AppState) => ({
    client: {
        data: state.client.data,
        loading: state.client.loading,
        error: state.client.error,
    }
});

const mapDispatchToProps = {
    loadClient: fetchAndStoreClient,
    toggleBlockingUI
};

export default connect(mapStateToProps, mapDispatchToProps)(EditDeathAssumption)

