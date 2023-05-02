import * as React from 'react';
import {translate} from "../../../components/Intl/IntlGlobalProvider";
import EditProfessionalInfo from "./Steps/EditProfessionalInfo";
import {connect} from "react-redux";
import {ClientContext} from "../../../store/types/ClientContext";
import {AppState} from "../../../store";
import {Service} from "../../../model/service";
import Loading from "../../../components/Loading";


interface State {
    disabled: boolean,
}

interface Props {
    client: ClientContext<Service>
}

class EditProfessionalData extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {disabled: true}
    }

    public render() {

        if (this.props.client) {
            return (
                <EditProfessionalInfo title={translate.formatMessage({id: "acts.editProfessionaldata"})}
                                      defaultValue={this.props.client.data}/>
            )
        } else {
            return (<Loading/>)
        }
    }
}

const mapStateToProps = (state: AppState) => ({
    client: state.client
});

export default connect(mapStateToProps)(EditProfessionalData)