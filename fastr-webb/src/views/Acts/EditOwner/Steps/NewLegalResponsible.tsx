import * as React from 'react';
import {FormattedMessage} from "react-intl";
import {NotificationManager} from "react-notifications";
import {connect} from "react-redux";
import {Button, Col, Container, FormGroup, Label, Row} from "reactstrap";
import AddressInput from "../../../../components/Form/Address/AddressInput";
import FormDateInput from "../../../../components/Form/Date/FormDateInput";
import FormSelectInput from "../../../../components/Form/FormSelectInput";
import FormTextInput from "../../../../components/Form/FormTextInput";
import {translate} from "../../../../components/Intl/IntlGlobalProvider";
import ContactForm from "../../../../components/Views/ContactForm";
import {Address} from "../../../../model/person";
import {AppState} from "../../../../store";
import {setIsDateHereForADGCTI} from "../../../../store/actions/CasePageAction";
import {validateEmail} from "../../../../utils/ContactUtils";
import ValidationUtils from "../../../../utils/ValidationUtils";

interface Props {
    saveData?: <T extends string | Date | boolean | Address>(key: string, value: T) => void,
    validate?: () => void
    // tslint:disable-next-line:no-any TODO: To correct
    getValuesFromFields: () => { form: any }
    setIsDateHereForADGCTI
    isDateValue
}

interface State {
    legalResponsible?: {
        responsible?: { civility?: string, firstName?: string, lastName?: string, address?: Address },
        contactEmail?,
        contactPhoneNumber?,
        contactMobilePhoneNumber?
    },
    selectedInputForm?: string
    isSimpleAddressValid?: boolean
    isAdvancedAddressValid?: boolean
}

class NewLegalResponsible extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            selectedInputForm: 'simple',
            isSimpleAddressValid: false,
            isAdvancedAddressValid: false
        }
    }

    public saveAddress = (key: string, value: string | Date | boolean | Address) => {
        if (this.props.saveData) {
            this.props.saveData(key, value)
        }
    }

    public isContactValid = () => {
        // tslint:disable-next-line:no-any TODO: To correct
        const form: any = this.props.getValuesFromFields();

        if (form === undefined || undefined === form.legalResponsible) {
            return;
        }

        const {email} = form.legalResponsible.contact
        return (!email || validateEmail(email)) && this.isPhoneContactValid(form);
    }

    // tslint:disable-next-line:no-any TODO: To correct
    public isPhoneContactValid = (form: any) => {
        const {contact} = form.legalResponsible
        return (!contact.phone || !contact.phone.startsWith("+33") || true === ValidationUtils.isFrenchPhoneNumber([], contact.phone, "FIXE"))
            && (!contact.cellphone || !contact.cellphone.startsWith("+33") || true === ValidationUtils.isFrenchMobilePhoneNumber([], contact.cellphone))
    }

    public isPersonValid = () => {
        // tslint:disable-next-line:no-any TODO: To correct
        const form: any = this.props.getValuesFromFields();

        if (form === undefined || undefined === form.legalResponsible || undefined === form.legalResponsible.responsible) {
            return;
        }

        const {civility, firstName, lastName} = form.legalResponsible.responsible
        return !!civility && !!firstName && !!lastName
    }

    public isAdvancedAdressValid = () => {
        // tslint:disable-next-line:no-any TODO: To correct
        const form: any = this.props.getValuesFromFields();
        if (this.state.selectedInputForm === "simple" && form.editOwnerAct.address) {
            const validAddress  = this.state.isSimpleAddressValid;
            return validAddress
        }
        if (this.state.selectedInputForm === "advanced" && form.editOwnerAct.address) {
            const validAdvancedAddress  = this.state.isAdvancedAddressValid;
            return validAdvancedAddress
        }
        return false;
    }

    public validate = () => {
        if (!this.isPersonValid() || !this.isContactValid() || !this.props.isDateValue || !this.isAdvancedAdressValid()) {
            NotificationManager.error(<FormattedMessage id="validation.general.message"/>);
        } else {
            if (this.props.validate) {
                this.props.validate();
                this.props.setIsDateHereForADGCTI(false)
            }
        }
    }

    public setDateIsHere = (date) => {
        this.props.setIsDateHereForADGCTI(date)
    }

    public onSelectInputForm = (key: string) => {
        this.setState({selectedInputForm: key});
    }

    public isSimpleAddressValid = (bool: boolean) => {
        this.setState({isSimpleAddressValid: bool});
    }

    public isAdvancedAddressValid = (bool: boolean) => {
        this.setState({isAdvancedAddressValid: bool});
    }

    public render() {
        const maxDate = new Date()
        maxDate.setFullYear(maxDate.getFullYear() - 18 )
        return (
            <Container>

                <Row className="d-flex justify-content-center mb-3">
                    <h6>{translate.formatMessage({id: "acts.holder.legalResponsible.title"})}</h6>
                </Row>

                <Row>
                    <Col md={3}>
                        <FormGroup>
                            <Label for="civility"><FormattedMessage id="global.form.civility"/><span className="text-danger">*</span></Label>
                            <FormSelectInput name="legalResponsible.responsible.civility"
                                             id="legalResponsible.responsible.civility"
                                             validations={{isRequired: ValidationUtils.notEmpty}}>
                                <option/>
                                <option value="MR">{translate.formatMessage({id: "global.form.civility.mr"})}</option>
                                <option value="MME">{translate.formatMessage({id: "global.form.civility.mrs"})}</option>
                                <option
                                    value="MLLE">{translate.formatMessage({id: "global.form.civility.miss"})}</option>
                            </FormSelectInput>
                        </FormGroup>
                    </Col>
                    <Col md={4}>
                        <FormGroup>
                            <Label for="firstName"><FormattedMessage id="global.form.firstname"/><span className="text-danger">*</span></Label>
                            <FormTextInput name="legalResponsible.responsible.firstName"
                                           id="legalResponsible.responsible.firstName"
                                           validations={{isRequired: ValidationUtils.notEmpty, respectPattern: ValidationUtils.respectPattern(/^[a-zA-Z\u00C0-\u00FF-.' ]*$/)}}/>
                        </FormGroup>
                    </Col>
                    <Col md={5}>
                        <FormGroup>
                            <Label for="lastName"><FormattedMessage id="global.form.lastname"/><span className="text-danger">*</span></Label>
                            <FormTextInput name="legalResponsible.responsible.lastName"
                                           id="legalResponsible.responsible.lastName"
                                           validations={{isRequired: ValidationUtils.notEmpty, respectPattern: ValidationUtils.respectPattern(/^[a-zA-Z\u00C0-\u00FF-.' ]*$/)}}/>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md={3}>
                        <FormGroup>
                            <Label for="birthDate"><FormattedMessage id="global.form.birth.date"/><span className="text-danger">*</span></Label>
                            <FormDateInput name="legalResponsible.responsible.birthDate"
                                           id="legalResponsible.responsible.birthDate" maxDate={maxDate}
                                           onChange={this.setDateIsHere}
                                           showYearDropdown
                                           />
                        </FormGroup>
                    </Col>
                </Row>
                <AddressInput name="legalResponsible.responsible.address"
                              saveData={this.saveAddress}
                              onSelectInputForm={this.onSelectInputForm}
                              isSimpleAddressValid={this.isSimpleAddressValid}
                              isAdvancedAddressValid={this.isAdvancedAddressValid}/>

                <ContactForm title="Contact" name="legalResponsible.contact" simpleForm optionalEmail/>
                <Row>
                    <Col>
                        <div className="mb-2 d-inline-flex float-right">
                            <Button id="newLegalResponsible.submit.button.id" size="lg" color="secondary"
                                    onClick={this.validate} block>
                                <FormattedMessage id="wizardform.next"/>
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        )
    }
}
const mapDispatchToProps = dispatch => (
    {
        setIsDateHereForADGCTI: (date) => dispatch(setIsDateHereForADGCTI(date))
    }
)
const mapStateToProps = (state: AppState) => ({
    isDateValue: state.casePage.isDateHereForADGCTI
});

export default connect(mapStateToProps, mapDispatchToProps)(NewLegalResponsible)
