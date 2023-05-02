import * as React from "react";
import FormSwitchInput from "../../../../../components/Form/FormSwitchInput";
import {translate} from "../../../../../components/Intl/IntlGlobalProvider";
import {CaseDataProperty} from "../../../../../model/CaseDataProperty";
import ValidationUtils from "../../../../../utils/ValidationUtils"

interface Props {
    data: CaseDataProperty;
    disabled?: boolean
    name: string
    value?: boolean
    onChange?: (id: string, val: string, checked: boolean) => void
    otherValidations: object,
    defaultChecked?: boolean,
    color?: string,
    thickness?:string
}

export default class CaseDataBoolean extends React.Component<Props> {
    public handleCaseDataDateChange = (event: React.FormEvent<HTMLInputElement>) => {
        if (this.props.onChange) {
            const id = this.props.data.id;
            const value = event.currentTarget.value;
            const checked = event.currentTarget.checked;
            this.props.onChange(id, value, checked)
        }

    };

    public render(): JSX.Element {
        const {data} = this.props;
        const {disabled} = this.props;
        const required = this.props.data.required;
        let validations;
        if (!disabled) {
            validations = {
                respectPattern: ValidationUtils.respectPattern(data.pattern),
                ...this.props.otherValidations
            };
            if (required) {
                validations = {...validations, isRequired: ValidationUtils.notEmpty}
            }
        }
        return <FormSwitchInput
            id={data.code}
            name={this.props.name}
            checked={Boolean(data.value)}
            validations={validations}
            value={this.props.value}
            valueOn={translate.formatMessage({id: "component.switch.yes"})}
            valueOff={translate.formatMessage({id: "component.switch.no"})}
            disabled={disabled}
            readOnly={disabled}
            color={this.props.color}
            defaultChecked={this.props.defaultChecked}
            onChange={this.handleCaseDataDateChange}
            thickness={this.props.thickness}
        />
    }
}