import * as React from "react";

import {Col, Container, PopoverBody, Row, UncontrolledPopover} from "reactstrap";
import {FormattedMessage} from "react-intl";
import Label from "reactstrap/lib/Label";
import {DuplicateBillingsActResponseDto} from "../../../../model/acts/duplicate-billing/DuplicateBillingsActResponseDto";
import * as moment from "moment";
import {translate} from "../../../../components/Intl/IntlGlobalProvider";
import {formatAmount} from "../../../Acts/DuplicateBillings/DuplicateBillingFormat";
import "../../../Acts/DuplicateBillings/DuplicateBilling.scss"
import {fetchAndStoreBillingsSettings} from "../../../../store/actions";
import {AppState} from "../../../../store";
import {connect} from "react-redux";

interface Props {
    duplicateBillingsResponse?: DuplicateBillingsActResponseDto
    duplicateBillingsCreationDate?: string
    caseId?: string
    billingsSettings,
    fetchAndStoreBillingsSettings: () => void,
}

interface State {
    duplicateBillingsResponse?: DuplicateBillingsActResponseDto
}

class DuplicateBillingsSummary extends React.Component<Props, State> {

    private DATETIME_FORMAT = process.env.REACT_APP_FASTR_DATETIME_FORMAT;

    constructor(props: Props) {
        super(props);
        this.state = {}

    }

    public componentDidMount = async () => {
        if (this.props.duplicateBillingsResponse) {
            this.setState({duplicateBillingsResponse: this.props.duplicateBillingsResponse})
        }
        if (!this.props.billingsSettings) {
            await this.props.fetchAndStoreBillingsSettings()
        }
    }

    public renderAddress = (): JSX.Element[] => {
        const addressToRender: JSX.Element[] = [];
        const address = this.props.duplicateBillingsResponse?.duplicataFacture.shipTo
        if (address?.civility && address?.firstName && address?.lastName) {
            addressToRender.push(
                <Row>
                    <Col md={6}>
                        {address?.civility + " " + address?.firstName + " " + address?.lastName}
                    </Col>
                </Row>
            )
        } else if (address?.companyName) {
            addressToRender.push(
                <Row>
                    <Col md={6}>
                        {address?.companyName}
                    </Col>
                </Row>
            )
        }
        addressToRender.push(
            <Row>
                <Col md={6}>
                    {address?.streetWithNumber}
                </Col>
            </Row>
        )
        if (address?.additionalAdress1) {
            addressToRender.push(
                <Row>
                    <Col md={6}>
                        {address?.additionalAdress1}
                    </Col>
                </Row>
            )
        }
        if (address?.additionalAdress2) {
            addressToRender.push(
                <Row>
                    <Col md={6}>
                        {address?.additionalAdress2}
                    </Col>
                </Row>
            )
        }
        addressToRender.push(
            <Row>
                <Col md={6}>
                    {address?.postalCode + " " + address?.city}
                </Col>
            </Row>
        )
        if (address?.country) {
            addressToRender.push(
                <Row>
                    <Col md={6}>
                        {address?.country}
                    </Col>
                </Row>
            )
        }
        return addressToRender;
    }


    public renderDuplicatedBills = (): JSX.Element[] => {
        const duplicatedBills: JSX.Element[] = [];
        duplicatedBills.push(
            <tr>
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
                    {translate.formatMessage({id: "act.duplicate.billings.status"})}
                </th>
            </tr>
        )
        this.state.duplicateBillingsResponse?.duplicataFacture.listDuplicata.forEach((duplicata, index) => {
            duplicatedBills.push(
                <tr key={index} className={(index % 2 === 0) ? "duplicate-billing-tr" : "duplicate-billing-tr-odd"}>
                    <td className={"duplicate-billing-td"}>
                        {duplicata.billId}
                    </td>
                    <td className={"duplicate-billing-td"}>
                        {duplicata.billDate.split("-").reverse().join("/")}
                    </td>
                    <td className={"duplicate-billing-td"}>
                        {this.getBillTypeLabel(duplicata.billType)}
                    </td>
                    <td className={"duplicate-billing-td-amount"}>
                        {formatAmount(duplicata.amount.toString())}
                    </td>
                    <td className={"duplicate-billing-td"}>
                        {duplicata.cf}
                    </td>
                    <td id={'td-duplicate' + index.toString()} className={"duplicate-billing-td"}>
                        {duplicata.status?.substring(0, 2)}
                    </td>
                    <UncontrolledPopover
                        placement='auto'
                        trigger='hover'
                        target={'td-duplicate' + index.toString()}>
                        <PopoverBody>
                            {duplicata.status?.substring(5)}
                        </PopoverBody>
                    </UncontrolledPopover>
                </tr>
            )
        })
        return duplicatedBills;
    }

    public renderRequestedOptions = (): JSX.Element[] => {
        const optionDuplicata = this.props.duplicateBillingsResponse?.duplicataFacture.optionDuplicata
        const requestedOptions: JSX.Element[] = [];
        requestedOptions.push(
            <Row>
                <Col md={6}>
                    {translate.formatMessage({id: "act.duplicate.billings.billingDetails"}) + " : " + (optionDuplicata?.detailled ? "Oui" : "Non")}
                </Col>
            </Row>
        )
        if (optionDuplicata?.charged) {
            requestedOptions.push(
                <Row>
                    <Col md={6}>
                        {translate.formatMessage({id: "act.duplicate.billings.billingOfDuplicates"}) + " : " + this.state.duplicateBillingsResponse?.duplicataFacture.totalCost + "€"}
                    </Col>
                </Row>
            )
        } else {
            requestedOptions.push(
                <Row>
                    <Col md={6}>
                        {translate.formatMessage({id: "act.duplicate.billings.billingOfDuplicates"}) + " : Non"}
                    </Col>
                </Row>
            )
        }
        return requestedOptions;
    }

    public getBillTypeLabel = (billTypeCode: string): string => {
        const billTypes = this.props.billingsSettings?.billTypes
        if(billTypes){
            return billTypes.find(element => billTypeCode === element.code && element.usedByDuplicata).label;
        }
        return "";
    }

    public render(): JSX.Element {
        if (!this.state.duplicateBillingsResponse) {
            return <React.Fragment/>
        }
        const duplicataFacture = this.state.duplicateBillingsResponse.duplicataFacture;
        return (
            <React.Fragment>
                <Container>
                    <Row>
                        <Col md={3} className={"mt-3"}>
                            <Label className="text-center font-weight-bold font-size-m">
                                <FormattedMessage id="acts.history.act.id"/>
                            </Label>
                            <div>
                                {this.state.duplicateBillingsResponse.actFunctionalId}
                            </div>
                        </Col>
                        <Col md={3} className={"mt-3"}>
                            <Label className="text-center font-weight-bold font-size-m">
                                <FormattedMessage id="case.number"/>
                            </Label>
                            <div>
                                {this.props.caseId}
                            </div>
                        </Col>
                        <Col md={6} className={"mt-3"}>
                            <Label className="text-center font-weight-bold font-size-m">
                                <FormattedMessage id="act.duplicate.billings.address"/>
                            </Label>
                            <div>
                                {this.renderAddress()}
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={3} className={"mt-3"}>
                            <Label className="text-center font-weight-bold font-size-m">
                                <FormattedMessage id="act.duplicate.billings.executionStatus"/>
                            </Label>
                            <div>
                                {duplicataFacture.globalStatus}
                            </div>
                        </Col>
                        <Col md={3} className={"mt-3"}>
                            <Label className="text-center font-weight-bold font-size-m">
                                <FormattedMessage id="act.duplicate.billings.creationDate"/>
                            </Label>
                            <div>
                                {moment(duplicataFacture.creationDate).format(this.DATETIME_FORMAT)}
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12} className={"mt-3"}>
                            <Label className="text-center font-weight-bold font-size-m">
                                <FormattedMessage id="act.duplicate.billings.duplicatedBills"/>
                            </Label>
                            <div>
                                {this.renderDuplicatedBills()}
                            </div>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={10} className={"mt-3"}>
                            <Label className="text-center font-weight-bold font-size-m">
                                <FormattedMessage id="act.duplicate.billings.requestedOptions"/>
                            </Label>
                            <div>
                                {this.renderRequestedOptions()}
                            </div>
                        </Col>
                    </Row>
                </Container>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state: AppState) => (
    {
        billingsSettings: state.billings.billingsSettings
    });

const mapDispatchToProps =
    {
        fetchAndStoreBillingsSettings
    }

export default connect(mapStateToProps, mapDispatchToProps)(DuplicateBillingsSummary)
