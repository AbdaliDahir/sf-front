import * as React from 'react';
import FastrPayloadPage from "../../../../components/Pages/FastrPayloadPage";
import {RouteComponentProps} from "react-router";
import Formsy from "formsy-react";
import {translate} from "../../../../components/Intl/IntlGlobalProvider";
import EditCompanyRegistrationNumberStep from "./Steps/EditCompanyRegistrationNumberStep";
import ActService from "../../../../service/ActService";
import ActConfirmationStep from "../../../../components/Views/ActOptions";
import * as moment from "moment";
import {ClientContextInterface} from "../../../../context/ClientContext";
import {BlockingContextInterface} from "../../../App";
import {NotificationManager} from "react-notifications";
import * as clientContext from "../../../../context/ClientContext";
import {Client} from "../../../../model/person";

import { connect } from "react-redux";
import { toggleBlockingUI } from "src/store/actions/UIActions";
import Loading from "../../../../components/Loading";

interface Payload {
    idClient: string,
    idService: string
}

interface State {
    disabled: boolean,
    dataForTheForm?: Client
}


interface Props extends RouteComponentProps<void> {
    client: ClientContextInterface,
    block: BlockingContextInterface
    toggleBlockingUI: () => void
}

class EditCompanyRegistrationNumber extends FastrPayloadPage<Props, State, Payload, void> {

    private actService: ActService = new ActService(true);

    constructor(props: Props) {
        super(props);
        this.state = {disabled: true, dataForTheForm: undefined}
    }

    /*Before load*/
    public componentDidMount = async () => {
        await this.props.client.loadServiceOwner(this.payload.idClient, this.payload.idService, clientContext.DataLoad.ONE_SERVICE)
        const data = {dueDate: moment().toISOString(), notification: true};
        const dataForTheForm = Object.assign(data, this.props.client.data);
        this.setState({dataForTheForm})
    };

    public getNonNullValues(valueFromForm: string, valueFromCache: string): string {
        if (valueFromForm === undefined || valueFromForm === null || valueFromForm === "") {
            return valueFromCache;
        } else {
            return valueFromForm;
        }
    }

    /*Submit form*/
    // tslint:disable-next-line:no-any TODO: typage
    public submitAct = async (form: any) => {
        const {corporation} = this.state.dataForTheForm!;

        // Block UI
        this.props.toggleBlockingUI();

        // Create request
        const {idClient, idService} = this.payload;

        if (form.act.business.info === undefined) {
            // if nothing was updated
            this.props.toggleBlockingUI();
        } else {
            let actFromForm;
            const siretFromForm: string = form.act.business.info.siret;

            if (corporation) {
                actFromForm = {
                    newValues: {
                        moralPerson: {
                            siren: siretFromForm !== undefined ? siretFromForm.substr(0, 9) : null,
                            siret: siretFromForm,
                            companyName: form.act.business.info.name
                        }
                    }
                }
            } else {
                actFromForm = {
                    newValues: {
                        physicalPerson: {
                            siren: siretFromForm !== undefined ? siretFromForm.substr(0, 9) : null,
                            siret: siretFromForm
                        }
                    }
                }
            }

            // TODO: A corriger
            // tslint:disable-next-line:no-any
            const request: any = {
                act: actFromForm,
                "personId": idClient,
                "pro": corporation,
                "serviceId": idService,
            };
            /*Call fastr-acts*/
            try {
                await this.actService.updateCorporationSigcData(request, idClient, idService);
            } catch (error) {
                NotificationManager.error("Erreur serveur " + error)
            }
            // Unblock UI
            this.props.toggleBlockingUI()
        }

    };


    public enableSubmitButton = () => (this.setState({disabled: false}));

    public disableSubmitButton = () => (this.setState({disabled: true}));

    public render() {
        const {dataForTheForm} = this.state;
        if (!dataForTheForm) {
            return (<Loading />)
        } else {
            return (
                <Formsy onSubmit={this.submitAct} onValid={this.enableSubmitButton}
                        onInvalid={this.disableSubmitButton}>
                        <EditCompanyRegistrationNumberStep
                            title={translate.formatMessage({id: "acts.editProfessionaldata"})}/>
                        <ActConfirmationStep title={translate.formatMessage({id: "global.confirmation"})}
                                             defaultValue={{notification: true, dueDate: moment().toDate()}}/>
                </Formsy>
            )
        }
    }
}

export default connect(null, { toggleBlockingUI })(EditCompanyRegistrationNumber)