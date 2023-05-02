import * as React from "react";


interface Props {
    color?: string;
    lg?: boolean
    children: JSX.Element[];
}

// tslint:disable:jsx-self-close
export default class Stepbar extends React.Component<Props, object> {

    public renderStepBar(): JSX.Element[] {
        return this.props.children.map((element, i) => {
            return element;
        });
    }


    public render(): JSX.Element {
        const {color} = this.props;
        return (
            <div className={`stepbar-${color} ${this.props.lg ? "stepbar-lg" : ""}`}>
                {this.renderStepBar()}
            </div>
        );
    }
}
