import * as React from "react";
import {Button, FormGroup} from "reactstrap";
import FormButtonGroupRadio from "../../../components/Form/FormButtonGroupRadio";
import {translate} from "../../../components/Intl/IntlGlobalProvider";
import ValidationUtils from "../../../utils/ValidationUtils";

interface Props {
    buttonGroupName: string
    isRequired?: boolean
    value: string
    label?: string
    context?: string
    handleButtonChange?: (value: string) => void
    disabled?: boolean
    updateMode?: boolean
}


export default class RetentionButtonRadio extends React.Component<Props> {

    constructor(props: Props) {
        super(props);

    }


    public handleButtonChange = (value: string) => {
        if (this.props.handleButtonChange) {
            this.props.handleButtonChange(value)
        }
    };


    public render() {
        const yesSelected = (this.props.disabled) && (this.props.value === "true");
        const noSelected = (this.props.disabled) && (this.props.value === "true");
        return (
            <React.Fragment>
                <FormGroup name={this.props.buttonGroupName+".buttons.id"}>
                    <FormButtonGroupRadio name={this.props.buttonGroupName}
                                          label={this.props.label}
                                          id={this.props.buttonGroupName}
                                          value={this.props.value === "true" ? "YES" : this.props.value === "false" ? "NO" : ""}
                                          forceValue={this.props.value === "true" ? "YES" : this.props.value === "false" ? "NO" : ""}
                                          validations={{isRequired: ValidationUtils.notEmpty}}
                                          disabled={this.props.disabled}
                                          onValueChange={this.handleButtonChange}
                    >
                        <Button size="sm" color={"primary"} outline={!yesSelected} value={"YES"}
                                hidden={this.props.disabled && this.props.value === "false"}>
                            {translate.formatMessage({id: "YES"})}
                        </Button>
                        <Button size="sm" color={"primary"} outline={!noSelected} value={"NO"}
                                hidden={this.props.disabled && this.props.value === "true"}>
                            {translate.formatMessage({id: "NO"})}
                        </Button>
                    </FormButtonGroupRadio>
                </FormGroup>
            </React.Fragment>
        )
    }
}