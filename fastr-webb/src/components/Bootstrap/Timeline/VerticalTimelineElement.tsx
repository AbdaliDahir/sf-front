import * as React from "react";

interface Props {
    color?: "primary" | "secondary" | "info" | "warning" | "danger" | "light" | "dark"
    icon?: string
    title?: string
    subtitle?: string
}

interface State {
    color: "primary" | "secondary" | "info" | "warning" | "danger" | "light" | "dark"
}

export default class VerticalTimelineElement extends React.Component<Props, State> {


    constructor(props: Props) {
        super(props);
        this.state = {
            color: props.color === undefined ? "secondary" : props.color
        }
    }

    public render(): JSX.Element {
        return (
            <React.Fragment>
                <div className={`timeline-badge bg-${this.state.color} d-flex justify-content-center`}><i
                    className={this.props.icon}/></div>
                <div className="card card-body timeline-panel">
                    <div className="timeline-heading">
                        <h4 className="timeline-title text-break">{this.props.title}</h4>
                        <p>
                            {this.props.subtitle ? <small className="text-muted"><i className="icon icon-clock"/> {this.props.subtitle}</small> : ""}
                        </p>
                    </div>
                    <div className="timeline-body">
                        <p>{this.props.children}</p>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}