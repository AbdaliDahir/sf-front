import * as React from "react";
import * as moment from "moment";
import EditServiceUserStepV2 from "./Steps/EditServiceUserStepV2";
import {Container} from "reactstrap";
import {connect} from "react-redux";
import {ClientContextSliceState} from "../../../../../store/ClientContextSlice";
import {AppState} from "../../../../../store";
import Loading from "../../../../../components/Loading";
import {translate} from "../../../../../components/Intl/IntlGlobalProvider";

interface State {
    disabled: boolean
    // tslint:disable-next-line:no-any TODO Typage
    dataForTheForm: any
}

interface Props {
    client: ClientContextSliceState
}

class EditServiceUserV2 extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {disabled: true, dataForTheForm: null}
    }

    /*Before load*/
    public componentDidMount = async () => {
        const data = {dueDate: moment().toISOString(), notification: true};
        const dataForTheForm = Object.assign(data, this.props.client.clientData);
        this.setState({dataForTheForm})
    };

    public render(): JSX.Element {
        const {dataForTheForm} = this.state;
        if (dataForTheForm && !this.props.client.loading) {
            const {dataForTheForm: {services}} = this.state;
            return (
                <Container>
                    <EditServiceUserStepV2
                        defaultValue={services[0].user ? services[0].user : this.props.client.clientData!.ownerPerson}
                        title={translate.formatMessage({id: "acts.edituser.user"})}/>
                </Container>
            )
        } else {
            return (<Loading />)
        }
    }
}

const mapStateToProps = (state: AppState) => ({
    client: state.store.client.currentClient
});

export default connect(mapStateToProps)(EditServiceUserV2)
