import {withFormsy} from "formsy-react";
import * as React from "react";
import {FormattedMessage} from "react-intl";
import {NotificationManager} from "react-notifications";
import {connect} from "react-redux";
import {Breadcrumb, Row} from "reactstrap";
import BreadcrumbItem from "reactstrap/lib/BreadcrumbItem";
import Col from "reactstrap/lib/Col";
import {Activity} from "../../../../model/Activity";
import {CaseDataProperty} from "../../../../model/CaseDataProperty"
import {CaseRoutingRule} from "../../../../model/CaseRoutingRule";
import {CasesQualificationSettings} from "../../../../model/CasesQualificationSettings";
import {CaseThemeQualification} from "../../../../model/CaseThemeQualification";
import CaseService from "../../../../service/CaseService";
import {AppState} from "../../../../store";
import {
    fetchAndStoreIncidents,
    notifyThemeSelectionAction,
    setAdditionalData,
    setValidRoutingRule
} from "../../../../store/actions/CasePageAction";
import {setIsMatchingCaseModalDisplayed, setMatchingCase} from "../../../../store/actions/RecentCasesActions";
import './Css/surmountCase.css';
import ClientErrorModal from "../../../../components/Modals/component/ClientErrorModal";
import {PassDownProps} from "../../../../@types/formsy-react/Wrapper";
import QualificationBox from "./QualificationBox";
import SwitchTransition from "react-transition-group/SwitchTransition";
import {CSSFadeTransition} from "../../../../components/Transitions/CSSTransition";
import {RouteComponentProps, withRouter} from "react-router";
import {compose} from "redux";
import SessionService from "../../../../service/SessionService";

declare type PropType = PassDownProps;

interface Props extends PropType {
    notifyThemeSelectionAction: (themeSelected?: CasesQualificationSettings, validRoutingRule?: CaseRoutingRule) => void
    setValidRoutingRule: (validRoutingRule?: CaseRoutingRule) => void
    setAdditionalData: (additionalData) => void
    additionalData: Array<CaseDataProperty>,
    code,
    activitySelected: Activity
    qualificationLeaf
    fetchAndStoreIncidents: (codeTheme: string) => void
    matchingCase,
    casesList,
    setMatchingCase,
    motif,
    client,
    setIsMatchingCaseModalDisplayed,
    displayOutput:(elements:JSX.Element[])=>void
    toggleCard:()=>void
}

interface State {
    retrievedTheme: CasesQualificationSettings[]
    selectedTheme
    level
    isLeaf: boolean
    routingRule
    shouldShowClientError
    sessionId :string
    activityUSer :string
}

class QualificationSet extends React.Component<Props & RouteComponentProps, State> {

    private caseService: CaseService = new CaseService(true);
    private levelMap = new Map();
    constructor(props) {
        super(props)
        this.state = {
            sessionId: SessionService.getSession(),
            activityUSer:"",
            retrievedTheme: [],
            selectedTheme: [],
            level: 0,
            isLeaf: false,
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
        if(this.props.qualificationLeaf && this.props.qualificationLeaf.code != undefined){
            try {
                let serviceType = this.props.client!.service!.serviceType ? this.props.client!.service!.serviceType : "UNKNOWN";
                const retrievedTheme: Array<CasesQualificationSettings> =
                    await this.caseService.getRootThemes(
                        this.props.qualificationLeaf.code,
                        this.state.sessionId,
                        serviceType)
                const activityUserr:string = await this.caseService.getUserActivitieFromSession(this.state.sessionId);
                this.setState({activityUSer:activityUserr});
                this.initThemeLevelMap(retrievedTheme)
                this.setState({
                    retrievedTheme
                });
            } catch (e) {
                NotificationManager.error(<FormattedMessage id="cases.create.scaling.get.root.themes"/>);
            }

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
        } catch (e) {
            NotificationManager.error(<FormattedMessage id="cases.create.scaling.get.themes.error"/>);
        }
    };

    private clearLevelMapFromLevel = (targetLevel) =>{
        this.levelMap.forEach((levelEntry, level) => {
            if (level > targetLevel) {
                this.levelMap.set(level, []);
            }
        });
    }

    private initThemeLevelMap = (retrievedTheme: Array<CasesQualificationSettings>) =>{
        retrievedTheme = retrievedTheme &&
            retrievedTheme.filter(theme => theme.habilitedActivities.includes(this.state.activityUSer))
        const targetLevel = retrievedTheme[0]?.level;
        this.levelMap.set(targetLevel,[]);
        this.clearLevelMapFromLevel(targetLevel);
        retrievedTheme
            .map((event)=>{
                let previousArray:[];
                previousArray = this.levelMap.get(event.level)?this.levelMap.get(event.level):[];
                this.levelMap.set(event.level,[...previousArray,event]);
            });
    }

    public renderThemesBoxes(): JSX.Element[] {
        const arr:JSX.Element[] =[];
        this.levelMap.forEach((eventEntry, level) =>
            arr.push(<QualificationBox elements={eventEntry} key={level} getNextThemes={this.getNextThemes}/>)
        );
        return arr;
    }

    public getNextThemes = async (event: CasesQualificationSettings) => {
        const lastThemeSelected = this.state.selectedTheme[this.state.selectedTheme.length - 1]
        if (event === lastThemeSelected) {
            return // if click on the same item, do nothing
        }

        const newSelectedTheme = [...this.state.selectedTheme];
        newSelectedTheme[event.level-1]= event; // levels starts at 1 and selectedTheme index at 0
        newSelectedTheme.splice(event.level,newSelectedTheme.length); // clear the rest after 'level', included
        this.levelMap.get(event.level).forEach((theme)=>theme.selected=false);
        event.selected=true;
        this.setState(() => ({
            selectedTheme: newSelectedTheme,
            level: event.level,
            isLeaf: event.isLeaf,
        }), async () => {
            if (!event.isLeaf) {
                await this.retrieveThemes(event.id)
            }
        });

        if (event.isLeaf) {
            this.clearLevelMapFromLevel(event.level);
            const listCasesMatchingQualification = this.props.casesList!.filter(recentCase => {
                const qualificationCode = this.props.motif.code;
                return recentCase.category === "SCALED" && event.code === recentCase.themeQualification.code && qualificationCode === recentCase.qualification.code;
            });

            if (listCasesMatchingQualification.length > 0) {
                this.props.setMatchingCase(listCasesMatchingQualification[0])
                this.props.setIsMatchingCaseModalDisplayed(true)
            }

            // get activity selected from global State if it exists
            const activitySelectedCode = this.props.activitySelected ? this.props.activitySelected.code : '';
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

                    this.props.setAdditionalData(
                        [...this.props.additionalData.filter(caseData => caseData.category === "MOTIF"), ...newMaxwellAdditionalData]
                    );

                    // Get and Store incidents of this Theme
                    this.props.fetchAndStoreIncidents(event.code);

                    if (!!this.props.client.error) {
                        this.setState({shouldShowClientError: true})
                    }
                } else {
                    const newThemeAdditionalData = event.data.map(caseDataProp => ({
                        ...caseDataProp,
                        category: "THEME"
                    }));

                    this.props.setAdditionalData(
                        [...this.props.additionalData.filter(caseData => caseData.category === "MOTIF"), ...newThemeAdditionalData]
                    )
                }

                const {estimatedResolutionDateOfCase} = event;
                if (estimatedResolutionDateOfCase) {
                    rule.estimatedResolutionDateOfCase = estimatedResolutionDateOfCase
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
                this.props.notifyThemeSelectionAction(event, rule)
            } catch (e) {
                NotificationManager.error((await e).message);
            }
        } else {
            this.setState({
                routingRule: undefined,
            })
            this.props.setValidRoutingRule(undefined)

            this.props.setAdditionalData(
                [...this.props.additionalData.filter(caseData => caseData.category === "MOTIF")]
            )
        }
    };

    public renderBreadcrumb() {
        const arr:JSX.Element[]=[];
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
                {this.state.shouldShowClientError && <ClientErrorModal/>}
                <Row className="mt-1 mb-2">
                    <Col xs={12}>
                        {this.renderBreadcrumb()}
                    </Col>
                </Row>
                <SwitchTransition>
                    <CSSFadeTransition key={this.state.selectedTheme}>
                        <Row>
                            {this.renderThemesBoxes()}
                        </Row>
                    </CSSFadeTransition>
                </SwitchTransition>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    qualificationLeaf: state.casePage.qualificationLeaf,
    activitySelected: state.casePage.activitySelected,
    additionalData: state.casePage.additionDataOfQualifsAndTheme,
    matchingCase: state.recentCases.matchingCaseFound,
    casesList: state.recentCases.casesList,
    motif: state.casePage.motif,
    client: state.client
});

const mapDispatchToProps = {
    notifyThemeSelectionAction,
    setAdditionalData,
    fetchAndStoreIncidents,
    setMatchingCase,
    setValidRoutingRule,
    setIsMatchingCaseModalDisplayed
};
// tslint:disable-next-line:no-any
export default compose<any>(withRouter, withFormsy, connect(mapStateToProps, mapDispatchToProps))(QualificationSet)