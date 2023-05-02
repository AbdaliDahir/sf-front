import {parse} from "date-fns";
import * as React from "react";
import {FormattedMessage} from "react-intl";
import {Col, FormGroup, Label, Row} from "reactstrap";
import {Person} from "../../../../../../model/person";
import FormSelectInput from "../../../../../../components/Form/FormSelectInput";
import {translate} from "../../../../../../components/Intl/IntlGlobalProvider";
import FormTextInput from "../../../../../../components/Form/FormTextInput";
import ValidationUtils from "../../../../../../utils/ValidationUtils";
import FormDateInput from "../../../../../../components/Form/Date/FormDateInput";

interface Props {
    title: string,
    defaultValue?: Person
}

interface State {
    defaultValue: Partial<Person>
}

export default class EditServiceUserStepV2 extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            defaultValue: props.defaultValue ? props.defaultValue : {}
        }
    }


    public render(): JSX.Element {
        const {civility, firstName, lastName, birthDate} = this.state.defaultValue;
        return (
            <Row>
                <Col md={3}>
                    <FormGroup>
                        <Label for="act.civility">
                            <FormattedMessage id="global.form.civility"/>
                            <span className="text-danger">*</span>
                        </Label>
                        <FormSelectInput bsSize={"sm"} name="act.civility" id="act.civility" value={civility}>
                            <option
                                value="MR">{translate.formatMessage({id: "global.form.civility.mr"})}</option>
                            <option
                                value="MME">{translate.formatMessage({id: "global.form.civility.mrs"})}</option>
                            <option
                                value="MLLE">{translate.formatMessage({id: "global.form.civility.miss"})}</option>
                        </FormSelectInput>
                    </FormGroup>
                </Col>
                <Col md={3}>

                    <FormGroup>
                        <Label for="act.firstName"><FormattedMessage id="global.form.firstname"/><span
                            className="text-danger">*</span></Label>
                        <FormTextInput bsSize={"sm"}
                            value={firstName}
                                       validations={{
                                           isRequired: ValidationUtils.notEmpty,
                                           respectPattern: ValidationUtils.respectPattern(/^[a-zA-Z\u00C0-\u00FF-.' ]{0,20}$/)
                                       }} id="act.firstName"
                                       name="act.firstName"/>
                    </FormGroup>
                </Col>
                <Col md={3}>
                    <FormGroup>
                        <Label for="act.lastName"><FormattedMessage id="global.form.lastname"/><span
                            className="text-danger">*</span></Label>
                        <FormTextInput bsSize={"sm"}
                                       value={lastName}
                                       validations={{
                                           isRequired: ValidationUtils.notEmpty,
                                           respectPattern: ValidationUtils.respectPattern(/^[a-zA-Z\u00C0-\u00FF-.' ]{0,25}$/)
                                       }} id="act.lastName"
                                       name="act.lastName"/>
                    </FormGroup>
                </Col>
                <Col md={3}>
                    <FormGroup>
                        <Label for="act.birthDate"><FormattedMessage id="global.form.birth.date"/><span
                            className="text-danger">*</span></Label>
                        <FormDateInput peekNextMonth showMonthDropdown showYearDropdown small
                                       value={birthDate ? parse(birthDate, "yyyy-MM-dd", new Date()) : undefined}
                                       maxDate={new Date(new Date().setFullYear(new Date().getFullYear() - 5))}
                                       validations={{isRequired: ValidationUtils.notEmpty}} id="act.birthDate"
                                       name="act.birthDate"
                        />
                    </FormGroup>
                </Col>
            </Row>
        )
    }
}
