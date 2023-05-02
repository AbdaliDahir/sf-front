import * as React from "react";
import Label from "reactstrap/lib/Label";
import {FormattedMessage} from "react-intl";


export interface ValidationProps {
  validate?: boolean
  minChar?: number
  maxChar?: number
  currentLength: number
}

interface State {
  currentLength: number
}

class FormTextAreaInputValidation extends React.Component<ValidationProps, State> {
  public static defaultProps = {
    validate: false
  };

  public static getDerivedStateFromProps(nextProps: ValidationProps, prevState: State) {
    if (nextProps.currentLength !== prevState.currentLength) {
      return {currentLength: nextProps.currentLength};
    } else {
      return null;
    }
  }

  constructor(props: ValidationProps) {
    super(props);
    this.state = {
      currentLength: this.props.currentLength
    }
  }

  public componentDidUpdate(prevProps: ValidationProps, prevState: State) {
    if (this.props.currentLength !== undefined && prevProps.currentLength !== this.props.currentLength) {
      this.setState({currentLength: this.props.currentLength});
    }
  }


  public renderValidation(): JSX.Element {
    const {minChar, maxChar} = this.props;
    const {currentLength} = this.state;

    if (minChar !== undefined &&
        minChar !== null &&
        maxChar !== undefined &&
        maxChar !== null &&
        currentLength !== undefined &&
        currentLength !== null &&
        currentLength >= minChar &&
        currentLength <= maxChar) {
      const remainingChar: number = maxChar - currentLength;
      return (
          <small><FormattedMessage id="validation.message.counter"/>{remainingChar}/{maxChar}
          </small>
      )

    } else {
      return (<span/>)
    }

  }

  public render(): JSX.Element {
    const {validate} = this.props;

    if (!validate) {
      return (
          <span/>
      )
    } else {
      return (
          <Label for={"validation"}>
            {this.renderValidation()}
          </Label>

      )
    }
  }
}

export default FormTextAreaInputValidation;