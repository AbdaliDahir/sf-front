import * as React from "react";
import {FormattedMessage} from "react-intl";
import Col from "reactstrap/lib/Col";
import Row from "reactstrap/lib/Row";
import Label from "reactstrap/lib/Label";
import {Case} from "../../../../model/Case";
import {Button, CardBody} from "reactstrap";
import {RouteComponentProps, withRouter} from "react-router";
import {translate} from "../../../../components/Intl/IntlGlobalProvider";
import {CaseCategory} from "../../../../model/CaseCategory";
import {retrieveLastMandatoryResources} from "../../../../utils/CaseUtils";
import {ACT_ID} from "../../../../model/actId";
import CaseNoteSummary from "./CaseNoteSummary";
import SelectedCaseQualification from "./SelectedCaseQualification";
import {compose} from "redux";
import {connect} from "react-redux";
import {AppState} from "../../../../store";
import {pushCaseToRecentCasesV2} from "../../../../store/actions/v2/case/RecentCasesActions";
import UXUtils from "../../../../utils/UXUtils";
import RetentionDataSummary from "./RetentionDataSummary";
import AntichurnDataSummary from "./AntichurnDataSummary";
import {ApplicationMode} from "../../../../model/ApplicationMode";

interface Props {
    case: Case
    fromModalMatchingCase?: boolean
    idService?: string
    authorizations
    pushCaseToRecentCasesV2
    handleReprendre?: (caseId: string) => void
    sessionIsFrom: string
}

interface State {
    showAllNotes: boolean,
    isAddNoteModalOpen: boolean
}

class SelectedCaseSummaryV2 extends React.Component<Props & RouteComponentProps, State> {

    constructor(props) {
        super(props);
        this.state = {
            showAllNotes: false,
            isAddNoteModalOpen: false
        }
    }

    public renderNotes = () => {
        const notes = this.props.case.notes ? (this.state.showAllNotes ? this.props.case.notes : this.props.case.notes.slice(0, 3)) : undefined
        const notesElements = notes ? notes.map(element => {
            return <CaseNoteSummary caseNote={element}/>
        }) : <React.Fragment/>
        return (
            <React.Fragment>
                {notes ?
                    <Row>
                        <Col md={7}>
                            <strong>
                                <Label>
                                    <FormattedMessage id="Derniers contacts clients"/>
                                </Label>
                            </strong>
                        </Col>
                        {this.props.case.notes?.length > 3 && <Col md={5} className="d-flex justify-content-end">
                            <strong>
                                <a onClick={this.showMoreNotes}>
                                <span style={{textDecoration: "underline", cursor: "pointer"}}
                                      className="font-weight-normal"
                                      id={"lastRetention"}>
                                    {this.state.showAllNotes ?
                                        <FormattedMessage id="cases.list.recent.single.case.note.less"/> :
                                        <FormattedMessage id="cases.list.recent.single.case.note.more"/>}
                                    {this.props.case.notes?.length}
                                </span>
                                </a>
                            </strong>
                        </Col>}
                    </Row>
                    :
                    <React.Fragment/>
                }
                {notesElements}
            </React.Fragment>
        )
    }

    public showMoreNotes = () => {
        this.setState({
            showAllNotes: !this.state.showAllNotes,
        });
    }

    public componentDidUpdate = (prevProps) => {
        if (this.props.case.caseId !== prevProps.case.caseId) {
            this.setState({
                showAllNotes: false
            });
        }
    }
    public handleReprendreClick = async () => {
        if (this.props.handleReprendre) {
            this.props.handleReprendre(this.props.case.caseId);
        }
    }

    private filterCasesForDISRC = ():boolean=>{
        if(this.props.sessionIsFrom === ApplicationMode.DISRC ){
            return this.props.case.category !== "SCALED"
        }
        return true;
    }

    private renderMandatoryAdgs = (): JSX.Element => {
        const lastMandatoryResources = retrieveLastMandatoryResources(this.props.case);
        if (!lastMandatoryResources || 0 === lastMandatoryResources.size) {
            return <React.Fragment/>
        }
        return (
            <React.Fragment>
                {this.props.authorizations.includes(ACT_ID.ADG_RETENTION) &&
                <RetentionDataSummary lastRetentionResource={lastMandatoryResources.get(ACT_ID.ADG_RETENTION)}/>}

                {this.props.authorizations.includes(ACT_ID.ADG_ANTICHURN) &&
                <AntichurnDataSummary caseResource={lastMandatoryResources.get(ACT_ID.ADG_ANTICHURN)}/>}
            </React.Fragment>
        )
    }

    public render(): JSX.Element {
        const {
            case: {
                caseId,
                processingConclusion,
                qualification,
                themeQualification,
                status,
                clientRequest,
                category
            }
        } = this.props;
        return (
            <div>
                <CardBody>
                    <Row>
                        <Col md={10}>
                            <h4>
                                <FormattedMessage id="cases.list.recent.single.case.description"/>
                            </h4>
                        </Col>
                        <Col md={2} className={"d-flex justify-content-end"}>
                            {
                                this.props.case.status !== "CLOSED" && (this.filterCasesForDISRC()) &&
                                <Button id="selectedCase.update.redirect.id" color="primary"
                                        onClick={this.handleReprendreClick} >
                                    <FormattedMessage id={"cases.list.recent.case.reprendre"}/>
                                </Button>
                            }
                        </Col>
                    </Row>
                    <Row className="mt-4">
                        <Col md={4}>
                            <p>
                                <span> <strong><FormattedMessage id="cases.get.details.title"/></strong></span>
                                <br/> <span onClick={UXUtils.copyValueToClipboard} className={"hover-bg-light cursor-pointer"}>{caseId}</span>
                            </p>
                            {category !== CaseCategory.SCALED ?
                                <p>
                                    <strong><FormattedMessage id="cases.create.conclusion"/></strong>
                                    <br/> {processingConclusion ? processingConclusion : ""}
                                </p>
                                : <React.Fragment/>}
                            <p>
                                <strong><FormattedMessage id="cases.get.details.category"/></strong>
                                <br/>
                                {category ? translate.formatMessage({id: category}) : "Immédiat"}
                            </p>
                            <p>
                                <strong><FormattedMessage id="cases.get.details.status"/></strong>
                                <br/> <FormattedMessage id={status}/>
                            </p>
                        </Col>

                        <Col md={8}>
                            <strong>
                                <Label>
                                    <FormattedMessage id="cases.list.recent.single.case.qualification"/>
                                </Label>
                            </strong>

                            <SelectedCaseQualification motifTags={qualification.tags}
                                                       themeTags={themeQualification ? themeQualification.tags : undefined}/>

                            <strong>
                                <Label>
                                    <FormattedMessage
                                        id="cases.list.recent.table.client.request"/>
                                </Label>
                            </strong>
                            <p className="rounded bg-light w-100 p-2 text-dark"
                               id="case.clientRequest">{clientRequest}</p>
                            {this.renderNotes()}
                            {this.renderMandatoryAdgs()}
                        </Col>
                    </Row>
                </CardBody>
            </div>
        )
    }

}

const mapStateToProps = (state: AppState) => ({
    authorizations: state.store.applicationInitialState.authorizations,
    sessionIsFrom: state.store.applicationInitialState.sessionIsFrom
});

const mapDispatchToProps = {
    pushCaseToRecentCasesV2
}

export default compose<any>(withRouter, connect(mapStateToProps, mapDispatchToProps))(SelectedCaseSummaryV2)
