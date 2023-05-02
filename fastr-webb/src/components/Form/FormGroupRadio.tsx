import {withFormsy} from "formsy-react";
import {PassDownProps} from "formsy-react/dist/Wrapper";
import * as React from "react";
import {Input, InputProps, Label} from "reactstrap";
import FormGroup from "reactstrap/lib/FormGroup";
import './Css/helper.css';

type PropType = PassDownProps & InputProps;


interface Props extends PropType {
    forceValue?: string
    value?: string
    onValueChange?: (value: string) => void
    onRadioBtnChange?: (e: React.MouseEvent<HTMLInputElement>) => void
    onFieldValidation?: (isValid: boolean) => void
    dontShowActiveWhenDisabled?: boolean,
    radioListData: [{ label: string, value: string }]
    onDoubleClick?: () => void
}

interface State {
    selected: string
}

class FormButtonGroupRadio extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        if (this.props.value) {
            this.state = {
                selected: this.props.value,
            };
            this.props.setValue(this.props.value);
        } else if (this.props.radioListData.length > 0) {
            this.state = {
                selected: this.props.radioListData[0].value,
            };
            this.props.setValue(this.props.radioListData[0].value);
        } else {
            this.state = {
                selected: "",
            };
            this.props.setValue("");
        }
    }

    public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>): void {
        if (prevProps.forceValue !== this.props.forceValue && this.props.forceValue !== undefined) {
            this.updateValue(this.props.forceValue);
        }
    }

    public renderButtons(): JSX.Element[] {
        return this.props.radioListData.map((element, i) => {
            return (
                <div key={"div-" + i} className={"input-group mt-1"} onDoubleClick={this.onRadioBtnDoubleClick}>
                    <div className={"input-group-prepend"}>
                        <div className={"input-group-text pr-4" + (element.value === this.state.selected ? " bg-secondary" : "")}>
                            <Input type={"radio"}
                                   onClick={this.onRadioBtnClick}
                                   key={i}
                                   id={element.value}
                                   disabled={this.props.disabled}
                                   name={this.props.name}
                                   value={element.value}
                                   defaultChecked={element.value === this.state.selected}
                                   className={"input-group-text ml-0"}
                            />
                        </div>
                    </div>
                    <Label className={"form-control hover-bg-light" + (element.value === this.state.selected ? " bg-secondary" : "")} for={element.value}>{element.label}</Label>
                </div>
            );
        });
    }

    public onRadioBtnDoubleClick = (event: React.MouseEvent<HTMLInputElement>) => {
        if (this.props.onDoubleClick) {
            this.props.onDoubleClick();
        }
    };

    public onRadioBtnClick = (event: React.MouseEvent<HTMLInputElement>) => {
        this.updateValue(event.currentTarget.value);
        if (this.props.onRadioBtnChange) {
            this.props.onRadioBtnChange(event)
        }
    };

    public updateValue = (value: string) => {
        this.setState({selected: value});
        this.props.setValue(value);
        if (this.props.onValueChange) {
            this.props.onValueChange(value);
        }
    };

    public render(): JSX.Element {
        return (
            <FormGroup>
                {this.renderButtons()}
            </FormGroup>
        )
    }
}

export default withFormsy<Props>(FormButtonGroupRadio);
