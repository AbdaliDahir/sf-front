import * as React from "react"
import {Card, CardBody, CardHeader, CardText, Col, Row} from "reactstrap";
import DisplayTitle from "../../../components/DisplayTitle";
import {useTypedSelector} from "../../../components/Store/useTypedSelector";
import {FormattedMessage} from "react-intl";
import DisplayField from "../../../components/DisplayField";
import {translate} from "../../../components/Intl/IntlGlobalProvider";
import {Service} from "../../../model/service";
import ExternalLinksBlock from "../ExternalLinksBlock";
import {BlocksExternalAppsConfig} from "../ExternalAppsConfig"

interface Props {
    service?: Service
}

const BlockPayment = (props: Props) => {
    const service = props?.service ? props.service : useTypedSelector(state => state.store.clientContext.service);
    const externalAppsSettings = BlocksExternalAppsConfig.billingAndPayment.blockPayment;
    return (
        <div className="card-block">
            <Card>
                <CardHeader className="d-flex justify-content-between align-items-center">
                    <DisplayTitle icon="icon-gradient icon-euro" fieldName="billsAndPayment.payment.title"
                                  isLoading={service}/>
                    {!!service?.billingAccount?.billingDay &&
                    <span className={"font-weight-bold"}>
                                    <FormattedMessage
                                        id={"payment.billingDay"}/> : {service?.billingAccount?.billingDay}
                                </span>}
                    {!!externalAppsSettings?.length &&
                        <ExternalLinksBlock settings={externalAppsSettings} isLoading={service}/>
                    }
                </CardHeader>
                <CardBody>
                    <CardText tag={"div"}>
                        <Row className={"m-2"}>
                            <Col>
                                <DisplayField fieldName="payment.mean"
                                              fieldValue={getPaymentMethod(service)}
                                              isLoading={service}/>
                            </Col>
                            {
                                service?.billingAccount?.billingMethod === "SEPA" &&
                                <Col>
                                    <DisplayField
                                        isLoading={service}
                                        fieldName={"payment.account.owner"}
                                        fieldValue={service?.billingAccount?.sepaMethod.owner}
                                    />
                                </Col>
                            }
                        </Row>
                    </CardText>
                </CardBody>
            </Card>
        </div>)
};

const getPaymentMethod = (service: Service | undefined) => {
    if (!service) {
        return ""
    }
    return translate.formatMessage({id: `payment.${service.billingAccount?.billingMethod}`})
}

export default BlockPayment;