import * as React from "react";
import {ChangeEvent} from "react";
import {FormattedMessage} from "react-intl";
import {connect} from "react-redux";
import {Col, Label, Row} from "reactstrap";
import {setIsDateHereForADGCTIV2} from "../../../../store/actions/v2/case/CaseActions";
import {Client} from "../../../../model/person";
import FormSwitchInput from "../../../../components/Form/FormSwitchInput";
import {translate} from "../../../../components/Intl/IntlGlobalProvider";
import FormSelectInput from "../../../../components/Form/FormSelectInput";
import ValidationUtils from "../../../../utils/ValidationUtils";
import FormTextInput from "../../../../components/Form/FormTextInput";
import FormDateInput from "../../../../components/Form/Date/FormDateInput";

interface State {
    corporation: boolean,
    personWithSiret: boolean
    datePresent
}

interface Props {
    defaultValue?: Client
    saveData?: <T extends string | Date | boolean>(key: string, value: T) => void
    setIsDateHereForADGCTIV2: (caseId: string, value: boolean) => void
    caseId: string
}

class PersonalDataFormV2 extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            corporation: this.props.defaultValue ? !!this.props.defaultValue.ownerCorporation : false,
            personWithSiret: this.props.defaultValue ? this.props.defaultValue.corporation : false,
            datePresent: undefined
        }
    }

    public saveIsPro = (event: ChangeEvent<HTMLInputElement>) => {
        this.props.setIsDateHereForADGCTIV2(this.props.caseId, false)
        const value = event.currentTarget.checked;
        if (this.props.saveData) {
            this.props.saveData("corporation", value)
        }
        this.setState({corporation: value});
    }

    public saveIsPersonWithSiret = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.currentTarget.checked;
        this.setState({personWithSiret: value});
    }

    public setDateIsHere = (date) => {
        this.props.setIsDateHereForADGCTIV2(this.props.caseId, !!date);
    }

    public render(): JSX.Element {
        const isOwnerPerson = this.props.defaultValue && this.props.defaultValue.ownerPerson
        const isOwnerCorporation = this.props.defaultValue && this.props.defaultValue.ownerCorporation
        // const birthDate = isOwnerPerson && this.props.defaultValue!.ownerPerson.birthDate ? new Date(this.props.defaultValue!.ownerPerson.birthDate) : new Date();
        // const legalCreationDate = isOwnerCorporation && this.props.defaultValue!.ownerCorporation.legalCreationDate ? new Date(this.props.defaultValue!.ownerCorporation.legalCreationDate) : new Date();
        const maxDate = new Date()
        maxDate.setFullYear(maxDate.getFullYear() - 18)
        const {corporation} = this.state;

        return (
            <React.Fragment>
                <Row>
                    <Col md={3}>
                        <Label for="corporation">
                            <FormattedMessage id="act.editOwner.corporation"/>
                        </Label>
                        <FormSwitchInput color="primary"
                                         valueOn={translate.formatMessage({id: "global.dialog.yes"})}
                                         valueOff={translate.formatMessage({id: "global.dialog.no"})}
                                         name="corporation"
                                         id="corporation"
                                         value={corporation}
                                         thickness={"sm"}
                                         onChange={this.saveIsPro}/>
                    </Col>
                </Row>

                {corporation ?
                    <div>
                        <Row>
                            <Col md={5}>
                                <Label for="ownerCorporation.name"><FormattedMessage
                                    id="global.form.corporateName"/><span className="text-danger">*</span></Label>
                                <FormTextInput name="ownerCorporation.name" id="ownerCorporation.name"
                                               value={isOwnerCorporation ? this.props.defaultValue!.ownerCorporation.name : ""}
                                               bsSize={"sm"}
                                               forceDirty
                                               validations={{isRequired: ValidationUtils.notEmpty}}/>
                            </Col>
                            <Col md={4}>
                                <Label for="siret"><FormattedMessage id="global.form.siret"/><span
                                    className="text-danger">*</span></Label>
                                <FormTextInput id="siret" name="siret"
                                               value={this.props.defaultValue ? this.props.defaultValue.siret : ""}
                                               bsSize={"sm"}
                                               forceDirty
                                               validations={{
                                                isRequired: ValidationUtils.notEmpty,
                                                respectPattern: ValidationUtils.siretNumberValidation
                                                }}/>
                            </Col>
                            <Col md={3}>
                                <Label for="ownerCorporation.legalCreationDate"><FormattedMessage
                                    id="global.form.creationDate"/><span className="text-danger">*</span></Label>
                                <FormDateInput peekNextMonth showMonthDropdown showYearDropdown small
                                               name="ownerCorporation.legalCreationDate"
                                               onChange={this.setDateIsHere}
                                               id="ownerCorporation.legalCreationDate"
                                               validations={{isRequired: ValidationUtils.notEmpty}}/>
                            </Col>
                        </Row>
                    </div>
                    :
                    <div>
                        <Row>
                            <Col md={2}>
                                <Label for="ownerPerson.civility"><FormattedMessage id="global.form.civility"/><span
                                    className="text-danger">*</span></Label>
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
                            </Col>
                            <Col md={5}>
                                <Label for="ownerPerson.firstName"><FormattedMessage
                                    id="global.form.firstname"/><span className="text-danger">*</span></Label>
                                <FormTextInput name="ownerPerson.firstName" id="ownerPerson.firstName"
                                               value={isOwnerPerson ? this.props.defaultValue!.ownerPerson.firstName : ""}
                                               bsSize={"sm"}
                                               validations={{
                                                   isRequired: ValidationUtils.notEmpty,
                                                   respectPattern: ValidationUtils.respectPattern(/^[a-zA-Z\u00C0-\u00FF-.' ]{0,20}$/)
                                               }}/>
                            </Col>
                            <Col md={5}>
                                <Label for="ownerPerson.lastName"><FormattedMessage id="global.form.lastname"/><span
                                    className="text-danger">*</span></Label>
                                <FormTextInput name="ownerPerson.lastName" id="ownerPerson.lastName"
                                               value={isOwnerPerson ? this.props.defaultValue!.ownerPerson.lastName : ""}
                                               bsSize={"sm"}
                                               validations={{
                                                   isRequired: ValidationUtils.notEmpty,
                                                   respectPattern: ValidationUtils.respectPattern(/^[a-zA-Z\u00C0-\u00FF-.' ]{0,25}$/)
                                               }}/>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={2}>
                                <Label for="ownerPerson.birthDate"><FormattedMessage
                                    id="global.form.birth.date"/><span className="text-danger">*</span></Label>
                                <FormDateInput peekNextMonth showMonthDropdown showYearDropdown small
                                               maxDate={maxDate}
                                               name="ownerPerson.birthDate" id="ownerPerson.birthDate"
                                               onChange={this.setDateIsHere}
                                               validations={{isRequired: ValidationUtils.notEmpty}}
                                />
                            </Col>
                            <Col md={3}>
                                <Label for="ownerPerson.birthDepartment"><FormattedMessage
                                    id="global.form.birth.county"/><span className="text-danger">*</span></Label>
                                <FormTextInput name="ownerPerson.birthDepartment" id="ownerPerson.birthDepartment"
                                               value={isOwnerPerson ? this.props.defaultValue!.ownerPerson.birthDepartment : ""}
                                               bsSize={"sm"}
                                               validations={{
                                                   isRequired: ValidationUtils.notEmpty,
                                                   isDepartmentNumber: ValidationUtils.departmentNumber
                                               }}/>
                            </Col>
                            <Col md={3}>
                                <Label for="personWithSiret"><FormattedMessage
                                    id="act.editPersonalData.pro"/></Label>
                                <FormSwitchInput color="primary"
                                                 valueOn={translate.formatMessage({id: "global.dialog.yes"})}
                                                 valueOff={translate.formatMessage({id: "global.dialog.no"})}
                                                 thickness={"sm"}
                                                 name="personWithSiret"
                                                 id="personWithSiret" value={this.state.personWithSiret}
                                                 onChange={this.saveIsPersonWithSiret}/>
                            </Col>
                            {this.state.personWithSiret &&
                                <Col md={4}>
                                    <Label for="siret"><FormattedMessage id="global.form.siret"/></Label>
                                    <FormTextInput id="siret" name="siret"
                                                   value={this.props.defaultValue ? this.props.defaultValue.siret : ""}
                                                   bsSize={"sm"}
                                                   validations={{
                                                    isRequired: ValidationUtils.notEmpty,
                                                    respectPattern: ValidationUtils.siretNumberValidation
                                                    }}
                                                />
                                </Col>
                            }
                        </Row>
                    </div>
                }
            </React.Fragment>
        )
    }
}

const mapDispatchToProps = {
    setIsDateHereForADGCTIV2
}

export default connect(null, mapDispatchToProps)(PersonalDataFormV2)
