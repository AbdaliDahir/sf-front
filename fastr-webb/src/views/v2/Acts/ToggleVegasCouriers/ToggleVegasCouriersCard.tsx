import React, { useState } from "react"
import { useEffect } from "react"
import { connect } from "react-redux"
import { Card, CardHeader, Collapse, CardBody } from "reactstrap"
import Loading from "src/components/Loading"
import { ServiceType } from "src/model/ServiceType"
import { ExternalEvent } from "src/model/externalEvent/ExternalEvent"
import ExternalEventService from "src/service/ExtrenalEventService"
import { AppState } from "src/store"
import { ClientContextSliceState } from "src/store/ClientContextSlice"
import { FiMail } from "react-icons/fi"
import ToggleVegasCouriers from "./ToggleVegasCouriers"
import FormHiddenInput from "src/components/Form/FormHiddenInput"

interface Props {
    caseId: string
    authorizations: any
    client: ClientContextSliceState
    isEditable: boolean
    isExpanded: boolean
    isExpandable: boolean
}

const ToggleVegasCouriersCard = (props: Props) => {
    const isMobile = props.client.service?.serviceType === ServiceType.MOBILE
    const serviceId = isMobile ? props.client.service?.id as string : props.client.service?.siebelAccount as string
    const isAuthorized: boolean = props.authorizations.indexOf("ADG_ASSOCIATION_COURRIERS_OBLIGATOIRE") > -1

    const externalEventService: ExternalEventService = new ExternalEventService(true)
    const [externalEvents, setExternalEvents] = useState<ExternalEvent[]>([])
    const [isExpanded, setIsExpanded] = useState<boolean>(props.isExpanded)
    const [mandatoryAdgIsValid, setMandatoryAdgIsValid] = useState<boolean>(false);

    useEffect(() => {
        if (!isAuthorized) return

        const externalEventPromise: Promise<ExternalEvent[]> = isMobile ? externalEventService.getMobileExternalEvents(serviceId, "vegas") : externalEventService.getFixeExternalEvents(serviceId, "vegas")
        externalEventPromise.then((externalEvents: ExternalEvent[]) => {
            setExternalEvents(externalEvents)
        })
    }, [])

    return externalEvents.length > 0 ?
        <Card>
            <CardHeader onClick={() => props.isExpandable ? setIsExpanded(!isExpanded) : undefined} className={"edit_antichurn_cardV2__header " + (isExpanded ? "" : "rounded")}>
                <section>
                    <FiMail style={{ fontSize: "18", color: "white" }} />
                    <span className={"ml-2"}>Demande VEGAS à rattacher/détacher</span>
                </section>
                <section className="d-flex">
                    {props.isExpandable && <i className={`icon icon-white float-right  ${isExpanded ? 'icon-up' : 'icon-down'}`} />}
                </section>
            </CardHeader>
            <Collapse isOpen={isExpanded}>
                <CardBody>
                    <React.Suspense fallback={<Loading />}>
                        <ToggleVegasCouriers caseId={props.caseId} externalEvents={externalEvents} setMandatoryAdgIsValid={setMandatoryAdgIsValid} />
                        <FormHiddenInput name="mandatoryAdgIsValid" id="mandatoryAdgIsValid" value={mandatoryAdgIsValid} />
                    </React.Suspense>
                </CardBody>
            </Collapse>
        </Card>
        : <React.Fragment />
}

const mapStateToProps = (state: AppState) => ({
    authorizations: state.store.applicationInitialState.authorizations,
    client: state.store.client.currentClient
})

export default connect(mapStateToProps)(ToggleVegasCouriersCard);