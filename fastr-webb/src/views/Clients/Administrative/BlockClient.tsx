import React from "react";
import {Card, CardBody, CardHeader, CardText, Col, Row} from "reactstrap";
import {FormattedMessage} from "react-intl";
import BlockReference from "./BlockReference";
import BlockSubscription from "./BlockSubscription";
import BlockHolder from "./BlockHolder";
import BlocTutorship from "./BlocTutorship";
import {format} from "date-fns";
import {ClientContextSliceState} from "../../../store/ClientContextSlice";
import {useTypedSelector} from "../../../components/Store/useTypedSelector";
import {translate} from "../../../components/Intl/IntlGlobalProvider";
import DisplayTitle from "../../../components/DisplayTitle";
import ExternalLinksBlock from "../ExternalLinksBlock";
import {BlocksExternalAppsConfig} from "../ExternalAppsConfig"

interface Props {
    clientContext?: ClientContextSliceState
}

const BlockClient = (props: Props) => {

    const {clientContext} = props;
    const client: ClientContextSliceState = clientContext ? clientContext : useTypedSelector(state => state.store.clientContext);
    const {clientData, service} = client;

    const shouldShowBlocTutorship = clientData?.legalResponsible && !clientData?.corporation;
    const externalAppsSettings = BlocksExternalAppsConfig.administrative.blockClient;

    const shouldDisplayUser = () => {
        const userIsSameAsOwner = service?.user?.lastName === clientData?.ownerPerson?.lastName && service?.user?.lastName === clientData?.ownerPerson?.lastName;
        return (service?.user && service?.category !== 'FIXE' && !userIsSameAsOwner);
    };

    const displayUserInfo = () => {
        let userInfo = [service?.user.civility, service?.user.firstName, service?.user.lastName].join(' ');
        userInfo += service?.user.birthDate ? `, ${translate.formatMessage({id: "contract.birthdate"})} ${format(new Date(service?.user.birthDate), 'dd/MM/yyyy')}` : '';
        return userInfo;
    };

    return (
        <div className="contract-block card-block">
            <Row>
                <Col>
                    <Card>
                        <CardHeader className="d-flex justify-content-between">
                            <DisplayTitle icon="icon-gradient icon-user" fieldName="contract.owner"
                                          isLoading={clientData}/>
                            {shouldDisplayUser() &&
                            <div className="mx-3">
                                <FormattedMessage
                                    id="contract.user.label"/> : {displayUserInfo()}
                            </div>
                            }
                            {!!externalAppsSettings?.length &&
                                <ExternalLinksBlock settings={externalAppsSettings} isLoading={clientData}/>
                            }
                        </CardHeader>
                        <CardBody>
                            <CardText tag={"div"}>
                                <Row className="m-2">
                                    <React.Fragment>
                                        <Col>
                                            <BlockHolder clientContext={clientContext}/>
                                            {shouldShowBlocTutorship &&
                                            <React.Fragment>
                                                <BlockReference clientContext={clientContext}/>
                                                <BlockSubscription clientContext={clientContext}/>
                                            </React.Fragment>
                                            }
                                        </Col>
                                    </React.Fragment>
                                </Row>
                            </CardText>
                        </CardBody>
                    </Card>
                </Col>

                {shouldShowBlocTutorship &&
                <Col>
                    <Card>
                        <CardHeader className="d-flex justify-content-between">
                            <DisplayTitle icon="icon-gradient icon-user" fieldName="contract.tutor"
                                          isLoading={clientData}/>
                        </CardHeader>
                        <CardBody>
                            <CardText tag={"div"}>
                                <Row className="m-2">
                                    <Col>
                                        <BlocTutorship clientContext={clientContext}/>
                                    </Col>
                                </Row>
                            </CardText>
                        </CardBody>
                    </Card>
                </Col>
                }
            </Row>
        </div>
    )

};
export default BlockClient
