import {withFormsy} from "formsy-react";
import * as React from "react";
import BlockUi from "react-block-ui";
import {Container, Row} from "reactstrap";
import {translate} from "../../../components/Intl/IntlGlobalProvider";
import {Address, Client} from "../../../model/person";
import {Corporation} from "../../../model/person";
import {LegalResponsible} from "../../../model/person/LegalResponsible";
import {Person} from "../../../model/person";
import {Service} from "../../../model/service";
import {ClientContext} from "../../../store/types/ClientContext";
import BillingMethodForm from "../EditBillingMethods/Steps/BillingMethodForm";
import NewLegalResponsible from "./Steps/NewLegalResponsible";
import NewOwner from "./Steps/NewOwner";
import OwnerEligibility from "./Steps/OwnerEligibility";
import OwnerSearch from "./Steps/OwnerSearch";
import {PassDownProps} from "formsy-react/dist/Wrapper";
import Loading from "../../../components/Loading";

enum OwnerEditStep {
    SEARCH_OWNER, CREATE_OWNER, FILL_BILLING_METHOD, FILL_LEGAL_RESPONSIBLE
}

interface ContactForm {
    phone: string,
    cellphone: string,
    fax: string,
    other: string,
    email: string
}

interface EditOwnerForm {
    siret: string
    ownerCorporation: Corporation
    ownerPerson: Person
    corporation: boolean
    selectedClient: Partial<Client>
    ineligibilityReason: string
    isNotEligible: boolean
    eligibilityNotAvailable: boolean
    idClient: string
    legalResponsible: LegalResponsible
    contact: ContactForm
    address: Address
    personWithSiret: boolean
}

interface State {
    disabled: boolean,
    newClient: boolean,
    startAct: boolean,
    step: OwnerEditStep,
    selectedClient?: Partial<Client>,
    // tslint:disable-next-line:no-any TODO: To correct
    editOwnerAct: Partial<EditOwnerForm>
    onGoingCheckIban: boolean
}

type PropType = PassDownProps;

interface Props extends PropType {
    client: ClientContext<Service>,
    idService: string,
    caseId?: string
    unlockEligibility: () => void
    // tslint:disable-next-line:no-any TODO: To correct
    getValuesFromFields: () => { form: any }
}

class EditOwner extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            disabled: true,
            newClient: false,
            startAct: false,
            step: OwnerEditStep.SEARCH_OWNER,
            editOwnerAct: {},
            onGoingCheckIban: false
        }
    }


    public storeFreeEntryValue = (b: boolean) => {
        this.setState({newClient: b});

        // reset selected client if exists
        const formToSave: Partial<EditOwnerForm> = this.state.editOwnerAct
        formToSave.idClient = ""
        this.setState({editOwnerAct: formToSave}, () => this.props.setValue(this.state.editOwnerAct))
        /*this.saveData("idClient", "");*/
    };

    public startAct = () => {
        this.setState({startAct: true})
    }

    public onValidateSearch = () => {
        if (this.state.newClient) {
            this.setState({step: OwnerEditStep.CREATE_OWNER})
        }
        else {
            this.setState({step: OwnerEditStep.FILL_BILLING_METHOD})
        }
    }

    public onValidateCreation = () => {
        /*        if (!this.state.editOwnerAct.corporation) {
                    this.setState({step: OwnerEditStep.FILL_BILLING_METHOD})
                } else {
                    this.setState({step: OwnerEditStep.FILL_LEGAL_RESPONSIBLE})
                }*/


        // tslint:disable-next-line:no-any TODO: To correct
        const form: any = {};
        Object.assign(form, this.props.getValuesFromFields());
        const newOwnerForm: Partial<EditOwnerForm> = this.state.editOwnerAct;
        /*newOwnerForm = {*/
        newOwnerForm.corporation = form.corporation
        newOwnerForm.ownerPerson = form.ownerPerson
        newOwnerForm.contact = form.contact
        newOwnerForm.address = form.address
        newOwnerForm.siret = form.siret
        newOwnerForm.ownerCorporation = form.ownerCorporation
        newOwnerForm.personWithSiret = form.personWithSiret
        /*}*/
        /*const formToSave = {...this.state.editOwnerAct, ...newOwnerForm}*/


        /*const formToSave: EditOwnerForm = {...this.state.editOwnerAct, ...form}*/
        this.setState({editOwnerAct: newOwnerForm}, () => this.props.setValue(this.state.editOwnerAct))
        /*let formToSave: EditOwnerForm = {...this.state.editOwnerAct, ...form}*/
        /*this.props.setValue(form)*/

        if (!form.corporation) {
            this.setState({step: OwnerEditStep.FILL_BILLING_METHOD})
        } else {
            this.setState({step: OwnerEditStep.FILL_LEGAL_RESPONSIBLE})
        }
    }

    public onValidateLegalResponsible = () => {
        // tslint:disable-next-line:no-any TODO: To correct
        const form: any = {};
        Object.assign(form, this.props.getValuesFromFields());
        const newOwnerForm: Partial<EditOwnerForm> = this.state.editOwnerAct;

        newOwnerForm.legalResponsible = {
            responsible: form.legalResponsible.responsible,
            contactEmail: form.legalResponsible!.contact ? form.legalResponsible!.contact.email : "",
            contactMobilePhoneNumber: form.legalResponsible!.contact ? form.legalResponsible!.contact.cellphone : "",
            contactPhoneNumber: form.legalResponsible!.contact ? form.legalResponsible!.contact.phone : "",
        }
        this.setState({editOwnerAct: newOwnerForm}, () => this.props.setValue(this.state.editOwnerAct))

        this.setState({step: OwnerEditStep.FILL_BILLING_METHOD})
    }

    public onSelectClient = (client: Client) => {
        this.setState({selectedClient: client});
        this.saveSelectedClient(client);
    }

    public saveSelectedClient(client: Client) {
        // tslint:disable-next-line:no-any TODO: To correct
        const newOwnerForm: Partial<EditOwnerForm> = this.state.editOwnerAct;
        let selectedClient: Partial<Client>;
        selectedClient = {
            id: client.id,
            ownerPerson: client.ownerPerson
        }

        newOwnerForm.selectedClient = selectedClient
        newOwnerForm.idClient = client.id

        this.setState({editOwnerAct: newOwnerForm}, () => this.props.setValue(this.state.editOwnerAct))
    }

    // tslint:disable-next-line:no-any TODO: To correct
    public saveData = (key: string, value: any) => {
        // tslint:disable-next-line:no-any TODO: To correct
        const newOwnerForm: Partial<EditOwnerForm> = this.state.editOwnerAct;
        newOwnerForm[key] = value;
        this.setState({editOwnerAct: newOwnerForm}, () => this.props.setValue(this.state.editOwnerAct))
    };

    public storeIneligibilityData = (reason: string) => {
        const formToSave: Partial<EditOwnerForm> = this.state.editOwnerAct;
        formToSave.ineligibilityReason = reason;
        formToSave.isNotEligible = true;

        this.setState({editOwnerAct: formToSave}, () => this.props.setValue(this.state.editOwnerAct))
    }

    public storeEligibilityNotAvailable = () => {
        const formToSave: Partial<EditOwnerForm> = this.state.editOwnerAct
        formToSave.eligibilityNotAvailable = true

        this.setState({editOwnerAct: formToSave}, () => this.props.setValue(this.state.editOwnerAct))
    }

    public setOnGoingCheckIban = () => {
        this.setState({onGoingCheckIban: true})
    }

    public setFinishedCheckIban = () => {
        this.setState({onGoingCheckIban: false})
    }

    public renderStep(): JSX.Element {
        switch (this.state.step) {
            case OwnerEditStep.SEARCH_OWNER:
                return <OwnerSearch title={translate.formatMessage({id: "acts.holder.search.title"})}
                                    notifyFreeEntry={this.storeFreeEntryValue}
                                    validate={this.onValidateSearch} onSelectClient={this.onSelectClient}/>

            case OwnerEditStep.CREATE_OWNER:
                return <NewOwner title={translate.formatMessage({id: "acts.holder.new.title"})}
                                 validate={this.onValidateCreation}
                                 getValuesFromFields={this.props.getValuesFromFields} saveData={this.saveData}/>

            case OwnerEditStep.FILL_BILLING_METHOD:
                return <BillingMethodForm title={translate.formatMessage({id: "acts.billing.methods"})} forCTI={true}
                                          getValuesFromFields={this.props.getValuesFromFields}
                                          client={this.props.client} setOnGoingCheckIban={this.setOnGoingCheckIban}
                                          setFinishedCheckIban={this.setFinishedCheckIban}/>

            case OwnerEditStep.FILL_LEGAL_RESPONSIBLE:
                return <NewLegalResponsible saveData={this.saveData} validate={this.onValidateLegalResponsible}
                                            getValuesFromFields={this.props.getValuesFromFields}/>

        }
    }

    public render(): JSX.Element {
        if (!this.state.startAct) {
            return (
                <OwnerEligibility title={translate.formatMessage({id: "acts.owner.eligibility.title"})}
                                  client={this.props.client} idService={this.props.idService}
                                  startAct={this.startAct} notifyIneligibility={this.storeIneligibilityData}
                                  notifyServiceUnavailable={this.storeEligibilityNotAvailable}/>
            )
        } else {
            return (
                <BlockUi blocking={this.state.onGoingCheckIban} keepInView={true}
                         loader={<Loading />} tag="div">
                    <Container>
                        <Row>
                            {this.renderStep()}
                        </Row>
                    </Container>

                </BlockUi>
            )
        }

    }
}

export default withFormsy(EditOwner);
