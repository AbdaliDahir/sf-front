import * as React from 'react';
import {FormattedMessage} from "react-intl";
import {NotificationManager} from "react-notifications";
import {connect} from "react-redux";
import {Button, Col, Label, Row} from "reactstrap";
import {Address} from "../../../../../model/person";
import {AppState} from "../../../../../store";
import {setIsDateHereForADGCTIV2} from "../../../../../store/actions/v2/case/CaseActions";
import {CaseState} from "../../../../../store/reducers/v2/case/CasesPageReducerV2";
import {validateEmail} from "../../../../../utils/ContactUtils";
import ValidationUtils from "../../../../../utils/ValidationUtils";
import {translate} from "../../../../../components/Intl/IntlGlobalProvider";
import FormSelectInput from "../../../../../components/Form/FormSelectInput";
import FormTextInput from "../../../../../components/Form/FormTextInput";
import FormDateInput from "../../../../../components/Form/Date/FormDateInput";
import AddressInput from "../../../../../components/Form/Address/AddressInput";
import ContactForm from "../../../../../components/Views/ContactForm";

interface Props {
    saveData?: <T extends string | Date | boolean | Address>(key: string, value: T) => void,
    validate?: () => void
    // tslint:disable-next-line:no-any TODO: To correct
    getValuesFromFields: () => { form: any }
    setIsDateHereForADGCTIV2: (caseId: string, value: boolean) => void
    currentCases
    caseId: string
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

class NewLegalResponsibleV2 extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            selectedInputForm: 'simple',
            isSimpleAddressValid: false,
            isAdvancedAddressValid: false
        }
    }

    private currentCaseState = (): CaseState => {
        return this.props.currentCases[this.props.caseId]
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
            const validAddress = this.state.isSimpleAddressValid;
            return validAddress
        }
        if (this.state.selectedInputForm === "advanced" && form.editOwnerAct.address) {
            const validAdvancedAddress = this.state.isAdvancedAddressValid;
            return validAdvancedAddress
        }
        return false;
    }

    public validate = () => {
        if (!this.isPersonValid() || !this.isContactValid() || !this.currentCaseState().isDateHereForADGCTI || !this.isAdvancedAdressValid()) {
            NotificationManager.error(<FormattedMessage id="validation.general.message"/>);
        } else {
            if (this.props.validate) {
                this.props.validate();
                this.props.setIsDateHereForADGCTIV2(this.props.caseId, false)
            }
        }
    }

    public setDateIsHere = (date) => {
        this.props.setIsDateHereForADGCTIV2(this.props.caseId, !!date)
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
        maxDate.setFullYear(maxDate.getFullYear() - 18)
        return (
            <React.Fragment>
                <Row className="d-flex justify-content-center mb-3">
                    <h6>{translate.formatMessage({id: "acts.holder.legalResponsible.title"})}</h6>
                </Row>

                <Row>
                    <Col md={3}>
                        <Label for="civility"><FormattedMessage id="global.form.civility"/><span className="text-danger">*</span></Label>
                        <FormSelectInput name="legalResponsible.responsible.civility"
                                         id="legalResponsible.responsible.civility"
                                         bsSize={"sm"}
                                         validations={{isRequired: ValidationUtils.notEmpty}}>
                            <option/>
                            <option value="MR">{translate.formatMessage({id: "global.form.civility.mr"})}</option>
                            <option value="MME">{translate.formatMessage({id: "global.form.civility.mrs"})}</option>
                            <option
                                value="MLLE">{translate.formatMessage({id: "global.form.civility.miss"})}</option>
                        </FormSelectInput>
                    </Col>
                    <Col md={4}>
                        <Label for="firstName"><FormattedMessage id="global.form.firstname"/><span className="text-danger">*</span></Label>
                        <FormTextInput name="legalResponsible.responsible.firstName"
                                       id="legalResponsible.responsible.firstName"
                                       bsSize={"sm"}
                                       validations={{isRequired: ValidationUtils.notEmpty, respectPattern: ValidationUtils.respectPattern(/^[a-zA-Z\u00C0-\u00FF-.' ]*$/)}}/>
                    </Col>
                    <Col md={5}>
                        <Label for="lastName"><FormattedMessage id="global.form.lastname"/><span className="text-danger">*</span></Label>
                        <FormTextInput name="legalResponsible.responsible.lastName"
                                       id="legalResponsible.responsible.lastName"
                                       bsSize={"sm"}
                                       validations={{isRequired: ValidationUtils.notEmpty, respectPattern: ValidationUtils.respectPattern(/^[a-zA-Z\u00C0-\u00FF-.' ]*$/)}}/>
                    </Col>
                </Row>
                <Row>
                    <Col md={3}>
                        <Label for="birthDate"><FormattedMessage id="global.form.birth.date"/><span className="text-danger">*</span></Label>
                        <FormDateInput name="legalResponsible.responsible.birthDate"
                                       id="legalResponsible.responsible.birthDate" maxDate={maxDate}
                                       onChange={this.setDateIsHere}
                                       showYearDropdown
                                       small
                        />
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
                            <Button id="newLegalResponsible.submit.button.id" size="sm" color="secondary"
                                    onClick={this.validate} block>
                                <FormattedMessage id="wizardform.next"/>
                            </Button>
                        </div>
                    </Col>
                </Row>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state: AppState) => ({
    currentCases: state.store.cases.casesList
});

const mapDispatchToProps = {
    setIsDateHereForADGCTIV2
}
export default connect(mapStateToProps, mapDispatchToProps)(NewLegalResponsibleV2)
