import * as _ from "lodash";
import * as moment from "moment-timezone";
import * as React from "react";
import {ChangeEvent} from "react";
import {FormattedMessage} from "react-intl";
import {NotificationManager} from "react-notifications";
import {Button, Col, Label, Row} from "reactstrap";
import FormSwitchInput from "../../components/Form/FormSwitchInput";
import FormTextInput from "../../components/Form/FormTextInput";
import {translate} from "../../components/Intl/IntlGlobalProvider";
import {AdvancedSearchDto} from "../../model/AdvancedSearchDto";
import {Client} from "../../model/person";
import ClientService from "../../service/ClientService";
import AddressUtils from "../../utils/AddressUtils";
import DateUtils from "../../utils/DateUtils";
import ValidationUtils from "../../utils/ValidationUtils";
import {SearchForm} from "./ExtendedSearchClients";
import ResultBox from "./ResultBox";
import FormDateInputV2 from "../../components/Form/Date/FormDateInputV2";

interface Props {
    onSelect: (client: Client | undefined) => void,
    previousSearchForm?: SearchForm,
    // tslint:disable-next-line:no-any TODO A CORRIGER
    saveData?: (key: string, value: any) => void,
    excludedIds?: string[]
}

interface State {
    disabledSearch: boolean,
    clients: Client[],
    searchForm: SearchForm,
    selectedClient?: string
}

export default class AdvancedSearchClients extends React.Component<Props, State> {

    private clientService: ClientService = new ClientService();

    constructor(props: Readonly<Props>) {
        super(props);
        this.state = {
            disabledSearch: true,
            clients: [],
            searchForm: this.props.previousSearchForm ? this.props.previousSearchForm : {
                lastname: "",
                firstname: "",
                birthDate: undefined,
                city: "",
                zipcode: "",
                pro: true,
                corporateName: "",
                corporateZipcode: ""
            }
        }
    }

    public onSearch = async () => {
        try {
            this.onSelect(undefined)

            const {searchForm} = this.state;
            let searchDto: AdvancedSearchDto;

            if (!searchForm.pro) {
                searchDto = {
                    firstname: searchForm.firstname,
                    lastname: searchForm.lastname,
                    birthDate: searchForm.birthDate ? DateUtils.toGMT0ISOString(moment.utc(searchForm.birthDate)) : undefined,
                    city: searchForm.city !== '' ?searchForm.city : undefined,
                    zipcode: searchForm.zipcode !== '' ? searchForm.zipcode: undefined
                }
            } else {
                searchDto = {
                    corporateName: searchForm.corporateName,
                    corporateZipcode: searchForm.corporateZipcode
                }
            }
            let clients: Client[] = await this.clientService.advancedSearchClients(searchDto);

            if (clients.length === 0) {
                NotificationManager.info(translate.formatMessage({id: "global.table.nothing"}), null, 2000)
            } else {
                if (this.props.excludedIds) {
                    clients = clients.filter(c => !this.props.excludedIds!.includes(c.id))
                    if (clients.length === 0) {
                        NotificationManager.error(translate.formatMessage({id: "acts.holder.search.results.same.owner"}))
                    }
                }
            }
            this.setState({
                clients
            });
        } catch (e) {
            NotificationManager.error((await e).message);
            console.error(e);
        }
    }

    public saveData = (e: ChangeEvent<HTMLInputElement>) => {
        const name = e.currentTarget.name;
        const value = 'checkbox' !== e.currentTarget.type ? e.currentTarget.value : e.currentTarget.checked;
        this.setState((prevState) => {
            _.set(prevState, name, value);
            return {...prevState};
        });

        if (this.props.saveData) {
            this.props.saveData(name, value)
        }
    }

    public changeDate = (date: Date) => {
        this.saveDate("birthDate", date);
    }

    public saveDate = (name: string, value: Date) => {
        this.setState((prevState) => {
            _.set(prevState, name, value);
            return {...prevState};
        });

        if (this.props.saveData) {
            this.props.saveData(name, value)
        }
    }

    public onSelect = (c?: Client) => {
        this.props.onSelect(c);

        if (c) {
            const id = c.id;
            this.setState({selectedClient: id})
        } else {
            this.setState({selectedClient: undefined})
        }
    }

    public render(): JSX.Element {
        const {searchForm: {firstname, lastname, birthDate, city, zipcode, pro, corporateName, corporateZipcode}} = this.state;

        return (
            <React.Fragment>
                <Row>
                    <Col className="mt-3 d-inline-flex">
                        <Label for="pro" className="mt-2">
                            <FormattedMessage id="global.form.pro"/>
                        </Label>
                        <FormSwitchInput color="primary"
                                         valueOn={translate.formatMessage({id: "global.dialog.yes"})}
                                         valueOff={translate.formatMessage({id: "global.dialog.no"})}
                                         name="pro"
                                         thickness={"sm"}
                                         id="pro" value={pro} onChange={this.saveData}/>
                    </Col>
                </Row>

                {pro ? <React.Fragment>
                        <Row>
                            <Col md={4}>
                                <Label for="corporateName">
                                    <FormattedMessage id="global.form.corporateName"/><span className="text-danger">*</span>
                                </Label>
                                <FormTextInput name="corporateName" id="corporateName" onChange={this.saveData}
                                               validations={{isRequired: ValidationUtils.notEmpty}}
                                               bsSize={"sm"}
                                               value={corporateName}/>
                            </Col>
                            <Col md={4}>
                                <Label for="corporateZipcode">
                                    <FormattedMessage id="global.address.zipcode"/>
                                </Label>
                                <FormTextInput name="corporateZipcode" id="corporateZipcode" value={corporateZipcode}
                                               onChange={this.saveData}
                                               bsSize={"sm"}
                                               validations={corporateZipcode ? {isZipcode: ValidationUtils.isZipcode} : {}}/>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={{size: 2, offset: 10}}>
                                <Button id="advancedSearchClients.onsearchnonpro.button.id" className="mt-3"
                                        color="secondary" size="sm"
                                        disabled={!corporateName || (!!corporateZipcode ? !AddressUtils.isZipcode(corporateZipcode) : false)}
                                        onClick={this.onSearch}>
                                    <FormattedMessage id="search.button"/>
                                </Button>
                            </Col>
                        </Row>
                    </React.Fragment>
                    :
                    <React.Fragment>
                        <Row>
                            <Col md={4}>
                                <Label for="lastname">
                                    <FormattedMessage id="global.form.lastname"/><span className="text-danger">*</span>
                                </Label>
                                <FormTextInput name="lastname" id="lastname" onChange={this.saveData}
                                               validations={{isRequired: ValidationUtils.notEmpty}}
                                               bsSize={"sm"}
                                               value={lastname}/>
                            </Col>
                            <Col md={4}>
                                <Label for="firstname">
                                    <FormattedMessage id="global.form.firstname"/><span className="text-danger">*</span>
                                </Label>
                                <FormTextInput name="firstname" id="firstname" onChange={this.saveData}
                                               validations={{isRequired: ValidationUtils.notEmpty}}
                                               bsSize={"sm"}
                                               value={firstname}/>
                            </Col>
                            <Col md={3}>
                                <Label for="birthDate">
                                    <FormattedMessage id="global.form.birth.date"/><span className="text-danger">*</span>
                                </Label>
                                <FormDateInputV2 peekNextMonth showMonthDropdown showYearDropdown
                                                 isClearable
                                                 name="birthDate" id="birthDate" handleActionDateChange={this.changeDate}
                                                 small
                                                 value={birthDate}/>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={4}>
                                <Label for="zipcode">
                                    <FormattedMessage id="acts.holder.search.zipcode"/>
                                </Label>
                                <FormTextInput name="zipcode" id="zipcode"
                                               value={zipcode} onChange={this.saveData}
                                               bsSize={"sm"}/>
                            </Col>
                            <Col md={4}>
                                <Label for="city">
                                    <FormattedMessage id="global.address.city"/>
                                </Label>
                                <FormTextInput name="city" id="city"
                                               value={city} onChange={this.saveData}
                                               bsSize={"sm"}/>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={{size: 2, offset: 10}}>
                                <Button id="advancedSearchClients.onsearchpro.button.id" className="mt-3"
                                        color="secondary" size="sm"
                                        disabled={!firstname || !lastname}
                                        onClick={this.onSearch}><FormattedMessage
                                    id="search.button"/></Button>
                            </Col>
                        </Row>
                    </React.Fragment>
                }

                <Row className="mt-3">
                    {this.renderResults()}
                </Row>
            </React.Fragment>
        )
    }

    private renderResults(): JSX.Element[] {
        return this.state.clients.map(e => <ResultBox key={e.id} client={e} onClick={this.onSelect} selected/>)
    }

}
