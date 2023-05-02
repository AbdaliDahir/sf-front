import React from "react";
import { Card, CardBody, CardHeader, CardText, Col, Row } from "reactstrap";
import { useTypedSelector } from "../../../components/Store/useTypedSelector";
import DisplayField from "../../../components/DisplayField";
import DisplayTitle from "../../../components/DisplayTitle";
import ServiceUtils from "../../../utils/ServiceUtils";
import { LandedLineService } from "../../../model/service/LandedLineService";
import ExternalLinksBlock from "../ExternalLinksBlock";
import {BlocksExternalAppsConfig} from "../ExternalAppsConfig"
import { format } from "date-fns";
import { FormattedMessage } from "react-intl";
import { translate } from "src/components/Intl/IntlGlobalProvider";

import {ClientContextSliceState} from "../../../store/ClientContextSlice";

interface Props {
    clientContext?: ClientContextSliceState
}

const BlockContract = (props: Props) => {

    const {clientContext} = props;
    const client = clientContext ? clientContext : useTypedSelector(state => state.store.clientContext);
    const service = client?.service;
    const externalAppsSettings = BlocksExternalAppsConfig.administrative.blockContract;

    const displayProLevel = () => {
        const proLevel = client?.clientData?.ownerPerson?.qualificationLevelPro;
        if (proLevel && proLevel === "CERTIFIED_PRO") {
            return <div className="ml-auto">
                <i className="icon-gradient icon-pro" />
            </div>
        } else return <React.Fragment />
    }
    const displayDate = () => {
        let date = client?.service?.creationDate;
        if (date) {
            return <div className="d-flex flex-align-middle mr-4 text-prewrap">
                <FormattedMessage id="contract.subscriptiondate"/>{format(new Date(date), 'dd/MM/yyyy')}
            </div>
        } else return <React.Fragment />
    }

    const displayAccountRef = () => {
        const landedService = service as LandedLineService;
        return (
            <DisplayField fieldName={"contract.contract.ref.compte"}
                isLoading={service}
                fieldValue={landedService?.siebelAccount}
                bold />
        )
    }

    const shouldDisplayUser = () => {
        const ownerPerson = client?.clientData?.ownerPerson;
        const user = service?.user;
        const userIsSameAsOwner = user?.lastName === ownerPerson?.lastName;
        return (user && service?.category !== 'FIXE' && !userIsSameAsOwner);
    };

    const displayUserInfo = () => {
        const user = service?.user;
        let userInfo = [user?.civility, user?.firstName, user?.lastName].join(' ');
        userInfo += user?.birthDate ? `, ${translate.formatMessage({id: "contract.birthdate"})} ${format(new Date(user?.birthDate), 'dd/MM/yyyy')}` : '';
        return userInfo;
    };

    return (
        <Card>
            <CardHeader className="d-flex justify-content-between">
                <DisplayTitle icon="icon-gradient icon-contract" fieldName="contract.contract" isLoading={service} />
                <div className="d-flex justify-content-between">
                    {displayDate()}
                    {displayProLevel()}
                </div>
                {externalAppsSettings && externalAppsSettings.length ?
                    <ExternalLinksBlock settings={externalAppsSettings} isLoading={service} clientContext={clientContext} /> : ''
                }
            </CardHeader>
            <CardBody>
                <CardText tag={"div"}>
                    <Row>
                        <Col sm={4}>
                            <DisplayField fieldName={ServiceUtils.isMobileService(service) ? "contract.contract.ref.compte" : "contract.contract.compte.service"}
                                isLoading={service}
                                fieldValue={service?.id}
                                bold />
                        </Col>
                        <Col sm={4}>
                            {ServiceUtils.isLandedService(service) ? displayAccountRef() : <React.Fragment />}
                        </Col>
                        <Col sm={4}>
                            {shouldDisplayUser() ?
                                <DisplayField fieldName={"contract.user.title"}
                                isLoading={service}
                                fieldValue={displayUserInfo()}
                                bold />
                                : null
                            }
                        </Col>
                    </Row>
                </CardText>
            </CardBody>
        </Card>
    );
};


export default BlockContract;