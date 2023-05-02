import * as React from "react";
import {ChangeEvent} from "react";
import {FormattedMessage} from "react-intl";
import {connect} from "react-redux";
import {Col, Container, FormGroup, Label, Row} from "reactstrap";
import {Client} from "../../model/person";
import {setIsDateHereForADGCTI} from "../../store/actions/CasePageAction";
import ValidationUtils from "../../utils/ValidationUtils";
import FormDateInput from "../Form/Date/FormDateInput";
import FormSelectInput from "../Form/FormSelectInput";
import FormSwitchInput from "../Form/FormSwitchInput";
import FormTextInput from "../Form/FormTextInput";
import {translate} from "../Intl/IntlGlobalProvider";

interface State {
    corporation: boolean,
    personWithSiret: boolean
    datePresent
}

interface Props {
    defaultValue?: Client
    saveData?: <T extends string | Date | boolean>(key: string, value: T) => void
    setIsDateHereForADGCTI
}

class PersonalDataForm extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            corporation: this.props.defaultValue ? !!this.props.defaultValue.ownerCorporation : false,
            personWithSiret: this.props.defaultValue ? this.props.defaultValue.corporation : false,
            datePresent: undefined
        }
    }

    /*    public saveData = (event: ChangeEvent<HTMLInputElement>) => {
            if (this.props.saveData) {
                this.props.saveData(event.currentTarget.name, 'checkbox' !== event.currentTarget.type ? event.currentTarget.value : event.currentTarget.checked)
            }
        }*/

    public saveIsPro = (event: ChangeEvent<HTMLInputElement>) => {
        this.props.setIsDateHereForADGCTI(false)
        const value = event.currentTarget.checked;
        if (this.props.saveData) {
            this.props.saveData("corporation", value)
        }
        this.setState({corporation: value});
    }

    /*public saveIsPersonWithSiret = (event: ChangeEvent<HTMLInputElement>) => {
        const name = event.currentTarget.name;
        const value = event.currentTarget.checked;

        if (this.props.saveData) {
            this.props.saveData(name, value)
        }

        this.setState((prevState) => {
            _.set(prevState, name, value);
            return {...prevState};
        });
    }*/

    public saveIsPersonWithSiret = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.currentTarget.checked;
        this.setState({personWithSiret: value});
    }

    public setDateIsHere = (date) => {
        this.props.setIsDateHereForADGCTI(date)
    }

    public render(): JSX.Element {
        const isOwnerPerson = this.props.defaultValue && this.props.defaultValue.ownerPerson
        const isOwnerCorporation = this.props.defaultValue && this.props.defaultValue.ownerCorporation
        // const birthDate = isOwnerPerson && this.props.defaultValue!.ownerPerson.birthDate ? new Date(this.props.defaultValue!.ownerPerson.birthDate) : new Date();
        // const legalCreationDate = isOwnerCorporation && this.props.defaultValue!.ownerCorporation.legalCreationDate ? new Date(this.props.defaultValue!.ownerCorporation.legalCreationDate) : new Date();
        const maxDate = new Date()
        maxDate.setFullYear(maxDate.getFullYear() - 18 )
        const {corporation} = this.state;
        return (
            <Container>
                <Row>
                    <Col md={3}>
                        <FormGroup>
                            <Label for="corporation"><FormattedMessage
                                id="act.editOwner.corporation"/></Label>
                            <FormSwitchInput color="primary"
                                             valueOn={translate.formatMessage({id: "global.dialog.yes"})}
                                             valueOff={translate.formatMessage({id: "global.dialog.no"})}
                                             name="corporation"
                                             id="corporation"
                                             value={corporation}
                                             thickness={"sm"}
                                             onChange={this.saveIsPro}/>
                        </FormGroup>
                    </Col>
                </Row>

                {!corporation &&
                <div>
                    <Row>
                        <Col md={3}>
                            <FormGroup>
                                <Label for="ownerPerson.civility"><FormattedMessage id="global.form.civility"/><span className="text-danger">*</span></Label>
                                <FormSelectInput name="ownerPerson.civility" id="person.civility"
                                                 value={isOwnerPerson ? this.props.defaultValue!.ownerPerson.civility : ""}
                                                 bsSize={"sm"}
                                                 validations={{isRequired: ValidationUtils.notEmpty}}>
                                    <option/>
                                    <option
                                        value="MR">{translate.formatMessage({id: "global.form.civility.mr"})}</option>
                                    <option
                                        value="MME">{translate.formatMessage({id: "global.form.civility.mrs"})}</option>
                                    <option
                                        value="MLLE">{translate.formatMessage({id: "global.form.civility.miss"})}</option>
                                </FormSelectInput>
                            </FormGroup>
                        </Col>
                        <Col md={4}>
                            <FormGroup>
                                <Label for="ownerPerson.firstName"><FormattedMessage
                                    id="global.form.firstname"/><span className="text-danger">*</span></Label>
                                <FormTextInput name="ownerPerson.firstName" id="ownerPerson.firstName"
                                               value={isOwnerPerson ? this.props.defaultValue!.ownerPerson.firstName : ""}
                                               bsSize={"sm"}
                                               forceDirty
                                               validations={{
                                                   isRequired: ValidationUtils.notEmpty,
                                                   respectPattern: ValidationUtils.respectPattern(/^[a-zA-Z\u00C0-\u00FF-.' ]{0,20}$/)
                                               }}/>
                            </FormGroup>
                        </Col>
                        <Col md={5}>
                            <FormGroup>
                                <Label for="ownerPerson.lastName"><FormattedMessage id="global.form.lastname"/><span className="text-danger">*</span></Label>
                                <FormTextInput name="ownerPerson.lastName" id="ownerPerson.lastName"
                                               value={isOwnerPerson ? this.props.defaultValue!.ownerPerson.lastName : ""}
                                               bsSize={"sm"}
                                               forceDirty
                                               validations={{
                                                   isRequired: ValidationUtils.notEmpty,
                                                   respectPattern: ValidationUtils.respectPattern(/^[a-zA-Z\u00C0-\u00FF-.' ]{0,25}$/)
                                               }}/>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={3}>
                            <FormGroup>
                                <Label for="ownerPerson.birthDate"><FormattedMessage
                                    id="global.form.birth.date"/><span className="text-danger">*</span></Label>
                                <FormDateInput peekNextMonth showMonthDropdown showYearDropdown maxDate={maxDate} small
                                               name="ownerPerson.birthDate" id="ownerPerson.birthDate"
                                               onChange={this.setDateIsHere}
                                               validations={{isRequired: ValidationUtils.notEmpty}}
                                               />
                            </FormGroup>
                        </Col>
                        <Col md={2}>
                            <FormGroup>
                                <Label for="ownerPerson.birthDepartment"><FormattedMessage
                                    id="global.form.birth.county"/><span className="text-danger">*</span></Label>
                                <FormTextInput name="ownerPerson.birthDepartment" id="ownerPerson.birthDepartment"
                                               value={isOwnerPerson ? this.props.defaultValue!.ownerPerson.birthDepartment : ""}
                                               forceDirty
                                               bsSize={"sm"}
                                               validations={{
                                                   isRequired: ValidationUtils.notEmpty,
                                                   isDepartmentNumber: ValidationUtils.departmentNumber
                                               }}/>
                            </FormGroup>
                        </Col>
                        <Col md={3}>
                            <FormGroup>
                                <Label for="personWithSiret"><FormattedMessage
                                    id="act.editPersonalData.pro"/></Label>
                                <FormSwitchInput color="primary"
                                                 valueOn={translate.formatMessage({id: "global.dialog.yes"})}
                                                 valueOff={translate.formatMessage({id: "global.dialog.no"})}
                                                 thickness={"sm"}
                                                 name="personWithSiret"
                                                 id="personWithSiret" value={this.state.personWithSiret}
                                                 onChange={this.saveIsPersonWithSiret}/>
                            </FormGroup>
                        </Col>
                        {
                            this.state.personWithSiret &&
                            <Col md={4}>
                                <FormGroup>
                                    <Label for="siret"><FormattedMessage id="global.form.siret"/></Label>
                                    <FormTextInput id="siret" name="siret"
                                                   bsSize={"sm"}
                                                   value={this.props.defaultValue ? this.props.defaultValue.siret : ""}
                                                   validations={{
                                                    isRequired: ValidationUtils.notEmpty,
                                                    respectPattern: ValidationUtils.siretNumberValidation
                                                    }}
                                                   />
                                </FormGroup>
                            </Col>
                        }
                    </Row>
                </div>
                }

                {corporation &&
                <div>
                    <Row>
                        <Col md={5}>
                            <FormGroup>
                                <Label for="ownerCorporation.name"><FormattedMessage
                                    id="global.form.corporateName"/><span className="text-danger">*</span></Label>
                                <FormTextInput name="ownerCorporation.name" id="ownerCorporation.name"
                                               forceDirty
                                               bsSize={"sm"}
                                               value={isOwnerCorporation ? this.props.defaultValue!.ownerCorporation.name : ""}
                                               validations={{isRequired: ValidationUtils.notEmpty}}/>
                            </FormGroup>
                        </Col>
                        <Col md={4}>
                            <FormGroup>
                                <Label for="siret"><FormattedMessage id="global.form.siret"/><span className="text-danger">*</span></Label>
                                <FormTextInput id="siret" name="siret"
                                               forceDirty
                                               bsSize={"sm"}
                                               value={this.props.defaultValue ? this.props.defaultValue.siret : ""}
                                               validations={{
                                                isRequired: ValidationUtils.notEmpty,
                                                respectPattern: ValidationUtils.siretNumberValidation
                                                }}/>
                            </FormGroup>
                        </Col>
                        <Col md={3}>
                            <FormGroup>
                                <Label for="ownerCorporation.legalCreationDate"><FormattedMessage
                                    id="global.form.creationDate"/><span className="text-danger">*</span></Label>
                                <FormDateInput peekNextMonth showMonthDropdown showYearDropdown small
                                               name="ownerCorporation.legalCreationDate"
                                               onChange={this.setDateIsHere}
                                               validations={{isRequired: ValidationUtils.notEmpty}}
                                               id="ownerCorporation.legalCreationDate"/>
                            </FormGroup>
                        </Col>
                    </Row>
                </div>
                }

            </Container>
        )
    }
}

const mapDispatchToProps = dispatch => (
    {
        setIsDateHereForADGCTI: (date) => dispatch(setIsDateHereForADGCTI(date))
    }
)

export default connect(null, mapDispatchToProps)(PersonalDataForm)
