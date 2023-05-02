import * as React from "react";
import Card from "reactstrap/lib/Card";
import {CardHeader} from "reactstrap";
import Row from "reactstrap/lib/Row";
import Col from "reactstrap/lib/Col";
import {translate} from "../../../components/Intl/IntlGlobalProvider";
import {CaseResource} from "../../../model/CaseResource";
import Loading from "../../../components/Loading";
import CardBody from "reactstrap/lib/CardBody";
import AntiChurnData from "./AntiChurnData";
import {isIE} from "react-device-detect";
import * as moment from "moment";
import {FormattedMessage} from "react-intl";
import LastAntiChurnPopover from "./LastAntiChurnPopover";
import LastAntiChurnModalSpecificIE from "./LastAntiChurnModalSpecificIE";
import {AppState} from "../../../store";
import {connect} from "react-redux";

interface Props {
    lastResource?: CaseResource | undefined,
    updateMode
    isFromAutoAssign
    authorizations
}

interface State {
    openModal: boolean
}

class AntiChurnCard extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            openModal: false,
        }
    }
    public getTwoDigitsTimeElement(num) {
        return ("0" + num).slice(-2)
    }

    public shutModal = (isOpen: boolean) => {
        this.setState({openModal: isOpen})
    }

    public openLastAntiChurnModalSpecificIE = () =>  {
        this.setState({openModal: true})
    }

    public formatAntiChurnDate(antiChurnResource) {
        const date = moment(antiChurnResource.creationDate)
        return this.getTwoDigitsTimeElement(date.date()) + "/" + this.getTwoDigitsTimeElement(date.month() + 1)
            + "/" + date.year().toString().substr(-2) + " - " + this.getTwoDigitsTimeElement(date.hour())
            + ":" + this.getTwoDigitsTimeElement(date.minute())
    }

    public renderLastAntiChurnData = (antiChurnResource: CaseResource) => {
        return (
            <div>
                <span style={{textDecoration: "underline", cursor: "pointer"}} className="font-weight-normal"
                      id={"lastAntiChurn"}>
                    <FormattedMessage id="last.antichurn"/> ({this.formatAntiChurnDate(antiChurnResource)})
                </span>
                <LastAntiChurnPopover resourceId={antiChurnResource.id} target="lastAntiChurn"/>
            </div>
        )
    }

    public renderLastAntiChurnDataIE = (antiChurnResource: CaseResource) => {
        return <div>
            <span onClick={() => this.openLastAntiChurnModalSpecificIE()} style={{textDecoration: "underline", cursor: "pointer"}} className="font-weight-normal">
                <FormattedMessage id="last.antichurn"/> ({this.formatAntiChurnDate(antiChurnResource)})
            </span>
        </div>
    }

    public render(): JSX.Element {
        const {lastResource} = this.props;
        const autoAssignSpecific = (this.props.authorizations.indexOf("ADG_ANTICHURN") !== -1) && this.props.updateMode && this.props.isFromAutoAssign;
        const idAct = autoAssignSpecific && lastResource ? lastResource.id : "";
        return (
            <Card className="mt-3 mb-3">
                <CardHeader>
                    <Row>
                        <Col md={5}>
                            <i className={"icon-gradient icon-document mr-2"}/>
                            <span>{translate.formatMessage({id: "antichurn.section.title"})}</span>
                        </Col>
                        {lastResource &&
                        <Col md={7} className="d-flex justify-content-end">
                            {!isIE ?
                                this.renderLastAntiChurnData(lastResource)
                                : this.renderLastAntiChurnDataIE(lastResource)
                            }
                        </Col>}
                    </Row>
                </CardHeader>
                <CardBody>
                    <React.Suspense fallback={<Loading/>}>
                        <AntiChurnData idAct={idAct}/>
                    </React.Suspense>
                </CardBody>
                {isIE && lastResource && this.state.openModal ?
                    <LastAntiChurnModalSpecificIE resourceId={lastResource?.id} openModal={this.state.openModal} shutModal={this.shutModal}/> : <React.Fragment/>
                }
            </Card>
        )
    }
}

const mapStateToProps = (state: AppState) => ({
    updateMode: state.casePage.updateMode,
    isFromAutoAssign: state.casePage.isFromAutoAssign,
    authorizations: state.authorization.authorizations
});

export default connect(mapStateToProps)(AntiChurnCard)
