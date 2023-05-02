import * as moment from 'moment'
import * as React from "react";
import {FormattedMessage} from "react-intl";
import {connect} from "react-redux";
import {Col, Label, Row} from "reactstrap";
import {ClientContextSliceState} from "../../../../store/ClientContextSlice";
import {Client} from "../../../../model/person";
import {formatPhoneNumber} from "../../../../utils/ContactUtils";
import ContactForm from "../../../../components/Views/ContactForm";
import FormSelectInput from "../../../../components/Form/FormSelectInput";
import {translate} from "../../../../components/Intl/IntlGlobalProvider";
import Loading from "../../../../components/Loading";
import {AppState} from "../../../../store";

interface Props {
    client: ClientContextSliceState
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

class EditContactDataV2 extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {dataForTheForm: undefined};
    }

    public componentDidMount = async () => {
        const dataForTheForm: FormData = {
            ...this.props.client.clientData!,
            dueDate: moment().toISOString(),
            notification: true
        };

        const {
            indicatifPhoneNumber,
            indicatifMobilePhoneNumber,
            indicatifFaxNumber,
            indicatifOtherNumber,
            phoneNumber,
            mobilePhoneNumber,
            faxNumber,
            otherNumber,
            contactEmail,
            favoriteContactDay,
            favoriteContactHour,
            corporation
        } = dataForTheForm;
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
                <React.Fragment>
                    <ContactForm title="Contact" name="contact" defaultValue={defaultContactValue} withPhonesConstraints={true}/>
                    <Row>
                        <Col md={6}>
                            <Label for="favoriteContactHour"><FormattedMessage
                                id="act.notification.favoritehour"/></Label>
                            <FormSelectInput name="notificationInformation.favoriteContactHour"
                                             id="notificationInformation.favoriteContactHour"
                                             bsSize={"sm"}
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
                        </Col>
                        <Col md={6}>
                            <Label for="favoriteContactDay"><FormattedMessage
                                id="act.notification.favoriteday"/></Label>
                            <FormSelectInput name="notificationInformation.favoriteContactDay"
                                             id="notificationInformation.favoriteContactDay"
                                             bsSize={"sm"}
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
                        </Col>
                    </Row>
                </React.Fragment>
            )
        } else {
            return (<Loading/>)
        }
    }
}

const mapStateToProps = (state: AppState) => ({
    client: state.store.client.currentClient
});

export default connect(mapStateToProps)(EditContactDataV2)