import {Service} from "../../../model/service";
import * as React from "react";
import ClientContextProps from "../../../store/types/ClientContext";
import ClientService from "../../../service/ClientService";
import {AppState} from "../../../store";
import {fetchAndStoreClient} from "../../../store/actions/ClientContextActions";
import {fetchAndStoreBillingsSettings} from "../../../store/actions";
import {connect} from "react-redux";
import {Card, CardBody, Col, Container, CustomInput, FormGroup, Label, Row} from "reactstrap";
import {FormattedMessage} from "react-intl";
import FormDateInput from "../../../components/Form/Date/FormDateInput";
import ValidationUtils from "../../../utils/ValidationUtils";
import FormSelectInput from "../../../components/Form/FormSelectInput";
import {translate} from "../../../components/Intl/IntlGlobalProvider";
import {ChangeEvent} from "react";
import FormSwitchInput from "../../../components/Form/FormSwitchInput";
import Button from "reactstrap/lib/Button";
import ServiceUtils from "../../../utils/ServiceUtils";
import BillingService from "../../../service/BillingService";
import {BankingMovement} from "../../../model/person/billing/BillingInformation";
import "./DuplicateBilling.scss"
import FormHiddenInput from "../../../components/Form/FormHiddenInput";
import {formatAmount} from "./DuplicateBillingFormat";
import AddressModel from "../../../model/acts/duplicate-billing/AddressModel";
import Tooltip from "reactstrap/lib/Tooltip";
import BillType from "../../../model/acts/duplicate-billing/BillType";

interface State {
    accountId?: string,
    startDate: Date
    endDate: Date,
    selectedTypeCodes: string[]
    billingAccountId: string
    billingAccountIdToolTip: string
    billingAccountIdSearch: string
    billingDetails: boolean
    billingDuplicates: boolean
    bankingMovements: BankingMovement[]
    bankingMovementsDisplayed: BankingMovement[]
    selectAllBankingMovements: boolean
    selectedBankingMovements: BankingMovement[],
    billingAccountIds: Map<string, string[]>
    totalCost: number
    billingAddress?: AddressModel
    contactAddress?: AddressModel
    selectedAddress?: AddressModel
    selectedBillingAddress: boolean
    selectedContactAddress: boolean,
    tooltipOpenBillingAccountId: boolean
}

interface Props extends ClientContextProps<Service> {
    enableBillingDuplicates: boolean,
    billingsSettings,
    fetchAndStoreBillingsSettings: () => void,
}

class DuplicateBillings extends React.Component<Props, State> {

    public clientService: ClientService = new ClientService();
    private billingService: BillingService = new BillingService();
    private isMobile = ServiceUtils.isMobileService(this.props.client.service)
    private refSiebel = this.props.client.service!.siebelAccount;
    private isOwnerPerson = !!this.props.client.data?.ownerPerson


    constructor(props: Props) {
        super(props);
        const startDate = new Date()
        startDate.setFullYear(startDate.getFullYear() - 1)
        const endDate = new Date()
        this.state = {
            startDate,
            endDate,
            selectedTypeCodes: [],
            billingAccountId: "",
            billingAccountIdToolTip: "",
            billingAccountIdSearch: "",
            billingDetails: false,
            billingDuplicates: true,
            bankingMovements: [],
            bankingMovementsDisplayed: [],
            selectAllBankingMovements: false,
            selectedBankingMovements: [],
            billingAccountIds: new Map<string, string[]>(),
            totalCost: 0,
            selectedBillingAddress: true,
            selectedContactAddress: false,
            tooltipOpenBillingAccountId: false
        }
    }

    public async componentDidMount() {
        if (!this.props.billingsSettings) {
            await this.props.fetchAndStoreBillingsSettings()
        }
        const billingAccountId = this.props.client.service!.billingAccount.id;
        const billingAccountIdSearch = billingAccountId;
        const billingAccountIds: Map<string, string[]> = this.state.billingAccountIds
        this.props.client.data?.services.forEach((service) => {
            if (billingAccountIds.has(service.billingAccount.id)) {
                billingAccountIds.get(service.billingAccount.id)!!.push(service.label);
            } else {
                billingAccountIds.set(service.billingAccount.id, [service.label])
            }
        })
        this.state.startDate.toISOString()
        const bills = await this.billingService.getBillingInfo(billingAccountId,
            this.refSiebel,
            this.isMobile,
            true,
            this.formatDate(this.state.startDate),
            this.formatDate(this.state.endDate));
        const bankingMovements = bills.bankingMovements.filter(bankingMovement => bankingMovement.bill !== null);
        const billingAddress: AddressModel = {
            civility: this.isOwnerPerson ? this.props.client.service?.billingAccount.payer.civility : "",
            firstName: this.isOwnerPerson ? this.props.client.service?.billingAccount.payer.firstName : "",
            lastName: this.isOwnerPerson ? this.props.client.service?.billingAccount.payer.lastName : "",
            companyName: this.isOwnerPerson ? "" : this.props.client.service?.billingAccount.businessName,
            streetWithNumber: this.props.client.service?.billingAccount.payer.address.address1,
            additionalAdress1: this.props.client.service?.billingAccount.payer.address.address2,
            additionalAdress2: undefined,
            postalCode: this.props.client.service?.billingAccount.payer.address.zipcode,
            city: this.props.client.service?.billingAccount.payer.address.city,
            country: this.props.client.service?.billingAccount.payer.address.country
        }
        const contactAddress: AddressModel = {
            civility: this.isOwnerPerson ? this.props.client.data?.ownerPerson.civility : "",
            firstName: this.isOwnerPerson ? this.props.client.data?.ownerPerson.firstName : "",
            lastName: this.isOwnerPerson ? this.props.client.data?.ownerPerson.lastName : "",
            companyName: this.isOwnerPerson ? "" : this.props.client.data?.ownerCorporation.name,
            streetWithNumber: this.isOwnerPerson ? this.props.client.data?.ownerPerson.address.address1 : this.props.client.data?.ownerCorporation.address.address1,
            additionalAdress1: this.isOwnerPerson ? this.props.client.data?.ownerPerson.address.address2 : this.props.client.data?.ownerCorporation.address.address2,
            additionalAdress2: undefined,
            postalCode: this.isOwnerPerson ? this.props.client.data?.ownerPerson.address.zipcode : this.props.client.data?.ownerCorporation.address.zipcode,
            city: this.isOwnerPerson ? this.props.client.data?.ownerPerson.address.city : this.props.client.data?.ownerCorporation.address.city,
            country: this.isOwnerPerson ? this.props.client.data?.ownerPerson.address.country : this.props.client.data?.ownerCorporation.address.country,
        }
        this.setState({
            billingAccountId,
            billingAccountIdToolTip : billingAccountId,
            billingAccountIdSearch,
            bankingMovements,
            bankingMovementsDisplayed: bankingMovements,
            billingAccountIds,
            billingAddress,
            contactAddress,
            selectedAddress: billingAddress ? billingAddress : contactAddress
        });
    }

    public formatDate = (dateToFormat: Date): string => {
        const formattedDate = dateToFormat.toISOString().split("T");
        return (formattedDate.length > 0) ? dateToFormat.toISOString().split("T")[0] : "";
    }

    public toggleTooltipBillingAccountIds = () => this.setState(prevState => ({tooltipOpenBillingAccountId: !prevState.tooltipOpenBillingAccountId}));

    public toggleTooltipBill = (targetName: string) => () => {
        if (!this.state[targetName]) {
            this.setState(prevState => ({
                ...prevState,
                [targetName]: {
                    tooltipOpen: true
                }
            }));
        } else {
            this.setState(prevState => ({
                ...prevState,
                [targetName]: {
                    tooltipOpen: !prevState[targetName].tooltipOpen
                }
            }))
        }
    }

    public isToolTipBillOpen = (targetName: string) => {
        return this.state[targetName] ? this.state[targetName].tooltipOpen : false;
    }


    public getListOfBillingAccountIds = (): JSX.Element[] => {
        const billingAccountIdsOptions: JSX.Element[] = [];
        this.state.billingAccountIds.forEach((value, key) => {
            billingAccountIdsOptions.push(<option key={key}
                                                  value={key}>{this.formatBillingAccountIdLabel(key, value)}</option>);
        })
        return billingAccountIdsOptions;
    };

    public formatBillingAccountIdLabel(billingAccountId: string, labels?: string[]) {
        let formatBillingAccountIdLabel: string = billingAccountId;
        if (labels) {
            labels.forEach((label, index) => {
                if (index === 0) {
                    formatBillingAccountIdLabel = formatBillingAccountIdLabel + " (" + label
                } else {
                    formatBillingAccountIdLabel = formatBillingAccountIdLabel + ", " + label
                }
            })
        }
        return formatBillingAccountIdLabel + ")"
    }

    public getListOfBillingType = (): JSX.Element[] => {
        const billingTypeOptions: JSX.Element[] = [];
        const billTypes: BillType[] = this.props.billingsSettings?.billTypes
        billingTypeOptions.push(<option key="ALL"
                                        value="ALL">Tout type</option>)
        const labels: Set<string> = new Set()
        if (billTypes) {
            billTypes.filter(billType => billType.usedByDuplicata && this.isMobile ? billType.category === "MOBILE" : billType.category === "FIXE")
                .map(billType => labels.add(billType.label))
            labels.forEach(label => billingTypeOptions.push(<option key={label} value={label}>{label}</option>))
        }
        return billingTypeOptions;
    };

    public getBankingMovements = (): JSX.Element[] => {
        const bankingMovements: JSX.Element[] = [];
        bankingMovements.push(
            <tr>
                <th className={"duplicate-billing-checkbox-th"}>
                    <CustomInput type="checkbox" id="selectAll" name="selectAll"
                                 onChange={this.onSelectAllBankingMovements}
                                 disabled={this.state.bankingMovements.length === 0}
                                 checked={this.state.selectAllBankingMovements}/>
                </th>
                <th className={"duplicate-billing-th"}>
                    {translate.formatMessage({id: "act.duplicate.billings.billingReference"})}
                </th>
                <th className={"duplicate-billing-th"}>
                    {translate.formatMessage({id: "act.duplicate.billings.billingDate"})}
                </th>
                <th className={"duplicate-billing-th"}>
                    {translate.formatMessage({id: "act.duplicate.billings.billingType"})}
                </th>
                <th className={"duplicate-billing-th"}>
                    {translate.formatMessage({id: "act.duplicate.billings.amount"})}
                </th>
                <th className={"duplicate-billing-th"}>
                    {translate.formatMessage({id: "act.duplicate.billings.billingAccountNumber"})}
                </th>
                <th className={"duplicate-billing-th"}>
                    {translate.formatMessage({id: "act.duplicate.billings.links"})}
                </th>
            </tr>
        )

        if (this.state.bankingMovementsDisplayed.length === 0) {
            bankingMovements.push(
                <div className={"duplicate-billing-row-no-bills"}>
                    {translate.formatMessage({id: "act.duplicate.billings.noBills"})}
                </div>
            )
        }

        this.state.bankingMovementsDisplayed.map((bankingMovement, index) => {
            const billOverview = bankingMovement.bill.documents?.find(document => document.type === "OVERVIEW")?.url
            const billDetailed = bankingMovement.bill.documents?.find(document => document.type === "FULL")?.url
            bankingMovements.push(
                <tr key={index} className={(index % 2 === 0) ? "duplicate-billing-tr" : "duplicate-billing-tr-odd"}>
                    <td className={"duplicate-billing-checkbox"}>
                        <CustomInput type="checkbox" id={"checkbox_" + index} name="selectAll"
                                     onChange={this.handleSelectBankingMovement(bankingMovement)}
                                     checked={this.isBankingMovementSelected(bankingMovement)}/>

                    </td>
                    <td className={"duplicate-billing-td"}>
                        {bankingMovement.bill.id}
                    </td>
                    <td className={"duplicate-billing-td"}>
                        {bankingMovement.bill.date.split("-").reverse().join("/")}
                    </td>
                    <td className={"duplicate-billing-td"}>
                        {this.getBillTypeLabel(bankingMovement.bill?.type)}
                    </td>
                    <td className={"duplicate-billing-td-amount"}>
                        {formatAmount(bankingMovement.amount.toString())}
                    </td>
                    <td className={"duplicate-billing-td"}>
                        {this.formatBillingAccountId(this.state.billingAccountId)}
                    </td>
                    <td className={"duplicate-billing-td"}>
                        <Row>
                            <Tooltip placement="bottom"
                                     isOpen={this.isToolTipBillOpen("bill" + bankingMovement.bill.id)}
                                     autohide={false}
                                     className="duplicate-billing-Tooltip"
                                     target={"bill" + bankingMovement.bill.id}
                                     toggle={this.toggleTooltipBill("bill" + bankingMovement.bill.id)}>
                                {translate.formatMessage({id: "act.duplicate.billings.tooltip.bill"})}
                            </Tooltip>
                            <Col className={"pr-0"} id={"bill" + bankingMovement.bill.id}>
                                <a href={billOverview} target="_blank">
                                    <i className={"icon-gradient icon-bill font-size-xl"}/></a>
                            </Col>
                            {billDetailed &&
                            <Tooltip placement="bottom"
                                     isOpen={this.isToolTipBillOpen("billDetails" + bankingMovement.bill.id)}
                                     autohide={false}
                                     className="duplicate-billing-Tooltip"
                                     target={"billDetails" + bankingMovement.bill.id}
                                     toggle={this.toggleTooltipBill("billDetails" + bankingMovement.bill.id)}>
                                {translate.formatMessage({id: "act.duplicate.billings.tooltip.billDetails"})}
                            </Tooltip>
                            }
                            <Col id={"billDetails" + bankingMovement.bill.id}>
                                {billDetailed &&
                                <a href={billDetailed} target="_blank">
                                    <i className={"icon icon-bill font-size-xl"}/>
                                </a>
                                }
                            </Col>
                        </Row>
                    </td>
                </tr>
            )
        })
        return bankingMovements;
    }

    public renderCardBodyAddress = (address?: AddressModel): JSX.Element[] => {
        const cardBodyAddress: JSX.Element[] = [];
        if (address) {
            cardBodyAddress.push(
                <CardBody>
                    <Container>
                        <Row>
                            <div className={"col-xs-2"}>
                                {this.isOwnerPerson ? address?.civility + " " + address?.firstName + " " + address?.lastName : address?.companyName}
                            </div>
                        </Row>
                        <Row>
                            <div className={"col-xs-2"}>
                                {address?.streetWithNumber}
                            </div>
                        </Row>
                        <Row>
                            <div className={"col-xs-2"}>
                                {address?.additionalAdress1}
                            </div>
                        </Row>
                        <Row>
                            <div className={"col-xs-2"}>
                                {address?.postalCode + " " + address?.city}
                            </div>
                        </Row>
                        <Row>
                            <div className={"col-xs-2"}>
                                {address?.country}
                            </div>
                        </Row>
                    </Container>
                </CardBody>
            )
        }
        return cardBodyAddress
    }

    public onStartDateChange = (date: string) => {
        if (!date) {
            return;
        }
        const currentDate = new Date
        const startDate = new Date(date)
        const endDate = new Date(date)
        endDate.setFullYear(endDate.getFullYear() + 1)
        this.setState({
            startDate,
            endDate: currentDate < endDate ? currentDate : endDate
        });
    }

    public onEndDateChange = (date: string) => {
        if (!date) {
            return;
        }
        const endDate = new Date(date);
        this.setState({endDate});
    }

    public onBillingTypeChange = (event: ChangeEvent<HTMLInputElement>) => {
        const billingType = event.currentTarget.value;
        const selectedTypeCodes = this.props.billingsSettings?.billTypes.filter(billType => billType.usedByDuplicata && billType.label === billingType)?.map(billType => billType.code)
        this.setState({
            selectedTypeCodes,
            bankingMovementsDisplayed: !selectedTypeCodes || !selectedTypeCodes.length
                ? this.state.bankingMovements
                : this.state.bankingMovements.filter((bankingMovement) => selectedTypeCodes.includes(bankingMovement.bill.type))
        });
    }

    public onBillingAccountIdChange = (event: ChangeEvent<HTMLInputElement>) => {
        const billingAccountIdSearch = event.currentTarget.value;
        this.setState({billingAccountIdSearch,
            billingAccountIdToolTip:billingAccountIdSearch});
    }

    public formatBillingAccountId = (billingAccountId: string) => {
        if (this.isMobile && billingAccountId) {
            let billingAccountIdSplitted = billingAccountId.split("-")
            if (billingAccountIdSplitted[billingAccountIdSplitted.length - 1].length === 2) {
                billingAccountIdSplitted = billingAccountIdSplitted.slice(0, billingAccountIdSplitted.length - 1)
            }
            billingAccountId = billingAccountIdSplitted.join("-")
        }
        return billingAccountId;
    }

    public onBillingDetailsChange = (event: ChangeEvent<HTMLInputElement>) => {
        const billingDetails = event.currentTarget.checked;
        this.setState({billingDetails});
    }

    public onBillingDuplicatesChange = (event: ChangeEvent<HTMLInputElement>) => {
        const billingDuplicates = event.currentTarget.checked;
        const billPrice = this.props.billingsSettings?.duplicateBillingPrice
        const selectedBankingMovements = this.state.selectedBankingMovements;
        this.setState({billingDuplicates});
        if (billingDuplicates) {
            this.setState({
                totalCost: billPrice * selectedBankingMovements.length
            })
        } else {
            this.setState({
                totalCost: 0
            })
        }
    }

    public onBillingAddressClick = () => {
        this.setState({
            selectedAddress: this.state.billingAddress,
            selectedBillingAddress: true,
            selectedContactAddress: false
        })
    }

    public onContactAddressClick = () => {
        this.setState({
            selectedAddress: this.state.contactAddress,
            selectedBillingAddress: false,
            selectedContactAddress: true
        })
    }

    public searchBillings = async () => {
        const bills = await this.billingService.getBillingInfo(this.state.billingAccountIdSearch,
            this.refSiebel,
            this.isMobile,
            true,
            this.formatDate(this.state.startDate),
            this.formatDate(this.state.endDate));
        const bankingMovements = bills.bankingMovements.filter(bankingMovement => bankingMovement.bill !== null);
        const bankingMovementsDisplayed = !this.state.selectedTypeCodes || !this.state.selectedTypeCodes.length
            ? bankingMovements
            : bankingMovements.filter((bankingMovement) => this.state.selectedTypeCodes.includes(bankingMovement.bill.type));

        this.setState({
            bankingMovements,
            bankingMovementsDisplayed,
            selectedBankingMovements: [],
            totalCost: 0
        });
    }
    public onSelectAllBankingMovements = (event) => {
        const billPrice = this.props.billingsSettings?.duplicateBillingPrice
        if (event.currentTarget.checked) {
            this.setState({
                selectAllBankingMovements: true,
                selectedBankingMovements: this.state.bankingMovementsDisplayed,
                totalCost: billPrice * this.state.bankingMovementsDisplayed.length
            });
        } else {
            this.setState({
                selectAllBankingMovements: false,
                selectedBankingMovements: [],
                totalCost: 0
            });
        }
    }

    public handleSelectBankingMovement = (bankingMovement: BankingMovement) => (event) => {
        const selectedBankingMovements = this.state.selectedBankingMovements;
        const billPrice = this.props.billingsSettings?.duplicateBillingPrice
        if (event.currentTarget.checked) {
            this.setState({
                selectedBankingMovements: [...selectedBankingMovements, bankingMovement],
                totalCost: billPrice * [...selectedBankingMovements, bankingMovement].length
            })
        } else {
            this.setState({
                selectedBankingMovements: [...selectedBankingMovements.filter(elem => elem.bill.id !== bankingMovement.bill.id)],
                selectAllBankingMovements: false,
                totalCost: billPrice * [...selectedBankingMovements.filter(elem => elem.bill.id !== bankingMovement.bill.id)].length
            })
        }
    }

    public isBankingMovementSelected = (bankingMovement: BankingMovement) => {
        return this.state.selectedBankingMovements.filter(elem => elem.bill.id === bankingMovement.bill.id).length > 0;
    }

    public getBillTypeLabel = (billTypeCode: string): string => {
        const billTypes = this.props.billingsSettings?.billTypes
        let billTypeLabel = "";
        billTypes.forEach((billType: BillType) => {
            if (billType.code === billTypeCode && billType.usedByDuplicata) {
                billTypeLabel = billType.label
            }
        })
        return billTypeLabel
    }

    public render(): JSX.Element {
        const {
            startDate,
            endDate,
            billingAccountId,
            billingAccountIdToolTip,
            billingAccountIds,
            billingDetails,
            billingDuplicates,
            totalCost,
            billingAddress,
            contactAddress,
            selectedBankingMovements,
            selectedAddress
        } = this.state
        const currentDate = new Date()
        const minDate = new Date();
        minDate.setFullYear(minDate.getFullYear() - 5)
        let maxDate = new Date(startDate)
        maxDate.setFullYear(maxDate.getFullYear() + 1)
        maxDate = currentDate < maxDate ? currentDate : maxDate
        const billPrice = this.props.billingsSettings?.duplicateBillingPrice
        const billingAddressColor = this.state.selectedBillingAddress ? "primary" : ""
        const contactAddressColor = this.state.selectedContactAddress ? "primary" : ""
        return (
            <div>
                <Row className={"duplicate-billing-row"}>
                    <div className={"mt-2 col-xs-2"}>
                        <Label className="text-center font-weight-bold font-size-m">
                            <FormattedMessage id="act.duplicate.billings.startDate"/>
                        </Label>
                    </div>
                    <Col md={3}>
                        <FormGroup>
                            <FormDateInput name="startDate"
                                           id="startDate"
                                           minDate={minDate}
                                           maxDate={currentDate}
                                           value={startDate}
                                           onChange={this.onStartDateChange}
                                           validations={{isRequired: ValidationUtils.notEmpty}}/>
                        </FormGroup>
                    </Col>

                    <div className={"mt-2 col-xs-2"}>
                        <Label className="text-center font-weight-bold font-size-m">
                            <FormattedMessage id="act.duplicate.billings.endDate"/>
                        </Label>
                    </div>
                    <Col md={3}>
                        <FormGroup>
                            <FormDateInput name="endDate"
                                           id="endDate"
                                           minDate={startDate}
                                           maxDate={maxDate}
                                           value={endDate}
                                           onChange={this.onEndDateChange}
                                           validations={{isRequired: ValidationUtils.notEmpty}}/>
                        </FormGroup>
                    </Col>

                    <div className={"mt-2 col-xs-2"}>
                        <Label className="text-center font-weight-bold font-size-m">
                            <FormattedMessage id="act.duplicate.billings.billingType"/>
                        </Label>
                    </div>
                    <Col md={3}>
                        <FormSelectInput name="duplicateBillingsForm.billingType"
                                         id="duplicateBillingsForm.billingType"
                                         validations={{isRequired: ValidationUtils.notEmpty}}
                                         value="ALL"
                                         onChange={this.onBillingTypeChange}>
                            {this.getListOfBillingType()}
                        </FormSelectInput>
                    </Col>

                </Row>

                <Row className={"duplicate-billing-first-row"}>
                    <div className={"mt-2 col-xs-2"}>
                        <Tooltip placement="bottom" isOpen={this.state.tooltipOpenBillingAccountId}
                                 autohide={false}
                                 className="duplicate-billing-Tooltip"
                                 target={"duplicateBillingsBillingAccountId"}
                                 toggle={this.toggleTooltipBillingAccountIds}>
                            {this.formatBillingAccountIdLabel(billingAccountIdToolTip, billingAccountIds.get(billingAccountIdToolTip))}
                        </Tooltip>
                        <Label className="text-center font-weight-bold font-size-m">
                            <FormattedMessage id="act.duplicate.billings.billingAccountNumber"/>
                        </Label>
                    </div>
                    <Col md={6} className={"mr-3"} id={"duplicateBillingsBillingAccountId"}>
                        <FormSelectInput name="duplicateBillingsForm.billingAccountId"
                                         id="duplicateBillingsForm.billingAccountId"
                                         validations={{isRequired: ValidationUtils.notEmpty}}
                                         value={this.formatBillingAccountId(billingAccountId)}
                                         onChange={this.onBillingAccountIdChange}>
                            {
                                this.getListOfBillingAccountIds()
                            }
                        </FormSelectInput>
                    </Col>
                    <Col md={2} className={"ml-5"}>
                        <Button color="primary"
                                className="m-1"
                                id="searchBillings"
                                onClick={this.searchBillings}>
                            {translate.formatMessage({id: "global.dialog.search"})}</Button>
                    </Col>
                </Row>

                {this.getBankingMovements()}

                <Row className={"duplicate-billing-last-row"}>
                    <div className={"mt-2 col-xs-2"}>
                        <Label className="text-center font-weight-bold font-size-m">
                            <FormattedMessage id="act.duplicate.billings.billingDetails"/>
                        </Label>
                    </div>
                    <Col md={2}>
                        <FormGroup>
                            <FormSwitchInput color="primary"
                                             name="duplicateBillingsForm.billingDetails"
                                             id="duplicateBillingsForm.billingDetails"
                                             valueOn={translate.formatMessage({id: "global.dialog.yes"})}
                                             valueOff={translate.formatMessage({id: "global.dialog.no"})}
                                             value={billingDetails}
                                             onChange={this.onBillingDetailsChange}/>
                        </FormGroup>
                    </Col>
                    <div className={"mt-2 col-xs-2"}>
                        <Label className="text-center font-weight-bold font-size-m">
                            <FormattedMessage id="act.duplicate.billings.billingOfDuplicates"/>
                        </Label>
                    </div>
                    <Col md={2}>
                        <FormGroup>
                            <FormSwitchInput color="primary"
                                             name="duplicateBillingsForm.billingDuplicates"
                                             id="duplicateBillingsForm.billingDuplicates"
                                             valueOn={translate.formatMessage({id: "global.dialog.yes"})}
                                             valueOff={translate.formatMessage({id: "global.dialog.no"})}
                                             value={billingDuplicates}
                                             onChange={this.onBillingDuplicatesChange}
                                             disabled={!this.props.enableBillingDuplicates}/>
                        </FormGroup>
                    </Col>
                    {this.state.billingDuplicates &&
                    <Col md={3}>
                        <div>
                            {
                                formatAmount(billPrice ? billPrice.toString() : "") + " x " + this.state.selectedBankingMovements.length + " " +
                                (this.state.selectedBankingMovements.length > 1 ? translate.formatMessage({id: "act.duplicate.billings.bills"}) : translate.formatMessage({id: "act.duplicate.billings.bill"})) +
                                " = " + (totalCost === 0 ? 0 + "€" : formatAmount(totalCost.toString()))
                            }
                        </div>
                        <div>
                            {translate.formatMessage({id: "act.duplicate.billings.onNextBill"})}
                        </div>
                    </Col>
                    }
                </Row>

                <Row className={"duplicate-billing-row"}>
                    <div className={"col-xs-2"}>
                        <Label className="text-center font-weight-bold font-size-m">
                            <FormattedMessage id="act.duplicate.billings.address"/>
                        </Label>
                    </div>
                </Row>
                <Row className={"duplicate-billing-row"}>
                    <div className={"mr-5"}>
                        <div className={"text-center"}>
                            <Label className="text-center font-weight-bold font-size-m">
                                <FormattedMessage id="act.duplicate.billings.billingAddress"/>
                            </Label>
                        </div>
                        <Card tag="a" onClick={this.onBillingAddressClick} style={{cursor: "pointer"}} outline
                              color={billingAddressColor}>
                            {this.renderCardBodyAddress(billingAddress)}
                        </Card>
                    </div>
                    <div className={"mr-5"}>
                        <div className={"text-center"}>
                            <Label className="text-center font-weight-bold font-size-m">
                                <FormattedMessage id="act.duplicate.billings.contactAddress"/>
                            </Label>
                        </div>
                        <Card tag="a" onClick={this.onContactAddressClick} style={{cursor: "pointer"}} outline
                              color={contactAddressColor}>
                            {this.renderCardBodyAddress(contactAddress)}
                        </Card>
                    </div>
                </Row>

                <FormHiddenInput
                    name="duplicateBillingsForm.bankingMovements"
                    id="duplicateBillingsForm.bankingMovements"
                    validations={{isRequired: ValidationUtils.notEmptyList}}
                    value={selectedBankingMovements}/>

                <FormHiddenInput
                    name="duplicateBillingsForm.address"
                    id="duplicateBillingsForm.address"
                    value={selectedAddress}/>

                <FormHiddenInput
                    name="duplicateBillingsForm.client"
                    id="duplicateBillingsForm.client"
                    value={this.props.client}/>

                <FormHiddenInput
                    name="duplicateBillingsForm.category"
                    id="duplicateBillingsForm.category"
                    value={this.isMobile ? "MOBILE" : "FIXE"}/>

                <FormHiddenInput
                    name="duplicateBillingsForm.totalCost"
                    id="duplicateBillingsForm.totalCost"
                    value={totalCost}/>

            </div>

        )
    }
}

const mapStateToProps = (state: AppState) => (
    {
        client: {
            data: state.client.data,
            loading: state.client.loading,
            error: state.client.error,
            service: state.client.service,
            serviceId: state.client.serviceId
        }
        ,
        billingsSettings: state.billings.billingsSettings
    });

const mapDispatchToProps =
    {
        loadClient: fetchAndStoreClient,
        fetchAndStoreBillingsSettings
    }

export default connect(mapStateToProps, mapDispatchToProps)(DuplicateBillings)