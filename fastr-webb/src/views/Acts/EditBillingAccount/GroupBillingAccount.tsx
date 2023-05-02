import * as React from "react";
import {connect} from "react-redux";
import Table from "reactstrap/lib/Table";
import FormHiddenInput from "../../../components/Form/FormHiddenInput";
import {Service} from "../../../model/service";
import {AppState} from "../../../store";
import {fetchAndStoreClient} from "../../../store/actions/ClientContextActions";
import ClientContextProps from "../../../store/types/ClientContext";
import ServiceUtils from "../../../utils/ServiceUtils";
import ClientService from "../../../service/ClientService";

interface State {
    accountId?: string,
    eligibleServices: Service[],
    eligibleBillingAccountIds: string []
}

class GroupBillingAccount extends React.Component<ClientContextProps<Service>, State> {

     public clientService: ClientService = new ClientService();

    constructor(props: ClientContextProps<Service>) {
        super(props);
        this.state = {accountId: undefined, eligibleServices: [], eligibleBillingAccountIds:[]}
    }

    public async componentDidMount() {
        const currentBillingAccount = this.props.client.service!.billingAccount;
        const filteredServices: Service[] = this.props.client.data!.services.filter(
            e => e.billingAccount.id !== currentBillingAccount.id && !ServiceUtils.isFixe(e) && !e.billingAccount.haveUnPaid);
        const eligibleBillingAccountIdsResponse = await this.clientService.getEligibleBillingAccountIds(this.props.client.data!.id,this.props.client.serviceId!);
        this.setState({
            eligibleServices: filteredServices,
            eligibleBillingAccountIds: eligibleBillingAccountIdsResponse
        });
    }

    public selectAccountId = (selectedAccountId: string) => () => {
        this.setState({accountId: selectedAccountId})
    }

    public renderAccount(): JSX.Element[] {
        const accountToServices = new Map();
        const {eligibleServices, eligibleBillingAccountIds} = this.state
        const activesEligibleServices = eligibleServices.filter(eligibleService => eligibleBillingAccountIds.includes(eligibleService.billingAccount.id))

        activesEligibleServices.forEach(e => {
            const meansOfPayment = e.billingAccount.billingMethod === "SEPA"
                ? e.billingAccount.sepaMethod.iban : "";

            let servicesLabels: string[];
            if (accountToServices.has(e.billingAccount.id + ',' + meansOfPayment)) {
                servicesLabels = accountToServices.get(e.billingAccount.id + ',' + meansOfPayment);
                servicesLabels.push(e.label)

            } else {
                servicesLabels = [];
                servicesLabels.push(e.label);
                accountToServices.set(e.billingAccount.id + ',' + meansOfPayment, servicesLabels)
            }
        });

        const content: JSX.Element[] = [];
        accountToServices.forEach((value: string[], key: string) => {
                const accountId = key.split(',')[0];
                const hiddenMeansOfPayment = ServiceUtils.hideIban(key.split(',')[1]);
                content.push(
                    <tr key={key}>
                        <td>
                            <input className="mr-1" type={"radio"} title={"Sélectionner pour modifier"} name="radAnswer"
                                   onClick={this.selectAccountId(accountId)}/>
                        </td>
                        <td>{accountId}</td>
                        {!hiddenMeansOfPayment ? <td>Autre</td> :
                            <td>{"SEPA" + " " + hiddenMeansOfPayment}</td>}
                        <td>{value.join(',')}</td>
                    </tr>)
            }
        )

        return content;
    }

    public render(): JSX.Element {
        const currentBillingAccount = this.props.client.service!.billingAccount;
        const impactedLine = this.props.client.service!.label;
        const {eligibleServices, eligibleBillingAccountIds} = this.state;
        const activesEligibleServices = eligibleServices.filter(eligibleService => eligibleBillingAccountIds.includes(eligibleService.billingAccount.id))
        if (currentBillingAccount.haveUnPaid || currentBillingAccount.status.toString() !== "ACTIVE") {
            return (<div className="mt-4 text-center">Le groupement est impossible car le compte de facturation de la
                ligne est en impayé ou n'est pas au statut ACTIF</div>)

        } else if (activesEligibleServices.length === 0) {
            return (<div className="mt-4 text-center">Aucun compte de facturation disponible pour un groupement</div>)

        } else {
            return (
                <div>
                    <div className="pt-3">Choisissez le nouveau Compte de Facturation du service {impactedLine}</div>
                    <Table bordered responsive data={activesEligibleServices}
                           className="w-100 mt-1 table-hover table-sm mt-3">
                        <tr>
                            <th/>
                            <th>CF</th>
                            <th>Moyen de paiement</th>
                            <th>Liste des services</th>
                        </tr>
                        <tbody>
                        {this.renderAccount()}
                        </tbody>
                    </Table>

                    <FormHiddenInput name="selectedAccountId" id="selectedAccountId" value={this.state.accountId}/>
                </div>
            )
        }
    }

}

const mapStateToProps = (state: AppState) => ({
    client: {
        data: state.client.data,
        loading: state.client.loading,
        error: state.client.error,
        service: state.client.service,
        serviceId: state.client.serviceId
    }
});

const mapDispatchToProps = {
    loadClient: fetchAndStoreClient
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupBillingAccount)
