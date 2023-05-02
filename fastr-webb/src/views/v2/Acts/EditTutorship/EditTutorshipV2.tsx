import {parse} from "date-fns"
import * as React from 'react';
import {FormattedMessage} from "react-intl";
import {connect} from "react-redux";
import {Button, Card, CardBody, CardHeader, Col, Container, FormGroup, Label, ListGroup, Row} from "reactstrap";
import {UIProps} from "src/store/actions/UIActions";
import Collapse from "reactstrap/lib/Collapse";
import {ClientContextSliceState} from "../../../../store/ClientContextSlice";
import {AppState} from "../../../../store";
import {Service} from "../../../../model/service";
import ResultServiceLine from "../../../Search/ResultServiceLine";
import FormSwitchInput from "../../../../components/Form/FormSwitchInput";
import ValidationUtils from "../../../../utils/ValidationUtils";
import FormSelectInput from "../../../../components/Form/FormSelectInput";
import {translate} from "../../../../components/Intl/IntlGlobalProvider";
import FormTextInput from "../../../../components/Form/FormTextInput";
import FormDateInput from "../../../../components/Form/Date/FormDateInput";
import AddressInput from "../../../../components/Form/Address/AddressInput";
import ContactForm from "../../../../components/Views/ContactForm";
import {TUTORSHIP} from "../../../../model/person";
import FormButtonGroupRadio from "../../../../components/Form/FormButtonGroupRadio";

type PropType = UIProps

interface Props extends PropType {
    client: ClientContextSliceState
    isMoralPerson?: boolean
}

interface State {
    // tslint:disable-next-line:no-any TODO : a typer ....
    act: any
    disabled: boolean
    billingAccountInForm?: object,
    // tslint:disable-next-line:no-any TODO : a typer
    legalResponsible?: any
    blockButton: boolean
    collapseLinkedServices: boolean
    isRemoveTutelle: boolean
    hasTutorshipEndDate?: boolean
}

class EditTutorshipV2 extends React.Component<Props, State> {


    constructor(props: Props) {
        super(props);
        this.state = {
            disabled: true,
            blockButton: true,
            act: undefined,
            collapseLinkedServices: false,
            isRemoveTutelle: false
        };

    }

    public componentWillMount(): void {
        const legalResponsible = this.props.client.clientData!.legalResponsible?.contactEmail != TUTORSHIP[TUTORSHIP.NON_RENSEIGNE] ? this.props.client.clientData!.legalResponsible :
        {
            responsible: {},
            indicatifPhoneNumber: "",
            contactPhoneNumber: "",
            indicatifMobilePhoneNumber: "",
            contactMobilePhoneNumber: "",
            contactEmail: ""
        };
        
        this.setState({
            legalResponsible: legalResponsible,
            hasTutorshipEndDate: this.hasTutorshipEndDate()
        })
    }

    public hasTutorshipEndDate = (): boolean | undefined => {
        const {clientData} = this.props.client
        return !this.tutelleExists() ? undefined : clientData!.ownerPerson?.tutorshipEndDate ? true : false
    }

    public blockNextButton = (blockButton: boolean) => {
        this.setState({blockButton})
    };

    public parseKeyForNestedObjectAndUpdateValue(obj: object, path: string, value: string) {
        let schema = obj;  // a moving reference to internal objects within obj
        const pList = path.split('.');
        const len = pList.length;
        for (let i = 0; i < len - 1; i++) {
            const elem = pList[i];
            if (!schema[elem]) {
                schema[elem] = {}
            }
            schema = schema[elem];
        }
        schema[pList[len - 1]] = value;
        return obj
    }

    public catchFormChanges = (formWasChanged: React.ChangeEvent<HTMLInputElement>) => {

        if (formWasChanged && formWasChanged.currentTarget.name === 'removeTutelle') {
            this.toggleRemoveTutelle()
        } else {
            if (formWasChanged && formWasChanged.currentTarget) {
                const key = formWasChanged.currentTarget.name;
                const value = formWasChanged.currentTarget.value;

                this.setState((prevState: State) => ({
                    legalResponsible: this.parseKeyForNestedObjectAndUpdateValue({...prevState.legalResponsible}, key, value)
                }));
                this.blockNextButton(true);
            }
        }
    };

    public toggleLinkedServices = () => {
        this.setState(prevState => ({collapseLinkedServices: !prevState.collapseLinkedServices}))
    }

    public getLinkedServices = (): Service[] => {
        return this.props.client.clientData!.services
    }

    public renderLinkedServices(): JSX.Element | JSX.Element[] {
        const linkedServices: Service[] = this.getLinkedServices();

        if (linkedServices.length === 0) {
            return (<span>Aucun</span>)
        }

        return linkedServices.map(e => {
            return <ResultServiceLine client={this.props.client!.clientData!} key={e.id} service={e}/>
        })
    }

    public tutelleExists = () => {
        const {clientData} = this.props.client
        if (clientData?.legalResponsible) {
            return !!clientData?.legalResponsible.responsible
        }
        return undefined !== clientData?.ownerPerson?.tutorshipType && TUTORSHIP.NON_PROTEGE !== TUTORSHIP[clientData?.ownerPerson?.tutorshipType.toString()]
    }

    private toggleRemoveTutelle = () => this.setState(prevState => ({isRemoveTutelle: !prevState.isRemoveTutelle}))

    public setHasTutorshipEndDate = (value: string) => {
        if (undefined === value) {
            return
        }
        if ("true" === value) {
            this.setState({hasTutorshipEndDate: true})
        } else {
            this.setState({hasTutorshipEndDate: false})
        }
    }

    public renderTutorshipEndDate = (): JSX.Element | undefined => {
        const {hasTutorshipEndDate, isRemoveTutelle} = this.state
        if (isRemoveTutelle || !hasTutorshipEndDate) {
            return
        }

        const {clientData} = this.props.client
        const tutorshipEndDate: Date | undefined = clientData?.ownerPerson?.tutorshipEndDate ? parse(clientData!.ownerPerson?.tutorshipEndDate, 'yyyy-MM-dd', new Date()) : undefined
        return (
            <Col md={3}>
                <FormGroup>
                    <Label for="tutorshipEndDate"><FormattedMessage id="acts.editTutorship.tutorshipEndDate"/><span
                        className="text-danger">*</span></Label>
                    <FormDateInput
                        small
                        name="tutorshipEndDate"
                        id="tutorshipEndDate"
                        peekNextMonth showMonthDropdown showYearDropdown
                        value={tutorshipEndDate}
                        minDate={new Date()}
                        validations={{isRequired: ValidationUtils.notEmpty}}
                    />
                </FormGroup>
            </Col>
        )
    }

    public renderTutorshipType = () => {
        const {clientData} = this.props.client
        const {isRemoveTutelle} = this.state

        return !isRemoveTutelle ? (
            <FormGroup>
                <Label for="tutorship"><FormattedMessage id="acts.editTutorship.type"/><span
                    className="text-danger">*</span></Label>
                <FormSelectInput bsSize={"sm"} name="tutorship" id="tutorship"
                                //  validations={{isRequired: ValidationUtils.notEmpty}}
                                 validations={{isRequired: this.props.isMoralPerson ? ValidationUtils.canBeEmpty : ValidationUtils.notEmpty}}
                                 value={clientData && clientData.ownerPerson && clientData.ownerPerson?.tutorshipType !== undefined ? "" + clientData.ownerPerson?.tutorshipType : undefined}
                                 disabled={false}>

                    <option disabled selected/>

                    <option
                        value="TUTELLE">{translate.formatMessage({id: "acts.editpersonaldata.protected.TUTELLE"})}</option>
                    <option
                        value="CURATELLE_SIMPLE">{translate.formatMessage({id: "acts.editpersonaldata.protected.CURATELLE_SIMPLE"})}</option>
                    <option
                        value="CURATELLE_RENFORCEE">{translate.formatMessage({id: "acts.editpersonaldata.protected.CURATELLE_RENFORCEE"})}</option>
                    <option
                        value="CURATELLE_AMENAGEE">{translate.formatMessage({id: "acts.editpersonaldata.protected.CURATELLE_AMENAGEE"})}</option>
                    <option
                        value="SAUVEGARDE_JUSTICE">{translate.formatMessage({id: "acts.editpersonaldata.protected.SAUVEGARDE_JUSTICE"})}</option>
                    <option
                        value="HABILITATION_FAMILIALE">{translate.formatMessage({id: "acts.editpersonaldata.protected.HABILITATION_FAMILIALE"})}</option>

                </FormSelectInput>
            </FormGroup>
        ) : (
            <FormGroup>
                <Label for="tutorship"><FormattedMessage id="acts.editTutorship.type"/><span
                    className="text-danger">*</span></Label>
                <FormTextInput bsSize={"sm"}
                               name="tutorship"
                               id="tutorship"
                               disabled={true}
                               value={translate.formatMessage({id: "acts.editpersonaldata.protected.NON_PROTEGE"})}
                />
            </FormGroup>
        )
    }

    public renderProtectionCard = (): JSX.Element => {
        const {isRemoveTutelle, hasTutorshipEndDate} = this.state
        const originalHasTutorshipEndDate = this.hasTutorshipEndDate()
        return (
            <Card>
                <CardHeader><FormattedMessage id="acts.editTutorship.protection.section"/></CardHeader>
                <CardBody>
                    <Row>
                        {this.tutelleExists() &&
                            <Col md={3}>
                                <FormGroup>
                                    <Label for="password">Retirer la tutelle/curatelle</Label>
                                    <FormSwitchInput color="primary" thickness={"sm"}
                                                     id="removeTutelle" name="removeTutelle"
                                                     onChange={this.catchFormChanges}
                                                     value={this.state.isRemoveTutelle}/>
                                </FormGroup>
                            </Col>
                        }
                        <Col md={4}>
                            {!this.props.isMoralPerson && this.renderTutorshipType()}
                        </Col>
                        {(!isRemoveTutelle && !this.props.isMoralPerson) &&
                            <Col md={2}>
                                <Label for="hasTutorshipEndDate"><FormattedMessage
                                    id="acts.editTutorship.hasTutorshipEndDate"/><span
                                    className="text-danger">*</span></Label>
                                <FormButtonGroupRadio name="hasTutorshipEndDate"
                                                      id="hasTutorshipEndDate"
                                                      value={undefined === originalHasTutorshipEndDate ? "" : "" + originalHasTutorshipEndDate}
                                                      forceValue={undefined === originalHasTutorshipEndDate ? "" : "" + originalHasTutorshipEndDate}
                                                      validations={{isRequired: ValidationUtils.notEmpty}}
                                                      onValueChange={this.setHasTutorshipEndDate}
                                >
                                    <Button size="sm" color="primary" value={"true"}
                                            active={true === hasTutorshipEndDate}>
                                        <FormattedMessage id={"YES"}/>
                                    </Button>
                                    <Button size="sm" color="primary" value={"false"}
                                            active={false === hasTutorshipEndDate}>
                                        <FormattedMessage id={"NO"}/>
                                    </Button>
                                </FormButtonGroupRadio>
                            </Col>
                        }
                        {!this.props.isMoralPerson && this.renderTutorshipEndDate()}
                    </Row>
                </CardBody>
            </Card>
        )
    }

    public renderTutorCard = (): JSX.Element | undefined => {
        if (this.state.isRemoveTutelle) {
            return
        }
        const {legalResponsible} = this.state;
        const defaultContactValue = {
            contact: {
                phone: legalResponsible ? legalResponsible.indicatifPhoneNumber + (legalResponsible.contactPhoneNumber && legalResponsible.contactPhoneNumber.length === 10 ? legalResponsible.contactPhoneNumber.substring(1) : legalResponsible.contactPhoneNumber) : "",
                cellphone: legalResponsible ? legalResponsible.indicatifMobilePhoneNumber + (legalResponsible.contactMobilePhoneNumber && legalResponsible.contactMobilePhoneNumber.length === 10 ? legalResponsible.contactMobilePhoneNumber.substring(1) : legalResponsible.contactMobilePhoneNumber) : "",
                email: legalResponsible ? legalResponsible.contactEmail : "",
                fax: "",
                other: ""
            }
        }
        const birthDateString: string | undefined = legalResponsible && legalResponsible.responsible ? legalResponsible.responsible.birthDate : undefined
        const birthDate: Date | undefined = birthDateString ? parse(birthDateString, 'yyyy-MM-dd', new Date()) : undefined
        const maxDate = new Date()
        maxDate.setFullYear(maxDate.getFullYear() - 18)
        return (
            <Card className={"mt-1"}>
                <CardHeader><FormattedMessage id="acts.editTutorship.tutor.section"/></CardHeader>
                <CardBody>
                    <Row>
                        <Col md={2}>
                            <FormGroup>
                                <Label for="civility"><FormattedMessage id="global.form.civility"/><span
                                    className="text-danger">*</span></Label>
                                <FormSelectInput
                                    bsSize={"sm"}
                                    name="legalResponsible.responsible.civility"
                                    id="legalResponsible.responsible.civility"
                                    value={legalResponsible && legalResponsible.responsible ? legalResponsible.responsible.civility : ""}
                                    validations={{isRequired: !this.state.isRemoveTutelle ? ValidationUtils.notEmpty : ValidationUtils.canBeEmpty}}
                                    onChangeCapture={this.catchFormChanges}>
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
                        <Col md={3}>
                            <FormGroup>
                                <Label for="firstName"><FormattedMessage id="global.form.firstname"/><span
                                    className="text-danger">*</span></Label>
                                <FormTextInput
                                    bsSize={"sm"}
                                    name="legalResponsible.responsible.firstName"
                                    id="legalResponsible.responsible.firstName"
                                    value={legalResponsible && legalResponsible.responsible ? legalResponsible.responsible.firstName : ""}
                                    validations={{
                                        isRequired: !this.state.isRemoveTutelle ? ValidationUtils.notEmpty : ValidationUtils.canBeEmpty,
                                        respectPattern: ValidationUtils.respectPattern(/^[a-zA-Z\u00C0-\u00FF-.' ]{0,20}$/)
                                    }}
                                    onChangeCapture={this.catchFormChanges}/>
                            </FormGroup>
                        </Col>
                        <Col md={4}>
                            <FormGroup>
                                <Label for="lastName"><FormattedMessage id="global.form.lastname"/><span
                                    className="text-danger">*</span></Label>
                                <FormTextInput
                                    bsSize={"sm"}
                                    name="legalResponsible.responsible.lastName"
                                    id="legalResponsible.responsible.lastName"
                                    value={legalResponsible && legalResponsible.responsible ? legalResponsible.responsible.lastName : ""}
                                    validations={{
                                        isRequired: !this.state.isRemoveTutelle ? ValidationUtils.notEmpty : ValidationUtils.canBeEmpty,
                                        respectPattern: ValidationUtils.respectPattern(/^[a-zA-Z\u00C0-\u00FF-.' ]{0,25}$/)
                                    }}
                                    onChangeCapture={this.catchFormChanges}/>
                            </FormGroup>
                        </Col>
                        <Col md={3}>
                            <FormGroup>
                                <Label for="birthDate"><FormattedMessage id="global.form.birth.date"/><span
                                    className="text-danger">*</span></Label>
                                <FormDateInput small
                                               name="legalResponsible.responsible.birthDate"
                                               id="legalResponsible.responsible.birthDate"
                                               peekNextMonth showMonthDropdown showYearDropdown
                                               value={birthDate}
                                               maxDate={maxDate}
                                               validations={{isRequired: !this.state.isRemoveTutelle ? ValidationUtils.notEmpty : ValidationUtils.canBeEmpty}}

                                               onChangeCapture={this.catchFormChanges}
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                    <AddressInput
                        value={legalResponsible && legalResponsible.responsible && legalResponsible.responsible.address ? legalResponsible.responsible.address : undefined}
                        name="legalResponsible.responsible.address"/>
                    <ContactForm title="Contact" name="legalResponsible.contact" simpleForm
                                 defaultValue={defaultContactValue}/>
                </CardBody>
            </Card>
        )
    }

    public render() {
        const {collapseLinkedServices} = this.state;
        return (
            <Container>
                <Row className="mb-1">
                    <Col>
                        <Card>
                            <CardHeader onClick={this.toggleLinkedServices}>
                                <Row>
                                    <Col md={10}>
                                        Services impactés par l'acte
                                    </Col>
                                    <Col md={2}>
                                        <i id="editBillingAccount.toggleLinkedServices.button.id"
                                           className={"icon icon-black float-right " + (collapseLinkedServices ? "icon-down" : "icon-up")}/>
                                    </Col>
                                </Row>
                            </CardHeader>

                            <Collapse isOpen={!collapseLinkedServices}>
                                <CardBody>
                                    <ListGroup flush>
                                        {this.renderLinkedServices()}
                                    </ListGroup>
                                </CardBody>
                            </Collapse>
                        </Card>
                    </Col>
                </Row>

                <div>
                    {!this.props.isMoralPerson && this.renderProtectionCard()}
                    {this.renderTutorCard()}
                </div>
            </Container>
        )
    }
}

const mapStateToProps = (state: AppState) => ({
    client: state.store.client.currentClient
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(EditTutorshipV2)
