import format from "date-fns/format";
import React, {RefObject, useRef} from "react"
import {FormattedMessage} from "react-intl";
import {Col, Row} from "reactstrap"
import {ClientContextSliceState} from "../../../store/ClientContextSlice";
import LoadableText from "../../../components/LoadableText";
import {PhoneLineService} from "../../../model/service/PhoneLineService";
import Badge from "reactstrap/lib/Badge";
import DateUtils from "../../../utils/DateUtils";
import {Client, TUTORSHIP} from "../../../model/person";
import {translate} from "../../../components/Intl/IntlGlobalProvider";
import AlertBlock from "../AlertBloc";
import {Service} from "../../../model/service";
import UXUtils from "../../../utils/UXUtils";

interface Props {
    clientContext: ClientContextSliceState,
    onHeightChange: (height: number) => void
}

const BlockLine = (props: Props) => {

    const blockLineRef: RefObject<HTMLDivElement> = useRef(null);
    const {clientContext} = props;
    const client: Client | undefined = clientContext.clientData;
    const service: Service | undefined = clientContext.service;

    const getClientTitle = (): JSX.Element => {
        if (client?.corporation) {
            return <LoadableText isLoading={client} fieldValue={client?.ownerCorporation?.name}/>
        } else {
            return <LoadableText isLoading={client}
                                 fieldValue={`${client?.ownerPerson?.civility} ${client?.ownerPerson?.firstName} ${client?.ownerPerson?.lastName}`}/>
        }
    };

    const displayDFPC = () => {
        if (service?.engagementCurrentStatus?.engagementDate) {
            const today = new Date();
            const engagementDate = new Date(service?.engagementCurrentStatus.engagementDate!)
            const diff = DateUtils.monthsBetween(today, engagementDate)
            if (today >= engagementDate) {
                return "status status-danger";
            } else if (diff < 3) {
                return "status status-warning";
            } else {
                return "status status-success";
            }
        } else {
            return "status status-danger";
        }
    };

    const displayStatus = () => {
        switch (service?.status) {
            case "ACTIVE":
                return "status status-success";
            case "CANCELED":
            case "CREATED":
            case "SUSPENDED":
                return "status status-warning";
            case "REJECTED":
            case "TERMINATED":
                return "status status-danger";
            default:
                return "status status-success";
        }
    };

    if (blockLineRef?.current?.clientHeight) {
        props.onHeightChange(blockLineRef.current.clientHeight)
    }

    const getIconByServiceType = () => {
        switch (service?.category) {
            case "MOBILE":
                return "icon-gradient icon-sim-card font-size-xl";
            case "FIXE":
                const phoneLineService = service as PhoneLineService
                switch (phoneLineService?.technology) {
                    case "ADSL":
                        return "icon-gradient icon-fiber-modem font-size-xxl box";
                    case "FTTB":
                        return "icon-gradient icon-fiber-modem font-size-xxl box";
                    case "FTTH":
                        return "icon-gradient icon-fiber-modem font-size-xxl box";
                    default:
                        return "icon-gradient icon-legacy-phone";
                }
            default:
                return "icon-gradient icon-close";
        }
    };

    const getTutorshipTypeBadge = () => {
        if (!client?.ownerPerson?.tutorshipType) {
            return
        }
        let label = translate.formatMessage({id: "tutorship." + client.ownerPerson.tutorshipType})
        if (client.ownerPerson.tutorshipEndDate && TUTORSHIP[client.ownerPerson.tutorshipType] !== TUTORSHIP.NON_PROTEGE.toString()) {
            label += " jusqu'au " + format(new Date(client.ownerPerson.tutorshipEndDate), 'dd/MM/yyyy')
        }
        return <Badge color="dark" className="mx-2">{label}</Badge>;
    };

    return (
        <div ref={blockLineRef} className="line-block bg-light font-size-sm sticky-top">
            <Row className="h-100 w-100 no-gutters">
                <Col sm={4} className="d-flex">
                    <i className={`${getIconByServiceType()} mx-4`}/>
                    <div className="client-service-info py-2">
                        <div>
                            <h4 className="d-inline mb-0 px-1 font-size-l hover-bg-secondary rounded cursor-pointer"
                                onClick={UXUtils.copyValueToClipboard}
                                title={"Copier"}>
                                <LoadableText fieldValue={service?.label.replace(/(.{2})/g, "$1 ").trim()}
                                              isLoading={service}
                                />
                            </h4>
                        </div>

                        <div className={"px-1"}>
                            {getClientTitle()}
                            {getTutorshipTypeBadge()}
                        </div>

                        {!!service?.activationDate &&
                        <div className={"px-1"}>
                            <FormattedMessage id="line.date.service"/>
                            <LoadableText fieldValue={format(new Date(service?.activationDate!), 'dd/MM/yyyy')}
                                          isLoading={service}/>
                        </div>
                        }

                        <div className={"px-1"}>
                            {service &&
                            <LoadableText isLoading={service}>
                                <div className={`status ${displayDFPC()}`}>
                                    <div className="status-message">
                                        <span className="font-weight-bold mr-2 text-left"><FormattedMessage
                                            id="line.dfpc"/></span>
                                        <span className="mx-1 fa fa-circle" aria-hidden="true"/>
                                        <LoadableText fieldValue={service?.engagementCurrentStatus?.currentEngagementStatusLabel || "Sans engagement"}
                                                      isLoading={service}/>
                                    </div>
                                </div>
                            </LoadableText>
                            }
                        </div>

                        <div className={"px-1"}>
                            <LoadableText isLoading={service}>
                                <div className={`status ${displayStatus()}`}>
                                    <div className="status-message">
                                        <span className="font-weight-bold"><FormattedMessage id="line.status"/></span>
                                        <span className="mx-1 fa fa-circle" aria-hidden="true"/>
                                        <FormattedMessage id={service?.status + ""}/>
                                    </div>
                                </div>
                            </LoadableText>
                        </div>
                    </div>
                </Col>

                <Col className="d-flex p-4 align-self-center">
                    <AlertBlock pwd={"ALL"} clientContext={clientContext}/>
                </Col>

                <Col sm={1}/>
            </Row>
        </div>
    )
}

export default BlockLine
