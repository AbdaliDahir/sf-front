import {parse} from "date-fns"
import * as React from "react"
import ReactDatePicker, {registerLocale} from "react-datepicker"
import {FormattedMessage} from "react-intl"
import {Button} from "reactstrap"
import fr from "date-fns/locale/fr";
import {GingerParameter} from "../../../../../../model/acts/send-communication/GingerTemplateModel";
import {PreviewParameters} from "../../../../../../model/acts/send-communication/SendCommunicationRequestDTO";
import ValidationUtils from "../../../../../../utils/ValidationUtils";
import FormTextInput from "../../../../../../components/Form/FormTextInput";
import {translate} from "../../../../../../components/Intl/IntlGlobalProvider";
import FormButtonGroupRadio from "../../../../../../components/Form/FormButtonGroupRadio";
import FormSelectInput from "../../../../../../components/Form/FormSelectInput";

// TODO: a typer
interface InputProps {
    param: GingerParameter
    form: PreviewParameters
    index: number
    onParamChange
    onDateParamChange
    onFocus
    updateValidArray
}
// Register date local
registerLocale('fr', fr);
const ParamFormInput = (props: InputProps) => {
    const {param} = props

    const value = props.form.filter(formParam => formParam.name === param.name)[0] ? props.form.filter(formParam => formParam.name === param.name)[0].value : undefined
    const onFocus = e => props.onFocus(e.currentTarget.name)


    const isRequired = () => {
        if (param.mandatory) {
            return {isRequired: ValidationUtils.notEmpty}
        }
        return;
    }

    const placeholder = (param.sizeMin || param.sizeMax) ? `${param.description} [(${param.sizeMin})-(${param.sizeMax})]` : param.description
    const locale = process.env.REACT_APP_FASTR_LANGUAGE

    switch (param.type) {
        case "string":
            return <FormTextInput
                validations={{
                    ...isRequired(),
                    "inputMaxLength": param.sizeMax,
                    "inputMinLength": param.sizeMin
                }}
                onFocus={onFocus}
                id={`${param.type}_${param.name}`}
                name={param.name}
                value={value}
                placeholder={placeholder}
                onChange={props.onParamChange}
                onFieldValidation={props.updateValidArray(props.index)}
            />;
        case "email":
            return <FormTextInput
                validations={{
                    ...isRequired(), isEmail: true,
                    "inputMaxLength": param.sizeMax,
                    "inputMinLength": param.sizeMin
                }}
                validationErrors={{
                    isEmail: translate.formatMessage({id: "error.email"}),
                }}
                onFocus={onFocus}
                id={`${param.type}_${param.name}`}
                name={param.name}
                value={value}
                placeholder={placeholder}
                onChange={props.onParamChange}
                onFieldValidation={props.updateValidArray(props.index)}
            />;
        case "date":
            const dateString: string = value ? value : ""
            const selectedDate = dateString ? parse(dateString, "yyyyMMdd", new Date()) : undefined
            return <ReactDatePicker onChange={props.onDateParamChange("date", param.name)}
                                    onFocus={onFocus}
                                    name={param.name}
                                    locale={locale}
                                    selected={selectedDate}
                                    dateFormat="d,MMMM yyyy"
                                    customInput={<FormTextInput validations={isRequired()}
                                                                onFieldValidation={props.updateValidArray(props.index)}/>}/>;
        case "heure":
            const hour: string = value ? value : ""
            const selectedHour = hour ? parse(hour, "HHmmss", new Date()) : undefined
            return <ReactDatePicker onChange={props.onDateParamChange("heure", param.name)}
                                    onFocus={onFocus}
                                    name={param.name}
                                    locale={locale}
                                    selected={selectedHour}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={15}
                                    timeCaption="Time"
                                    dateFormat="HH:mm"
                                    customInput={<FormTextInput validations={isRequired()}
                                                                onFieldValidation={props.updateValidArray(props.index)}
                                    />}/>;
        case "datetime":
            const datetime: string = value ? value : ""
            const selectedDatetime = datetime ? parse(datetime, "yyyyMMddHHmmss", new Date()) : undefined
            return <ReactDatePicker onChange={props.onDateParamChange("datetime", param.name)}
                                    onFocus={onFocus}
                                    name={param.name}
                                    locale={locale}
                                    selected={selectedDatetime}
                                    showTimeSelect
                                    timeFormat="HH:mm"
                                    timeIntervals={15}
                                    timeCaption="time"
                                    dateFormat="d,MMMM yyyy HH:mm"
                                    customInput={<FormTextInput validations={isRequired()}
                                                                onFieldValidation={props.updateValidArray(props.index)}
                                    />}/>;
        case "boolean":
            return (<>
                    <p className="font-weight-lighter">{param.description}</p>
                <FormButtonGroupRadio name={param.name} id={`${param.type}_${param.name}`}
                                      onRadioBtnChange={props.onParamChange} validations={isRequired()}
                                      onFieldValidation={props.updateValidArray(props.index)}>
                    <Button size="lg" color="primary" name={param.name} id={`${param.type}_${param.name}`} value="yes">
                        <FormattedMessage id="component.switch.yes"/>
                    </Button>
                    <Button size="lg" color="primary" name={param.name} id={`${param.type}_${param.name}`} value="no">
                        <FormattedMessage id="component.switch.no"/>
                    </Button>
                </FormButtonGroupRadio>
                </>
            )
        case "int":
            return <FormTextInput
                validations={{
                    ...isRequired(),
                    respectPattern: ValidationUtils.respectStrictPattern(/-?\d+/),
                    isBetween: param && ValidationUtils.isBetween(param.sizeMin, param.sizeMax)
                }}
                onFocus={onFocus}
                id={`${param.type}+${param.name}`}
                name={param.name}
                value={value}
                placeholder={placeholder}
                onChange={props.onParamChange}
                onFieldValidation={props.updateValidArray(props.index)}
            />;
        case "reel":
            return <FormTextInput
                validations={{
                    ...isRequired(),
                    isPhoneNumber: ValidationUtils.respectStrictPattern(/-?\d+[\.,]?\d*/),
                    isBetween: param && ValidationUtils.isBetween(param.sizeMin, param.sizeMax)
                }}
                onFocus={onFocus}
                id={`${param.type}_${param.name}`}
                name={param.name}
                value={value}
                placeholder={placeholder}
                onChange={props.onParamChange}
                onFieldValidation={props.updateValidArray(props.index)}
            />;
        case "list":
        case "liste":
            const options: Array<JSX.Element> = param.values.map((listItem) =>
                <option
                    key={listItem.key} value={listItem.key} id={listItem.key} selected={listItem.key === value}>
                    {listItem.label}
                </option>
            )
            options.unshift(<option value="" selected disabled hidden>{param.description}</option>)
            return <FormSelectInput
                id={`${param.type}+${param.name}`}
                name={param.name}
                onFocus={onFocus}
                onChange={props.onParamChange}
                validations={{...isRequired()}}
                onFieldValidation={props.updateValidArray(props.index)}>
                {options}
            </FormSelectInput>
        case "msisdn":
            return <FormTextInput
                validations={{
                    ...isRequired(),
                    isPhoneNumber: ValidationUtils.respectStrictPattern(/0\d{9}/),
                }}
                onFocus={onFocus}
                id={`${param.type}_${param.name}`}
                name={param.name}
                value={value}
                placeholder={placeholder}
                onChange={props.onParamChange}
                onFieldValidation={props.updateValidArray(props.index)}
            />;
        default:
            return null
    }
}

export default ParamFormInput