import {withFormsy} from "formsy-react";
import {PassDownProps} from "formsy-react/dist/Wrapper";
import * as React from "react";
import {InputProps} from "reactstrap";
import Button from "reactstrap/lib/Button";
import ButtonGroup from "reactstrap/lib/ButtonGroup";
import Col from "reactstrap/lib/Col";
import FormGroup from "reactstrap/lib/FormGroup";
import Row from "reactstrap/lib/Row";
import './Css/helper.css';
import './Css/FormButtonGroupRadio.scss';

type PropType = PassDownProps & InputProps;

interface Props extends PropType {
    children: JSX.Element[]
    forceValue?: string
    value?: string
    onValueChange?: (value: string) => void
    onRadioBtnChange?: (e: React.MouseEvent<HTMLButtonElement>) => void
    onFieldValidation?: (isValid: boolean) => void
    longButtons: boolean
    dontShowActiveWhenDisabled?: boolean
    handleSansContactClicked?: () => void
    className?: string
    label?: string
}

interface State {
    selected: string
}

class FormButtonGroupRadio extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        const value = this.props.forceValue ? this.props.forceValue : this.props.value
        if (value) {
            this.state = {
                selected: value,
            };
            this.props.setValue(value);
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
        if (this.props.longButtons) {
            return this.props.children.map((element, i) => {
                return !element.props.shouldHide ? (
                    <Col className={`pr-0 pl-0 ${this.props.dontShowActiveWhenDisabled ? '' : 'show-active-disabled'}`}>
                        <Button className='form-button-group'
                                label={this.props.label}
                                onClick={this.onRadioBtnClick}
                                active={element.props.disabled ? false : this.state.selected === element.props.value}
                                key={i}
                                onValid={this.onValid()}
                                disabled={this.props.disabled} {...element.props}
                        />
                    </Col>
                ) : <React.Fragment/>
            })
        } else {
            return this.props.children.map((element, i) => {
                return (
                    React.cloneElement(element, {
                        className: 'form-button-group',
                        label: this.props.label,
                        onClick: this.onRadioBtnClick,
                        active: element.props.disabled ? false : this.state.selected === element.props.value,
                        ...element.props,
                        key: i,
                        onValid: this.onValid(),
                        disabled: this.props.disabled
                    }, element.props.children)
                );
            });

        }
    }

    public onValid = () => {
        if (this.props.onFieldValidation) {
            this.props.onFieldValidation(this.props.isValid)
        }
    }

    public getErrorMessage(): JSX.Element {
        return (
            <div className="requiredValueMsg" hidden={this.props.isValid}>{this.props.errorMessage}</div>
        )
    }

    public onRadioBtnClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        this.updateValue(event.currentTarget.value);
        if (this.props.onRadioBtnChange) {
            this.props.onRadioBtnChange(event)
        }
        if (event.currentTarget.value === 'SANS_CONTACT' && this.props.handleSansContactClicked) {
            this.props.handleSansContactClicked()
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
            <FormGroup className={this.props.className}>
                {this.props.longButtons ?
                    <Row className={"respectSize form-button-group-radio__long-button-container"}>
                        {this.renderButtons()}
                    </Row>
                    : <ButtonGroup>{this.renderButtons()}</ButtonGroup>}
                {this.getErrorMessage()}
            </FormGroup>
        )
    }
}

export default withFormsy<Props>(FormButtonGroupRadio);
