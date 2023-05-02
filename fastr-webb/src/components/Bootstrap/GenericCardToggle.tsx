import * as React from "react";
import {Card, CardBody, CardHeader, Collapse} from "reactstrap";
import {FormattedMessage} from 'react-intl'

interface Props {
    title: string,
    icon: string,
    cardBodyClass?: string,
    isExpanded?: boolean,
    headerContent?: any,
    cardHeaderClass?: string
}

interface State {
    isExpanded: boolean
}

export default class GenericCardToggle extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isExpanded: undefined !== this.props.isExpanded ? this.props.isExpanded : true
        }
    }

    public toggle = () => {
        this.setState({
            isExpanded: !this.state.isExpanded
        })
    };

    public render(): JSX.Element {
        const {isExpanded} = this.state;
        const {title, children, icon, cardBodyClass ,cardHeaderClass, headerContent} = this.props;
        return (
            <Card className="my-2">
                <CardHeader className={cardHeaderClass ? cardHeaderClass :"justify-between-and-center" }
                            onClick={this.toggle} >
                    {icon && <i className={`icon-gradient ${icon} mr-2`}/>}
                    <FormattedMessage id={title}/>
                    {headerContent}
                    <i className={`icon icon-black float-right  ${isExpanded ? 'icon-up' : 'icon-down'}`} />
                </CardHeader>
                <Collapse isOpen={isExpanded}>
                    <CardBody className={cardBodyClass}>
                        {children}
                    </CardBody>
                </Collapse>
            </Card>
        );
    }
}
