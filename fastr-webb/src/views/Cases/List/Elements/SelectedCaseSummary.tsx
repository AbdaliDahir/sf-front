import * as React from "react";
import {FormattedMessage} from "react-intl";
import Col from "reactstrap/lib/Col";
import Row from "reactstrap/lib/Row";
import Label from "reactstrap/lib/Label";
import {Case} from "../../../../model/Case";
import {Button, CardBody} from "reactstrap";
import {RouteComponentProps, withRouter} from "react-router";
import FastService from "../../../../service/FastService";
import {FastTabContext} from '../ListRecentCasesPage';
import {translate} from "../../../../components/Intl/IntlGlobalProvider";
import {CaseCategory} from "../../../../model/CaseCategory";
import * as moment from "moment";
import {retrieveLastMandatoryResources} from "../../../../utils/CaseUtils";
import {ACT_ID} from "../../../../model/actId";
import RetentionDataSummary from "./RetentionDataSummary";
import {CaseResource} from "../../../../model/CaseResource";
import CaseNoteSummary from "./CaseNoteSummary";
import SelectedCaseQualification from "./SelectedCaseQualification";
import {compose} from "redux";
import {connect} from "react-redux";
import {AppState} from "../../../../store";
import {fetchAndStoreAuthorizations} from "../../../../store/actions";
import SessionService from "../../../../service/SessionService";
import AntichurnDataSummary from "./AntichurnDataSummary";
import {
    setIsMatchingCaseModalDisplayed,
    setIsRecentCasesListDisplayed,
    setMatchingCase
} from "../../../../store/actions/RecentCasesActions";
import {setDisplayGridADGForDISRC, storeIdActDisRC, storeMotifDisRCAdg} from "../../../../store/actions/CasePageAction";

interface Props {
    case: Case
    fromModalMatchingCase?: boolean
    shutOpened? : () => void
    setMatchingCase : (matchingCase) => void
    setIsRecentCasesListDisplayed : (state:boolean) => void
    setDisplayGridADGForDISRC : (state:boolean) => void
    setIsMatchingCaseModalDisplayed : (state:boolean) => void
    idService?: string
    authorizations
    fromDisrc: boolean
    fetchAndStoreAuthorizations: (sessionId: string) => void
    storeMotifDisRCAdg
    storeIdActDisRC
}
interface State {
    lastMandatoryResources?:Map<ACT_ID, CaseResource|undefined>
    showallNotes:boolean
}

class SelectedCaseSummary extends React.Component<Props & RouteComponentProps,State> {

    constructor(props) {
        super(props);
        this.state={
            showallNotes:false
        }

    }


    public redirectToUpdateCasePage = (fastContext: string) => (event: React.MouseEvent<HTMLElement>) => {
        if(this.props.shutOpened) {
            this.props.shutOpened()
        }

        // TODO la redirection ci-dessous est executee si on est sur FASTR, si on est sur FAST il faut faire un postMessage pour que fast ferme la page en cours et ouvre la page de modification
        // et sur DISRC c'est un affichage de composant
        // this.props.history.push("/cases/" + this.props.case.caseId + "/view" + this.props.location.search)
        this.props.setMatchingCase(this.props.case)
        this.props.setIsMatchingCaseModalDisplayed(false);
        this.props.setIsRecentCasesListDisplayed(!this.props.fromDisrc);
        this.props.setDisplayGridADGForDISRC(true);// resets adg tab display state
        this.props.storeMotifDisRCAdg(undefined);
        this.props.storeIdActDisRC("");

        const url: string = "/cases/" + this.props.case.caseId + "/view" + this.props.location.search;
        FastService.postRedirectMessage({
            urlUpdate: url,
            idCase: this.props.case.caseId,
            fastTabId: fastContext,
            serviceId: this.props.idService
        });

    };

    public renderNotes = () => {
        const notes = this.props.case.notes ? !this.state.showallNotes ? this.props.case.notes.slice(0, 3): this.props.case.notes : undefined
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
                                    {this.state.showallNotes ? <FormattedMessage id="cases.list.recent.single.case.note.less"/> : <FormattedMessage id="cases.list.recent.single.case.note.more"/>}
                                    {this.props.case.notes?.length}
                                </span>
                            </a>
                        </strong>
                    </Col>}
                </Row> :<React.Fragment/> }
                {notesElements}
            </React.Fragment>
        )
    }

    public showMoreNotes = () => {
        this.setState({
            showallNotes: !this.state.showallNotes,
        });
    }

    public componentDidMount = async () => {
        const currentSessionId = SessionService.getSession();
        if(!this.props.authorizations || this.props.authorizations.length === 0){
            await this.props.fetchAndStoreAuthorizations(currentSessionId ? currentSessionId : "");
        }
        const lastMandatoryResources: Map<ACT_ID, CaseResource> = retrieveLastMandatoryResources(this.props.case)
        this.setState({
            lastMandatoryResources
        });
    }

    public componentDidUpdate = (prevProps) => {
        if (this.props.case.caseId !== prevProps.case.caseId) {
            const lastMandatoryResources: Map<ACT_ID, CaseResource> = retrieveLastMandatoryResources(this.props.case)
            this.setState({
                lastMandatoryResources: lastMandatoryResources,
                showallNotes:false
            });
        }
    }

    public renderMandatoryAdgs = (): JSX.Element => {
        const {lastMandatoryResources} = this.state
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
        const {case: {caseId, processingConclusion, qualification, themeQualification, status, progressStatus, clientRequest, category, caseOwner, estimatedResolutionDate}} = this.props;
        return (
            <div>
                <CardBody>
                    <Row>
                        <Col md={10}>
                            <h4>
                                <FormattedMessage id="cases.list.recent.single.case.description"/>
                            </h4>
                        </Col>
                        {!this.props.fromModalMatchingCase &&
                            <Col md={2} className={"d-flex justify-content-end"}>
                                <FastTabContext.Consumer>{(fastTabId) => (
                                    <Button id="selectedCase.update.redirect.id" color="primary" onClick={this.redirectToUpdateCasePage(fastTabId)}>
                                        <FormattedMessage id={"cases.list.recent.case.view"}/>
                                    </Button>
                                )}
                                </FastTabContext.Consumer>
                            </Col>
                        }
                    </Row>
                    <Row className="mt-4">
                        <Col md={4}>
                            <p>
                                <span> <strong><FormattedMessage id="cases.get.details.title"/></strong></span>
                                <br/> {caseId}
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
                            {category === CaseCategory.SCALED ?
                                <div>
                                    <p>
                                        <strong><FormattedMessage id="cases.get.details.progressStatus"/></strong>
                                        <br/> {progressStatus ? translate.formatMessage({id: progressStatus}) : ''}
                                    </p>
                                    <p>
                                        <strong><FormattedMessage id="cases.get.details.destination.site"/></strong>
                                        <br/> {caseOwner && caseOwner.site && caseOwner.site.label ? caseOwner.site.label : caseOwner.site.code}
                                    </p>

                                    <p>
                                        <strong><FormattedMessage id="cases.get.details.destination.activity"/></strong>
                                        <br/> {caseOwner && caseOwner.activity && caseOwner.activity.label ? caseOwner.activity.label : caseOwner.activity.code}
                                    </p>
                                    <p>
                                        <strong><FormattedMessage
                                            id="cases.scaling.estimated.resolution.date"/> </strong>
                                        <br/> {estimatedResolutionDate ? moment(estimatedResolutionDate).format('DD/MM/YYYY') : ""}
                                    </p>
                                </div>
                                : <React.Fragment/>}
                        </Col>

                        <Col md={8}>
                            <strong>
                                <Label>
                                    <FormattedMessage id="cases.list.recent.single.case.qualification"/>
                                </Label>
                            </strong>

                            <SelectedCaseQualification motifTags={qualification.tags} themeTags={themeQualification? themeQualification.tags : undefined}/>

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
    authorizations: state.authorization.authorizations,
    fromDisrc: state.payload.payload.fromdisrc
});

const mapDispatchToProps = {
    fetchAndStoreAuthorizations,
    setMatchingCase,
    setIsRecentCasesListDisplayed,
    storeMotifDisRCAdg,
    storeIdActDisRC,
    setDisplayGridADGForDISRC,
    setIsMatchingCaseModalDisplayed
}

export default compose<any>(withRouter, connect(mapStateToProps, mapDispatchToProps))(SelectedCaseSummary)
