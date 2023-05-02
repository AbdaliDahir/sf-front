import * as React from "react";
import {FormattedMessage} from "react-intl";
import {NotificationManager} from "react-notifications";
import {connect} from "react-redux";
import {Button, Col, Container, Row} from "reactstrap";
import AddressForm from "../../../../components/Views/AddressForm";
import ContactForm from "../../../../components/Views/ContactForm";
import PersonalDataForm from "../../../../components/Views/PersonalDataForm";

import {Address, Client, Corporation, Person} from "../../../../model/person";
import {AppState} from "../../../../store";
import {setIsDateHereForADGCTI} from "../../../../store/actions/CasePageAction";
import {validateEmail} from "../../../../utils/ContactUtils";
import ValidationUtils from "../../../../utils/ValidationUtils";

interface Props {
    defaultValue?: Client
    saveData?: <T extends string | Date | boolean | Address>(key: string, value: T) => void
    title?: string,
    validate?: () => void
    // tslint:disable-next-line:no-any TODO: To correct
    getValuesFromFields: () => { form: any }
    isDateValue
    setIsDateHereForADGCTI
    onSelectInputForm?: (key: string) => void
    isSimpleAddressValid?: (bool: boolean) => void
    isAdvancedAddressValid?: (bool: boolean) => void
}

interface State {
    disabled: boolean,
    ownerPerson?: { civility: string, firstName: string, lastName: string, birthDepartment: string },
    ownerCorporation?: { name: string, legalCreationDate: string },
    address: Address | undefined,
    siren?: string,
    siret?: string,
    contact: { email: string },
    corporation: boolean
    personWithSiret: boolean,
    selectedInputForm?: string
    isSimpleAddressValid?: boolean
    isAdvancedAddressValid?: boolean
}

export interface FormData {
    contact: { phone: string, cellphone: string, fax: string, other: string, email: string }
    ownerPerson: Person
    ownerCorporation: Corporation
}

class NewOwner extends React.Component<Props, State> {

    public constructor(props: Props) {
        super(props);

        this.state = {
            disabled: true,
            ownerPerson: {
                civility: "",
                firstName: "",
                lastName: "",
                birthDepartment: ""
            },
            ownerCorporation: {name: "", legalCreationDate: ""},
            contact: {
                email: ""
            },
            address: undefined,
            corporation: false,
            personWithSiret: false,
            selectedInputForm: 'simple',
            isSimpleAddressValid: false,
            isAdvancedAddressValid: false
        }
    }

    /*    public componentDidMount() {
            this.isValid();
        }*/

    /*    public componentDidUpdate() {
            this.isValid();
        }*/

    /*    public componentDidUpdate(prevProps: Props) {

            // tslint:disable-next-line:no-any TODO: To correct
            const allForm: any = this.props.getValuesFromFields();
            console.warn(allForm)

            // tslint:disable-next-line:no-any TODO: To correct
            const allPreviousForm: any = prevProps.getValuesFromFields();
            console.warn(allPreviousForm)

            if (allForm !== undefined && JSON.stringify(allPreviousForm) !== JSON.stringify(allForm)) {
                this.isValid();
            }
        }*/

    // TODO another way to save simple adresse / also used for saving corporation status
    public saveData = (key: string, value: string | Date | boolean | Address) => {
        if (this.props.saveData) {
            this.props.saveData(key, value);
        }
    }

    /*    public isValid = () => {
            if (this.isPersonValid() && this.isContactValid() && this.isAddressValid()) {
                this.setState({disabled: false})
            } else {
                this.setState({disabled: true})
            }
        }*/

    public isPersonValid: ()=> boolean = () => {
        // tslint:disable-next-line:no-any TODO: To correct
        const form: any = this.props.getValuesFromFields();
        const firstNamePattern = /^[a-zA-Z\u00C0-\u00FF-.' ]{1,20}$/
        const lastNamePattern = /^[a-zA-Z\u00C0-\u00FF-.' ]{1,25}$/

        if (form === undefined || (undefined === form.ownerPerson && undefined === form.ownerCorporation) ) {
            return false;
        }

        if (!form.corporation) {
            const {civility, firstName, lastName, birthDepartment} = form.ownerPerson!
            return !!civility && firstNamePattern.test(firstName) && lastNamePattern.test(lastName) && !!birthDepartment && true === ValidationUtils.departmentNumber([], birthDepartment)
        } else {
            return !!form.ownerCorporation!.name && !!form.siret;
        }
    }

    public isContactValid = () => {
        // tslint:disable-next-line:no-any TODO: To correct
        const form: any = this.props.getValuesFromFields();
        return !!form.contact.email && validateEmail(form.contact.email) && this.isPhoneContactValid(form);
    }

    // tslint:disable-next-line:no-any TODO: To correct
    public isPhoneContactValid = (form: any) => {
        return (!form.contact.phone || !form.contact.phone.startsWith("+33") || true === ValidationUtils.isFrenchPhoneNumber([], form.contact.phone, "FIXE"))
            && (!form.contact.cellphone || !form.contact.cellphone.startsWith("+33") || true === ValidationUtils.isFrenchMobilePhoneNumber([], form.contact.cellphone))
            && this.isOtherContactValid(form.contact.fax)
            && this.isOtherContactValid(form.contact.other)
    }

    // tslint:disable-next-line:no-any TODO: To correct
    public isOtherContactValid = (otherNumber: string) => {
        if (!otherNumber) {
            return true
        }
        if (!otherNumber.startsWith("+33")) {
            return true
        }
        return true === ValidationUtils.isFrenchPhoneNumber([], otherNumber, "OTHER")
    }

    public isAddressValid = () => {
        // tslint:disable-next-line:no-any TODO: To correct
        const form: any = this.props.getValuesFromFields();
        if (form.editOwnerAct["address.address1"]) {
            return !!form.editOwnerAct["address.address1"]
        }
        if (form.editOwnerAct.address) {
            return !!form.editOwnerAct.address.address1
        }
        return false;
    }

    public isAdvancedAdressValid = () => {
        // tslint:disable-next-line:no-any TODO: To correct
        const form: any = this.props.getValuesFromFields();
        if (this.state.selectedInputForm === "simple" && form.editOwnerAct.address) {
            const validAddress  = this.state.isSimpleAddressValid;
            return validAddress
        }
        if (this.state.selectedInputForm === "advanced" && form.address) {
            const validAdvancedAddress  = this.state.isAdvancedAddressValid;
            return validAdvancedAddress
        }
        return false;
    }

    private isSiretValid = () => {
        const form: any = this.props.getValuesFromFields();
        const siret = form.siret;
        const corporationValue = form?.corporation;
        const personWithSiretValue = form?.personWithSiret;
        if((corporationValue == undefined || corporationValue === false) && (personWithSiretValue === false || personWithSiretValue == undefined)) {
            return true;
        } else if (form === undefined || siret === undefined) {
            return false;
        } else if (ValidationUtils.siretNumberValidation([], siret) === true) {
            return true;
        }
        return false;
    }

    /*    public allowNextStep = (event: ChangeEvent<HTMLInputElement>) => {
            if (this.isPersonValid()) {
                this.setState({disabled: false})
            } else {
                this.setState({disabled: true})
            }
        }*/

    public validate = () => {
        if (!this.isPersonValid() || !this.isContactValid() || !this.isAddressValid() || !this.props.isDateValue || !this.isAdvancedAdressValid() || !this.isSiretValid()) {
            NotificationManager.error(<FormattedMessage id="validation.general.message"/>);
        } else {
            if (this.props.validate) {
                this.props.validate();
                this.props.setIsDateHereForADGCTI(false)
            }
        }
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

    public render(): JSX.Element {
        return (
            <Container>
                <Row className="d-flex justify-content-center mb-3">
                    <h6>Saisie du repreneur
                    </h6>
                </Row>

                <PersonalDataForm saveData={this.saveData}/>
                <ContactForm title="Contact" name="contact"/>
                <AddressForm saveData={this.saveData}
                             onSelectInputForm={this.onSelectInputForm}
                             isSimpleAddressValid={this.isSimpleAddressValid}
                             isAdvancedAddressValid={this.isAdvancedAddressValid}/>

                <Row>
                    <Col>
                        <div className="mb-2 d-inline-flex float-right">
                            <Button id="newOwner.validate.button.id" size="sm" color="secondary" onClick={this.validate}
                                    block>
                                <FormattedMessage id="wizardform.next"/>
                            </Button>
                        </div>
                    </Col>
                </Row>

            </Container>
        )
    }
}

const mapStateToProps = (state: AppState) => ({
    isDateValue: state.casePage.isDateHereForADGCTI
});


const mapDispatchToProps = dispatch => (
    {
        setIsDateHereForADGCTI: value => {
            dispatch(setIsDateHereForADGCTI(value))
        }
    }
)

export default connect(mapStateToProps, mapDispatchToProps)(NewOwner)
