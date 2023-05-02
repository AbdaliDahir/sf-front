import {Button} from "reactstrap";
import * as React from 'react';

interface Props {
  selectFilterFn: (e) => void
  name: string
  count: number
}

interface State {
  isSelected: boolean
}

export default class FaceButton extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      isSelected: false
    }
  }

  public onClick = (e) => {
    this.props.selectFilterFn(e)
    this.setState(prevstate => ({
      isSelected: !prevstate.isSelected
    }))
  }

  public renderButton(): JSX.Element {
    if (this.state.isSelected) {
      return (
        <Button close aria-label="Cancel" name={this.props.name} onClick={this.onClick}>
          <span aria-hidden>&ndash;</span>
        </Button>
      )
    }
    return (
      <Button close name={this.props.name} onClick={this.onClick} />
    )
  }

  public render() {
    return (
      <span>{this.renderButton()}<a onClick={this.onClick}>{`${this.props.name} (${this.props.count})`}</a></span>
    );
  }
}
