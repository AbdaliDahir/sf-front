import * as React from "react";

export interface Props {
    name: string;
    parentName?: string;
    index?: number;
    isExpanded?: boolean
}

interface State {
    isExpanded: boolean;
}

export default class AccordeonElement extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        const {isExpanded} = this.props;
        this.state = {
            isExpanded: isExpanded !== undefined ? isExpanded : false
        }
    }

    public toogleElement = () => () => {
        this.setState({
            isExpanded: !this.state.isExpanded
        })
    };

    public render(): JSX.Element {
        const {parentName, index, name, children} = this.props;
        const {isExpanded} = this.state;
        return (
            <div className="card">
                <div className="card-header" id={"heading" + parentName + index}>
                    <h5 className="mb-0">
                        <button className={"btn btn-link " + (isExpanded ? "" : "collapsed") } type="button" data-toggle="collapse"
                                data-target={"#collapse" + parentName + index}
                                aria-expanded={isExpanded}
                                onClick={this.toogleElement()}
                                aria-controls={"collapse" + parentName + index}>
                            {name}
                        </button>
                    </h5>
                </div>

                <div id={"collapse" + parentName + index} className={"collapse " + (isExpanded ? "show": "")}
                     aria-labelledby={"heading" + parentName + index}
                     data-parent={"#" + parentName}>
                    <div className="card-body">
                        {children}
                    </div>
                </div>
            </div>
        );
    }
}