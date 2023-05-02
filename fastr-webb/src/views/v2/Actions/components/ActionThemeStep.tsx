import {withFormsy} from "formsy-react";
import * as React from "react";
import {FormattedMessage} from "react-intl";
import {NotificationManager} from "react-notifications";
import {connect} from "react-redux";
import {Breadcrumb, Row} from "reactstrap";
import BreadcrumbItem from "reactstrap/lib/BreadcrumbItem";
import Col from "reactstrap/lib/Col";
import {RouteComponentProps, withRouter} from "react-router";
import {compose} from "redux";
import {PassDownProps} from "formsy-react/dist/Wrapper";
import {CasesQualificationSettings} from "../../../../model/CasesQualificationSettings";
import {CaseRoutingRule} from "../../../../model/CaseRoutingRule";
import {CaseThemeQualification} from "../../../../model/CaseThemeQualification";
import {ClientContextSliceState} from "../../../../store/ClientContextSlice";
import QualificationBoxV2 from "../../Cases/Qualification/QualificationBoxV2";
import ClientErrorModal from "../../../../components/Modals/component/ClientErrorModal";
import {CSSFadeTransition} from "../../../../components/Transitions/CSSTransition";
import SwitchTransition from "react-transition-group/SwitchTransition";

import {
    notifyActionThemeSelectionActionV2,
    setActionAdditionalDataV2,
    setActionValidRoutingRule,
    setIsActionThemeNotSelected,
    setIsActionThemeSelected
} from "../../../../store/actions/v2/case/CaseActions";
import {AppState} from "../../../../store";
import * as moment from "moment";
import {translate} from "../../../../components/Intl/IntlGlobalProvider";
import ActionService from "../../../../service/ActionService";
import CaseService from "../../../../service/CaseService";

declare type PropType = PassDownProps;

interface Props extends PropType {
    caseId: string
    actionThemeType: string
    qualificationLeaf
    setAdditionalData
    recentCasesList
    actionAdditionalData
    userActivity?
    motif
    actionThemeSelected: CasesQualificationSettings
    notifyActionThemeSelectionActionV2
    setIsActionThemeSelected
    setIsActionThemeNotSelected
    client: ClientContextSliceState
    setActionAdditionalDataV2
    setActionValidRoutingRule: (caseId: string, validRoutingRule?: CaseRoutingRule) => void
    displayOutput: (elements: JSX.Element[]) => void
    toggleCard: () => void
    isThemeExpanded: boolean
    shouldDisplay: boolean
    blockActionValidation: (bool: boolean) => void
    setDisableActionValidation: (bool: boolean) => void
    estimatedAssignmentDate: (date: Date) => void
}

interface State {
    retrievedTheme: CasesQualificationSettings[]
    selectedActionTheme
    level
    isLeaf: boolean
    routingRule
    shouldShowClientError
}

class ActionThemeStep extends React.Component<Props & RouteComponentProps, State> {

    private caseService: CaseService = new CaseService(true);
    private actionService: ActionService = new ActionService(true);
    private levelMap = new Map();

    constructor(props) {
        super(props)
        this.state = {
            retrievedTheme: [],
            selectedActionTheme: this.props.actionThemeSelected || [],
            level: 0,
            isLeaf: this.props.actionThemeSelected?.isLeaf,
            routingRule: null,
            shouldShowClientError: false,
        }
    }

    public QualifArrayToTagsArray = (qualifs: CasesQualificationSettings[]) => {
        const qualiflabels: string[] = [];
        qualifs.forEach(qualif => {
            qualiflabels.push(qualif.label);
        });
        return qualiflabels;
    }

    public noRootThemesFoundedErrorMessageFormatter() {
        return (<div>
            <FormattedMessage id={"cases.actions.theme.step.error.1"} /> <span>{this.props.actionThemeType}</span>
            <FormattedMessage id={"cases.actions.theme.step.error.2" } /> <span>{this.props.userActivity?.label}</span>
            <FormattedMessage id={"cases.actions.theme.step.error.3"} /> <span>{this.props.client?.service?.serviceType}</span>
        </div>)
    }

    public componentWillMount = async () => {
            try {
                const serviceType = this.props.client!.service!.serviceType ? this.props.client!.service!.serviceType : "UNKNOWN";
                const retrievedTheme: Array<CasesQualificationSettings> =
                    await this.actionService.getRootThemesByThemeType(
                        this.props.actionThemeType,
                        serviceType)
                this.initThemeLevelMap(retrievedTheme)
                this.setState({
                    retrievedTheme
                });
                if (retrievedTheme?.length === 1) {
                    await this.forceNextTheme(retrievedTheme.pop())
                    return;
                }
                if(!retrievedTheme.length) {
                    NotificationManager.error(this.noRootThemesFoundedErrorMessageFormatter(), null, 0, this.props.blockActionValidation(true));
                }
            } catch (e) {
                NotificationManager.error(this.noRootThemesFoundedErrorMessageFormatter(), null, 0, this.props.blockActionValidation(true));
            }
    }

    public forceNextTheme = async (theme: CasesQualificationSettings | undefined) => {
        if (theme) {
            await this.getActionNextThemes(theme)
        }
    }

    public async componentDidUpdate(prevProps: Props) {
        if (JSON.stringify(prevProps.actionThemeSelected) !== JSON.stringify(this.props.actionThemeSelected)) {
            try {
                const serviceType = this.props.client!.service!.serviceType ? this.props.client!.service!.serviceType : "UNKNOWN";
                const retrievedTheme: Array<CasesQualificationSettings> =
                    await this.actionService.getRootThemesByThemeType(
                        this.props.actionThemeType,
                        serviceType)
                // this.initThemeLevelMap(retrievedTheme)
                if(this.props.isThemeExpanded) {
                    this.props.toggleCard
                    this.state.selectedActionTheme.pop();
                }
                this.setState({
                    retrievedTheme
                });
                if(!retrievedTheme.length) {
                    NotificationManager.error(this.noRootThemesFoundedErrorMessageFormatter(), null, 0, this.props.blockActionValidation(true));
                }
            } catch (e) {
                NotificationManager.error(this.noRootThemesFoundedErrorMessageFormatter(), null, 0, this.props.blockActionValidation(true));
            }
        }
    }

    public retrieveActionThemes = async (idTheme: string) => {
        try {
            const serviceType = this.props.client!.service!.serviceType ? this.props.client!.service!.serviceType : "UNKNOWN";
            const retrievedTheme: Array<CasesQualificationSettings> = await this.caseService.getThemeByAncestor(
                idTheme, serviceType);
            this.initThemeLevelMap(retrievedTheme);
            this.setState({
                retrievedTheme
            });
            return retrievedTheme;
        } catch (e) {
            NotificationManager.success(translate.formatMessage({id: "cases.create.scaling.get.themes.error"}))
            return [];
        }
    };

    public checkActionsDuplicatedThemes = async (themeCode: string) => {
        let duplicatedAction;
        try {
            const serviceId = this.props.client!.service!.id ? this.props.client!.service!.id : "";
            duplicatedAction = await this.actionService.checkActionsDuplicatedThemes(serviceId, themeCode)
        } catch (e) {
            const error = await e;
            console.log(error)
        }
        return duplicatedAction
    }

    private clearLevelMapFromLevel = (targetLevel) => {
        this.levelMap.forEach((levelEntry, level) => {
            if (level > targetLevel) {
                this.levelMap.set(level, []);
            }
        });
    }

    private initThemeLevelMap = (retrievedTheme: Array<CasesQualificationSettings>) => {
        const targetLevel = retrievedTheme[0]?.level;
        this.levelMap.set(targetLevel, []);
        this.clearLevelMapFromLevel(targetLevel);
        retrievedTheme
            .sort((a, b) => {
                if (a.isLeaf === b.isLeaf) {
                    return a.label.localeCompare(b.label);
                }
                return a.isLeaf === b.isLeaf ? 0 : a.isLeaf ? 1 : -1;
            })
            .map((event) => {
                let previousArray: [];
                previousArray = this.levelMap.get(event.level) ? this.levelMap.get(event.level) : [];
                this.levelMap.set(event.level, [...previousArray, event]);
            });
    }

    public renderActionThemesBoxes(): JSX.Element[] {
        const arr: JSX.Element[] = [];
        this.levelMap.forEach((eventEntry, level) =>
            arr.push(<QualificationBoxV2 elements={eventEntry} key={level} getNextThemes={this.getActionNextThemes}/>)
        );
        return arr;
    }

    public getActionNextThemes = async (event: CasesQualificationSettings) => {
        this.props.blockActionValidation(false)
        const lastActionThemeSelected = this.state.selectedActionTheme[this.state.selectedActionTheme.length - 1]
        if (event === lastActionThemeSelected) {
            return // if click on the same item, do nothing
        }

        const newSelectedActionTheme = [...this.state.selectedActionTheme];
        newSelectedActionTheme[event.level - 1] = event; // levels starts at 1 and selectedActionTheme index at 0
        newSelectedActionTheme.splice(event.level, newSelectedActionTheme.length); // clear the rest after 'level', included
        this.levelMap.get(event.level).forEach((actionTheme) => actionTheme.selected = false);
        event.selected = true;
        this.setState(() => ({
            selectedActionTheme: newSelectedActionTheme,
            level: event.level,
            isLeaf: event.isLeaf,
        }), async () => {
            if (!event.isLeaf) {
                const retrievedTheme: CasesQualificationSettings[] = await this.retrieveActionThemes(event.id)
                if(retrievedTheme?.length === 1) {
                    await this.forceNextTheme(retrievedTheme.pop())
                }
            }
        });

        if (event.isLeaf) {
            this.clearLevelMapFromLevel(event.level);

            const duplicatedAction = await this.checkActionsDuplicatedThemes(event.code)
            if(duplicatedAction) {
                this.props.setDisableActionValidation(true)
                const duplicatedActionErrorMsg = <div>
                    <FormattedMessage id={"cases.actions.theme.duplicated.theme.error.1"} /> <span>{this.props.actionThemeSelected?.label}</span>
                    <FormattedMessage id={"cases.actions.theme.duplicated.theme.error.2" } /> <span>{duplicatedAction.caseId}</span>
                    <FormattedMessage id={"cases.actions.theme.duplicated.theme.error.3"} />
                </div>
                NotificationManager.error(duplicatedActionErrorMsg, null, 0);
            } else {
                this.props.setDisableActionValidation(false)
            }

            // get activity selected from global State if it exists
            const activitySelectedCode = this.props.userActivity ? this.props.userActivity.code : '';
            try {
                const serviceType = this.props.client!.service!.serviceType ? this.props.client!.service!.serviceType : "UNKNOWN";
                const rule: CaseRoutingRule = await this.caseService.getReceiverSiteFromleafTheme(
                    event.code,
                    serviceType,
                    activitySelectedCode
                );

                if (event.incident) {
                    const newMaxwellAdditionalData = event.data.map(caseDataProp => ({
                        ...caseDataProp,
                        category: "MAXWELL"
                    }));

                    this.props.setActionAdditionalDataV2(this.props.caseId, [...newMaxwellAdditionalData]);

                    if (!!this.props.client.error) {
                        this.setState({shouldShowClientError: true})
                    }
                } else {
                    const newThemeAdditionalData = event.data.map(caseDataProp => ({
                        ...caseDataProp,
                        category: "THEME"
                    }));

                    this.props.setActionAdditionalDataV2(this.props.caseId, [...newThemeAdditionalData])
                }

                const { estimatedAssignmentDelay } = event;
                const estimatedAssignmentDate = moment().utc(true).add(estimatedAssignmentDelay, 'days')
                if (estimatedAssignmentDate) {
                    rule.estimatedResolutionDateOfCase = estimatedAssignmentDate.format()
                    this.props.estimatedAssignmentDate(estimatedAssignmentDate.toDate())
                }

                const actionTheme: CaseThemeQualification = {
                    code: event.code,
                    id: event.id,
                    caseType: event.type,
                    tags: this.QualifArrayToTagsArray(this.state.selectedActionTheme)
                }
                this.renderActionBreadcrumb()
                this.props.toggleCard();
                this.setState({
                    routingRule: rule,
                    retrievedTheme: [],
                })

                // notify theme change for validation (formsy)
                actionTheme.code !== "" ? this.props.setValue(actionTheme) : this.props.resetValue()
                // dispatch changes to relative state objects
                this.props.notifyActionThemeSelectionActionV2(this.props.caseId,actionTheme, rule)
                this.props.setIsActionThemeSelected(this.props.caseId)
            }
            catch (e) {
                const actionThemeOutput = this.state.selectedActionTheme?.map(el => el.label).join(' / ')
                const routingErrorMsg =  <div>
                    <FormattedMessage id={"cases.actions.theme.routing.error.1"} /> <span>{this.props.actionThemeType}</span>
                    <FormattedMessage id={"cases.actions.theme.routing.error.2" } /> <span>{this.props.userActivity?.label}</span>
                    <FormattedMessage id={"cases.actions.theme.routing.error.3" } /> <span>{this.props.client?.service?.serviceType}</span>
                    <FormattedMessage id={"cases.actions.theme.routing.error.4"} /> <span>{actionThemeOutput ? actionThemeOutput : ''}</span>
                </div>
                NotificationManager.error(routingErrorMsg, null, 0, this.props.blockActionValidation(true));
            }
        } else {
            this.setState({
                routingRule: undefined,
            })
            this.props.setActionValidRoutingRule(this.props.caseId, undefined)

            this.props.setActionAdditionalDataV2(this.props.caseId, [])
        }
    };

    public renderActionBreadcrumb() {
        const arr: JSX.Element[] = [];
        arr.push(<Breadcrumb>
            {this.state.selectedActionTheme.map((event, index) => (
                <BreadcrumbItem key={index}>
                    {event.label}
                </BreadcrumbItem>))
            }
            {this.state.isLeaf ? <span/> :
                <BreadcrumbItem>
                    <FormattedMessage id="cases.qualification.selection.theme"
                                      values={{level: this.state.level + 1}}/>
                </BreadcrumbItem>}
        </Breadcrumb>);
        this.props.displayOutput(arr);
        return <React.Fragment/>
    }

    public render(): JSX.Element {
        return (
            <React.Fragment>
                {this.props.shouldDisplay &&
                <div style={{padding: '1.25rem', minHeight: '1px', flex: '1 1 auto'}}>
                    {this.state.shouldShowClientError && <ClientErrorModal/>}
                    <Row>
                        <Col xs={12}>
                            {() => this.renderActionBreadcrumb()}
                        </Col>
                    </Row>
                    <SwitchTransition>
                        <CSSFadeTransition key={this.state.selectedActionTheme}>
                            <Row className={"theme-selection-v2"}>
                                {this.renderActionThemesBoxes()}
                            </Row>
                        </CSSFadeTransition>
                    </SwitchTransition>
                </div>
                }
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state: AppState, ownProps:Props) => ({
    qualificationLeaf: state.store.cases.casesList[ownProps.caseId].qualificationLeaf,
    actionAdditionalData: state.store.cases.casesList[ownProps.caseId].caseAction.actionAdditionalData,
    motif: state.store.cases.casesList[ownProps.caseId].motif,
    recentCasesList: state.store.recentCases.casesList,
    client: state.store.client.currentClient,
    userActivity: state.store.applicationInitialState.user?.activity,
    actionThemeSelected: state.store.cases.casesList[ownProps.caseId].caseAction.actionThemeSelected,
});

const mapDispatchToProps = {
    setActionValidRoutingRule,
    setActionAdditionalDataV2,
    notifyActionThemeSelectionActionV2,
    setIsActionThemeSelected,
    setIsActionThemeNotSelected
};
export default compose<any>(withRouter, withFormsy, connect(mapStateToProps, mapDispatchToProps))(ActionThemeStep)
