import * as moment from "moment";
import * as React from "react";
import { ChangeEvent } from "react";
import Col from "reactstrap/lib/Col";
import '../Css/clientMonitoring.css';
import Container from "reactstrap/lib/Container";
import Row from "reactstrap/lib/Row";
import { GesteCommercialBios } from "../../../model/TimeLine/GesteCommercialBios";
import { SOCO } from "../../../model/TimeLine/SOCO";
import EventTimeLineSynthetic from "../EventsTimeLine/EventTimeLineSynthetic";
import { FormattedMessage } from "react-intl";
import Switch from "../../../components/Bootstrap/Switch";
import {
    hideGCOInTimeLine,
    hideREGULInTimeLine,
    hideSOCOInTimeLine,
    showGCOInTimeLine,
    showREGULInTimeLine,
    showSOCOInTimeLine,
    setTimeLineRegularisation
} from "../../../store/actions";
import { connect } from "react-redux";
import { AppState } from "../../../store";

import { isAllowedAutorisation } from "../../../utils/AuthorizationUtils";
import FixeToggleButton from "./FixeToggleButton"
import { eventRegulToTimeLineRegulMapper } from "../tools/time_regularisation_mapper";
import { TimeLineRegularisationItem } from "src/model/TimeLine/Regularisation";
import { ActiviteRegul } from "src/model/service";


interface Props {
    discountMobile: GesteCommercialBios[]
    showGCOInTimeLine: () => void
    hideGCOInTimeLine: () => void
    showSOCOInTimeLine: () => void
    hideSOCOInTimeLine: () => void
    showREGULInTimeLine: () => void
    hideREGULInTimeLine: () => void
    setTimeLineRegularisation: (regularisations: TimeLineRegularisationItem[]) => void
    retrieveCommercialSolicitation: () => void
    retrieveData: () => void
    getAdgDetails: () => void
    adgRegul
    actionRegul
    showGCO: boolean
    showSOCO: boolean
    showREGUL: boolean
    isFixe: boolean
    commercialSolicitation: SOCO | undefined
    authorizations: Array<string>
    gcoGcu,
    activRegul: ActiviteRegul[],
    timeLineRegularisations: TimeLineRegularisationItem[]
}

class TimeLineSynthetic extends React.Component<Props> {

    public changeSwitchStatus = (event: ChangeEvent<HTMLInputElement>) => {
        const { checked, name } = event.currentTarget;
        switch (name) {
            case "GCO":
                checked ? this.props.showGCOInTimeLine() : this.props.hideGCOInTimeLine();
                break
            case "SOCO":
                if (checked) {
                    this.props.retrieveCommercialSolicitation()
                    this.props.showSOCOInTimeLine()
                } else {
                    this.props.hideSOCOInTimeLine()
                }
                break
            case "REGULANDGESTESCO":
                if (checked) {
                    this.props.retrieveData()
                    this.props.showREGULInTimeLine()
                } else {
                    this.props.hideREGULInTimeLine()
                }
                break
        }
    }

    public renderToggleButton = () => {
        const { discountMobile } = this.props;
        if (this.props.isFixe) {
            const fixeToggleNames = ["REGULANDGESTESCO", "SOCO"]
            const fixeToggleParams = {
                REGULANDGESTESCO: {
                    id: "REGULANDGESTESCO",
                    isAuthorized: isAllowedAutorisation(this.props.authorizations, "is_access_regul_suivi_commercial"),
                    color: "success",
                    checked: this.props.showREGUL,
                    thickness: "xs",
                    label: "timeline.regul"
                },
                SOCO: {
                    id: "SOCO",
                    isAuthorized: isAllowedAutorisation(this.props.authorizations, "is_access_SOCO"),
                    color: "success",
                    checked: this.props.showSOCO,
                    thickness: "xs",
                    label: "timeline.commercialSolicitation"
                }
            }
            return <React.Fragment>
                {fixeToggleNames.map((name, index) => {
                    return <FixeToggleButton key={index} params={fixeToggleParams[name]}
                        changeSwitchStatus={this.changeSwitchStatus} />
                })}
            </React.Fragment>
        } else {
            if (this.props.authorizations && this.props.authorizations.indexOf('is_access_SOCO') > -1) {
                return (
                    <div>
                        <Container>
                            <Row className={"totalDiscount"}>
                                <Col xs={5}>
                                    {this.props.showGCO ?
                                        <span style={{ fontWeight: "bold" }}><FormattedMessage
                                            id={"timeline.title"} />{discountMobile[0] ? discountMobile[0].montantCumul : 0}<FormattedMessage
                                                id={"euro"} /></span> : ""}
                                </Col>
                                <Col xs={3} >
                                    <Row>
                                        <Col className="switch-container">
                                            <Switch className="switch-synth" name={"GCO"} id={"GCO"}
                                                color={"success"}
                                                thickness={"xs"}
                                                onChange={this.changeSwitchStatus} checked={this.props.showGCO} />
                                            <small className={"goABitUp"}><FormattedMessage id={"discount"} /></small>
                                        </Col>
                                    </Row>
                                </Col>

                               
                                <Col xs={4}>
                                    <Row>
                                        <Col className="switch-container">
                                            <Switch className="switch-synth" name={"SOCO"} id={"SOCO"}
                                                color={"success"}
                                                thickness={"xs"}
                                                onChange={this.changeSwitchStatus} checked={this.props.showSOCO} />

                                            <small className={"goABitUp"}><FormattedMessage
                                                id={"timeline.commercialSolicitation"} /></small>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>

                        </Container>
                    </div>
                )
            } else {
                return (
                    <div>
                        <Container>
                            <Row className={"totalDiscount"}>
                                <Col>
                                    <Row>
                                        <Col><Switch name={"GCO"} id={"GCO"}
                                            color={"success"}
                                            thickness={"xs"}
                                            onChange={this.changeSwitchStatus} checked={this.props.showGCO} />
                                        </Col>
                                        <Col>
                                            <small><FormattedMessage id={"discount"} /></small>
                                        </Col>
                                        <Col className={"text-center"}>
                                            {this.props.showGCO ?
                                                <span style={{ fontWeight: "bold" }}><FormattedMessage
                                                    id={"timeline.title"} />{discountMobile[0] ? discountMobile[0].montantCumul : 0}<FormattedMessage
                                                        id={"euro"} /></span> : ""}
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Container>
                    </div>
                )
            }
        }
    }

    public render(): JSX.Element {
        const { discountMobile, commercialSolicitation, adgRegul, gcoGcu, actionRegul, activRegul } = this.props;
        // tslint:disable-next-line:no-any
        let eventToDisplay: any[] = []
        if (!this.props.isFixe) {
            eventToDisplay = eventToDisplay.concat(this.props.showGCO ? discountMobile : [])
        }
        eventToDisplay = eventToDisplay.concat(this.props.showSOCO && commercialSolicitation?.sms ? commercialSolicitation!.sms : [])
        eventToDisplay = eventToDisplay.concat(this.props.showSOCO && commercialSolicitation?.emails ? commercialSolicitation!.emails : [])
        eventToDisplay = eventToDisplay.concat(this.props.showREGUL && adgRegul ? adgRegul : []);
        eventToDisplay = eventToDisplay.concat(this.props.showREGUL && actionRegul ? actionRegul : []);
        eventToDisplay = eventToDisplay.concat(this.props.showREGUL && activRegul ? activRegul : []);
        eventToDisplay = eventToDisplay.concat(this.props.showREGUL && gcoGcu ? gcoGcu : []);
        eventToDisplay.sort((a, b): number => {
            const dateA = a.sendDate || a.dateToDisplay || a.creationOfferServiceDate || a.creationDate || a.actDate || (a.actdate && a.actdate.split(' ')[0].replaceAll('/', '-').split('-').reverse().join('-'))
            const dateB = b.sendDate || b.dateToDisplay || b.creationOfferServiceDate || b.creationDate || b.actDate || (b.actdate && b.actdate.split(' ')[0].replaceAll('/', '-').split('-').reverse().join('-'))
            return moment(dateA).valueOf() - moment(dateB).valueOf();
        });
        const list = eventRegulToTimeLineRegulMapper(eventToDisplay);
        if (this.props.timeLineRegularisations.length < list.length) {
            this.props.setTimeLineRegularisation(eventRegulToTimeLineRegulMapper(eventToDisplay));
        }
        return (
            <div className={"hideOverflow mt-2"}>
                {this.renderToggleButton()}
                {eventToDisplay.length > 0 ?
                    <div className="timeline timeline-dark go-up-timeline timeline-synt hideOverflow">
                        <ol className="olSyntheticView text-center mt-3">
                            {eventToDisplay.length < 3 ?
                                <li className="timeline-element timeline-element-synthetic" /> : ""}
                            <li className="timeline-element timeline-element-synthetic" />
                            {eventToDisplay.slice(0, eventToDisplay.length).map((object, i) =>
                                <EventTimeLineSynthetic
                                    obj={object}
                                    loadingFunction={this.props.getAdgDetails}
                                    key={i} />)}
                            <li className="timeline-element timeline-element-synthetic" />
                            <li className="timeline-element timeline-element-synthetic" />
                            <li className="timeline-element timeline-element-synthetic" />
                            {eventToDisplay.length < 3 ?
                                <li className="timeline-element timeline-element-synthetic" /> : ""}
                        </ol>
                    </div>
                    :
                    <div className="timeline timeline-dark">
                        <ol className="olSyntheticView text-center go-up-timeline">
                            <li className="timeline-element timeline-element-synthetic" />
                            <li className="timeline-element timeline-element-synthetic" />
                            <li className="timeline-element timeline-element-synthetic" />
                            <li className="timeline-element timeline-element-synthetic" />
                            <li className="timeline-element timeline-element-synthetic" />
                            <li className="timeline-element timeline-element-synthetic" />
                            <li className="timeline-element timeline-element-synthetic" />
                            <li className="timeline-element timeline-element-synthetic" />
                        </ol>
                    </div>
                }
            </div>
        )
    }
}

const mapStateToProps = (state: AppState) => {
    return {
        showGCO: state.persisted.showGCO,
        showSOCO: state.persisted.showSOCO,
        showREGUL: state.persisted.showREGUL,
        authorizations: state.authorization.authorizations,
        timeLineRegularisations: state.timeLine.regularisations
    }
}

const mapDispatchToProps = {
    showGCOInTimeLine,
    hideGCOInTimeLine,
    showSOCOInTimeLine,
    hideSOCOInTimeLine,
    showREGULInTimeLine,
    hideREGULInTimeLine,
    setTimeLineRegularisation
};

export default connect(mapStateToProps, mapDispatchToProps)(TimeLineSynthetic)
