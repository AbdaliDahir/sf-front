import * as React from "react";

interface Props {
    children: JSX.Element[]
    nobreak?: boolean
}

export default class VerticalTimeline extends React.Component<Props> {

    public invertEach(): JSX.Element[] {
        if (!this.props.nobreak) {
            return this.props.children.map((child, i) => {
                return i % 2 === 0 ? <li>{child}</li> : <li className="timeline-inverted">{child}</li>;
            })
        }
        else {
            return this.props.children.map((child, i) => {
                return <li key={i}>{child}</li>;
            })
        }
    }

    public render(): JSX.Element {
        return (
            <ul className={`v-timeline ${this.props.nobreak ? 'no-break' : ""}`}>
                {this.invertEach()}
            </ul>
        )
    }
}
