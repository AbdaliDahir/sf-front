import React, {useState} from "react";
import {Card, CardBody, CardHeader, CardText, Col, FormGroup, Row} from "reactstrap";
import {FormattedMessage} from "react-intl";
import {format} from "date-fns";
import DisplayField from "../../../components/DisplayField";
import {useTypedSelector} from "../../../components/Store/useTypedSelector";
import ServiceUtils from "../../../utils/ServiceUtils";
import AddressUtils from "../../../utils/AddressUtils";
import {translate} from "../../../components/Intl/IntlGlobalProvider";
import DisplayTitle from "../../../components/DisplayTitle";
import ExternalLinksBlock from "../ExternalLinksBlock";
import {BlocksExternalAppsConfig} from "../ExternalAppsConfig"
import Loading from "../../../components/Loading";
import {ClientContextSliceState} from "../../../store/ClientContextSlice";

interface Props {
    clientContext?: ClientContextSliceState
}

const BlockPayment = (props: Props) => {

    const {clientContext} = props;
    const service = clientContext ? clientContext.service : useTypedSelector(state => state.store.clientContext.service);

    const externalAppsSettings = BlocksExternalAppsConfig.administrative.blockPayment;

    const mandatInfo = (hidden: boolean) => {
        const sepaMethod = service!.billingAccount.sepaMethod;
        if (sepaMethod.idRUM) {
            let mandat = hidden ? ServiceUtils.hideString(sepaMethod.idRUM) : sepaMethod.idRUM;
            mandat += sepaMethod.mandateSignatureDate ? ` Signé le ${format(new Date(sepaMethod.mandateSignatureDate), 'dd/MM/yyyy')}` : '';
            return mandat;
        }
        return;
    };

    const [isIbanShown, showIban] = useState(false)
    const toggleIbanVisibility = () => {
        showIban((state) => {
            return !state;
        })
    }
    const [isBicShown, showBic] = useState(false)
    const toggleBicVisibility = () => {
        showBic((state) => {
            return !state;
        })
    }
    const [isMandatShown, showMandat] = useState(false)
    const toggleMandatVisibility = () => {
        showMandat((state) => {
            return !state;
        })
    }

    const renderSEPABillingMethod = (): JSX.Element => {
        const {sepaMethod} = service!.billingAccount;
        return (
            sepaMethod &&
            <React.Fragment>
                <DisplayField
                    isLoading={service}
                    fieldName={"payment.account.owner"}
                    fieldValue={sepaMethod.owner}
                />

                <DisplayField
                    isLoading={service}
                    fieldName={"payment.bank"}
                    fieldValue={sepaMethod.bankName}
                />

                <FormGroup className="py-1 px-2 display-field mb-1">
                    <React.Fragment>
                        <h6><FormattedMessage id="payment.iban"/></h6>
                        {isIbanShown ? ServiceUtils.hideIban(sepaMethod.iban) : ServiceUtils.hideWholeIban(sepaMethod.iban)}
                        <span className="icon-gradient icon-eye ml-3 cursor-pointer"
                              onMouseDown={toggleIbanVisibility}/>
                    </React.Fragment>
                </FormGroup>

                <FormGroup className="py-1 px-2 display-field mb-1">
                    <React.Fragment>
                        <h6><FormattedMessage id="payment.bic"/></h6>
                        {isBicShown ? sepaMethod.bic : ServiceUtils.hideString(sepaMethod.bic)}
                        <span className="icon-gradient icon-eye ml-3 cursor-pointer" onMouseDown={toggleBicVisibility}/>
                    </React.Fragment>
                </FormGroup>

                <FormGroup className="py-1 px-2 display-field mb-1">
                    <React.Fragment>
                        <h6><FormattedMessage id="payment.mandat"/></h6>
                        {isMandatShown ? mandatInfo(false) : mandatInfo(true)}
                        <span className="icon-gradient icon-eye ml-3 cursor-pointer"
                              onMouseDown={toggleMandatVisibility}/>
                    </React.Fragment>
                </FormGroup>

            </React.Fragment>
        )
    };

    const renderCreditCardBillingMethod = (): JSX.Element => {
        const {creditCardMethod} = service!.billingAccount;
        return (
            creditCardMethod &&
            <React.Fragment>
                <DisplayField isLoading={service}
                              fieldName="payment.creditCard.number"
                              fieldValue={ServiceUtils.hideCardNumber(creditCardMethod.cardNumber)}
                />
                <DisplayField fieldName="payment.creditCard.type"
                              isLoading={service}
                              fieldValue={translate.formatMessage({id: `payment.${creditCardMethod.type}`})}
                              optional
                />
                <DisplayField isLoading={service}
                              fieldName="payment.creditCard.owner"
                              fieldValue={creditCardMethod.owner}
                />
                <DisplayField
                    isLoading={service}
                    fieldName={"payment.creditCard.validityDate"}
                    fieldValue={format(new Date(creditCardMethod.expiration), 'MM/yy')}
                />
            </React.Fragment>
        )
    };
    const renderOtherBillingMethod = (): JSX.Element => {
        const {otherMethod} = service!.billingAccount;
        return (
            otherMethod &&
            <React.Fragment>
                <DisplayField
                    isLoading={service}
                    fieldName={"payment.account.owner"}
                    fieldValue={otherMethod.owner}
                />

                <DisplayField
                    isLoading={service}
                    fieldName={"payment.bank"}
                    fieldValue={otherMethod.bankName}
                />

                <FormGroup className="py-1 px-2 display-field mb-1">
                    <React.Fragment>
                        <h6><FormattedMessage id="payment.iban"/></h6>
                        {isIbanShown ? ServiceUtils.hideIban(otherMethod.iban) : ServiceUtils.hideWholeIban(otherMethod.iban)}
                        <span className="icon-gradient icon-eye ml-3 cursor-pointer"
                              onMouseDown={toggleIbanVisibility}/>
                    </React.Fragment>
                </FormGroup>

                <FormGroup className="py-1 px-2 display-field mb-1">
                    <React.Fragment>
                        <h6><FormattedMessage id="payment.bic"/></h6>
                        {isBicShown ? otherMethod.bic : ServiceUtils.hideString(otherMethod.bic)}
                        <span className="icon-gradient icon-eye ml-3 cursor-pointer" onMouseDown={toggleBicVisibility}/>
                    </React.Fragment>
                </FormGroup>



            </React.Fragment>
        )
    };

    const renderBillingMethod = (): JSX.Element => {
        switch (service?.billingAccount?.billingMethod) {
            case "SEPA" :
                return renderSEPABillingMethod();

            case "CREDIT_CARD" :
                return renderCreditCardBillingMethod();
            case "OTHER" :
                return renderOtherBillingMethod();

            default:
                return <></>
        }
    };

    if (service?.billingAccount) {
        const {billingAccount} = service;
        const {payer} = billingAccount;
        // const payerCorporationName = payer.name;
        const payerPersonName = payer.lastName ? [payer.civility, payer.firstName, payer.lastName].join(" ") : "";
        return (
            <div>
                <Card>
                    <CardHeader className="d-flex justify-content-between">
                        <div>
                            <DisplayTitle icon="icon-gradient icon-euro" fieldName="payment.payment"
                                          isLoading={service}/>
                        </div>
                        <div>
                            {!!billingAccount.billingDay &&
                            <span className={"float-right font-weight-bold"}>
                                    <FormattedMessage id={"payment.billingDay"}/> : {billingAccount.billingDay}
                                </span>}
                        </div>
                        {!!externalAppsSettings?.length &&
                            <ExternalLinksBlock settings={externalAppsSettings} isLoading={service} clientContext={clientContext}/>
                        }
                    </CardHeader>
                    <CardBody>
                        <CardText tag={"div"}>
                            <Row>
                                <Col md={6}>
                                    <DisplayField fieldName="payment.mean"
                                                  fieldValue={translate.formatMessage({id: `payment.${billingAccount.billingMethod}`})}
                                                  isLoading={service}/>
                                    {renderBillingMethod()}
                                </Col>
                                <Col md={6}>
                                    {/*{!!payerCorporationName &&*/}
                                    {/*<DisplayField fieldName={"payment.corporation.name"}*/}
                                    {/*              fieldValue={payerCorporationName}*/}
                                    {/*              icon={"icon icon-home "}/>*/}
                                    {/*}*/}
                                    {!!payerPersonName &&
                                    <DisplayField
                                        isLoading={service}
                                        fieldName={"payment.billing.target"}
                                        fieldValue={payerPersonName}
                                    />
                                    }
                                    <DisplayField
                                        isLoading={service}
                                        fieldName={"payment.address"}
                                        fieldValue={AddressUtils.displaySimpleAddress(payer.address)}
                                    />

                                </Col>
                            </Row>
                        </CardText>
                    </CardBody>
                </Card>
            </div>
        )
    } else {
        return (
            <Card>
                <CardHeader className="d-flex justify-content-between">
                    <div>
                        <DisplayTitle icon="icon-gradient icon-euro" fieldName="payment.payment"
                                      isLoading={true}/>
                    </div>
                </CardHeader>
                <CardBody>
                    <Loading/>
                </CardBody>
            </Card>
        );
    }
}
export default BlockPayment
;
