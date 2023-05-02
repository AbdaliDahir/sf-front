import * as React from "react";
import {ReactElement} from "react";
import {Props as AccordeonElementProps} from "./AccordeonElement";

interface Props {
    parentName: string
    children: JSX.Element[]
}


export default class Accordeon extends React.Component<Props, object> {

    public render(): JSX.Element {
        const {parentName, children} = this.props;
        const childrenWithProps = React.Children.map(children,
            (child: ReactElement<AccordeonElementProps>, index: number) => React.cloneElement(child,
                {
                    ...child.props,
                    index: index.valueOf(),
                    parentName
                }));
        return (
            <div className="accordion" id="accordionExample">
                {childrenWithProps}
            </div>
        );
    }
}