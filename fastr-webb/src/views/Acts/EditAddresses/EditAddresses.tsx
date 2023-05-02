import * as React from "react";
import {Address, Client} from "../../../model/person";
import {connect} from "react-redux";
import {toggleBlockingUI, UIProps} from "src/store/actions/UIActions";
import ClientContextProps from "../../../store/types/ClientContext";
import {fetchAndStoreClient} from "../../../store/actions/ClientContextActions";
import {AppState} from "../../../store";
import AddressInput from "../../../components/Form/Address/AddressInput";
import {Service} from "../../../model/service";
import Loading from "../../../components/Loading";

// http://localhost:3000/acts/client/address?sessionId=dummy&payload=eyJpZENsaWVudCI6Ijg4ODkyMjg5IiwgImlkU2VydmljZSI6IjA5LVFBNDNHOSIsICJpZFRlY2huaXF1ZUFkcmVzc2VUaXR1bGFpcmUiOiIyNDg5ODM1NDciLCAiaWRUZWNobmlxdWVBZHJlc3NlVGl0dWxhaXJlQ1NVIjoiMjk0MzgxNjA0In0=

//  {"idClient":"88892289", "idService":"09-QA43G9", "idTechniqueAdresseTitulaire":"248983547", "idTechniqueAdresseTitulaireCSU":"294381604"}

type PropType = ClientContextProps<Service> & UIProps

interface State {
    disabled: boolean
    dataForTheForm?: Client
    act: FormData
}

interface FormData {
    act: { address: Address }
}

interface Props extends PropType {
    getValuesFromFields: () => { address: Address },
    idService: string
}

// TODO: A factoriser avec EditBillingAddress
class EditAddresses extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            disabled: true,
            dataForTheForm: undefined,
            act: {act: {address: {}}},
        }
    }

    public componentDidMount = async () => {
        if (this.props.client.loading || this.props.client.error) {
            throw new Error("Client is not fetch. Mostly a development error")
        }
        const data: Client = this.props.client.data!;
        data.corporation ? data.ownerCorporation.address.countryCode = data!.ownerCorporation.address.countryCode : data.ownerPerson.address.countryCode = data!.ownerPerson.address.countryCode
        data.address = {};
        this.setState({dataForTheForm: data});
    };

    public render(): JSX.Element {
        const {dataForTheForm} = this.state;

        if (dataForTheForm) {
            const {corporation} = this.state.dataForTheForm!;
            return (
                <AddressInput
                    value={corporation ? dataForTheForm.ownerCorporation.address : dataForTheForm.ownerPerson.address}
                    name="address"/>
            )
        } else {
            return (<Loading />)
        }
    }
}

const mapStateToProps = (state: AppState) => ({
    isFormCompleted: state.casePage.isFormCompleted,
    client: {
        data: state.client.data,
        loading: state.client.loading,
        error: state.client.error,
    }
});

const mapDispatchToProps = {
    loadClient: fetchAndStoreClient,
    toggleBlockingUI,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditAddresses)
