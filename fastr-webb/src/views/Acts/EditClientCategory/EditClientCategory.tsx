import React, {ChangeEvent, Component} from 'react';
import {Col, FormGroup, Label, Row, Table} from "reactstrap";
import {FormattedMessage} from "react-intl";
import FormSelectInput from "../../../components/Form/FormSelectInput";
import ValidationUtils from "../../../utils/ValidationUtils";
import {ServiceStatus} from "../../../model/service";
import ServiceUtils from "../../../utils/ServiceUtils";
import {translate} from "../../../components/Intl/IntlGlobalProvider";
import FormSwitchInput from "../../../components/Form/FormSwitchInput";
import ActService from "../../../service/ActService";
import {AppState} from "../../../store";
import {connect} from "react-redux";
import {Client} from "../../../model/person";
import {addModifiedServiceId, removeModifiedServiceId} from "../../../store/actions/ADGActions";
import {get} from "lodash";
import {NotificationManager} from "react-notifications";

interface Props {
    client: Client,
    authorizations: Array<string>,
    addModifiedServiceId: (value: string) => void
    removeModifiedServiceId: (value: string) => void
    modifiedServices: Array<string>
}

interface State {
    serviceMap: Map<string, string | "">
    isVip: boolean
    serviceCategories: Array<string>
}

class EditClientCategory extends Component<Props, State> {
    private actService: ActService = new ActService(true);

    constructor(props: Props) {
        super(props);
        this.state = {
            isVip: false,
            serviceMap: new Map(),
            serviceCategories: []
        };
    }

    get isAllowedVip() {
        return this.props.authorizations.indexOf("ENABLE_VIP_SEARCH") !== -1;
    }

    public async componentDidMount() {
        const {client} = this.props;
        const serviceMap = new Map();
        for (const service of client.services) {
            serviceMap.set(service.id, service.billingAccount.serviceCategory);
        }

        let serviceCategories: string[] = [];
        try {
            serviceCategories = await this.actService.getServiceCategories(this.isAllowedVip);
        } catch(error) {
            console.error(error);
            NotificationManager.error("Impossible de récupérer les catégories de service");
        }
        this.setState({serviceMap, serviceCategories, isVip: client.vip})
    }

    public catchServiceCategoryChange = (serviceId, formWasChanged: React.FormEvent<HTMLInputElement>) => {
        if (formWasChanged && formWasChanged.currentTarget) {
            const newServiceCategory = formWasChanged.currentTarget.value;
            const originalServiceCategory = this.props.client.services.find(service => service.id === serviceId)!.billingAccount.serviceCategory;

            const updatedMap = new Map(this.state.serviceMap);
            updatedMap.set(serviceId, newServiceCategory);
            if (newServiceCategory !== originalServiceCategory) {
                if (this.props.modifiedServices.indexOf(serviceId) === -1) {
                    this.props.addModifiedServiceId(serviceId);
                }
                this.setState({
                    serviceMap: updatedMap
                })
            } else {
                this.props.removeModifiedServiceId(serviceId);
                this.setState({
                    serviceMap: updatedMap
                })
            }
        }
    };

    public isServiceCategoryModified = (serviceId) => {
        return !!this.props.modifiedServices.find(modifiedServiceId => modifiedServiceId === serviceId);
    };

    public getServiceCategories = () => {
        return this.state.isVip ? this.state.serviceCategories : this.state.serviceCategories.filter(serviceCategory => serviceCategory !== "VIP");
    };

    public toggleVip = (event: ChangeEvent<HTMLInputElement>) => {
        const isVip = event.currentTarget.checked;
        const updatedMap = new Map(this.state.serviceMap);
        if (!isVip) {
            updatedMap.forEach((serviceCategory, serviceId) => {
                if (serviceCategory === "VIP") {
                    updatedMap.set(serviceId, "")
                }
            });
            this.setState({serviceMap: updatedMap, isVip})
        }
        this.setState({isVip});
    };

    public renderServices() {
        if (this.props.client && this.props.client.services) {
            const {services} = this.props.client;
            if (services.length > 0) {
                return services.map((service) =>
                    <tr key={service.id}
                        className={this.isServiceCategoryModified(service.id) ? "font-weight-bold" : ""}>
                        <td>
                            {service.billingAccount.id}
                        </td>
                        <td>
                            {service.label} {ServiceUtils.renderBadge(service.status as ServiceStatus)}
                        </td>
                        <td className="no-margin-formgroup">
                            <FormSelectInput bsSize="sm" name={`editClientCategory.serviceCategory.${service.id}`}
                                             id="serviceCategory"
                                             onChangeCapture={this.catchServiceCategoryChange.bind(this, service.id)}
                                             value={this.state.serviceMap.get(service.id)}
                                             validations={{isRequired: ValidationUtils.notEmpty}}><span className="text-danger">*</span>
                                <option disabled value=""/>
                                {this.getServiceCategories().map(category =>
                                    <option key={category}
                                            value={category}>{translate.formatMessage({id: category})}</option>
                                )}
                            </FormSelectInput>
                        </td>
                    </tr>
                )
            }
        }
        return <React.Fragment/>
    }

    public render() {
        const clientCategory = get(this.props.client, 'clientCategory', 'Non défini');
        return (
            <Row>
                <Col md={3} className="d-flex justify-content-around pr-0">
                    <FormGroup className="d-flex flex-column align-items-center">
                        <Label for="civility"><FormattedMessage id="acts.editClientCategory.select.category"/></Label>
                        <div><strong><FormattedMessage id={clientCategory}/></strong></div>
                    </FormGroup>
                    {this.isAllowedVip && <FormGroup className="d-flex flex-column align-items-center">
                        <Label for="isClientVip">
                            <FormattedMessage id="acts.editClientCategory.vipClient.label"/>
                        </Label>
                        <FormSwitchInput color="primary"
                                         value={this.state.isVip}
                                         valueOn={translate.formatMessage({id: "global.dialog.yes"})}
                                         valueOff={translate.formatMessage({id: "global.dialog.no"})}
                                         onChange={this.toggleVip}
                                         name="editClientCategory.vip" id="isClientVip"/>
                    </FormGroup>
                    }
                </Col>
                <Col md={9}>
                    <Table bordered>
                        <tr>
                            <th><FormattedMessage id="acts.editClientCategory.billingAccount.label"/></th>
                            <th><FormattedMessage id="acts.editClientCategory.affectedServices.label"/></th>
                            <th><FormattedMessage id="acts.editClientCategory.category.label"/></th>
                        </tr>
                        {this.renderServices()}
                    </Table>
                </Col>
            </Row>
        );
    }
}


const mapStateToProps = (state: AppState) => ({
    client: state.client.data,
    authorizations: state.authorization.authorizations,
    modifiedServices: state.adg.modifiedServiceIds
});

const mapDispatchToProps = {
    addModifiedServiceId,
    removeModifiedServiceId

};
export default connect(mapStateToProps, mapDispatchToProps)(EditClientCategory)
