import * as React from "react";
import Card from "reactstrap/lib/Card";
import {CardHeader, Collapse} from "reactstrap";
import CardBody from "reactstrap/lib/CardBody";
import {isIE} from "react-device-detect";
import * as moment from "moment";
import {FormattedMessage} from "react-intl";
import {connect} from "react-redux";
import {CaseResource} from "../../../../model/CaseResource";
import {AppState} from "../../../../store";
import {translate} from "../../../../components/Intl/IntlGlobalProvider";
import Loading from "../../../../components/Loading";
import AntiChurnDataV2 from "./AntiChurnDataV2";
import {LastAntiChurnModalSpecificIEV2} from "./LastAntiChurnModalSpecificIEV2";
import {LastAntiChurnPopoverV2} from "./LastAntiChurnPopoverV2";
import {ACT_ID} from "../../../../model/actId";
import "./AntiChurnCardV2.scss"
import {renderTheRightPicto} from "../../Cases/List/pictoHandler";

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

class AntiChurnCardV2 extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            openModal: false,
            isExpanded: this.props.isExpanded
        }
    }

    public toggle = () => {
        this.setState({
            isExpanded: !this.state.isExpanded
        })
    };

    public getTwoDigitsTimeElement(num) {
        return ("0" + num).slice(-2)
    }

    public shutModal = (isOpen: boolean) => {
        this.setState({openModal: isOpen})
    }

    public openLastAntiChurnModalSpecificIE = () => {
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
                      id={"lastAntiChurn"} onClick={(e)=>e.stopPropagation()}>
                    <FormattedMessage id="last.antichurn"/> ({this.formatAntiChurnDate(antiChurnResource)})
                </span>
                <LastAntiChurnPopoverV2 resourceId={antiChurnResource.id} target="lastAntiChurn"/>
            </div>
        )
    }

    public renderLastAntiChurnDataIE = (antiChurnResource: CaseResource) => {
        return <div>
            <span onClick={() => this.openLastAntiChurnModalSpecificIE()}
                  style={{textDecoration: "underline", cursor: "pointer"}} className="font-weight-normal">
                <FormattedMessage id="last.antichurn"/> ({this.formatAntiChurnDate(antiChurnResource)})
            </span>
        </div>
    }

    public render(): JSX.Element {
        const {lastResource} = this.props;
        const idAct = !this.props.isEditable && lastResource ? lastResource.id : "";

        return this.props.isEditable || lastResource ? (
            <div className="my-2">
                <Card>
                    <CardHeader onClick={this.props.isExpandable ? this.toggle : undefined}
                                className={"edit_antichurn_cardV2__header " + (this.state.isExpanded ? "" : "rounded")}>
                        <section>
                            {renderTheRightPicto("ANTI_CHURN_LIGHT")}
                            <span className={"ml-2"}>{translate.formatMessage({id: "antichurn.section.title"})}</span>
                        </section>
                        <section  className="d-flex">
                            {lastResource &&
                            <section className="d-flex justify-content-end mr-2">
                                {!isIE ?
                                    this.renderLastAntiChurnData(lastResource)
                                    : this.renderLastAntiChurnDataIE(lastResource)
                                }
                                {isIE && lastResource && this.state.openModal ?
                                    <LastAntiChurnModalSpecificIEV2 resourceId={lastResource?.id} openModal={this.state.openModal}
                                                                    shutModal={this.shutModal}/> : <React.Fragment/>
                                }
                            </section>}
                            {this.props.isExpandable &&
                            <i className={`icon icon-white float-right  ${this.state.isExpanded ? 'icon-up' : 'icon-down'}`}/>
                            }
                        </section>
                    </CardHeader>
                    <Collapse isOpen={this.state.isExpanded}>
                        <CardBody>
                            <React.Suspense fallback={<Loading/>}>
                                <AntiChurnDataV2 caseId={this.props.caseId} disabled={!this.props.isEditable} idAct={idAct}/>
                            </React.Suspense>
                        </CardBody>
                    </Collapse>
                </Card>
            </div>
        ): <React.Fragment/>
    }
}

const mapStateToProps = (state: AppState, ownProps: Props) => ({
    authorizations: state.store.applicationInitialState.authorizations,
    lastResource: state.store.cases.casesList[ownProps.caseId]?.currentCase?.resources?.sort((r1, r2) => {
        return new Date(r2.creationDate).getTime() - new Date(r1.creationDate).getTime();
    })
        .find(
            r => "ACT_FASTR" === r.resourceType && ACT_ID.ADG_ANTICHURN === r.description)
});

export default connect(mapStateToProps)(AntiChurnCardV2)
