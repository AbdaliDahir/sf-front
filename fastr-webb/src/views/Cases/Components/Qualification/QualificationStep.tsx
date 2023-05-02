import {withFormsy} from "formsy-react";
import * as queryString from "querystring";
import React, {Component} from 'react';
import {FormattedMessage} from "react-intl";
import {NotificationManager} from "react-notifications";
import {connect} from "react-redux";
import {RouteComponentProps, withRouter} from "react-router";
import {Row} from "reactstrap";
import Breadcrumb from "reactstrap/lib/Breadcrumb";
import BreadcrumbItem from "reactstrap/lib/BreadcrumbItem";
import Col from "reactstrap/lib/Col";
import {compose} from "redux";
import {Case} from "../../../../model/Case";
import {CasesQualificationSettings} from "../../../../model/CasesQualificationSettings";
import {CaseThemeQualification} from "../../../../model/CaseThemeQualification";
import CaseService from "../../../../service/CaseService";
import {AppState} from "../../../../store";
import {
    setHasCallTransfer,
    setQualificationIsNotSelected,
    setQualificationIsSelected, storeCase
} from "../../../../store/actions/";
import {
    setAdditionalData,
    setCaseMotif,
    setCaseQualification,
    setQualificationLeaf,
} from "../../../../store/actions/CasePageAction";
import {setIsMatchingCaseModalDisplayed, setMatchingCase} from "../../../../store/actions/RecentCasesActions";
import Loading from "../../../../components/Loading";
import QualificationBox from "./QualificationBox";
import SwitchTransition from "react-transition-group/SwitchTransition";
import {CSSFadeTransition} from "../../../../components/Transitions/CSSTransition";
import {CaseCategory} from "../../../../model/CaseCategory";
import {translate} from "../../../../components/Intl/IntlGlobalProvider";
import SessionService from "../../../../service/SessionService";
import FastService from "../../../../service/FastService";

interface State {
    retrievedQualif
    selectedQualif
    level
    isLeaf: boolean
    caseAlreadyCreated: boolean
}

// TODO: A typer
// TODO: A découper
// TODO: A commenter
// TODO marquer ce qui va disparaitre avec la qualif provenant de FAST

interface Props {
    client
    setQualificationIsSelected: (qualificationCode, serviceType) => void
    setQualificationIsNotSelected: () => void
    setCaseQualification: (qualification) => void
    setQualificationLeaf: (qualificationLeaf) => void
    setAdditionalData: (additionalData) => void
    matchingCase: undefined | Case
    getValuesFromFields?
    motif
    setQualificationSelected
    qualification
    qualificationLeaf
    setCaseMotif: (motif) => void
    isQualificationSelected: boolean
    context: string
    idAct?: string
    qualifWasGivenInThePayload: boolean
    qualificationHierarchyFromSearch : Map<number, string>
    setHasCallTransfer: (value: boolean) => void
    setIsMatchingCaseModalDisplayed: (value: boolean) => void
    casesList
    setMatchingCase
    setValue
    isScalingMode: boolean
    payload
    displayOutput:(elements:JSX.Element[])=>void
    toggleCard:()=>void
    storeCase
    isQualifExpanded:boolean
    currentCase?: Case
    currentContactId: string
}

// tslint:disable-next-line:no-any
class QualificationStep extends Component<Props & RouteComponentProps, State> {
    private caseService: CaseService = new CaseService(true)
    private levelMap = new Map();
    private session : string ="";
    constructor(props) {
        super(props)
        this.state = {
            retrievedQualif: [],
            selectedQualif: [],
            level: 0,
            isLeaf: false,
            caseAlreadyCreated: !!this.props.currentCase?.qualification
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
        let serviceType = this.props.client!.service!.serviceType ? this.props.client!.service!.serviceType : "UNKNOWN";
        if (this.props.qualification) {
            this.props.setAdditionalData(this.props.qualificationLeaf.data)
            this.props.setQualificationIsSelected(this.props.qualificationLeaf.code, serviceType)
        }
        try {
            let currentSessionId: string | undefined = ""  ;
            try {
                currentSessionId = queryString.parse(this.props.location.search.replace("?", "")).sessionId.toString();
            }catch (e) {
                currentSessionId =  SessionService.getSession();
            }
            if (currentSessionId === undefined){
                currentSessionId = ""
            }

            this.session = currentSessionId;

            const retrievedQualif: Array<CasesQualificationSettings> = await this.caseService.getQualifFromSessionId(currentSessionId, serviceType)
            this.initQualifLevelMap(retrievedQualif);
            this.setState({retrievedQualif})

        } catch (e) {
            const error = await e;
            if(error.status) {
                NotificationManager.error(<FormattedMessage id="cases.create.scaling.get.root.themes"/>);
            } else {
                NotificationManager.error(<FormattedMessage id="cases.create.client.data.inconsistencies"/>);
            }
        }
    }

    public async componentDidUpdate(prevProps) {
        if(this.props.qualificationHierarchyFromSearch
            && prevProps.qualificationHierarchyFromSearch != this.props.qualificationHierarchyFromSearch){
            this.initQualificationFromSearch(this.session , this.props.client!.service!.serviceType);
        }
    }

    public retrieveThemes = async (idQualif: string) => {
        try {
            const retrievedQualif:CasesQualificationSettings[] = await this.getChildrenQualifs(idQualif);
            this.initQualifLevelMap(retrievedQualif);
            this.setState({
                retrievedQualif
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

    private initQualifLevelMap(retrievedQualif: Array<CasesQualificationSettings>) {
        const targetLevel = retrievedQualif[0]?.level;// if empty retrieved qualif(and not leaf), keeps the previous one displayed
        this.levelMap.set(targetLevel, []);
        this.clearLevelMapFromLevel(targetLevel);
        retrievedQualif
            .map((event) => {
                let previousArray: [];
                previousArray = this.levelMap.get(event.level) ? this.levelMap.get(event.level) : [];
                this.levelMap.set(event.level, [...previousArray, event]);
            });
    }

    private getChildrenQualifs = async(idQualif :string) => {
        let serviceType = this.props.client!.service!.serviceType ? this.props.client!.service!.serviceType : "UNKNOWN";
        const retrievedQualif: Array<CasesQualificationSettings> = await this.caseService.getQualifFromSessionIdAndAncestor(
            this.session,
            idQualif,
            serviceType);
        return retrievedQualif;
    }

    public renderThemesBoxes = (): JSX.Element[] => {
        let arr:JSX.Element[] =[];
        this.levelMap.forEach((eventEntry, level) =>
           arr.push(<QualificationBox elements={eventEntry} key={level} getNextThemes={this.getNextThemes}/>)
        );
        return arr;
    };


    private initQualificationFromSearch = async(currentSessionId: string , serviceType: string) => {
        const newlevelMap = new Map();
        newlevelMap.set(undefined,[]);
        const newSelectedQualif : Array<CasesQualificationSettings> = [];
        const levels = Array.from(this.props.qualificationHierarchyFromSearch.keys()).sort();
        let lastSelectedMotif : CasesQualificationSettings;
        for(let level of levels){
            const qualifId = this.props.qualificationHierarchyFromSearch.get(level)!;
            let retrievedQualif: Array<CasesQualificationSettings>;
            if(level === 1){
                retrievedQualif = await this.caseService.getQualifFromSessionId(currentSessionId, serviceType)
            }else{
                retrievedQualif = await this.getChildrenQualifs(newSelectedQualif[level-2].id);
            }
            const selectedQualif : CasesQualificationSettings= retrievedQualif.filter(qualif => qualif.id === qualifId)[0];
            newlevelMap.set(level,retrievedQualif);
            if(level !== levels.length){
                selectedQualif.selected = true;
                newSelectedQualif.push(selectedQualif);
            }else{
                lastSelectedMotif = selectedQualif;
            }
        }

        this.levelMap = newlevelMap;
        this.setState((prevState) => ({
            selectedQualif: newSelectedQualif,
            level: levels.length -1 ,
            isLeaf: false,
            retrievedQualif : this.levelMap.get(levels.length)
        }),async () => {
           await this.getNextThemes(lastSelectedMotif);
        });

    }

    public getNextThemes = async (event: CasesQualificationSettings) => {
        if (event === this.state.selectedQualif[this.state.selectedQualif.length - 1]) {
            return
        }
        const newSelectedQualif = [...this.state.selectedQualif];
        newSelectedQualif[event.level-1]= event; // levels starts at 1 and selectedQualif index at 0
        newSelectedQualif.splice(event.level,newSelectedQualif.length);
        this.levelMap.get(event.level).forEach((qualif)=>qualif.selected=false);
        event.selected=true;
        this.setState((prevState) => ({
            selectedQualif: newSelectedQualif,
            level: event.level,
            isLeaf: event.isLeaf
        }), async () => {
            if (!event.isLeaf) {
                await this.retrieveThemes(event.id)
                this.props.setQualificationIsNotSelected()
                this.props.setQualificationLeaf(undefined)
            } else {
                this.clearLevelMapFromLevel(event.level);
                const qualif: CaseThemeQualification = {
                    code: event.code,
                    id: event.id,
                    caseType: event.type,
                    tags: this.QualifArrayToTagsArray(this.state.selectedQualif)
                }
                // TODO mettre ca dans une action redux
                this.props.setQualificationLeaf(event)
                this.props.setQualificationIsSelected(qualif.code, this.props.client!.service!.serviceType)
                this.props.setCaseMotif(qualif)
                this.props.setCaseQualification(qualif)
                const additionnalDataMotif = event.data.map(caseDataProp => ({
                    ...caseDataProp,
                    category: "MOTIF"
                }));
                this.props.setAdditionalData(additionnalDataMotif);
                const listCasesMatchingQualification = this.props.casesList!.filter(recentCase => {
                    const perfectMatch:boolean = qualif!.code === recentCase.qualification.code;
                    const thirdLevelMatch:boolean = qualif.tags[0] === recentCase.qualification.tags[0] &&
                        qualif.tags[1] === recentCase.qualification.tags[1] &&
                        qualif.tags[2] === recentCase.qualification.tags[2];
                    return recentCase.category === "IMMEDIATE" && (perfectMatch || thirdLevelMatch);
                })
                if (listCasesMatchingQualification.length > 0) {
                    this.props.setMatchingCase(listCasesMatchingQualification[0])
                    this.props.setIsMatchingCaseModalDisplayed(true)
                } else {
                    if (!this.props.qualifWasGivenInThePayload) {
                        if (!this.state.caseAlreadyCreated) {
                            try {
                                await this.createDefaultCase(qualif, event);
                                FastService.postResreshFastCasesCounter({
                                    serviceId: this.props.client.serviceId
                                });
                            } catch (e) {
                                const error = await e;
                                const errorKey = error.exceptionName ? "create.default.case." + error.exceptionName + ".message" : "create.default.case.error.message"
                                NotificationManager.error(translate.formatMessage({id: errorKey}))
                            }
                        }
                    }

                }
                this.props.toggleCard();
                this.setState({
                    retrievedQualif: [],
                })
            }
        })
    }

    public createDefaultCase = async (qualif, event) => {
        this.setState({caseAlreadyCreated: true})
        const valuesFromTheParentForm = this.props.getValuesFromFields()
        const caseRequestDTO = this.formatCaseAndADG(valuesFromTheParentForm, qualif, event)
        const createdCase = await this.caseService.createCaseDefault(caseRequestDTO);
        this.props.storeCase(createdCase);

    }

    public formatCaseAndADG = (caseDTO, qualif, event) => {
        caseDTO.category = CaseCategory.IMMEDIATE
        caseDTO.caseId = this.props.payload.idCase;
        caseDTO.clientId = this.props.payload.idClient;
        caseDTO.contact.contactId = this.props.currentContactId;
        caseDTO.serviceId = this.props.payload.idService;
        caseDTO.offerCategory = this.props.client!.service!.category;
        caseDTO.serviceType = this.props.client!.service!.serviceType ? this.props.client!.service!.serviceType : "UNKNOWN";
        caseDTO.siebelAccount = this.props.client!.service?.siebelAccount;
        caseDTO.processing = false;

        if (this.props.idAct) {
            caseDTO.qualification = this.props.qualification
        } else {
            caseDTO.qualification = qualif
        }
        if (event && event.type) {
            caseDTO.qualification.caseType = event.type;
        }
        caseDTO.clientRequest = translate.formatMessage({id: "pre.save.case.default"})

        if (!caseDTO.processingConclusion) {
            caseDTO.processingConclusion = "Traitement incomplet"
        }
        if (!caseDTO.status) {
            caseDTO.status = "CREATED"
        }
        return caseDTO
    }

    // TODO pourquoi y'a 40 breadcrumbs dans ce composant ?
    public renderBreadcrumb() {
        let arr:JSX.Element[]=[];
            arr.push(<Breadcrumb>
                {this.state.selectedQualif.map((event, index) => (
                    <BreadcrumbItem key={index}>
                            {event.label}
                    </BreadcrumbItem>))
                }
                {this.state.isLeaf ? <span/> :
                    <BreadcrumbItem>
                        <FormattedMessage id="cases.qualification.selection.motif"
                                          values={{level: this.state.level + 1}}/>
                    </BreadcrumbItem>}
            </Breadcrumb>);
        this.props.displayOutput(arr);
        return <React.Fragment/>;
    }

    private renderBreadcrumbFromMotif():JSX.Element{
        let arr:JSX.Element[]=[];
        if(this.props.motif?.tags){
            arr.push(
                <React.Fragment>
                    <Breadcrumb>
                        {this.props.motif.tags.filter(tag => tag !== "").map((event, index) => (
                            <BreadcrumbItem key={index}>
                                {event}
                            </BreadcrumbItem>
                        ))}
                    </Breadcrumb>
                    <p>{this.props.motif.description}</p>
                </React.Fragment>
                );
        }
        this.props.displayOutput(arr);
        return <React.Fragment/>
    }

    public render(): JSX.Element {
        if ( (this.props.context === "CreateCasePage" && this.props.idAct) || (this.props.context === "CreateCasePage" && this.props.qualifWasGivenInThePayload)) {
            if (this.props.motif) {
                return this.renderBreadcrumbFromMotif()
            } else {
                return <Loading/>
            }
        } else {
            if (this.props.isScalingMode || !this.props.isQualifExpanded) {
                return this.renderBreadcrumbFromMotif()
            }
            return (
                <React.Fragment>
                    <Row>
                        <Col xs={12}>
                            {this.renderBreadcrumb()}
                        </Col>
                    </Row>
                    <SwitchTransition>
                        <CSSFadeTransition key={this.state.selectedQualif}>
                            <Row>
                                {this.renderThemesBoxes()}
                            </Row>
                        </CSSFadeTransition>
                    </SwitchTransition>
                </React.Fragment>
            );
        }
    }
}

const mapStateToProps = (state: AppState) => ({
    client: state.client,
    motif: state.casePage.motif,
    qualification: state.casePage.qualification,
    qualificationLeaf: state.casePage.qualificationLeaf,
    isQualificationSelected: state.casePage.isQualificationSelected,
    qualifWasGivenInThePayload: state.casePage.qualifWasGivenInThePayload,
    matchingCase: state.recentCases.matchingCaseFound,
    casesList: state.recentCases.casesList,
    isScalingMode: state.casePage.isScalingMode,
    payload: state.payload.payload,
    currentCase: state.case.currentCase,
    currentContactId: state.casePage.currentContactId
});

const mapDispatchToProps = dispatch => ({
    setHasCallTransfer: (value) => dispatch(setHasCallTransfer(value)),
    setQualificationIsSelected: (qualificationCode, serviceType) => dispatch(setQualificationIsSelected(qualificationCode, serviceType)),
    setCaseQualification: (qualification: CasesQualificationSettings) => dispatch(setCaseQualification(qualification)),
    setQualificationLeaf: (qualificationLeaf) => dispatch(setQualificationLeaf(qualificationLeaf)),
    setAdditionalData: (additionalData) => dispatch(setAdditionalData(additionalData)),
    setCaseMotif: (motif) => dispatch(setCaseMotif(motif)),
    setMatchingCase: (caseFound: Case) => dispatch(setMatchingCase(caseFound)),
    setQualificationIsNotSelected:() => dispatch(setQualificationIsNotSelected()),
    setIsMatchingCaseModalDisplayed:(isDisplayed) => dispatch(setIsMatchingCaseModalDisplayed(isDisplayed)),
    storeCase: (caseToSave: Case) => dispatch(storeCase(caseToSave))
})
// tslint:disable-next-line:no-any
export default compose<any>(withRouter, withFormsy, connect(mapStateToProps, mapDispatchToProps))(QualificationStep)


