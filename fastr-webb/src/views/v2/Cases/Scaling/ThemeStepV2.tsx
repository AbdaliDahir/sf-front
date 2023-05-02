import {withFormsy} from "formsy-react";
import * as React from "react";
import {FormattedMessage} from "react-intl";
import {NotificationManager} from "react-notifications";
import {connect} from "react-redux";
import {Breadcrumb, Row} from "reactstrap";
import moment from "moment";
import BreadcrumbItem from "reactstrap/lib/BreadcrumbItem";
import Col from "reactstrap/lib/Col";
import {CaseRoutingRule} from "../../../../model/CaseRoutingRule";
import {CasesQualificationSettings} from "../../../../model/CasesQualificationSettings";
import {CaseThemeQualification} from "../../../../model/CaseThemeQualification";
import CaseService from "../../../../service/CaseService";
import {AppState} from "../../../../store";
import ClientErrorModal from "../../../../components/Modals/component/ClientErrorModal";
import {PassDownProps} from "../../../../@types/formsy-react/Wrapper";
import SwitchTransition from "react-transition-group/SwitchTransition";
import {CSSFadeTransition} from "../../../../components/Transitions/CSSTransition";
import {RouteComponentProps, withRouter} from "react-router";
import {compose} from "redux";
import SessionService from "../../../../service/SessionService";
import {
    notifyThemeSelectionActionV2,
    setAdditionalDataV2,
    setCaseHasInProgressIncident,
    setIsMatchingCaseModalDisplayedV2,
    setIsThemeSelectedV2,
    setMatchingCaseV2,
    setValidRoutingRuleV2,
} from "../../../../store/actions/v2/case/CaseActions";
import QualificationBoxV2 from "../Qualification/QualificationBoxV2";
import {ClientContextSliceState} from "../../../../store/ClientContextSlice";

declare type PropType = PassDownProps;

interface Props extends PropType {
    caseId: string
    setCaseHasInProgressIncident
    setIsMatchingCaseModalDisplayedV2
    setMatchingCaseV2
    qualificationLeaf
    setAdditionalData
    recentCasesList
    additionalData
    userActivity?
    motif
    themeSelected: CasesQualificationSettings
    notifyThemeSelectionActionV2
    setIsThemeSelectedV2
    client: ClientContextSliceState
    setAdditionalDataV2
    setValidRoutingRuleV2: (caseId: string, validRoutingRule?: CaseRoutingRule) => void
    displayOutput: (elements: JSX.Element[]) => void
    toggleCard: () => void
    shouldDisplay: boolean
    isCurrentCaseScaled: boolean,
    isCurrentCancelScaling: boolean
}

interface State {
    retrievedTheme: CasesQualificationSettings[]
    selectedTheme
    level
    isLeaf: boolean
    routingRule
    shouldShowClientError
}

class ThemeStepV2 extends React.Component<Props & RouteComponentProps, State> {

    private caseService: CaseService = new CaseService(true);
    private levelMap = new Map();

    constructor(props) {
        super(props)
        this.state = {
            retrievedTheme: [],
            selectedTheme: this.props.themeSelected || [],
            level: 0,
            isLeaf: this.props.themeSelected?.isLeaf,
            routingRule: null,
            shouldShowClientError: false
        }
    }

    public QualifArrayToTagsArray = (qualifs: CasesQualificationSettings[]) => {
        const qualiflabels: string[] = [];
        qualifs.forEach(qualif => {
            qualiflabels.push(qualif.label);
        });
        return qualiflabels;
    }

    public componentWillMount = async () => {
        if (this.props.qualificationLeaf) {
            try {
                const serviceType = this.props.client!.service!.serviceType ? this.props.client!.service!.serviceType : "UNKNOWN";
                const retrievedTheme: Array<CasesQualificationSettings> =
                    await this.caseService.getRootThemes(
                        this.props.qualificationLeaf.code,
                        SessionService.getSession(),
                        serviceType)
                this.initThemeLevelMap(retrievedTheme.sort((a, b) => {
                    if (a.isLeaf === b.isLeaf) {
                        return a.label.localeCompare(b.label);
                    }
                    return a.isLeaf === b.isLeaf ? 0 : a.isLeaf ? 1 : -1;
                }))
                this.setState({
                    retrievedTheme
                });
                if (retrievedTheme?.length === 1 && (this.props.isCurrentCaseScaled || this.props.isCurrentCancelScaling)) {
                    await this.forceNextTheme(retrievedTheme[0])
                }
            } catch (e) {
                NotificationManager.error(<FormattedMessage id="cases.create.scaling.get.root.themes"/>);
            }

        }
    }

    public forceNextTheme = async (theme: CasesQualificationSettings | undefined) => {
        if (theme) {
            await this.getNextThemes(theme)
        }
    }

    public retrieveThemes = async (idTheme: string) => {
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
            NotificationManager.error(<FormattedMessage id="cases.create.scaling.get.themes.error"/>);
            return [];
        }
    };

    private clearLevelMapFromLevel = (targetLevel) => {
        this.levelMap.forEach((levelEntry, level) => {
            if (level > targetLevel) {
                this.levelMap.set(level, []);
            }
        });
    }

    private initThemeLevelMap = (retrievedTheme: Array<CasesQualificationSettings>) => {
        retrievedTheme = retrievedTheme &&
            retrievedTheme.filter(theme => theme.habilitedActivities.includes(this.props.userActivity.code))
        const targetLevel = retrievedTheme[0]?.level;
        this.levelMap.set(targetLevel, []);
        this.clearLevelMapFromLevel(targetLevel);
        retrievedTheme
            .map((event) => {
                let previousArray: [];
                previousArray = this.levelMap.get(event.level) ? this.levelMap.get(event.level) : [];
                this.levelMap.set(event.level, [...previousArray, event]);
            });
    }

    public renderThemesBoxes(): JSX.Element[] {
        const arr: JSX.Element[] = [];
        this.levelMap.forEach((eventEntry, level) =>
            arr.push(<QualificationBoxV2 elements={eventEntry} key={level} getNextThemes={this.getNextThemes}/>)
        );
        return arr;
    }

    public getNextThemes = async (event: CasesQualificationSettings) => {
        const lastThemeSelected = this.state.selectedTheme[this.state.selectedTheme.length - 1]
        if (event === lastThemeSelected) {
            return // if click on the same item, do nothing
        }

        const newSelectedTheme = [...this.state.selectedTheme];
        newSelectedTheme[event.level - 1] = event; // levels starts at 1 and selectedTheme index at 0
        newSelectedTheme.splice(event.level, newSelectedTheme.length); // clear the rest after 'level', included
        this.levelMap.get(event.level).forEach((theme) => theme.selected = false);
        event.selected = true;
        this.setState(() => ({
            selectedTheme: newSelectedTheme,
            level: event.level,
            isLeaf: event.isLeaf,
        }), async () => {
            if (!event.isLeaf) {
                const retrievedQualif: CasesQualificationSettings[] = await this.retrieveThemes(event.id)
                if(retrievedQualif?.length === 1) {
                    await this.forceNextTheme(retrievedQualif.pop())
                }
            }
        });

        if (event.isLeaf) {
            this.clearLevelMapFromLevel(event.level);
            
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
                    this.props.setCaseHasInProgressIncident(this.props.caseId);
                    this.props.setAdditionalDataV2(this.props.caseId,
                        [...this.props.additionalData.filter(caseData => caseData.category === "MOTIF"), ...newMaxwellAdditionalData]
                    );

                    if (!!this.props.client.error) {
                        this.setState({shouldShowClientError: true})
                    }
                } else if(this.props.additionalData?.length === 0){
                    const newThemeAdditionalData = event.data.map(caseDataProp => ({
                        ...caseDataProp,
                        category: "THEME"
                    }));

                    this.props.setAdditionalDataV2(this.props.caseId,
                        [...this.props.additionalData.filter(caseData => caseData.category === "MOTIF"), ...newThemeAdditionalData]
                    )
                }

                const {estimatedResolutionDateOfCase} = event;
                if (estimatedResolutionDateOfCase) {
                    const todayDate = moment(new Date()).format("MM/DD/YYYY")
                    rule.estimatedResolutionDateOfCase = rule.autoAssign ? todayDate : estimatedResolutionDateOfCase
                }

                const theme: CaseThemeQualification = {
                    code: event.code,
                    id: event.id,
                    caseType: event.type,
                    tags: this.QualifArrayToTagsArray(this.state.selectedTheme)
                }
                this.props.toggleCard();
                this.setState({
                    routingRule: rule,
                    retrievedTheme: [],
                })

                // notify theme change for validation (formsy)
                theme.code !== "" ? this.props.setValue(theme) : this.props.resetValue()
                // dispatch changes to relative state objects
                this.props.notifyThemeSelectionActionV2(this.props.caseId,event, rule)
                this.props.setIsThemeSelectedV2(this.props.caseId)
            }
            catch (e) {
                NotificationManager.error((await e).message);
            }
        } else {
            this.setState({
                routingRule: undefined,
            })
            this.props.setValidRoutingRuleV2(this.props.caseId, undefined)

            this.props.setAdditionalDataV2(this.props.caseId,
                [...this.props.additionalData.filter(caseData => caseData.category === "MOTIF")]
            )
        }
    };

    public renderBreadcrumb() {
        const arr: JSX.Element[] = [];
        arr.push(<Breadcrumb>
            {this.state.selectedTheme.map((event, index) => (
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
                            {this.renderBreadcrumb()}
                        </Col>
                    </Row>
                    <SwitchTransition>
                        <CSSFadeTransition key={this.state.selectedTheme}>
                            <Row className={"theme-selection-v2"}>
                                {this.renderThemesBoxes()}
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
    additionalData: state.store.cases.casesList[ownProps.caseId].additionalData,
    motif: state.store.cases.casesList[ownProps.caseId].motif,
    recentCasesList: state.store.recentCases.casesList,
    client: state.store.client.currentClient,
    userActivity: state.store.applicationInitialState.user?.activity,
    themeSelected: state.store.cases.casesList[ownProps.caseId].themeSelected,
    isCurrentCaseScaled: state.store.cases.casesList[ownProps.caseId]?.isCurrentCaseScaled,
    isCurrentCancelScaling: state.store.cases.casesList[ownProps.caseId]?.isCurrentCaseCancelScaling
});

const mapDispatchToProps = {
    setValidRoutingRuleV2,
    setIsMatchingCaseModalDisplayedV2,
    setMatchingCaseV2,
    setAdditionalDataV2,
    notifyThemeSelectionActionV2,
    setIsThemeSelectedV2,
    setCaseHasInProgressIncident,

};
export default compose<any>(withRouter, withFormsy, connect(mapStateToProps, mapDispatchToProps))(ThemeStepV2)