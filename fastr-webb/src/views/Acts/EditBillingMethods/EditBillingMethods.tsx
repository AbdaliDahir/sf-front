import * as React from "react";
import Formsy from 'formsy-react';
import ActOptionsStep from "../../../components/Views/ActOptions";
import {translate} from "../../../components/Intl/IntlGlobalProvider";
import BillingMethodFormStep from "./Steps/BillingMethodForm";
import FastrPayloadPage from "../../../components/Pages/FastrPayloadPage";
import * as moment from 'moment'
import ActService from "../../../service/ActService";
import {BillingMethods} from "../../../model/BillingMethods";
import AddressForm from "../../../components/Views/AddressForm";
import {BlockingContext, BlockingContextInterface} from "../../App";
import {RouteComponentProps} from "react-router";
import { connect } from "react-redux";
import { toggleBlockingUI } from "src/store/actions/UIActions";

// http://localhost:3000/acts/client/billing/methods?sessionId=dummy&payload=eyJvbGRCaWxsaW5nTWV0aG9kcyI6ewogICAgImJhbmtEZXRhaWxzIjp7CiAgICAgICAgImliYW4iOiAiRlIzOSAxMDAwIDk5OTkgMTIqKiAqKioqICo3NzggQSoqIiwKICAgICAgICAiYmljIjogIkNSTFlGUlRDWFhYIiwKICAgICAgICAiZXRzIjogICJTRlIgZW50cmVwcmlzZSIKICAgIH0KfSwKImZpcnN0TmFtZSI6IkZhc3QiLCAibGFzdE5hbWUiOiJGYXN0ciIsICJjaXZpbGl0eSI6Ik1MTEUiLCJhZGRyZXNzSWQiOiAiSURUT1RPIiwgImFkZHJlc3MiOiIxNiBydWUgZHUgZ2VuZXJhbCBhbGFpbiBkZSBib2lzc2lldSIsICJhZGRyZXNzQ29tcGxlbWVudCIgOiAiMmVtZSBldGFnZSwgem9uZSAzOC01OCIsICJjaXR5IjogIlBhcmlzIiwgInppcGNvZGUiOiI3NTAxNSIsICJjb3VudHJ5IjoiRnJhbmNlIiwKInBlcnNvbklkIjoiPz8/Igp9

interface Props extends RouteComponentProps<void>{
    blockUi: BlockingContextInterface,
    toggleBlockingUI: ()=>void
}

export interface Payload {
    oldBillingMethods: BillingMethods
    personId: string,
}

interface State {
    disabled: boolean
}


class EditBillingMethods extends FastrPayloadPage<Props, State, Payload, void> {
    public static contextType = BlockingContext;
    private actService: ActService = new ActService(true);

    constructor(props: Props) {
        super(props);
        this.state = {disabled: true}
    }

    // TODO: Edit ça
    // tslint:disable-next-line:no-any
    public submitAct = async (form: any) => {
        this.props.toggleBlockingUI()


        // TODO: Edit ça

        // tslint:disable-next-line:no-any
        const request: any = {
            act: {
                oldBillingMethods: this.payload.oldBillingMethods,
                newBillingMethods: form.act.oldBillingMethods,
                address: form.act.oldAddress,
            },
            dueDate: moment(form.dueDate).toDate(),
            notification: form.notification
        };

        await this.actService.updateBillingMethod(request);

        this.props.toggleBlockingUI()
    };

    public enableSubmitButton = () => (this.setState({disabled: false}));

    public disableSubmitButton = () => (this.setState({disabled: true}));

    public render(): JSX.Element {
        return (
            <Formsy onSubmit={this.submitAct} onValid={this.enableSubmitButton} onInvalid={this.disableSubmitButton}>
                    <BillingMethodFormStep title={translate.formatMessage({id: "acts.billing.methods"})}/>
                    <AddressForm title={translate.formatMessage({id: "global.address"})}/>
                    <ActOptionsStep title={translate.formatMessage({id: "acts.billing.methods.options"})}
                                    defaultValue={{notification: true, dueDate: moment().toDate()}} />
            </Formsy>
        )
    }
}

export default connect(null, { toggleBlockingUI})(EditBillingMethods)