import {format} from "date-fns"
import * as React from "react";
import {connect} from "react-redux"
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap"
import {StepProps} from "../../../../../components/Form/StepForm/StepForm"
import {translate} from "../../../../../components/Intl/IntlGlobalProvider"
import {
    GingerMedia,
    GingerParameter,
    GingerTemplateModel
} from "../../../../../model/acts/send-communication/GingerTemplateModel"
import {PreviewParameters} from "../../../../../model/acts/send-communication/SendCommunicationRequestDTO"
import Payload from "../../../../../model/Payload"
import {Client} from "../../../../../model/person"
import {Service} from "../../../../../model/service"
import notifService from "../../../../../service/NotifService"
import {AppState} from "../../../../../store"
import {setFormComplete, setFormIncomplete} from "../../../../../store/actions"
import ParamForm from "./ParamForm"
import Visualization from "./Visualization"
import {NotificationManager} from "react-notifications";
import {PhoneLineService} from "../../../../../model/service/PhoneLineService";

// TODO a typer
// TODO fichier de langue
interface Props extends StepProps {
    model?: GingerTemplateModel
    media?: GingerMedia
    client: Client
    service: Service
    payload: Payload
    setValidForm: (form: PreviewParameters) => void
    validForm?: PreviewParameters

    isFormCompleted: boolean
    setFormComplete
    setFormIncomplete
}

const TemplateVisualization: React.FunctionComponent<Props> = (props: Props) => {

    const GINGER_DATE_FORMAT = {
        date: "yyyyMMdd",
        heure: "HHmmss",
        datetime: "yyyyMMddHHmmss"
    }

    const getInitialParam = (param: GingerParameter) => {
        if (!param.auto) {
            return {name: param.name, value: undefined}
        } else {
            switch (param.name.toLocaleUpperCase()) {
                case "TYPE_DOSSIER":
                    return {
                        name: param.name,
                        value: props.payload && props.payload.motif && props.payload.motif.caseType
                    }
                case "CIV_TITU":
                    return {
                        name: param.name,
                        value: props.client && props.client.ownerPerson && props.client.ownerPerson.civility
                    }
                case "NOM_TITU":
                    return {
                        name: param.name,
                        value: props.client && props.client.ownerPerson ? props.client.ownerPerson.lastName : props.client.ownerCorporation.name
                    }
                case "DATE_EVENEMENT":
                    return {name: param.name, value: format(new Date(), "yyyyMMdd")}
                case "DATE":
                    return {name: param.name, value: format(new Date(), "yyyyMMdd")}
                case "MSISDN":
                    return {name: param.name, value: props.service && props.service.label}
                case "NDI":
                    return {name: param.name, value: props.service && props.service.label}
                case "SEGMENT":
                    return {name: param.name, value: props.service && props.service.segment}
                case "TECHNO_FIXE":
                    if (props.service && props.service.category === "FIXE") {
                        const phoneService = props.service as PhoneLineService
                        const technology: string = phoneService && phoneService.technology ? phoneService && phoneService.technology : ""
                        if (["ADSL", "FTTB", "FTTH"].indexOf(technology) !== -1) {
                            return {name: param.name, value: technology}
                        } else {
                            return {name: param.name, value: "AUTRE"}
                        }
                    } else {
                        return {name: param.name, value: undefined}
                    }
                case "ID_SELF":
                    return {name: param.name, value: undefined}
                case "MARQUE":
                    return {name: param.name, value: props.service && props.service.brand}
                default:
                    return {name: param.name, value: undefined}
            }
        }
    }


    const [form, setForm] = React.useState<PreviewParameters | undefined>(() => {
        return props.validForm ? props.validForm : props.model && props.model.parameters.map(getInitialParam)
    })

    const [modal, setModal] = React.useState<boolean>(true)

    const [content, setContent] = React.useState()

    const [focusedField, setFocusedField] = React.useState()

    const [isFormValid, setIsValidForm] = React.useState<boolean>(false)

    const toggle = () => setModal(prevState => {
        if (prevState) {
            if (props.changeValidation) {
                props.changeValidation(false)
            }
        }
        return !prevState
    })
    const onNext = () => {
        toggle()
        if (props.changeValidation) {
            props.changeValidation(true)
        }
        if (form) {
            props.setValidForm(form)
        }
        props.setFormComplete()
        if (props.onNext) {
            props.onNext()
        }
    }
    const onPrevious = () => {
        toggle()
        props.setFormIncomplete()
        if (props.changeValidation) {
            props.changeValidation(false)
        }
        if (props.onPrevious) {
            props.onPrevious()
        }
    }

    const updateForm = (paramName, value) => {
        const newForm = form && form.map(param => {
            if (param.name === paramName) {
                param.value = value
                return param
            } else {
                return param
            }
        })
        setForm(newForm)
    }

    const onParamChange = (e) => {
        const value: string = e.currentTarget.value
        const name: string = e.currentTarget.name
        const id: string = e.currentTarget.id
        const isNumber = id.startsWith("int") || id.startsWith("reel")
        if (isNumber && value.includes(",")) {
            updateForm(name, value.replace(',', '.'))
        } else if (id.startsWith("liste")) {
            const index: number = e.currentTarget.selectedIndex;
            const optionElement: HTMLOptionElement = e.currentTarget.childNodes[index]
            updateForm(name, optionElement.id)
        } else if (id.startsWith("boolean")) {
            const valueFormatted = e.currentTarget.value === "yes" ? "1" : "0"
            updateForm(name, valueFormatted)
        } else {
            updateForm(name, value)
        }
    }

    const onDateParamChange = (type, paramName) => {
        return (date) => {

            const value = date ? format(date, GINGER_DATE_FORMAT[type]) : undefined
            updateForm(paramName, value)
        }
    }

    React.useEffect(() => {
            notifService.fetchTemplatePreview({
                templateName: props.model && props.model.name,
                previewParameters: form,
                templateMedia: props.media && props.media.toString()
            })
                .then(res => {
                        setContent(res.content)
                        const invalidAutoParams = res.parameters.filter(param => param.auto && param.mandatory).filter(param => !param.valid)
                        if (invalidAutoParams.length) {
                            const displayInvalidParam = invalidAutoParams.map(param => `${param.description}=${param.value}(${param.type})`).join("/")
                            NotificationManager.error(translate.formatMessage({id: "act.send.communication.error.preview.invalid.auto.param"}, {paramString: displayInvalidParam}), null, 20000)
                            onPrevious()
                        }
                    }
                )
                .catch(err => console.error(err))
        }
        , [form])


    return (
        <div>
            Envoi de commmunication : Etape 3
            <Modal isOpen={modal} toggle={toggle} className="comm-modal" zIndex={"no"}>
                <ModalHeader className="bg-light font-weight-bold">
                    Envoi de communication: Saisie des paramètres du modèle <em>
                    {props.model && props.model.description}</em> au format <em>
                    {props.media && props.media.toString()}</em>
                </ModalHeader>
                <ModalBody className="d-flex">
                    <Visualization content={content} focusedField={focusedField} highlighted/>
                    <ParamForm parameters={props.model && props.model.parameters}
                               onParamChange={onParamChange}
                               onDateParamChange={onDateParamChange}
                               onFocus={setFocusedField}
                               setIsValidForm={setIsValidForm}
                               form={form}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button id="index.next.button.id" onClick={onNext} disabled={!isFormValid}>Suivant</Button>
                    <Button id="index.cancel.button.id" onClick={onPrevious}>Abandonner</Button>
                </ModalFooter>
            </Modal>

        </div>
    )

}

const mapStateToProps = (state: AppState) => ({
    isFormCompleted: state.casePage.isFormCompleted
})

export default connect(mapStateToProps, {
    setFormComplete,
    setFormIncomplete
})(TemplateVisualization);
