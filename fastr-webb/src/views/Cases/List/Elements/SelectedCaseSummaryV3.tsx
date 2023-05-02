import * as React from "react";
import { createRef, RefObject } from "react";
import 'moment-duration-format';
import { Case } from "../../../../model/Case";
import { CardBody, Col, Row, UncontrolledTooltip } from "reactstrap";
import { RouteComponentProps, withRouter } from "react-router";
import { retrieveLastMandatoryResources } from "../../../../utils/CaseUtils";
import { ACT_ID } from "../../../../model/actId";
import { CaseResource } from "../../../../model/CaseResource";
import { compose } from "redux";
import { connect } from "react-redux";
import { AppState } from "../../../../store";
import { pushCaseToRecentCasesV2 } from "../../../../store/actions/v2/case/RecentCasesActions";
import CaseHistoryV2 from "../../../v2/Cases/CaseHistory/CaseHistoryV2";
import RetentionDataSummary from "./RetentionDataSummary";
import GenericCardToggleV2 from "../../../v2/Cases/Components/Sections/GenericCardToggleV2";
import "./SelectedCaseSummaryV3.scss";
import BreadcrumbItem from "reactstrap/lib/BreadcrumbItem";
import { CaseDataProperty } from "../../../../model/CaseDataProperty";
import { FormattedMessage } from "react-intl";
import moment from "moment";
import { IncidentsListItem } from "../../../../model/IncidentsList";
import CaseService from "../../../../service/CaseService";
import { ScaleDetail } from "../../../../model/ScaleDetail.ts";
import { translate } from "../../../../components/Intl/IntlGlobalProvider";
import DateUtils from "../../../../utils/DateUtils";
import ActionService from "../../../../service/ActionService";
import { Action } from "../../../../model/actions/Action";
import { commentRender } from "src/views/Commons/Acts/ActsUtils";
import { formattedStatus, getBadgeBgColor, isInProgressIncident } from "../../../../utils/MaxwellUtilsV2";
import ActionComponent from "../../../v2/Actions/ActionComponent";

interface Props {
    case: Case
    idService?: string
    authorizations,
    pushCaseToRecentCasesV2,
    sessionIsFrom: string,
    sectionToForceOpen?: string
    isScalingV2?: boolean
    isPastScaling?: boolean
    isOpened?: boolean
    editableScaling?: boolean
    checkInProgressActions?,
    userActivity,
    userLogin: string,
    updateActionsDetails?: () => void
    forceOpenActionsHistory: () => void
}

interface State {
    lastMandatoryResources?: Map<ACT_ID, CaseResource | undefined>
    showAllNotes: boolean,
    isAddNoteModalOpen: boolean,
    incidents?
    openedSections,
    actions
}

class SelectedCaseSummaryV3 extends React.Component<Props & RouteComponentProps, State> {

    private DATETIME_FORMAT = process.env.REACT_APP_FASTR_DATETIME_FORMAT;
    private caseService: CaseService = new CaseService(true);
    private actionService: ActionService = new ActionService(true);

    private ref: RefObject<HTMLSpanElement> = createRef();

    constructor(props) {
        super(props);
        this.state = {
            showAllNotes: false,
            isAddNoteModalOpen: false,
            openedSections: {
                HISTORY: false,
                RETENTION: false,
                ANTICHURN: false,
                INCIDENTS: false,
                SCALING: false,
                QUALIFICATION: false,
                ACTION: false
            },
            actions: []
        }

    }

    public componentDidMount = async () => {
        const lastMandatoryResources: Map<ACT_ID, CaseResource> = retrieveLastMandatoryResources(this.props.case)
        this.setState({
            lastMandatoryResources
        });
        this.retrieveIncidents(this.props.case.caseId);
        this.getActions()
    }

    public componentDidUpdate = (prevProps) => {
        if (this.props.case.caseId !== prevProps.case.caseId) {
            this.getActions()
            const lastMandatoryResources: Map<ACT_ID, CaseResource> = retrieveLastMandatoryResources(this.props.case)
            this.setState({
                lastMandatoryResources,
                showAllNotes: false
            });
        }
        if (this.props.sectionToForceOpen && (this.props.sectionToForceOpen !== prevProps.sectionToForceOpen || this.props.isOpened !== prevProps.isOpened)) {
            const temp = { ...this.state.openedSections }
            Object.keys(this.state.openedSections).forEach((openSectionName) => {
                temp[openSectionName] = false
            })
            temp[this.props.sectionToForceOpen] = true;
            this.setState({
                openedSections: temp
            })
        }
        if (this.props.case.events.length !== prevProps.case.events.length) {
            this.retrieveIncidents(this.props.case.caseId);
        }
    }

    private getActions = async () => {
        try {
            const actionDatas: Array<Action> = await this.actionService.getInProgressAndResolvedUnresolvedActionsBy(this.props.case.caseId, this.props.userActivity.code)
            this.setState({
                actions: actionDatas
            });
        } catch (e) {
            const error = await e;
            console.error(error)
        }
    }

    private retrieveIncidents(caseId: string) {
        this.caseService.getIncidentsList(caseId).then((incidentsArr: IncidentsListItem[]) => {
            if (incidentsArr) {
                incidentsArr?.sort((a, b) => a.status > b.status ? 1 : -1)
                this.setState({
                    incidents: incidentsArr
                });
            }
        })
    }

    private onSectionToggle = (name, value) => {
        const temp = { ...this.state.openedSections }
        temp[name] = value;
        this.setState({
            openedSections: temp
        })
    }

    private renderMandatoryAdgs = (): JSX.Element => {
        const { lastMandatoryResources } = this.state
        if (!lastMandatoryResources || 0 === lastMandatoryResources.size) {
            return <React.Fragment />
        }

        const adgRet: CaseResource | undefined = lastMandatoryResources.get(ACT_ID.ADG_RETENTION);

        return (
            <React.Fragment>
                {adgRet && DateUtils.daysBetween(new Date(), new Date(adgRet.creationDate)) <= 30 &&
                    <GenericCardToggleV2
                        icon={""}
                        title={"cases.elements.retention"}
                        isExpandable
                        isExpanded={this.state.openedSections.RETENTION}
                        casePicto={"RETENTION_LIGHT"}
                        whiteArrow
                        cardClass={"selected-case-summary__card"}
                        cardBodyClass={"selected-case-summary__card-body"}
                        cardHeaderClass={"selected-case-summary__card-header-closed-dark"}
                        onToggle={(value) => this.onSectionToggle("RETENTION", value)}>
                        <RetentionDataSummary lastRetentionResource={adgRet} />
                    </GenericCardToggleV2>
                }
            </React.Fragment>
        )
    }

    private renderIncidents = (): JSX.Element => {
        const incidentsList: JSX.Element[] = [];
        if (!this.state.incidents) {
            return <React.Fragment />
        }

        this.state.incidents.filter(incident => isInProgressIncident(incident)).forEach(incident => {
            const badgeBG = getBadgeBgColor(incident.timeSpentLastUpdate, incident.status)
            incidentsList.push(<Row className="w-100 pt-2 pb-2 border-bottom align-items-center incident-line">
                <Col md={1} className="d-flex flex-column align-items-center justify-content-center">
                    {incident?.ticketId && <div className="pb-1">{incident.ticketId}</div>}
                    <span ref={this.ref}
                        className={`badge badge-round d-flex align-items-center ${badgeBG}`}>
                        <span
                            className="text-white">{DateUtils.formatTimeSpentLastUpdate(incident.timeSpentLastUpdate, "d[j] h[h] m[min] s[s]")}</span>
                    </span>
                    {
                        this.ref?.current &&
                        <UncontrolledTooltip placement="top" target={this.ref.current}>
                            {DateUtils.formatTimeSpentLastUpdate(incident.timeSpentLastUpdate, "d[ jour(s)] h[ heure(s)] m[ minute(s)] s[ secondes]")}
                        </UncontrolledTooltip>
                    }
                </Col>

                <Col md={3}>
                    {incident?.creationDate && <div><FormattedMessage
                        id="maxwellV2.incident.list.created.on" /> {moment(incident.creationDate).format(this.DATETIME_FORMAT)}
                    </div>}
                    {incident?.updateDate && <div><FormattedMessage
                        id="maxwellV2.incident.list.updated.on" /> {moment(incident.updateDate).format(this.DATETIME_FORMAT)}
                    </div>}
                </Col>

                <Col md={2}>{incident?.status && formattedStatus(incident)}</Col>

                {incident.status === "WAITING" && !incident.comment ?
                    <Col md={4}>
                        <FormattedMessage id="maxwellV2.incident.list.infos" />
                    </Col> :
                    <Col className="mb-2" md={5}>{commentRender(incident.comment)}</Col>
                }
            </Row>)

        });
        return incidentsList.length > 0 ? <GenericCardToggleV2
            icon={""}
            title={"maxwellV2.incident.list.title"}
            isExpandable
            isExpanded={this.state.openedSections.INCIDENTS}
            casePicto={"INCIDENT_LIGHT"}
            cardClass={"selected-case-summary__card"}
            cardBodyClass={"selected-case-summary__card-body"}
            cardHeaderClass={"selected-case-summary__card-header-closed"}
            whiteArrow
            onToggle={(value) => this.onSectionToggle("INCIDENTS", value)}>
            {...incidentsList}
        </GenericCardToggleV2> : <React.Fragment />

    }

    private renderBreadcrumb = (tags: string[], lightTheme?: boolean) => {
        return <section
            className={lightTheme ? "selected-case-summary__breadcrumb-light" : "selected-case-summary__breadcrumb"}>
            {tags?.map((tag, index) => (
                <BreadcrumbItem key={index}>
                    {tag}
                </BreadcrumbItem>)
            )}
        </section>
    }

    private renderAdditionalData = (dataArray: CaseDataProperty[]) => {
        return <section className={"selected-case-summary__additional-data-container"}>
            {
                dataArray.map((data) => {
                    return data.value ? <section className={"selected-case-summary__additional-data"}>
                        <span className={"selected-case-summary__additional-data-label"}>{data.label} : </span>
                        <span>{data.type === "DATETIME" ?
                            moment(data.value).format(this.DATETIME_FORMAT) :
                            this.translateValue(data.value)}
                        </span>
                    </section>
                        : <React.Fragment />
                })
            }
        </section>
    }

    private translateValue = (value: string) => {
        if (value === "yes") {
            return translate.formatMessage({ id: "global.dialog.yes" })
        } else if (value === "no") {
            return translate.formatMessage({ id: "global.dialog.no" })
        }
        return value;
    }

    private renderQualificationSection = () => {
        const qualificationAdditionalData = this.props.case.data?.filter(caseData => caseData.category === "MOTIF");
        const hasAdditionalData = qualificationAdditionalData && qualificationAdditionalData.length > 0;
        return <GenericCardToggleV2
            icon={"icon-rom"}
            title={"cases.list.recent.single.case.qualification"}
            isExpandable={hasAdditionalData}
            isExpanded={this.state.openedSections.QUALIFICATION && hasAdditionalData}
            cardClass={"selected-case-summary__card"}
            cardBodyClass={"selected-case-summary__card-body"}
            cardHeaderClass={"selected-case-summary__card-header"}
            extendedTitle={this.renderBreadcrumb(this.props.case.qualification.tags)}
            onToggle={(value) => this.onSectionToggle("QUALIFICATION", value)}>
            {
                hasAdditionalData &&
                this.renderAdditionalData(qualificationAdditionalData)
            }
        </GenericCardToggleV2>
    }

    private renderRoutingRuleData = (scaledDetail, latestAssignationScaledDetail, createScaledDetail) => {
        const resDate = this.props.case.estimatedResolutionDate?.toString();
        return <section className={"selected-case-summary__routing-data"}>
            {scaledDetail.assignmentContext?.owner?.login &&
                <section>
                    <label><FormattedMessage
                        id={"cases.scaling.next.owner"} /></label>{scaledDetail.assignmentContext.owner.login}
                </section>
            }
            <section>
                <label><FormattedMessage
                    id={"cases.scaling.receiver.act"} /></label>{scaledDetail.requestedActivite?.label}
            </section>
            <section>
                <label><FormattedMessage id={"cases.scaling.receiver.site"} /></label>{scaledDetail.site?.label}
            </section>
            {(!scaledDetail || this.props.case.status === "QUALIFIED") && this.props.case.estimatedResolutionDate &&
                <section>
                    <label>
                        <FormattedMessage id={"cases.scaling.estimated.resolution.date"} />
                    </label>
                    {moment(resDate).format('DD/MM/YYYY')}
                </section>
            }
            {scaledDetail && this.props.case.status !== "QUALIFIED" &&
                <section>

                    <label>
                        <FormattedMessage id={"cases.scaling.real.resolution.date"} />
                    </label>
                    {this.renderSCalingAssignationDate(scaledDetail, latestAssignationScaledDetail, createScaledDetail)}
                    {
                    }
                </section>
            }
        </section>
    }

    private renderSCalingAssignationDate = (scaledDetail, latestAssignationScaledDetail, createScaledDetail) => {
        const latestDateAssignement =latestAssignationScaledDetail?.dateTime ?
        moment(latestAssignationScaledDetail?.dateTime).format('DD/MM/YYYY') : null;
        return  scaledDetail.assignmentContext?.dateAssignment ?
            moment(scaledDetail.assignmentContext?.dateAssignment).format('DD/MM/YYYY')
            : latestDateAssignement ?  latestDateAssignement
                :moment(createScaledDetail?.dateTime).format('DD/MM/YYYY');
    }

    private renderScalingAdditionalData = (scaledDetail) => {

        return <section className={"selected-case-summary__additional-scaling-data"}>
            {scaledDetail.dateTime && <section><label><FormattedMessage
                id={"cases.maxwell.incident.updateDate"} /></label>{moment(scaledDetail.dateTime).format(this.DATETIME_FORMAT)}
            </section>}
            {scaledDetail.progressStatus && <section><label><FormattedMessage id={"cases.edit.progress.list"} /></label>
                <FormattedMessage id={"PROGRESS_STATUS." + scaledDetail.progressStatus} /></section>}
            {scaledDetail.doNotResolveBeforeDate && <section><label><FormattedMessage
                id={"case.scaled.doNotResolveBeforeDate"} /></label>{scaledDetail.doNotResolveBeforeDate.split("-").reverse().join("/")}
            </section>}
        </section>
    }

    private renderScalingConclusionField = (dataName, data) => {
        const lowercaseName = dataName.toLowerCase();
        return dataName !== "status" && data[dataName] ?
            <section className={"selected-case-summary__conclusion-field"}>
                <label>
                    <FormattedMessage id={"cases.scaling.conclusion." + lowercaseName} />
                </label>
                {data[dataName]}
            </section> : <React.Fragment />

    }

    private renderConclusionData = (scaledDetail) => {
        const data = scaledDetail.finishingTreatmentConclusion
        return data && Object.keys(data).filter((dataName) => data[dataName]).length > 0 ? <section>
            <section className={"selected-case-summary__conclusion-title"}>Statut : <FormattedMessage
                id={"STATUS." + data.status} /></section>
            <section className={"selected-case-summary__conclusion-box"}>
                {
                    Object.keys(data).map((fieldName) => this.renderScalingConclusionField(fieldName, data))
                }
            </section>
        </section> : <React.Fragment />
    }

    private handleRetrocompatibilityV1 = (): ScaleDetail => {
        const scaledDetailFromCase = this.props.case.scaleDetails![this.props.case.scaleDetails!.length - 1];

        //TODO here  
        if (this.props.isScalingV2) {
            return scaledDetailFromCase;
        } else {
            return {
                assignmentContext: scaledDetailFromCase.assignmentContext,
                cancelContact: undefined,
                data: this.props.case?.data?.filter(caseData => caseData.category === "THEME"),
                dateTime: scaledDetailFromCase.dateTime,
                doNotResolveBeforeDate: this.props.case.doNotResolveBeforeDate,
                finishingTreatmentConclusion: this.props.case.finishingTreatmentConclusion,
                initialContact: scaledDetailFromCase.initialContact,
                progressStatus: this.props.case.progressStatus,
                reopenedContext: undefined,
                requestedActivite: scaledDetailFromCase.requestedActivite,
                site: scaledDetailFromCase.site,
                step: undefined,
                themeQualification: this.props.case.themeQualification
            }
        }
    }
    private getLatestAssignationDetail = () => {
          return this.props.case.scaleDetails?.slice().reverse()
        .find(scaledDetail => scaledDetail.step === "ASSIGNATION");
    }
    private getCreatedScaledDetail = () => {
        return this.props.case.scaleDetails?.slice().reverse()
      .find(scaledDetail => scaledDetail.step === "CREATION");
  }

    private renderScaledSection = () => {
        const scaledDetail = this.handleRetrocompatibilityV1();
        const latestAssignationScaledDetail =  this.getLatestAssignationDetail();
        const createScaledDetail =  this.getCreatedScaledDetail();
        const themeAdditionalData = scaledDetail?.data?.filter(caseData => caseData.category === "THEME");
        return <GenericCardToggleV2
            icon={""}
            title={"cases.events.type.SCALED"}
            isExpandable
            isExpanded={this.state.openedSections.SCALING}
            casePicto={"SCALING_LIGHT"}
            alertPicto={this.props.editableScaling ? "ACTION_YELLOW" : ""}
            alertType={"scalingAlert"}
            whiteArrow
            cardClass={"selected-case-summary__card"}
            cardBodyClass={"selected-case-summary__card-body"}
            cardHeaderClass={this.props.isPastScaling ? "selected-case-summary__card-header-closed-dark" : "selected-case-summary__card-header-closed"}
            extendedTitle={this.renderBreadcrumb(scaledDetail?.themeQualification?.tags, this.props.isPastScaling)}
            onToggle={(value) => this.onSectionToggle("SCALING", value)}>
            {
                themeAdditionalData && themeAdditionalData.length > 0 && this.state.incidents && this.state.incidents.length === 0 &&
                this.renderAdditionalData(themeAdditionalData)
            }
            {
                this.renderRoutingRuleData(scaledDetail, latestAssignationScaledDetail, createScaledDetail)
            }
            {
                this.renderScalingAdditionalData(scaledDetail)
            }
            {
                this.renderConclusionData(scaledDetail)
            }
        </GenericCardToggleV2>
    }

    public render(): JSX.Element {
        const {
            case: {
                caseId,
                /* processingConclusion,
                 qualification,
                 themeQualification,
                 status,
                 clientRequest,
                 category*/
            }
        } = this.props;
        return (
            <div>
                <CardBody>
                    {
                        caseId &&
                        <CaseHistoryV2
                            forceOpenActionsHistory={this.props.forceOpenActionsHistory}
                            caseId={caseId}
                            isExpanded={this.state.openedSections.HISTORY}
                            isExpandable={true}
                            icon={"icon-clock"}
                            cardHeaderClass={"selected-case-summary__card-header"}
                            cardClass={"selected-case-summary__card"}
                            cardBodyClass={"selected-case-summary__card-body"}
                            excludeHeader caseFromParent={this.props.case}
                            updateActionsDetails={this.props.updateActionsDetails}
                            onToggle={(value) => this.onSectionToggle("HISTORY", value)}
                        />
                    }
                    {
                        // need les DA, rien dans les casePage (store différent)
                        this.props.case.scaleDetails && this.props.case.scaleDetails.length > 0 &&
                        this.renderScaledSection()
                    }

                    {caseId &&
                        <ActionComponent caseId={caseId}
                            caseLastModification={this.props.case.updateDate}
                            isOpened={this.props.isOpened}
                            isExpanded={this.state.openedSections.ACTION}
                            onSectionToggle={this.onSectionToggle}
                            fromActiveCases={true}
                            checkInProgressActions={this.props.checkInProgressActions} />
                    }

                    {
                        this.renderMandatoryAdgs()
                    }
                    {
                        this.renderIncidents()
                    }
                    {
                        this.props.case.qualification &&
                        this.renderQualificationSection()
                    }
                </CardBody>
            </div>
        )
    }

}

const mapStateToProps = (state: AppState, ownProps: Props) => ({
    authorizations: state.store.applicationInitialState.authorizations,
    sessionIsFrom: state.store.applicationInitialState.sessionIsFrom,
    userActivity: state.store.applicationInitialState.user!.activity,
    userLogin: state.store.applicationInitialState.user!.login
});

const mapDispatchToProps = {
    pushCaseToRecentCasesV2
}

export default compose<any>(withRouter, connect(mapStateToProps, mapDispatchToProps))(SelectedCaseSummaryV3)
