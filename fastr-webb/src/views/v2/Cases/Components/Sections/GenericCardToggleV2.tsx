import * as React from "react";
import { Card, CardBody, CardHeader, Collapse, UncontrolledTooltip } from "reactstrap";
import { FormattedMessage } from 'react-intl'
import { renderTheRightPicto } from "../../List/pictoHandler";
import "./GenericCardToggleV2.scss"
import ErrorBoundary from "src/poc/ErrorBoundary";

interface Props {
    title: string,
    icon: string,
    extendedTitle?: JSX.Element,
    cardBodyClass?: string,
    isExpanded?: boolean,
    isExpandable?: boolean,
    cardHeaderClass?: string
    cardClass?: string
    casePicto?: string
    alertPicto?: string
    alertType?: string
    editableScalingPicto?: string
    whiteArrow?: boolean
    onToggle?: (bool) => void
    caseId?
    fromActiveCases?: boolean
}

interface State {
    isExpanded: boolean
}

export default class GenericCardToggleV2 extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isExpanded: undefined !== this.props.isExpanded ? this.props.isExpanded : true
        }
    }

    public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any) {
        if (undefined !== this.props.isExpanded && prevProps.isExpanded !== this.props.isExpanded) {
            this.setState({
                isExpanded: this.props.isExpanded
            })
        }
    }

    public toggle = () => {
        if (this.props.fromActiveCases && this.props.onToggle) {
            this.props.onToggle(!this.state.isExpanded)
        }
        this.setState({
            isExpanded: !this.state.isExpanded
        })
    };
    
    public renderIcon (icon : string) {
        if (icon) {
            const classList: string[] = icon.split(' ');
            for (const val of classList) {
                if (val === "icon-white") {
                    return <i className={`${icon} mr-2`}/>;
                }
            }
            return <i className={`icon-gradient ${icon} mr-2`}/>;
        }
        return
    }

    public render(): JSX.Element {
        const { isExpanded } = this.state;
        const { children, cardBodyClass, cardHeaderClass, cardClass, title, icon, casePicto, extendedTitle, whiteArrow, alertPicto, alertType, caseId } = this.props;
        const pictoToDisplay = casePicto ? renderTheRightPicto(casePicto) : undefined;
        const alertPictoToDisplay = alertPicto ? renderTheRightPicto(alertPicto) : undefined;
        const arrowColorToUse = whiteArrow ? 'icon-white' : 'icon-black';
        return (
            <ErrorBoundary>
                <Card className={"my-2 " + cardClass}>
                    <CardHeader className={cardHeaderClass ? cardHeaderClass : "d-flex justify-content-between"}
                        onClick={this.props.isExpandable ? this.toggle : undefined}>
                        <section className={(alertPictoToDisplay ? 'action-header d-flex justify-content-center align-items-center' : "")}>
                            {this.renderIcon(icon)}
                            {casePicto && <div className={"generic-card-toggle__picto"}>{pictoToDisplay}</div>}
                            <FormattedMessage id={title} />
                            {extendedTitle &&
                                <section className={"generic-card-toggle__extended-title"}>{extendedTitle}</section>
                            }
                            {alertPictoToDisplay && <div className={"generic-card-toggle__picto action-waiting ml-2"}>
                                <div id={alertType + caseId}>
                                    {alertPictoToDisplay}
                                </div>
                                <UncontrolledTooltip target={alertType + caseId}>
                                    {alertType === "scalingAlert" ?
                                        <FormattedMessage id={"cases.actions.consult.scaling.alert"} />
                                        : <FormattedMessage id={"cases.actions.consult.at.least.one.action"} />
                                    }

                                </UncontrolledTooltip>
                            </div>}
                        </section>
                        {this.props.isExpandable &&
                            <i className={`icon ${arrowColorToUse} float-right  ${isExpanded ? 'icon-up' : 'icon-down'}`} />
                        }
                    </CardHeader>
                    <Collapse isOpen={isExpanded}>
                        <CardBody className={cardBodyClass}>
                            {children}
                        </CardBody>
                    </Collapse>
                </Card>
            </ErrorBoundary>

        );
    }
}
