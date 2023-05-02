import {parse} from "date-fns";
import * as React from "react";
import {FormattedMessage} from "react-intl";
import {connect} from "react-redux";
import {Col, Label, Row} from "reactstrap";
import Container from "reactstrap/lib/Container";
import {ClientContextSliceState} from "../../../../store/ClientContextSlice";
import {Client} from "../../../../model/person";
import Loading from "../../../../components/Loading";
import FormSelectInput from "../../../../components/Form/FormSelectInput";
import ValidationUtils from "../../../../utils/ValidationUtils";
import {translate} from "../../../../components/Intl/IntlGlobalProvider";
import FormTextInput from "../../../../components/Form/FormTextInput";
import FormHiddenInput from "../../../../components/Form/FormHiddenInput";
import {AppState} from "../../../../store";
import FormDateInputV2 from "../../../../components/Form/Date/FormDateInputV2";

interface State {
    dataForTheForm?: Client
}

interface Props {
    client: ClientContextSliceState
}

class EditAdministrativeDataV2 extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {dataForTheForm: undefined}
    }

    public componentDidMount = async () => {
        const dataForTheForm = this.props.client.clientData;
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
                        <Col sm={2}>
                            <Label for="ownerPerson.civility"><FormattedMessage
                                id="global.form.civility"/><span className="text-danger">*</span></Label>
                            <FormSelectInput name="ownerPerson.civility"
                                             id="person.civility"
                                             value={civility}
                                             bsSize={"sm"}
                                             validations={{isRequired: ValidationUtils.notEmpty}}>
                                <option value="MR">{translate.formatMessage({id: "global.form.civility.mr"})}</option>
                                <option value="MME">{translate.formatMessage({id: "global.form.civility.mrs"})}</option>
                                <option value="MLLE">{translate.formatMessage({id: "global.form.civility.miss"})}</option>
                            </FormSelectInput>
                        </Col>
                        <Col sm={5}>
                            <Label for="ownerPerson.firstName">
                                <FormattedMessage id="global.form.firstname"/><span className="text-danger">*</span>
                            </Label>
                            <FormTextInput name="ownerPerson.firstName" id="ownerPerson.firstName"
                                           value={firstName}
                                           bsSize={"sm"}
                                           validations={{
                                               isRequired: ValidationUtils.notEmpty,
                                               respectPattern: ValidationUtils.respectPattern(/^[a-zA-Z\u00C0-\u00FF-.' ]{0,25}$/)

                                           }}/>
                        </Col>
                        <Col sm={5}>
                            <Label for="ownerPerson.lastName">
                                <FormattedMessage id="global.form.lastname"/><span className="text-danger">*</span>
                            </Label>
                            <FormTextInput name="ownerPerson.lastName" id="ownerPerson.lastName"
                                           value={lastName}
                                           bsSize={"sm"}
                                           validations={{
                                               isRequired: ValidationUtils.notEmpty,
                                               respectPattern: ValidationUtils.respectPattern(/^[a-zA-Z\u00C0-\u00FF-.' ]{0,20}$/)
                                           }}/>
                        </Col>
                    </Row>
                    <Row className={"d-flex justify-content-around"}>
                        <Col sm={2}>
                            <Label for="ownerPerson.birthDate">
                                <FormattedMessage id="global.form.birth.date"/><span className="text-danger">*</span>
                            </Label>
                        </Col>
                        <Col sm={4}>
                            <FormDateInputV2 peekNextMonth showMonthDropdown showYearDropdown
                                             small
                                             name="ownerPerson.birthDate" id="ownerPerson.birthDate"
                                             value={birthDate ? parse(birthDate, "yyyy-MM-dd", new Date()) : undefined}
                                             validations={{isRequired: ValidationUtils.notEmpty}}/>
                        </Col>
                        <Col sm={3}>
                            <Label for="ownerPerson.birthCounty">
                                <FormattedMessage id="global.form.birth.county"/><span className="text-danger">*</span>
                            </Label>
                        </Col>
                        <Col sm={3}>
                            <FormTextInput name="ownerPerson.birthCounty" id="ownerPerson.birthCounty"
                                           value={birthDepartment}
                                           bsSize={"sm"}
                                           validations={{
                                               isRequired: ValidationUtils.notEmpty,
                                               isDepartmentNumber: ValidationUtils.departmentNumber
                                           }}/>
                        </Col>
                    </Row>
                    <FormHiddenInput className={"m-0"}
                                     id="ownerPerson.siret"
                                     name="ownerPerson.siret"
                                     value={siret}/>
                </Container>
            )
        }
    }
}

const mapStateToProps = (state: AppState) => ({
    client: state.store.client.currentClient
});

export default connect(mapStateToProps)(EditAdministrativeDataV2)
