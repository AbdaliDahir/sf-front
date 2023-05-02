import * as React from "react";
import {FormattedMessage} from "react-intl";
import {CaseResource} from "../../../../model/CaseResource";
import * as moment from "moment";
import classnames from 'classnames';
import Row from "reactstrap/lib/Row";
import Col from "reactstrap/lib/Col";
import {Client} from "../../../../model/person";
import {Service} from "../../../../model/service";
import {connect} from "react-redux";
import {AppState} from "../../../../store";
import {ActsHistorySmsiModal} from "../../View/Elements/ActHistorySmsiModal";


interface Props {
    resources: CaseResource[]
    client: Client
    service: Service
}
interface State {
    collapse: boolean;
    eventsModalList: boolean[]
    openModal: boolean,
    resource?: CaseResource
}

class CommunicationsHistory extends React.Component<Props, State> {

    private DATETIME_FORMAT = process.env.REACT_APP_FASTR_DATETIME_FORMAT;

    constructor(props: Props) {
        super(props);
        this.state = {
            collapse: !props.resources.length,
            eventsModalList: Array(this.props.resources.length).fill(false),
            openModal: false,
            resource: undefined
        }
    }

    public toggleModalDetailAct = (resourceFromTable: CaseResource) => () => {
        this.setState({openModal: true, resource: resourceFromTable})
    };

    public shutModal = (isOpen: boolean) => {
        this.setState({openModal: isOpen})
    };

    private renderModal(): JSX.Element {
        const {resource} = this.state
        if (!resource || resource.resourceType !== 'ADG_SMSI') {
            return <React.Fragment/>
        }
        return <ActsHistorySmsiModal resource={resource} openModal={this.state.openModal} shutModal={this.shutModal}/>
    }

    public render(): JSX.Element {
        const {resources} = this.props;
        if (resources && resources.length) {
            return (
                <div className="timeline-container">
                    {this.renderModal()}
                    <ul className="vertical-timeline w-100 mb-0">
                        {
                            resources.map((act, index) => (
                                <li className={`${!act.valid ? "table-warning" : ""} "cursor-pointer"`}
                                    onClick={this.toggleModalDetailAct(act)} key={act.id}>
                                    <span
                                        className={classnames('v-timeline-icon', 'v-not', {'v-last': index === (resources.length - 1)}, {'v-first': index === 0})}/>
                                    <Row className={"mx-1 cursor-pointer"}>
                                        <Col sm={2}>
                                            {moment(act.creationDate).format(this.DATETIME_FORMAT)}
                                        </Col>
                                        <Col sm={6}>
                                            <FormattedMessage id={"act.history.label." + act.description}/>
                                        </Col>
                                        <Col sm={3}>
                                            {act.creator !== undefined && act.creator !== null ? act.creator.login : ""}
                                        </Col>
                                    </Row>
                                </li>
                            ))}
                    </ul>
                </div>
            )
        } else {
            return (<div className="text-muted text-center font-weight-bold font-size-m">
                <FormattedMessage id={"cases.history.comunication.none"}/>
            </div>)
        }
    }
}

const mapStateToProps = (state: AppState) => ({
    client: state.client.data,
    service: state.client.service
})

export default connect(mapStateToProps)(CommunicationsHistory)
