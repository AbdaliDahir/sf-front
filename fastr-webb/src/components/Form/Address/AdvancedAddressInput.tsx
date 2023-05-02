import {withFormsy} from "formsy-react";
import {PassDownProps} from "formsy-react/dist/Wrapper";
import * as React from "react";
import {ChangeEvent} from "react";
import {FormattedMessage} from "react-intl";
import {Col, Container, FormGroup, Label, Row} from "reactstrap";
import { translate } from "src/components/Intl/IntlGlobalProvider";
import {Address} from "../../../model/person";
import ValidationUtils from "../../../utils/ValidationUtils";
import FormTextInput from "../FormTextInput";
import CountryInput from "./CountryInput";

type PropType = PassDownProps;

interface Props extends PropType {
    name: string,
    saveData?: <T extends string | Date | boolean>(key: string, value: T) => void
    isAdvancedAddressValid?: (bool: boolean) => void
}

interface State {
    chosenCountryCode: string
    address1FieldValid: string
    cityFieldValid: string
    zipcodeFieldValid: string
}

class AdvancedAddressInput extends React.Component<Props, State> {

    constructor(props: Readonly<Props>) {
        super(props);
        this.state = {
            chosenCountryCode: "",
            address1FieldValid: "is-invalid",
            cityFieldValid: "is-invalid",
            zipcodeFieldValid: "is-invalid"
        }
    }

    public componentDidMount(): void {
        if (this.props.value) {
            this.props.setValue({});
        }
        if (this.props.isAdvancedAddressValid) {
            this.isAdvancedAddressValid()
        }
    }

    public getChosenCountry = (countryCode: string) => {
        this.setState({
            chosenCountryCode: countryCode
        }, () => this.saveCountry(countryCode))
        // TODO: Putain a virer
        if (this.props.saveData) {
            this.props.saveData("address.countryCode", countryCode)
        }
    }

    public saveData = (event: ChangeEvent<HTMLInputElement>) => {
        const splittedTargetName = event.target.name.split(".");
        const address: Address = this.props.value ? this.props.value : {};
        address[splittedTargetName[splittedTargetName.length - 1]] = event.target.value.toLocaleUpperCase()
        this.props.setValue(address);

        if (this.props.isAdvancedAddressValid) {
            this.isAdvancedAddressValid()
        }

        if (event.target.name.includes('address1') || event.target.name.includes('city') || event.target.name.includes('zipcode')) {
            const Switch = (str) => ({
                [`${this.props.name}.address1`]: "address1FieldValid",
                [`${this.props.name}.city`]: "cityFieldValid",
                [`${this.props.name}.zipcode`]: "zipcodeFieldValid",
            })[str] || '';
            this.resetFieldValidation(Switch(event.target.name));
        }

        // TODO: Putain a virer
        if (this.props.saveData) {
            this.props.saveData(event.currentTarget.name, 'checkbox' !== event.currentTarget.type ? event.currentTarget.value.trim() : event.currentTarget.checked)
        }
    }

    public saveCountry = (countryCode: string) => {
        const address: Address = this.props.value ? this.props.value : {};
        address["countryCode"] = countryCode
        this.props.setValue(address);
        if (this.props.isAdvancedAddressValid) {
            this.isAdvancedAddressValid()
        }
    }

    public resetFieldValidation = (fieldStateKey) => {
        this.setState({
            ...this.state,
            [fieldStateKey]: ""
        });
    }

    public isAdvancedAddressValid = () => {
        if (this.props.isAdvancedAddressValid) {
            const address: Address = this.props.value ? this.props.value : {};
            const validAdress = address["address1"] !== "" && address["address1"] !== undefined;
            const validCity = address["city"] !== "" && address["city"] !== undefined;
            const validZipcode = address["countryCode"] === "250" ? !isNaN(Number(address["zipcode"])) && address["zipcode"]?.length === 5 : address["countryCode"] !== "" && address["countryCode"] !== undefined;
            const validCountryCode = address["countryCode"] !== "" && address["countryCode"] !== undefined;
            if (validAdress && validZipcode && validCity && validCountryCode) {
                this.props.isAdvancedAddressValid(true)
            } else {
                this.props.isAdvancedAddressValid(false)
            }
        }
    }

    public render(): JSX.Element {
        return (
            <Container>
                <Row>
                    <Col xs={12} lg={4}>
                        <Label for={`${this.props.name}.address1`}>
                            <FormattedMessage id="global.address"/><span className="text-danger">*</span>
                        </Label>
                    </Col>
                    <Col xs={12} lg={8}>
                        <FormTextInput uppercase name={`${this.props.name}.address1`} id="advancedAddress.address1"
                                       className={`${this.state.address1FieldValid}`}
                                       validations={{
                                            isRequired: ValidationUtils.notEmpty,
                                            respectPattern: ValidationUtils.respectPatternwithMessage(/[^\s]+(\s+[^\s]+)*/, translate.formatMessage({id: "validation.adresse.message"}) ),
                                            maxLength: 38
                                        }}
                                        validationErrors={{
                                            maxLength: "38 caractères maximum autorisés",
                                        }}
                                       bsSize={"sm"}
                                       onChange={this.saveData}/>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} lg={4}>
                        <Label for={`${this.props.name}.address2`}>
                            <FormattedMessage
                                id="global.address.addressComplement"/>
                        </Label>
                    </Col>
                    <Col xs={12} lg={8}>
                        <FormTextInput uppercase name={`${this.props.name}.address2`} id="advancedAddress.address2"
                                       validations={{
                                            respectPattern: ValidationUtils.respectPatternwithMessage(/^$|[^\s]+(\s+[^\s]+)*/, translate.formatMessage({id: "validation.adresse.message"}) ),
                                            maxLength: 38
                                        }}
                                        validationErrors={{
                                            maxLength: "38 caractères maximum autorisés",
                                        }}
                                       bsSize={"sm"}
                                       onChange={this.saveData}/>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} lg={4}>
                        <Label for={`${this.props.name}.identityComplement`}>
                            <FormattedMessage id="global.address.identityComplement"/>
                        </Label>
                    </Col>
                    <Col xs={12} lg={8}>
                        <FormTextInput uppercase name={`${this.props.name}.identityComplement`} id="advancedAddress.identityComplement"
                                        validations={{
                                            respectPattern: ValidationUtils.respectPatternwithMessage(/^$|[^\s]+(\s+[^\s]+)*/, translate.formatMessage({id: "validation.cin.message"}) ),
                                            maxLength: 38
                                        }}
                                        validationErrors={{
                                            maxLength: "38 caractères maximum autorisés",
                                        }}
                                       bsSize={"sm"}
                                       onChange={this.saveData}/>
                    </Col>
                </Row>
                <Row>
                    <Col xs={3}>
                        <Label for={`${this.props.name}.zipcode`}>
                            <FormattedMessage id="global.address.zipcode"/><span className="text-danger">*</span>
                        </Label>
                        <FormTextInput uppercase name={`${this.props.name}.zipcode`} id="advancedAddress.zipcode"
                                       className={`${this.state.zipcodeFieldValid}`}
                                       validations={this.state.chosenCountryCode === "250" ? {
                                           minLength: 5,
                                           maxLength: 10,
                                           isNumeric: true,
                                           isRequired: ValidationUtils.notEmpty
                                       } : {isRequired: ValidationUtils.notEmpty}}
                                       validationErrors={{isNumeric: 'Veuillez renseigner un code postal valide', minLength: "5 chiffres minimum autorisés", maxLength: "10 chiffres maximum autorisés"}}
                                       bsSize={"sm"}
                                       onChange={this.saveData}/>
                    </Col>
                    <Col xs={5}>
                        <Label for={`${this.props.name}.city`}>

                            <FormattedMessage id="global.address.city"/><span className="text-danger">*</span>
                        </Label>
                        <FormTextInput uppercase name={`${this.props.name}.city`} id="advancedAddress.city"
                                       className={`${this.state.cityFieldValid}`}
                                    //    validations={{isRequired: ValidationUtils.notEmpty}}
                                        validations={{
                                            isRequired: ValidationUtils.notEmpty,
                                            "inputFieldType": "city",
                                            respectPattern: ValidationUtils.respectPatternwithMessage(/^([^0-9]*)$/, translate.formatMessage({id: "validation.city.message"}) ),
                                            "inputMinLength": 1,
                                            maxLength: 38
                                        }}
                                        validationErrors={{
                                            maxLength: "38 caractères maximum autorisés",
                                        }} 
                                       bsSize={"sm"}
                                       onChange={this.saveData}/>

                    </Col>
                    <Col xs={4}>
                        <Label for={`${this.props.name}.countryCode`}>
                            <FormattedMessage id="global.address.country"/><span className="text-danger">*</span>
                        </Label>
                        <FormGroup name="advancedAddress.countryCode">
                            <CountryInput name={`${this.props.name}.countryCode`}
                                          validations={{isExisty: this.state.chosenCountryCode}}
                                          bsSize={"sm"}
                                          getChosenCountry={this.getChosenCountry}/>
                        </FormGroup>
                    </Col>
                </Row>
            </Container>
        )

    }
}

export default withFormsy<Props>(AdvancedAddressInput);
