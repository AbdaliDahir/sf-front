import * as moment from "moment";
import * as React from "react";
import {FormattedMessage} from "react-intl";
import Col from "reactstrap/lib/Col";
import Row from "reactstrap/lib/Row";
import classnames from 'classnames';
import {ViewCaseEvent} from "../../../../model/ViewCaseEvent";
import {EventsHistoryModal} from "../../../Cases/View/Elements/EventsHistoryModal";


interface Props {
    events: ViewCaseEvent[]
}

interface State {
    collapse: boolean;
    eventsModalList: boolean[]
    active: boolean[]
}

export default class EventsHistoryV2 extends React.Component<Props, State> {

    private DATETIME_FORMAT = process.env.REACT_APP_FASTR_DATETIME_FORMAT;


    constructor(props: Props) {
        super(props);
        this.state = {
            collapse: false,
            eventsModalList: Array(this.props.events.length).fill(false),
            active: Array(this.props.events.length).fill(false)
        }
    }

    public toggleModal = (indexPopover: number) => () => {
        const popoverOpenListN = this.state.eventsModalList.slice();
        popoverOpenListN.fill(false);
        popoverOpenListN[indexPopover] = true;
        this.setState({eventsModalList: popoverOpenListN});
        this.toggleClassActive(indexPopover);
    };


    public initModals = () => {
        const popoverOpenListN = this.state.eventsModalList.slice();
        popoverOpenListN.fill(false);
        this.setState({eventsModalList: popoverOpenListN})

    };

    public toggleClassActive(index) {
        const tmp = [this.state.active.slice(0, index), !this.state.active[index], this.state.active.slice(index + 1)];
        const active = [].concat.apply([], tmp);
        this.setState({active});
    };

    public render(): JSX.Element {
        const {events} = this.props
        const {active} = this.state
        if (events) {
            return (
                <div className="timeline-container">
                    <ul className="vertical-timeline w-100 mb-0">
                        <Row>
                            <Col>
                                <label style={{fontWeight: "bold"}}><FormattedMessage id={"cases.history.event.creator.date"}/></label>
                            </Col>
                            <Col>
                                <label style={{fontWeight: "bold"}}><FormattedMessage id={"cases.history.event.creator.type"}/></label>
                            </Col>
                            <Col>
                                <label style={{fontWeight: "bold"}}><FormattedMessage id={"cases.history.event.creator.status"}/></label>
                            </Col>
                            <Col>
                                <label style={{fontWeight: "bold"}}><FormattedMessage id={"cases.history.event.creator.login"}/></label>
                            </Col>
                            <Col>
                                <label style={{fontWeight: "bold"}}><FormattedMessage id={"cases.history.event.creator.activity"}/></label>
                            </Col>
                            <Col>
                                <label style={{fontWeight: "bold"}}><FormattedMessage id={"cases.history.event.creator.position"}/></label>
                            </Col>
                        </Row>
                        {
                            events.map((event, index) => (
                                <li key={index}
                                    className={`${active[index] ? 'focusRow': ""} cursor-pointer text-left highLightRow`}
                                    id={"Modal" + index}
                                    onClick={this.toggleModal(index)}>
                                <span
                                    className={classnames('v-timeline-icon', 'v-not', {'v-last': index === (events.length - 1)}, {'v-first': index === 0})}/>
                                    <Row className={"mx-1"}>
                                        <Col sm={2}>
                                            {moment(event.date).format(this.DATETIME_FORMAT)}
                                        </Col>
                                        <Col sm={2}>
                                            <FormattedMessage id={"cases.events.type." + event.type}/>
                                        </Col>
                                        <Col sm={2}>
                                            {!!event.status ? event.type==="CREATE" ? "Créé" : <FormattedMessage id={`${event.status}`}/> : "" }
                                        </Col>
                                        <Col sm={2}>
                                            {!!event.author ? event.author.login : ""}
                                        </Col>
                                        <Col sm={2}>
                                            {!!event.author && !!event.author.activity ? event.author.activity.label : ""}
                                        </Col>
                                        <Col sm={2}>
                                            {!!event.author && !!event.author.position ? event.author.position.label : ""}
                                        </Col>
                                    </Row>
                                    <EventsHistoryModal events={event.fieldChanges}
                                                        event={event}
                                                        index={index}
                                                        isOpen={this.state.eventsModalList[index]}
                                                        notifyParentOnChange={this.initModals}/>
                                </li>
                            ))}
                    </ul>
                </div>
            );
        } else {
            return (<React.Fragment/>)
        }
    }
}