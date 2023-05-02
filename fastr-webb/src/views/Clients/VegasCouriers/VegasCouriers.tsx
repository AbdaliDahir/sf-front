import React, { useEffect, useState } from "react";
import queryString, { ParsedUrlQuery } from "querystring";
import { useParams } from "react-router";
import { Card, CardHeader, CardBody, Col, Row, UncontrolledTooltip, Tooltip } from "reactstrap";
import { ExternalEvent, ExternalEventObjectType } from "src/model/externalEvent/ExternalEvent";
import moment from "moment";
import { AiFillQuestionCircle } from 'react-icons/ai';
import { FiLink2, FiArrowDown } from 'react-icons/fi';
import Icon from 'src/components/Bootstrap/Icon';
import './VegasCouriers.scss';
import ExternalEventService from "src/service/ExtrenalEventService";
import Loading from "src/components/Loading";
import { fetchClient, DataLoad, ClientContextSliceState } from "src/store/ClientContextSlice";
import { useDispatch } from "react-redux";
import { useTypedSelector } from "src/components/Store/useTypedSelector";
import { BlocksExternalAppsConfig } from "../ExternalAppsConfig";
import { fetchAndStoreExternalApps } from "src/store/actions";
import ExternalLinksBlock from "../ExternalLinksBlock";
import { AppState } from "src/store";
import FastService, { FastMessage } from "src/service/FastService";
import { ApplicationMode } from "src/model/ApplicationMode";
import { selectCaseV2 } from "src/store/actions/v2/case/RecentCasesActions";
import { FormattedMessage } from "react-intl";

const VegasCouriers = (props: any) => {
	const client: ClientContextSliceState = useTypedSelector(state => state.store.clientContext);
	const currentClient: ClientContextSliceState | undefined = useTypedSelector(state => state.store.client.currentClient);
	const sessionIsFrom = useTypedSelector((state: AppState) => state.store.applicationInitialState.sessionIsFrom)
	const dispatch = useDispatch();

	let serviceId;
	let isMobile;
	let clientId;
	let lineId;
	
	serviceId = {serviceId} = useParams() as { serviceId: string };
	const query: ParsedUrlQuery = queryString.parse(window.location.search.replace("?", ""));
	isMobile = query.isMobile == 'true';
	clientId = query.clientId as string;
	lineId = query.lineId as string;
	
	const externalAppsSettings = BlocksExternalAppsConfig.history.vegasCouriers;

	const externalEventService: ExternalEventService = new ExternalEventService(true);
	const [externalEvents, setExternalEvents] = useState<ExternalEvent[]>([]);

	useEffect(() => {
		if(currentClient?.clientData?.id) { 
			serviceId = currentClient?.service?.siebelAccount;
			clientId = currentClient?.clientData?.id;
			lineId = currentClient?.serviceId;
		}
		dispatch(fetchClient(clientId, lineId, DataLoad.ONE_SERVICE, true, true));
		dispatch(fetchAndStoreExternalApps());
		const externalEventPromise: Promise<ExternalEvent[]> = isMobile ? externalEventService.getMobileExternalEvents(serviceId, "vegas") : externalEventService.getFixeExternalEvents(serviceId, "vegas");
		externalEventPromise.then((externalEvents: ExternalEvent[]) => setExternalEvents(externalEvents));
		
		console.log("🚀 ~ file: VegasCouriers.tsx:66 ~ useEffect ~ externalEvents:", externalEvents)
	}, [currentClient?.clientData?.id])


	const onCaseClick = (attachedCase) => {
		if (sessionIsFrom === ApplicationMode.GOFASTR) {
			dispatch(selectCaseV2(attachedCase.caseId, attachedCase.clientId, attachedCase.serviceId));
		} else {
			const jsonMessage: FastMessage = {
				event: "clickOnAssignedCase",
				error: false,
				idCase: attachedCase.caseId,
				serviceId: attachedCase.serviceId
			};
			FastService.postRedirectMessage(jsonMessage)
		}
	}

	return (
		externalEvents.length ?
			<React.Fragment>
				<Card>
					<CardBody>
						<h6>
							Courriers/emails recus depuis le {moment(externalEvents[externalEvents.length - 1]?.eventDetail.scanDate).format("DD/MM/YYYY")}
							<AiFillQuestionCircle id="questionCircle" style={{ color: "red", fontSize: "16" }} className="ml-1" />

							<UncontrolledTooltip placement="bottom" target="questionCircle">
								Pour les courriers plus anciens consulter la zone HISTORIQUE ci-dessous
							</UncontrolledTooltip>
						</h6>
						<Row className="mt-3">
							{externalEvents.map(externalEvent =>
								<ExternalEvent externalEvent={externalEvent} onCaseClick={onCaseClick} externalAppsSettings={externalAppsSettings} client={client} serviceId={serviceId} />
							)}
						</Row>
					</CardBody>
				</Card>
			</React.Fragment> :
			<Loading />
	)
}

interface Props {
	onCaseClick: (attachedCase: any) => void
	externalEvent: ExternalEvent
	externalAppsSettings: any
	client: ClientContextSliceState
	serviceId: string
}
const ExternalEvent = (props: Props) => {
	const { externalEvent, externalAppsSettings, client, onCaseClick, serviceId } = props;

	const [showAll, setShowAll] = useState<boolean>(false);
	const [tooltipIsOpen, setTooltipIsOpen] = useState<boolean>(false);
	const renderOtherServiceIds = (serviceIds: Array<string>) => {
		return serviceIds.filter(id => id !== serviceId).join(', ');
	}

	return (
		<Col sm={3} className="mb-2">
			<Card style={{ height: "180px" }}>
				{externalAppsSettings && externalAppsSettings.length ?
					<ExternalLinksBlock settings={externalAppsSettings} clientContext={client} idParams={{ idsrcDem: externalEvent.objectId }} isLoading={true} >
						{renderHeader(externalEvent)}
					</ExternalLinksBlock> :
					renderHeader(externalEvent)
				}
				<CardBody className="p-2">
					<Row>
						<Col>
							<span id={"externalEvent-" + externalEvent.externalEventId}>Reçu le: {externalEvent.eventDetail.scanDate && moment(externalEvent.eventDetail.scanDate).format("DD/MM/YYYY")}</span>
							<UncontrolledTooltip placement="bottom" target={"externalEvent-" + externalEvent.externalEventId}>
								Indexé à la ligne le {moment(externalEvent.eventDetail.creationRequestDate).format("DD/MM/YYYY")}
							</UncontrolledTooltip>
						</Col>
					</Row>
					<Row className="mt-1">
						<Col style={{ color: "#696868" }}>
							Panier: {externalEvent.eventDetail.cartLabel}
						</Col>
					</Row>
					<Row className="mt-1 mb-1">
						<Col style={{ color: "#989696" }}>
							Provenance: {externalEvent.eventDetail.origin}
						</Col>
					</Row>
					<div className={`cases ${showAll ? 'overflow' : ''}`}>
						{externalEvent.caseExternalEventDTOS.map(attachedCase => {
							return (
								<Row>
									<Col>
										<span id={`externalEvent-${externalEvent.externalEventId}-case-${attachedCase.caseId}`} style={{ color: "red", cursor: "pointer", textDecoration: "underline" }} onClick={() => onCaseClick(attachedCase)}>Dossier n°{attachedCase.caseId}</span>
										<UncontrolledTooltip placement="bottom" target={`externalEvent-${externalEvent.externalEventId}-case-${attachedCase.caseId}`} className="case-tooltip">
											Date création: {moment(attachedCase.creationDate).format("DD/MM/YYYY HH:mm")} <br />
											Date modification: {moment(attachedCase.updateDate).format("DD/MM/YYYY HH:mm")} <br />
											Qualification: {attachedCase.qualification} <br />
											Statut: <FormattedMessage id={`STATUS.${attachedCase.status}`} />
										</UncontrolledTooltip>
										{(externalEvent.caseExternalEventDTOS.length > 3 && externalEvent.caseExternalEventDTOS.indexOf(attachedCase) === 2 && !showAll) &&
											<span className="ml-4" onClick={() => setShowAll(true)} style={{ cursor: "pointer" }}>+</span>}
									</Col>
								</Row>
							)
						})}
					</div>
					{externalEvent.otherServiceIds.length > 1 && <Row className="mt-1">
						<Col>
							<span id={"otherServiceIds-" + externalEvent.externalEventId} className="other-services" onClick={() => setTooltipIsOpen(true)}>
								+Autres lignes
							</span>
							<Tooltip placement="bottom" target={"otherServiceIds-" + externalEvent.externalEventId} autohide={false} isOpen={tooltipIsOpen}>
								<span onClick={() => setTooltipIsOpen(false)} className="close-tooltip">x</span>
								<b>ID service:</b> {renderOtherServiceIds(externalEvent.otherServiceIds)}
							</Tooltip>
						</Col>
					</Row>}
				</CardBody>
			</Card>
		</Col>
	)
}

const renderHeader = (externalEvent: ExternalEvent) => {
	return (
		<CardHeader className="p-2 d-flex justify-content-between e-e-header">
			<div>
				{externalEvent.eventDetail.objectType == ExternalEventObjectType.COURRIER ?
					<Icon name="icon-mail" color="gradient" className="mr-1" /> :
					<Icon name="icon-email" color="gradient" className="mr-1" />}
				<FiArrowDown className="arrow-icon" style={{ left: externalEvent.eventDetail.objectType == ExternalEventObjectType.COURRIER ? "23px" : "20px" }} />
				{externalEvent.objectId}
			</div>
			<FiLink2 style={{ fontSize: "16" }} className="mt-1" />
		</CardHeader>
	)
}

export default VegasCouriers;
