import * as React from "react";
import {FormattedMessage} from "react-intl";
import {Col, Label, Row} from "reactstrap";
import ValidationUtils from "../../utils/ValidationUtils";
import FormTextInput from "../Form/FormTextInput";
import FormPhoneInput from '../Form/Phone/FormPhoneInput'

interface Props {
    title: string,
    defaultValue?: { contact: { phone: string, cellphone: string, fax: string, other: string, email: string } }
    saveData?: <T extends string | Date | boolean>(key: string, value: T) => void
    simpleForm?: boolean
    withPhonesConstraints?: boolean
    name: string
    optionalEmail?: boolean
}

interface State {
    isFRFixeNumber: boolean
    isFRMobileNumber: boolean
    isFROtherNumber: boolean
    defaultValue?: { contact: { phone: string, cellphone: string, fax: string, other: string, email: string } }
    inputCellPhone: string
    inputPhone: string
}

export default class ContactForm extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            isFRFixeNumber: true,
            isFRMobileNumber: true,
            isFROtherNumber: true,
            defaultValue: this.props.defaultValue,
            inputCellPhone: this.props.defaultValue ? this.props.defaultValue?.contact.cellphone : "",
            inputPhone: this.props.defaultValue ? this.props.defaultValue?.contact.phone : ""
        }
    }

    public checkCountryForValidation = (type: string) => (countryCode: string) => {
        if ("FR" === countryCode) {
            if ("FIXE" === type) {
                this.setState({isFRFixeNumber: true})
            } else if ("MOBILE" === type) {
                this.setState({isFRMobileNumber: true})
            } else {
                this.setState({isFROtherNumber: true})
            }

        } else {
            if ("FIXE" === type) {
                this.setState({isFRFixeNumber: false})
            } else if ("MOBILE" === type) {
                this.setState({isFRMobileNumber: false})
            } else {
                this.setState({isFROtherNumber: false})
            }
        }
    }

    public saveData = (key: string, value: string) => {
        if(key === "contact.cellphone" || key === "legalResponsible.contact.cellphone") {
            this.setState({inputCellPhone: value})
        }

        if(key === "contact.phone" || key === "legalResponsible.contact.phone") {
            this.setState({inputPhone: value})
        }
    }

    public render(): JSX.Element {
        return (
            <React.Fragment>
                    {!this.props.simpleForm &&
                        <div>
                            {this.props.withPhonesConstraints ? this.FormWithPhonesConstraints() : this.phoneForm()}
                            <Row>
                                <Col size={6}>
                                    <Label for="contact.fax"><FormattedMessage id="global.fax"/></Label>
                                    <FormPhoneInput
                                        id={`${this.props.name}.fax`}
                                        name={`${this.props.name}.fax`}
                                        value={this.state.defaultValue ? this.state.defaultValue.contact.fax : ""}
                                        small
                                        validations={this.state.isFROtherNumber ? {"isValidFrenchPhoneNumber": "FAX"} : {}}
                                        onCountryChange={this.checkCountryForValidation("FAX")}
                                    />
                                </Col>
                                <Col size={6}>
                                    <Label for="contact.other"><FormattedMessage id="global.other"/></Label>
                                    <FormPhoneInput
                                        id={`${this.props.name}.other`}
                                        name={`${this.props.name}.other`}
                                        value={this.state.defaultValue ? this.state.defaultValue.contact.other : ""}
                                        small
                                        validations={this.state.isFROtherNumber ? {"isValidFrenchPhoneNumber": "OTHER"} : {}}
                                        onCountryChange={this.checkCountryForValidation("OTHER")}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={12} lg={1}>
                                    <Label for="contact.email"><FormattedMessage id="EMAIL"/><span
                                        className="text-danger">*</span></Label>
                                </Col>
                                <Col sm={12} lg={11}>
                                    <FormTextInput id={`${this.props.name}.email`}
                                                   name={`${this.props.name}.email`}
                                                   value={this.state.defaultValue ? this.state.defaultValue.contact.email : ""}
                                                   bsSize={"sm"}
                                                   forceDirty
                                                   validations={{isEmail: true, isRequired: ValidationUtils.notEmpty}}
                                        // TODO: Fichier de langue
                                                   validationErrors={{isEmail: 'Veuillez renseigner une adresse email correcte'}}/>
                                </Col>
                            </Row>
                        </div>}

                    {this.props.simpleForm &&
                        <div>
                            <Row>
                                <Col size={4}>
                                    <Label for="contact.phone"><FormattedMessage id="global.phone"/></Label>
                                    <FormPhoneInput
                                        id={`${this.props.name}.phone`}
                                        name={`${this.props.name}.phone`}
                                        value={this.state.defaultValue ? this.state.defaultValue.contact.phone : ""}
                                        small
                                        validations={this.state.isFRFixeNumber ? {"isValidFrenchPhoneNumber": "FIXE"} : {}}
                                        onCountryChange={this.checkCountryForValidation("FIXE")}
                                    />
                                </Col>
                                <Col size={4}>
                                    <Label for="contact.cellphone"><FormattedMessage id="global.cellphone"/></Label>
                                    <FormPhoneInput
                                        id={`${this.props.name}.cellphone`}
                                        name={`${this.props.name}.cellphone`}
                                        value={this.state.defaultValue ? this.state.defaultValue.contact.cellphone : ""}
                                        validations={this.state.isFRMobileNumber ? {isValidFrenchMobilePhoneNumber: ValidationUtils.isFrenchMobilePhoneNumber} : {}}
                                        small
                                        onCountryChange={this.checkCountryForValidation("MOBILE")}
                                    />
                                </Col>
                                <Col size={4}>
                                    <Label for="contact.email"><FormattedMessage id="EMAIL"/>{this.props.optionalEmail ? "" : <span className="text-danger">*</span>}</Label>
                                    <FormTextInput id={`${this.props.name}.email`}
                                                   name={`${this.props.name}.email`}
                                                   value={this.state.defaultValue ? this.state.defaultValue.contact.email : ""}
                                                   bsSize={"sm"}
                                                   validations={!this.props.optionalEmail ? {
                                                       isEmail: true,
                                                       isRequired: ValidationUtils.notEmpty
                                                   } : {isEmail: true}}
                                                   forceDirty={true}
                                                   validationErrors={{isEmail: 'Veuillez renseigner une adresse email correcte'}}/>
                                </Col>
                            </Row>
                        </div>}
            </React.Fragment>
        )
    }

    private phoneForm() {
        return <Row>
            <Col size={6}>
                <Label for="contact.phone"><FormattedMessage id="global.phone"/></Label>
                <FormPhoneInput
                    id={`${this.props.name}.phone`}
                    name={`${this.props.name}.phone`}
                    value={this.state.defaultValue ? this.state.defaultValue.contact.phone : ""}
                    small
                    validations={this.state.isFRFixeNumber ? {"isValidFrenchPhoneNumber": "FIXE"} : {}}
                    onCountryChange={this.checkCountryForValidation("FIXE")}
                />
            </Col>
            <Col size={6}>
                <Label for="contact.cellphone"><FormattedMessage id="global.cellphone"/></Label>
                <FormPhoneInput
                    id={`${this.props.name}.cellphone`}
                    name={`${this.props.name}.cellphone`}
                    value={this.state.defaultValue ? this.state.defaultValue.contact.cellphone : ""}
                    small
                    validations={this.state.isFRMobileNumber ? {isValidFrenchMobilePhoneNumber: ValidationUtils.isFrenchMobilePhoneNumber} : {}}
                    onCountryChange={this.checkCountryForValidation("MOBILE")}
                />
            </Col>
        </Row>;
    }

    private FormWithPhonesConstraints() {
        return <Row>
            <Col size={6}>
                <Label for="contact.phone"><FormattedMessage id="global.phone"/></Label>
                <FormPhoneInput
                    id={`${this.props.name}.phone`}
                    name={`${this.props.name}.phone`}
                    value={this.state.defaultValue ? this.state.defaultValue.contact.phone : ""}
                    small
                    validations={this.state.isFRFixeNumber ? {
                        "isValidFrenchPhoneNumber": "FIXE",
                        isRequired: !this.state.inputCellPhone ? ValidationUtils.isAtLeastOnePhoneFixeOrMobile : ValidationUtils.canBeEmpty
                    } : {isRequired: !this.state.inputCellPhone ? ValidationUtils.notEmpty : ValidationUtils.canBeEmpty}}
                    onCountryChange={this.checkCountryForValidation("FIXE")}
                    saveData={this.saveData}
                />
            </Col>
            <Col size={6}>
                <Label for="contact.cellphone"><FormattedMessage id="global.cellphone"/></Label>
                <FormPhoneInput
                    id={`${this.props.name}.cellphone`}
                    name={`${this.props.name}.cellphone`}
                    value={this.state.defaultValue ? this.state.defaultValue.contact.cellphone : ""}
                    small
                    validations={this.state.isFRMobileNumber ? {
                        isValidFrenchMobilePhoneNumber: ValidationUtils.isFrenchMobilePhoneNumber,
                        isRequired: !this.state.inputPhone ? ValidationUtils.isAtLeastOnePhoneFixeOrMobile : ValidationUtils.canBeEmpty
                    } : {isRequired: !this.state.inputPhone ? ValidationUtils.notEmpty : ValidationUtils.canBeEmpty}}
                    validationErrors={{isRequired: 'Saisir au moins un téléphone de contact fixe ou mobile'}}
                    onCountryChange={this.checkCountryForValidation("MOBILE")}
                    saveData={this.saveData}
                />
            </Col>
        </Row>;
    }
}
