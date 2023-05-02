import * as React from "react";
import Modal from "react-bootstrap/Modal";
import {FormattedMessage} from "react-intl";
import {Row} from "reactstrap";
import Col from "reactstrap/lib/Col";
import "../../View/ViewCase.scss"

import {translate} from "../../../../components/Intl/IntlGlobalProvider";
import {ViewEventFieldChange} from "../../../../model/ViewEventFieldChange";
import {ViewCaseEvent} from "../../../../model/ViewCaseEvent";
import * as moment from "moment";


interface Props {
    events?: ViewEventFieldChange[]
    index: number
    isOpen: boolean
    notifyParentOnChange: (index: number) => void,
    event?: ViewCaseEvent
}

interface State {
    historyModalIsOpen?: boolean
}


export class EventsHistoryModal extends React.Component<Props, State> {

    private DATETIME_FORMAT = "DD/MM/YYYY";

    constructor(props: Props) {
        super(props);
        this.state = {
            historyModalIsOpen: false
        };
    }


    public shouldComponentUpdate(nextProps: Readonly<Props>, nextState: Readonly<State>, nextContext: Readonly<void>): boolean {
        if (nextProps.isOpen !== this.state.historyModalIsOpen) {
            this.setState({
                historyModalIsOpen: nextProps.isOpen
            });
            return true;
        } else if (nextState.historyModalIsOpen === false && nextProps.isOpen) {
            this.setState({
                historyModalIsOpen: false
            });
            this.notifyParent();
            return true;
        } else {
            return false;
        }
    }

    public closeModal = () => {
        this.setState({
            historyModalIsOpen: false
        });
    };

    public notifyParent = () => {
        this.props.notifyParentOnChange(this.props.index);
    };

    public formatPreviousValue = (eventFieldChange: ViewEventFieldChange): string => {
        return this.formatChangeValue(eventFieldChange.previousValue, eventFieldChange)
    }

    public formatNextValue = (eventFieldChange: ViewEventFieldChange): string => {
        return this.formatChangeValue(eventFieldChange.nextValue, eventFieldChange)
    }

    public formatChangeValue = (changeValue: string | undefined, eventFieldChange: ViewEventFieldChange): string => {
        if (!changeValue || "null" === changeValue) {
            return "";
        }
        if ("DATE" === eventFieldChange.fieldType) {
            return moment(changeValue).format(this.DATETIME_FORMAT);
        }

        const key: string = ("ENUM" === eventFieldChange.fieldType ? eventFieldChange.fieldCode + "." : "") + changeValue;
        const label:string = translate.formatMessage({id: key});

        if (label === key) {
            return changeValue;
        } else {
            return label;
        }
    }

    public renderEventsHistory = () => {

        const events = this.props.events;
        if (events !== undefined && events !== null && events.length > 0) {
            return events.map((event, index) =>

                <Row key={index} className="border-bottom pt-2 pb-2">
                    <Col md="3"
                         className="text-center font-weight-bold">  <FormattedMessage id={""+event.label}/></Col>
                    <Col md="4" className={"text-center align-self-center"} style={{wordBreak: "break-word"}}>
                        {this.formatPreviousValue(event)}
                    </Col>
                    <Col md="5" className={"text-center align-self-center"} style={{wordBreak: "break-word"}}>
                        {this.formatNextValue(event)}
                    </Col>
                </Row>
            );
        }
        return "";
    }


    public render() {
        const {event} = this.props;
        return (

            <Modal show={this.state.historyModalIsOpen} onHide={this.closeModal} dialogClassName="lg" className={"text-smaller"}>
                <Modal.Header onHide={this.closeModal} className={"text-center font-weight-bold test-width"} closeButton>
                    {event?.type &&
                        <div className={"text-center font-weight-bold"}>
                            <span><FormattedMessage id={"acts.history.event.header"}/> : </span>
                            <span><FormattedMessage id={"cases.events.type." + event?.type}/> </span>
                            <span>du </span>
                        </div>
                    }
                    {event?.date &&
                        <div className={"text-center font-weight-bold"}>&nbsp;{moment(event?.date).format(process.env.REACT_APP_FASTR_DATETIME_FORMAT)}</div>
                    }
                </Modal.Header>
                <Modal.Body className="history_modal-body">
                    <Row className={"border-bottom  pb-2"}>
                        <Col md="3" className={"align-self-center"}/>
                        <Col md="4" className={"text-center font-italic font-weight-bold align-self-center"}>
                            <FormattedMessage id={"BEFORE"}/>
                        </Col>
                        <Col md="5" className={"text-center font-italic font-weight-bold align-self-center"}>
                            <FormattedMessage id={"AFTER"}/>
                        </Col>
                    </Row>
                    {this.renderEventsHistory()}

                </Modal.Body>
            </Modal>
        );
    }


}