import * as moment from 'moment'
import * as React from "react";
import {FormattedMessage} from "react-intl";
import {connect} from "react-redux";
import {Col, FormGroup, Label, Row} from "reactstrap";
import Container from "reactstrap/lib/Container";
import FormSelectInput from "../../../components/Form/FormSelectInput";
import {translate} from "../../../components/Intl/IntlGlobalProvider";
import ContactForm from "../../../components/Views/ContactForm";
import {Client} from "../../../model/person";
import {Service} from "../../../model/service";
import {AppState} from "../../../store";
import {toggleBlockingUI} from "../../../store/actions";
import {fetchAndStoreClient} from "../../../store/actions/ClientContextActions";
import ClientContextProps from "../../../store/types/ClientContext";
import {formatPhoneNumber} from "../../../utils/ContactUtils"
import Loading from "../../../components/Loading";

// http://localhost:3000/acts/select?sessionId=dummy&payload=eyJpZENsaWVudCI6Ijg4ODkyMjg5IiwgImlkU2VydmljZSI6IjA5LVFBNDNHOSJ9

type PropType = ClientContextProps<Service>

interface Props extends PropType {
    idClient: string,
    idService: string
}

interface State {
    dataForTheForm?: FormData
}

interface ContactElement {
    phone: string
    cellphone: string
    fax: string
    other: string
    email: string
    favoriteContactDay: string
    favoriteContactHour: string
    corporation: boolean
}

interface FormData extends Client {
    dueDate: string
    notification: boolean
    contact?: ContactElement
}

class EditContactData extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {dataForTheForm: undefined};
    }

    public componentDidMount = async () => {
        const dataForTheForm: FormData = {
            ...this.props.client.data!,
            dueDate: moment().toISOString(),
            notification: true
        };

        const {indicatifPhoneNumber, indicatifMobilePhoneNumber, indicatifFaxNumber, indicatifOtherNumber, phoneNumber, mobilePhoneNumber, faxNumber, otherNumber, contactEmail, favoriteContactDay, favoriteContactHour, corporation} = dataForTheForm;
        // We create the object for the defaultValues

        // We change the format of the phone numbers to be usable by our form
        dataForTheForm.contact = {
            phone: formatPhoneNumber(indicatifPhoneNumber, phoneNumber),
            cellphone: formatPhoneNumber(indicatifMobilePhoneNumber, mobilePhoneNumber),
            fax: formatPhoneNumber(indicatifFaxNumber, faxNumber),
            other: formatPhoneNumber(indicatifOtherNumber, otherNumber),
            email: contactEmail,
            favoriteContactDay,
            favoriteContactHour,
            corporation,
        };

        this.setState({dataForTheForm})
    };

    public render(): JSX.Element {
        const {dataForTheForm} = this.state;

        if (dataForTheForm && dataForTheForm.contact) {
            const defaultContactValue = {
                contact: {
                    phone: dataForTheForm.contact.phone ? dataForTheForm.contact.phone : "",
                    cellphone: dataForTheForm.contact.cellphone ? dataForTheForm.contact.cellphone : "",
                    fax: dataForTheForm.contact.fax ? dataForTheForm.contact.fax : "",
                    other: dataForTheForm.contact.other ? dataForTheForm.contact.other : "",
                    email: dataForTheForm.contact.email ? dataForTheForm.contact.email : ""
                }
            }

            return (
                <Container>
                    <ContactForm title="Contact" name="contact" defaultValue={defaultContactValue}/>
                    <Row>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="favoriteContactHour"><FormattedMessage
                                    id="act.notification.favoritehour"/></Label>
                                <FormSelectInput name="notificationInformation.favoriteContactHour"
                                                 id="notificationInformation.favoriteContactHour"
                                                 value={dataForTheForm.contact.favoriteContactHour}>
                                    <option
                                        value={translate.formatMessage({id: "act.notification.favoritehour.value.none"})}>{translate.formatMessage({id: "act.notification.none"})}</option>
                                    <option
                                        value={translate.formatMessage({id: "act.notification.favoritehour.value.morning"})}>{translate.formatMessage({id: "act.notification.favoritehour.morning"})}</option>
                                    <option
                                        value={translate.formatMessage({id: "act.notification.favoritehour.value.miday"})}>{translate.formatMessage({id: "act.notification.favoritehour.miday"})}</option>
                                    <option
                                        value={translate.formatMessage({id: "act.notification.favoritehour.value.afternoon"})}>{translate.formatMessage({id: "act.notification.favoritehour.afternoon"})}</option>
                                    <option
                                        value={translate.formatMessage({id: "act.notification.favoritehour.value.evening"})}>{translate.formatMessage({id: "act.notification.favoritehour.evening"})}</option>
                                </FormSelectInput>
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="favoriteContactDay"><FormattedMessage
                                    id="act.notification.favoriteday"/></Label>
                                <FormSelectInput name="notificationInformation.favoriteContactDay"
                                                 id="notificationInformation.favoriteContactDay"
                                                 value={dataForTheForm.contact.favoriteContactDay}>
                                    <option
                                        value={translate.formatMessage({id: "act.notification.favoriteday.value.none"})}>{translate.formatMessage({id: "act.notification.none"})}</option>
                                    <option
                                        value={translate.formatMessage({id: "act.notification.favoriteday.value.monday"})}>{translate.formatMessage({id: "act.notification.favoriteday.monday"})}</option>
                                    <option
                                        value={translate.formatMessage({id: "act.notification.favoriteday.value.tuesday"})}>{translate.formatMessage({id: "act.notification.favoriteday.tuesday"})}</option>
                                    <option
                                        value={translate.formatMessage({id: "act.notification.favoriteday.value.wednesday"})}>{translate.formatMessage({id: "act.notification.favoriteday.wednesday"})}</option>
                                    <option
                                        value={translate.formatMessage({id: "act.notification.favoriteday.value.thursday"})}>{translate.formatMessage({id: "act.notification.favoriteday.thursday"})}</option>
                                    <option
                                        value={translate.formatMessage({id: "act.notification.favoriteday.value.friday"})}>{translate.formatMessage({id: "act.notification.favoriteday.friday"})}</option>
                                    <option
                                        value={translate.formatMessage({id: "act.notification.favoriteday.value.saturday"})}>{translate.formatMessage({id: "act.notification.favoriteday.saturday"})}</option>
                                </FormSelectInput>
                            </FormGroup>
                        </Col>
                    </Row>
                </Container>
            )
        } else {
            return (<Loading />)
        }
    }
}

const mapStateToProps = (state: AppState) => ({
    client: {
        data: state.client.data,
        loading: state.client.loading,
        error: state.client.error,
    }
});

const mapDispatchToProps = {
    loadClient: fetchAndStoreClient,
    toggleBlockingUI
};

export default connect(mapStateToProps, mapDispatchToProps)(EditContactData)