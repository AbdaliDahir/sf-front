import * as React from "react";
import Card from "reactstrap/lib/Card";
import {CardHeader, Collapse} from "reactstrap";
import CardBody from "reactstrap/lib/CardBody";
import {FormattedMessage} from "react-intl";
import * as moment from "moment";
import {isIE} from 'react-device-detect';
import {connect} from "react-redux";
import {CaseResource} from "../../../../model/CaseResource";
import {translate} from "../../../../components/Intl/IntlGlobalProvider";
import Loading from "../../../../components/Loading";
import EditRetentionDataV2 from "./EditRetentionDataV2";
import {AppState} from "../../../../store";
import {ACT_ID} from "../../../../model/actId";
import {LastRetentionModalSpecificIE} from "../../../Acts/Retention/LastRetentionModalSpecificIE";
import LastRetentionPopover from "../../../Acts/Retention/LastRetentionPopover";
import "./EditRetentionCardV2.scss"
import {renderTheRightPicto} from "../../Cases/List/pictoHandler";
import DateUtils from "../../../../utils/DateUtils";

interface Props {
    caseId: string
    lastResource: CaseResource | undefined,
    authorizations
    isEditable: boolean
    isExpanded: boolean
    isExpandable: boolean
}

interface State {
    openModal: boolean
    isExpanded: boolean
}

class EditRetentionCardV2 extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            openModal: false,
            isExpanded: this.props.isExpanded
        }
    }

    public getTwoDigitsTimeElement(num) {
        return ("0" + num).slice(-2)
    }

    public shutModal = (isOpen: boolean) => {
        this.setState({openModal: isOpen})
    }

    public openLastRetentionModalSpecificIE = () => {
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
                      id={"lastRetention"} onClick={(e)=>e.stopPropagation()}>
                    <FormattedMessage id="last retention"/> ({this.formatRetentionDate(retentionResource)} - {DateUtils.renderDuration(new Date().getTime() - new Date(retentionResource.creationDate).getTime())})
                </span>
                <LastRetentionPopover resourceId={retentionResource.id} target="lastRetention"/>
            </div>
        )
    }

    public renderLastRetentionDataIE = (retentionResource: CaseResource) => {
        return <div>
            <span onClick={() => this.openLastRetentionModalSpecificIE()}
                  style={{textDecoration: "underline", cursor: "pointer"}} className="font-weight-normal">
                <FormattedMessage id="last retention"/> ({this.formatRetentionDate(retentionResource)})
            </span>
        </div>
    }

    public toggle = () => {
        this.setState({
            isExpanded: !this.state.isExpanded
        })
    };

    public render(): JSX.Element {
        const {lastResource} = this.props;
        const idAct = !this.props.isEditable && lastResource ? lastResource.id : "";

        const displayRetentionCard = this.props.isEditable || (lastResource && DateUtils.daysBetween(new Date(lastResource.creationDate), new Date()) <= 30)

        return displayRetentionCard ? (
            <Card className="my-2">
                <CardHeader onClick={this.props.isExpandable ? this.toggle : undefined}
                            className={"edit_retention_card__header " + (this.props.isEditable ? "" : "readonly ") + (this.state.isExpanded ? "" : "rounded ")}>
                    <section>
                        {renderTheRightPicto("RETENTION_LIGHT")}
                        <span className={"ml-2"}>{translate.formatMessage({id: "retention.section.title"})}</span>
                    </section>
                    <section className={"d-flex "}>
                        {lastResource &&
                        <section className="d-flex justify-content-end mr-2">
                            {!isIE ?
                                this.renderLastRetentionData(lastResource)
                                : this.renderLastRetentionDataIE(lastResource)
                            }
                        </section>}
                        {this.props.isExpandable &&
                        <i className={`icon icon-white float-right  ${this.state.isExpanded ? 'icon-up' : 'icon-down'}`}/>
                        }
                    </section>
                </CardHeader>
                <Collapse isOpen={this.state.isExpanded}>
                    <CardBody className={"edit_retention_card__body"}>
                        <React.Suspense fallback={<Loading/>}>
                            <EditRetentionDataV2
                                disabled={!this.props.isEditable}
                                caseId={this.props.caseId}
                                idAct={idAct}/>
                        </React.Suspense>
                    </CardBody>
                </Collapse>

                {isIE && lastResource && this.state.openModal ?
                    <LastRetentionModalSpecificIE resourceId={lastResource?.id} openModal={this.state.openModal}
                                                  shutModal={this.shutModal}/> : <React.Fragment/>
                }
            </Card>
        ): <React.Fragment/>
    }
}

const mapStateToProps = (state: AppState, ownProps: Props) => ({
    authorizations: state.store.applicationInitialState.authorizations,
    lastResource: state.store.cases.casesList[ownProps.caseId]?.currentCase?.resources?.sort((r1, r2) => {
        return new Date(r2.creationDate).getTime() - new Date(r1.creationDate).getTime();
    })
        .find(
            r => "ACT_FASTR" === r.resourceType && ACT_ID.ADG_RETENTION === r.description)
});

export default connect(mapStateToProps)(EditRetentionCardV2)
