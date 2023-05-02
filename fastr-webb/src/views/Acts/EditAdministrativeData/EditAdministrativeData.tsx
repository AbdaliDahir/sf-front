import {parse} from "date-fns";
import * as React from "react";
import {FormattedMessage} from "react-intl";
import {connect} from "react-redux";
import {Col, FormGroup, Label, Row} from "reactstrap";
import Container from "reactstrap/lib/Container";
import FormDateInput from "../../../components/Form/Date/FormDateInput";
import FormSelectInput from "../../../components/Form/FormSelectInput";
import FormTextInput from "../../../components/Form/FormTextInput";
import {translate} from "../../../components/Intl/IntlGlobalProvider";
import {Client} from "../../../model/person";
import {Service} from "../../../model/service";
import {AppState} from "../../../store";
import {toggleBlockingUI} from "../../../store/actions";
import {fetchAndStoreClient} from "../../../store/actions/ClientContextActions";
import ClientContextProps from "../../../store/types/ClientContext";
import ValidationUtils from "../../../utils/ValidationUtils";
import Loading from "../../../components/Loading";
import FormHiddenInput from "../../../components/Form/FormHiddenInput";

type PropType = ClientContextProps<Service>

interface State {
    dataForTheForm?: Client
}

interface Props extends PropType {
    idClient: string,
    idService: string
}

class EditAdministrativeData extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {dataForTheForm: undefined}
    }

    public componentDidMount = async () => {
        const dataForTheForm = this.props.client.data;
        this.setState({dataForTheForm})
    };

    public render(): JSX.Element {
        const {dataForTheForm} = this.state;
        if (!dataForTheForm) {
            return (<Loading/>)
        } else {
            const {ownerPerson: {civility, firstName, lastName, birthDate, birthDepartment}, siret} = dataForTheForm;
            return (
                <Container>
                    <Row>
                        <Col md={3}>
                            <FormGroup>
                                <Label for="ownerPerson.civility"><FormattedMessage
                                    id="global.form.civility"/><span className="text-danger">*</span></Label>
                                <FormSelectInput name="ownerPerson.civility" id="person.civility" value={civility}
                                                 validations={{isRequired: ValidationUtils.notEmpty}}>
                                    <option value="MR">{translate.formatMessage({id: "global.form.civility.mr"})}</option>
                                    <option value="MME">{translate.formatMessage({id: "global.form.civility.mrs"})}</option>
                                    <option value="MLLE">{translate.formatMessage({id: "global.form.civility.miss"})}</option>
                                </FormSelectInput>
                            </FormGroup>
                        </Col>
                        <Col md={4}>
                            <FormGroup>
                                <Label for="ownerPerson.firstName">
                                    <FormattedMessage id="global.form.firstname"/><span className="text-danger">*</span>
                                </Label>
                                <FormTextInput name="ownerPerson.firstName" id="ownerPerson.firstName"
                                               value={firstName}
                                               validations={{
                                                   isRequired: ValidationUtils.notEmpty,
                                                   respectPattern: ValidationUtils.respectPattern(/^[a-zA-Z\u00C0-\u00FF-.' ]{0,20}$/)
                                               }}/>
                            </FormGroup>
                        </Col>
                        <Col md={5}>
                            <FormGroup>
                                <Label for="ownerPerson.lastName">
                                    <FormattedMessage id="global.form.lastname"/><span className="text-danger">*</span>
                                </Label>
                                <FormTextInput name="ownerPerson.lastName" id="ownerPerson.lastName"
                                               value={lastName}
                                               validations={{
                                                   isRequired: ValidationUtils.notEmpty,
                                                   respectPattern: ValidationUtils.respectPattern(/^[a-zA-Z\u00C0-\u00FF-.' ]{0,25}$/)
                                               }}/>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row className={"d-flex justify-content-around"}>

                        <FormGroup>
                            <Label for="ownerPerson.birthDate">
                                <FormattedMessage id="global.form.birth.date"/><span className="text-danger">*</span>
                            </Label>
                            <FormDateInput peekNextMonth showMonthDropdown showYearDropdown
                                           name="ownerPerson.birthDate" id="ownerPerson.birthDate"
                                           value={birthDate ? parse(birthDate, "yyyy-MM-dd", new Date()) : undefined}
                                           validations={{isRequired: ValidationUtils.notEmpty}}/>
                        </FormGroup>

                        <FormGroup>
                            <Label for="ownerPerson.birthCounty">
                                <FormattedMessage id="global.form.birth.county"/><span className="text-danger">*</span>
                            </Label>
                            <FormTextInput name="ownerPerson.birthCounty" id="ownerPerson.birthCounty"
                                           value={birthDepartment}
                                           validations={{
                                               isRequired: ValidationUtils.notEmpty,
                                               isDepartmentNumber: ValidationUtils.departmentNumber
                                           }}/>
                        </FormGroup>
                    </Row>
                    <FormGroup>
                        <FormHiddenInput id="ownerPerson.siret" name="ownerPerson.siret" value={siret}/>
                    </FormGroup>
                </Container>
            )
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

export default connect(mapStateToProps, mapDispatchToProps)(EditAdministrativeData)
