import * as React from 'react';
import {connect} from "react-redux";
import {ClientContextSliceState} from "../../../../store/ClientContextSlice";
import EditProfessionalInfo from "../../../Acts/EditProfessionalData/Steps/EditProfessionalInfo";
import {translate} from "../../../../components/Intl/IntlGlobalProvider";
import Loading from "../../../../components/Loading";
import {AppState} from "../../../../store";


interface State {
    disabled: boolean,
}

interface Props {
    client: ClientContextSliceState
}

class EditProfessionalDataV2 extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {disabled: true}
    }

    public render() {

        if (this.props.client) {
            return (
                <EditProfessionalInfo title={translate.formatMessage({id: "acts.editProfessionaldata"})}
                                      defaultValue={this.props.client.clientData}/>
            )
        } else {
            return (<Loading />)
        }
    }
}

const mapStateToProps = (state: AppState) => ({
    client: state.store.client.currentClient
});

export default connect(mapStateToProps)(EditProfessionalDataV2)