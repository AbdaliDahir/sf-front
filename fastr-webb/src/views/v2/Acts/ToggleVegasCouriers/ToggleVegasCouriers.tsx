import moment from "moment"
import React, { useEffect, useState } from "react"
import { connect } from "react-redux"
import { UncontrolledTooltip, Row, Col } from "reactstrap"
import Loading from "src/components/Loading"
import { ServiceType } from "src/model/ServiceType"
import { ExternalEvent, ExternalEventObjectType } from "src/model/externalEvent/ExternalEvent"
import ExternalEventService from "src/service/ExtrenalEventService"
import { AppState } from "src/store"
import { ClientContextSliceState } from "src/store/ClientContextSlice"
import { UIProps } from "src/store/actions/UIActions"
import './ToggleVegasCouriers.scss'
import { BlocksExternalAppsConfig } from "src/views/Clients/ExternalAppsConfig"
import ExternalLinksBlock from "src/views/Clients/ExternalLinksBlock"
import { FiArrowDown } from "react-icons/fi"
import Icon from "src/components/Bootstrap/Icon"
import FormCheckboxInput from "src/components/Form/FormCheckboxInput"
import { NotificationManager } from "react-notifications";
import { ExternalEventChange } from "../../../../model/externalEvent/RequestForVegasCouriers"
import FormHiddenInput from "src/components/Form/FormHiddenInput"
import { Case } from "src/model/Case"

interface Props extends UIProps {
    caseId: string
    currentCase: Case
    client: ClientContextSliceState
    externalEvents?: ExternalEvent[]
    disableSubmit?: (disable: boolean) => void
    setMandatoryAdgIsValid?: (valid: boolean) => void
}

const ToggleVegasCouriers = (props: Props) => {
    const isMobile = props.client.service?.serviceType === ServiceType.MOBILE
    const serviceId = isMobile ? props.client.service?.id as string : props.client.service?.siebelAccount as string
    const externalAppsSettings = BlocksExternalAppsConfig.history.vegasCouriers

    const externalEventService: ExternalEventService = new ExternalEventService(true)
    const [externalEvents, setExternalEvents] = useState<ExternalEvent[]>([])
    const [checkedExternalEvents, setCheckedExternalEvents] = useState<string[]>([])
    const [externalEventChanges, setExternalEventChanges] = useState<ExternalEventChange[]>([])

    useEffect(() => {
        if (props.disableSubmit) props.disableSubmit(true)
        if (props.setMandatoryAdgIsValid) props.setMandatoryAdgIsValid(props.currentCase.externalEventIds ? props.currentCase.externalEventIds.length > 0 : false)

        setCheckedExternalEvents(props.currentCase.externalEventIds ? props.currentCase.externalEventIds : [])

        if (props.externalEvents?.length) setExternalEvents(props.externalEvents)
        else {
            const externalEventPromise: Promise<ExternalEvent[]> = isMobile ? externalEventService.getMobileExternalEvents(serviceId, "vegas") : externalEventService.getFixeExternalEvents(serviceId, "vegas")
            externalEventPromise.then((externalEvents: ExternalEvent[]) => {
                setExternalEvents(externalEvents)
                !externalEvents.length && NotificationManager.error("Aucun courrier ou email à associer pour cette ligne")
            })
        }
    }, [])

    const toggleChecked = (functionalId: string, checked: boolean) => {
        const nextCheckedExternalEvents = [...checkedExternalEvents]
        checked ? nextCheckedExternalEvents.push(functionalId) : nextCheckedExternalEvents.splice(nextCheckedExternalEvents.indexOf(functionalId), 1)
        setCheckedExternalEvents(nextCheckedExternalEvents)

        const nextExternalEventChanges = [...externalEventChanges]
        const externalEventChange = nextExternalEventChanges.find(evc => evc.externalEventId === functionalId)!
        if (externalEventChange)
            nextExternalEventChanges.splice(nextExternalEventChanges.indexOf(externalEventChange), 1)
        else {
            const externalEvent = externalEvents.find(e => e.externalEventId === functionalId)!
            const newExternalEventChange: ExternalEventChange = {
                type: checked ? 'attachment' : 'detachment',
                externalEventId: externalEvent.externalEventId,
                externalEventObjectId: externalEvent.objectId,
                externalEventObjectType: externalEvent.eventDetail.objectType,
                externalEventCreationRequestDate: externalEvent.eventDetail.creationRequestDate,
                externalEventScanDate: externalEvent.eventDetail.scanDate
            }
            nextExternalEventChanges.push(newExternalEventChange)
        }
        setExternalEventChanges(nextExternalEventChanges)

        if (props.disableSubmit) props.disableSubmit(nextExternalEventChanges.length === 0)
        if (props.setMandatoryAdgIsValid) {
            const mandatoryAdgIsValid = nextCheckedExternalEvents.length > 0 || (nextCheckedExternalEvents.length == 0 && externalEvents.some(e => e.caseExternalEventDTOS.some(c => c.caseId != props.caseId)))
            props.setMandatoryAdgIsValid(mandatoryAdgIsValid)
        }
    }

    return (
        externalEvents.length ?
            <React.Fragment>
                <h5 className="text-center mt-2 mb-0">Cocher la/les demande(s) VEGAS à associer à ce dossier</h5>
                <p className="text-center mb-4" style={{ fontSize: '14px' }}>Vous pouvez consulter au préalable chaque demande par clic Réf. TCO/EMAIL</p>
                {externalEvents.map((externalEvent, index) => {
                    return (
                        <Row className={`external-event ${index % 2 === 0 ? "even" : ""}`}>
                            <Col sm={6} className="d-flex align-items-center">
                                <FormCheckboxInput functionalId={externalEvent.externalEventId} value={checkedExternalEvents.includes(externalEvent.externalEventId)} name={"externalEvent.checked-" + externalEvent.externalEventId} toggleChecked={toggleChecked} />
                                <div className="ml-5">
                                    {externalEvent.eventDetail.objectType === ExternalEventObjectType.COURRIER ?
                                        <Icon name="icon-mail" color="gradient" className="external-event-icon" /> :
                                        <Icon name="icon-email" color="gradient" className="external-event-icon" />}
                                    <FiArrowDown className="arrow-icon" style={{ left: externalEvent.eventDetail.objectType === ExternalEventObjectType.COURRIER ? "-2px" : "-5px" }} />
                                    <span id={"externalEvent-" + externalEvent.externalEventId}>
                                        Reçu le: {externalEvent.eventDetail.scanDate && moment(externalEvent.eventDetail.scanDate).format("DD/MM/YYYY HH:mm")}
                                    </span>
                                    <UncontrolledTooltip placement="bottom" target={"externalEvent-" + externalEvent.externalEventId}>
                                        Indexé à la ligne le {moment(externalEvent.eventDetail.creationRequestDate).format("DD/MM/YYYY HH:mm")}
                                    </UncontrolledTooltip>
                                </div>
                            </Col>
                            <Col sm={6}>
                                <ExternalLinksBlock settings={externalAppsSettings} clientContext={props.client} idParams={{ idsrcDem: externalEvent.objectId }} isLoading={true} >
                                    <span className="external-link">Réf. "{externalEvent.objectId}"</span>
                                </ExternalLinksBlock>
                            </Col>
                        </Row>
                    )
                })}
                <FormHiddenInput name="externalEventChanges" id="externalEventChanges" value={externalEventChanges} />
            </React.Fragment> :
            <Loading />
    )
}

const mapStateToProps = (state: AppState, ownProps: Props) => ({
    currentCase: state.store.cases.casesList[ownProps.caseId]?.currentCase,
    client: state.store.client.currentClient
})

export default connect(mapStateToProps)(ToggleVegasCouriers)