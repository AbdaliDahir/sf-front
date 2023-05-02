import * as React from "react";
import FormSelectInput from "../../../../../components/Form/FormSelectInput";
import {CaseDataProperty} from "../../../../../model/CaseDataProperty";
import ValidationUtils from "../../../../../utils/ValidationUtils";

interface Props {
    data: CaseDataProperty
    disabled?: boolean
    name: string
    value?: string
    onChange?: (id: string, val: string, code?: string) => void
    otherValidations: object
}

export default class CaseDataList extends React.Component<Props> {

    public renderOptions(): JSX.Element[] {
        this.initDataValueIfUndefined();
        return this.props.data.listValues.map((value: string | undefined) => {
            return <option key={value} value={value}>{value}</option>
        })
    }

    /**
     * Si la value de la data est undefined => il faut la forcer avec la defaultValue s'elle existe
     */
    public initDataValueIfUndefined() {
        if (!this.props.data.value && this.props.data.defaultValue) {
            this.props.data.value = this.props.data.defaultValue
        }
    }

    public handleCaseDataListChange = (event: React.FormEvent<HTMLInputElement>) => {

        if (this.props.onChange) {
            const id = this.props.data.id;
            const code = this.props.data.code;
            const value = event.currentTarget.value;
            this.props.onChange(id, value, code)
        }
    };

    public render(): JSX.Element {
        const {data} = this.props;
        const {disabled} = this.props;
        const required = this.props.data.required;
        let validations
        if (!disabled) {
            validations = {
                respectPattern: ValidationUtils.respectPattern(data.pattern),
                ...this.props.otherValidations
            };
            if (required) {
                validations = {...validations, isRequired: ValidationUtils.notEmpty}
            }
        }
        return <FormSelectInput
            forceDirty={true}
            id={data.code}
            forcedValue={!data.value ? data.defaultValue : data.value}
            label={this.props.data.label}
            name={this.props.name}
            disabled={disabled}
            readOnly={disabled}
            validations={validations}
            bsSize={"sm"}
            onChange={this.handleCaseDataListChange}>
            <option key={""} value={""}/>
            {this.renderOptions()}
        </FormSelectInput>
    }
}