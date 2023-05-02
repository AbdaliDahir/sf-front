import * as React from "react";
import Card from "reactstrap/lib/Card";
import {CardHeader} from "reactstrap";
import Row from "reactstrap/lib/Row";
import Col from "reactstrap/lib/Col";
import {translate} from "../../../components/Intl/IntlGlobalProvider";
import CardBody from "reactstrap/lib/CardBody";
import Loading from "../../../components/Loading";
import {CaseResource} from "../../../model/CaseResource";
import {FormattedMessage} from "react-intl";
import LastRetentionPopover from "./LastRetentionPopover";
import * as moment from "moment";
import EditRetentionData from "./EditRetentionData";
import {isIE} from 'react-device-detect';
import {LastRetentionModalSpecificIE} from "./LastRetentionModalSpecificIE";
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

class EditRetentionCard extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            openModal: false,
        }
    }

    public getTwoDigitsTimeElement(number) {
        return ("0" + number).slice(-2)
    }

    public shutModal = (isOpen: boolean) => {
        this.setState({openModal: isOpen})
    }

    public openLastRetentionModalSpecificIE = () =>  {
        this.setState({openModal: true})
    }

    public formatRetentionDate(retentionResource) {
        const date = moment(retentionResource.creationDate)
        return this.getTwoDigitsTimeElement(date.date()) + "/" + this.getTwoDigitsTimeElement(date.month() + 1)
            + "/" + date.year().toString().substr(-2) + " - " + this.getTwoDigitsTimeElement(date.hour())
            + ":" + this.getTwoDigitsTimeElement(date.minute())
    }

    public renderLastRetentionData = (retentionResource: CaseResource) => {
        return (
            <div>
                <span style={{textDecoration: "underline", cursor: "pointer"}} className="font-weight-normal"
                      id={"lastRetention"}>
                    <FormattedMessage id="last retention"/> ({this.formatRetentionDate(retentionResource)})
                </span>
                <LastRetentionPopover resourceId={retentionResource.id} target="lastRetention"/>
            </div>
        )
    }

    public renderLastRetentionDataIE = (retentionResource: CaseResource) => {
        return <div>
            <span onClick={() => this.openLastRetentionModalSpecificIE()} style={{textDecoration: "underline", cursor: "pointer"}} className="font-weight-normal">
                <FormattedMessage id="last retention"/> ({this.formatRetentionDate(retentionResource)})
            </span>
        </div>
    }

    public render(): JSX.Element {
        const {lastResource} = this.props;
        const autoAssignSpecific = (this.props.authorizations.indexOf("ADG_RETENTION") !== -1) && this.props.updateMode && this.props.isFromAutoAssign;
        const idAct = autoAssignSpecific && lastResource ? lastResource.id : "";
        return (
            <Card className="mt-3 mb-3">
                <CardHeader>
                    <Row>
                        <Col md={5}>
                            <i className={"icon-gradient icon-document mr-2"}/>
                            <span>{translate.formatMessage({id: "retention.section.title"})}</span>
                        </Col>
                        {lastResource &&
                        <Col md={7} className="d-flex justify-content-end">
                            {!isIE ?
                                this.renderLastRetentionData(lastResource)
                                : this.renderLastRetentionDataIE(lastResource)
                            }
                        </Col>}
                    </Row>
                </CardHeader>
                <CardBody>
                    <React.Suspense fallback={<Loading/>}>
                        <EditRetentionData context={"ADGInsideCase"} idAct={idAct}/>
                    </React.Suspense>
                </CardBody>
            {isIE && lastResource && this.state.openModal ?
                <LastRetentionModalSpecificIE resourceId={lastResource?.id} openModal={this.state.openModal} shutModal={this.shutModal}/> : <React.Fragment/>
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

export default connect(mapStateToProps)(EditRetentionCard)
