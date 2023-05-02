import * as React from "react";
import {translate} from "../../../../components/Intl/IntlGlobalProvider";
import * as moment from "moment";
import EditServiceUserStep from "./Steps/EditServiceUserStep";
import {Container} from "reactstrap";
import {fetchAndStoreClient} from "../../../../store/actions/ClientContextActions";
import {toggleBlockingUI} from "../../../../store/actions";
import {connect} from "react-redux";
import ClientContextProps from "../../../../store/types/ClientContext";
import {AppState} from "../../../../store";
import {Service} from "../../../../model/service";
import Loading from "../../../../components/Loading";

type PropType = ClientContextProps<Service>

interface State {
    disabled: boolean
    // tslint:disable-next-line:no-any TODO Typage
    dataForTheForm: any
}

interface Props extends PropType {
    idService: string,
    idClient: string
}

class EditServiceUser extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {disabled: true, dataForTheForm: null}
    }

    /*Before load*/
    public componentDidMount = async () => {
        const data = {dueDate: moment().toISOString(), notification: true};
        const dataForTheForm = Object.assign(data, this.props.client.data);
        this.setState({dataForTheForm})
    };

    public render(): JSX.Element {
        const {dataForTheForm} = this.state;
        if (dataForTheForm && !this.props.client.loading) {
            const {dataForTheForm: {services}} = this.state;
            return (
                <Container>
                    <EditServiceUserStep
                        defaultValue={services[0].user ? services[0].user : this.props.client.data!.ownerPerson}
                        title={translate.formatMessage({id: "acts.edituser.user"})}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(EditServiceUser)
