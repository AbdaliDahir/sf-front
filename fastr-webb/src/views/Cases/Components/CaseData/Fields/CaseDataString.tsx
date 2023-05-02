import * as React from "react";
import FormTextInput from "../../../../../components/Form/FormTextInput";
import {CaseDataProperty} from "../../../../../model/CaseDataProperty";
import ValidationUtils from "../../../../../utils/ValidationUtils";

interface Props {
    data: CaseDataProperty,
    disabled?: boolean,
    name: string,
    value?: string,
    onChange?: (id: string, val: string) => void
    otherValidations: object
    requiredData?: boolean
}

interface State {
    tooltipOpen: boolean
}

export default class CaseDataString extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            tooltipOpen: false,
        }
    }

    public handleCaseDataStringChange = (event: React.FormEvent<HTMLInputElement>) => {
        if (this.props.onChange !== undefined) {
            const id = this.props.data.id;
            const value = event.currentTarget.value;
            this.props.onChange(id, value)
        }
    };

    public toggle = () => this.setState(prevState => ({tooltipOpen: !prevState.tooltipOpen}));

    public render(): JSX.Element {
        const {data, disabled, otherValidations} = this.props;

        let validations;

        if (!disabled) {
            validations = {
                respectPattern: ValidationUtils.respectPatternOnlyIfValueNotEmpty(data.pattern),
                ...otherValidations
            };

            if (data.required) {
                validations = {...validations, isRequired: ValidationUtils.notEmpty}
            }
        }

        // const {tooltipOpen} = this.state;
        return (
            <React.Fragment>
                {/*<Tooltip placement="bottom" isOpen={tooltipOpen} autohide={false} target={data.code} toggle={this.toggle}>*/}
                {/*    {data.value}*/}
                {/*</Tooltip>*/}
                <FormTextInput
                    validations={validations}
                    id={data.code}
                    name={this.props.name}
                    label={this.props.data.label}
                    value={data.value}
                    disabled={disabled}
                    readOnly={disabled}
                    bsSize={"sm"}
                    onChange={this.handleCaseDataStringChange}
                    forceDirty
                />
            </React.Fragment>
        )
    }
}