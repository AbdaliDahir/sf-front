import * as moment from "moment";
import * as React from "react";
import ReactDatePicker, {registerLocale} from "react-datepicker";
import {FormattedMessage} from "react-intl";
import {Col, Row} from "reactstrap";
import fr from "date-fns/locale/fr";

interface Props {
    onChange: (date: moment.Moment) => void
    startDate?: moment.Moment;
    endDate?: moment.Moment;
}

interface State {
    startDate?: moment.Moment;
    endDate?: moment.Moment;
}

// Register date local
registerLocale('fr', fr);

export default class DateRangePicker extends React.Component<Props, State> {

    public constructor(props: Props) {
        super(props);
        this.state = {
            startDate: props.startDate !== undefined ? props.startDate : undefined,
            endDate: props.endDate !== undefined ? props.endDate : undefined
        }
    }

    public handleChangeStart = (date: Date) => {
        this.setState({
            startDate: moment(date)
        }, () => this.props.onChange(moment(date)));
    };

    public handleChangeEnd = (date: Date) => {
        this.setState({
            endDate: moment(date)
        }, () => this.props.onChange(moment(date)));
    };

    public render(): JSX.Element {
        const {startDate : startDateFromState, endDate: endDateFromState} = this.state
        return (
            <Row>
                <Col md={6}>
                    <FormattedMessage id="component.datepicker.from"/>
                    <ReactDatePicker className="form-control"
                                     selected={startDateFromState ? startDateFromState.toDate() : startDateFromState}
                                     selectsStart
                                     startDate={startDateFromState ? startDateFromState.toDate() : startDateFromState}
                                     endDate={endDateFromState ? endDateFromState.toDate() : endDateFromState}
                                     onChange={this.handleChangeStart}
                    />
                </Col>
                <Col md={6}>
                    <FormattedMessage id="component.datepicker.to"/>
                    <ReactDatePicker className="form-control"
                                     selected={endDateFromState ? endDateFromState.toDate() : endDateFromState}
                                     selectsEnd
                                     startDate={startDateFromState ? startDateFromState.toDate() : startDateFromState}
                                     endDate={endDateFromState ? endDateFromState.toDate() : endDateFromState}
                                     onChange={this.handleChangeEnd}
                    />
                </Col>
            </Row>
        );
    }
}