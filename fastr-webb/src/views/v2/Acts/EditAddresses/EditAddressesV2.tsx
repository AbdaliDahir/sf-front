import * as React from "react";
import {UIProps} from "../../../../store/actions/UIActions";
import {Address, Client} from "../../../../model/person";
import AddressInput from "../../../../components/Form/Address/AddressInput";
import Loading from "../../../../components/Loading";
import {AppState} from "../../../../store";
import {connect} from "react-redux";
import {ClientContextSliceState} from "../../../../store/ClientContextSlice";


// http://localhost:3000/acts/client/address?sessionId=dummy&payload=eyJpZENsaWVudCI6Ijg4ODkyMjg5IiwgImlkU2VydmljZSI6IjA5LVFBNDNHOSIsICJpZFRlY2huaXF1ZUFkcmVzc2VUaXR1bGFpcmUiOiIyNDg5ODM1NDciLCAiaWRUZWNobmlxdWVBZHJlc3NlVGl0dWxhaXJlQ1NVIjoiMjk0MzgxNjA0In0=

//  {"idClient":"88892289", "idService":"09-QA43G9", "idTechniqueAdresseTitulaire":"248983547", "idTechniqueAdresseTitulaireCSU":"294381604"}

type PropType = UIProps

interface State {
    disabled: boolean
    dataForTheForm?: Client | undefined
    act: FormData
}

interface FormData {
    act: { address: Address }
}

interface Props extends PropType {
    client: ClientContextSliceState
}

// TODO: A factoriser avec EditBillingAddress
class EditAddressesV2 extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            disabled: true,
            dataForTheForm: undefined,
            act: {act: {address: {}}},
        }
    }

    public componentDidMount = async () => {
        if(this.props.client.clientData){
            this.setState({dataForTheForm: {
                ...this.props.client.clientData,
                address: {}
                }});
        }
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
    client: state.store.client.currentClient
});

export default connect(mapStateToProps)(EditAddressesV2)
