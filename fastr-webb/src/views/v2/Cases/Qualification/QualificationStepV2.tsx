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
import QualificationBoxV2 from "./QualificationBoxV2";
import SwitchTransition from "react-transition-group/SwitchTransition";
import {CSSFadeTransition} from "../../../../components/Transitions/CSSTransition";
import SessionService from "../../../../service/SessionService";
import {
    setAdditionalDataV2,
    setCanCurrentCaseBeScaledV2,
    setCaseMotifV2,
    setHasCallTransferV2,
    setIsMatchingCaseModalDisplayedV2,
    setMatchingCaseV2,
    setQualificationIsNotSelectedV2,
    setQualificationLeafV2,
    setQualificationSelectedV2,
    storeCaseV2,
    updateSectionsV2
} from "../../../../store/actions/v2/case/CaseActions";
import {CaseState} from "../../../../store/reducers/v2/case/CasesPageReducerV2";
import {CaseRequestCLO} from "../../../../model/CaseRequestCLO";
import {CaseCLO} from "../../../../model/CaseCLO";
import {setBlockingUIV2} from "../../../../store/actions/v2/ui/UIActions";
import {ClientContextSliceState} from "../../../../store/ClientContextSlice";
import {fetchAndStoreIsServiceInLists} from "../../../../store/actions/v2/client/ClientActions";

interface State {
    retrievedQualif
    selectedQualif
    level
    isLeaf: boolean
    caseAlreadyCreated: boolean
}

interface Props {
    formsyRef
    getDiffFromPristine
    name: string
    caseId: string,
    currentCases: any,
    setCanCurrentCaseBeScaledV2
    client: ClientContextSliceState
    setQualificationIsSelected: (caseId, qualificationCode) => void
    setQualificationIsNotSelected: (caseId) => void
    // setCaseQualification: (caseId, qualification) => void
    setQualificationLeaf: (caseId, qualificationLeaf) => void
    setAdditionalData: (caseId, additionalData) => void
    getValuesFromFields?
    setQualificationSelected
    setCaseMotif: (caseId, motif) => void
    isQualificationSelected: boolean
    idAct?: string
    qualifWasGivenInThePayload: boolean
    qualificationHierarchyFromSearch: Map<number, string>
    setHasCallTransfer: (caseId, value: boolean) => void
    setIsMatchingCaseModalDisplayed: (caseId, value: boolean) => void
    casesList
    setMatchingCase: (caseId, aCase) => void
    setValue
    payload
    displayOutput: (elements: JSX.Element[]) => void
    toggleCard: () => void
    storeCase
    updateSectionsV2: (caseId: string, sections) => void
    isQualifExpanded: boolean
    currentContactId: string
    setBlockingUIV2
    setHandleCancelModalMatchingCase
    cancelScalingButtonRef?
    caseSections
    duplicateLevel: number,
    isServiceInLists
    fetchAndStoreIsServiceInLists
}

// tslint:disable-next-line:no-any
class QualificationStepV2 extends Component<Props & RouteComponentProps, State> {
    private caseService: CaseService = new CaseService(true)
    private levelMap = new Map();
    private session: string = "";

    constructor(props) {
        super(props)
        this.state = {
            retrievedQualif: [],
            selectedQualif: [],
            level: 0,
            isLeaf: false,
            caseAlreadyCreated: !!this.currentCase()?.qualification
        }
        if (this.props.setHandleCancelModalMatchingCase) {
            const handle = () => {
                this.clearLevelMapFromLevel(1);
                this.props.toggleCard();
            };
            this.props.setHandleCancelModalMatchingCase(() => handle);
        }

    }

    private currentCaseState = (): CaseState => {
        return this.props.currentCases[this.props.caseId]
    }

    private currentCase = (): Case | undefined => {
        return this.currentCaseState()?.currentCase
    }

    public QualifArrayToTagsArray = (qualifs: CasesQualificationSettings[]) => {
        const qualiflabels: string[] = [];
        qualifs.forEach(qualif => {
            qualiflabels.push(qualif.label);
        });
        return qualiflabels;
    }

    public componentWillMount = async () => {
        if (this.currentCaseState()?.qualificationLeaf) {
            if (this.currentCaseState().additionalData && this.currentCaseState().additionalData.length > 0 && !(this.currentCaseState().additionalData.length > 0)) {
                const augmentedData = this.currentCaseState().qualificationLeaf.data.map((d) => {
                    d.category = "MOTIF";
                    return d;
                });
                this.props.setAdditionalData(this.props.caseId, augmentedData)
            }
            this.props.setQualificationIsSelected(this.props.caseId, this.currentCaseState().qualificationLeaf.code)
        }
        if (this.props.client && this.props.client.service) {
            this.props.fetchAndStoreIsServiceInLists(this.props.client.clientData?.id, this.props.client.serviceId)
            await this.initQualif();
        }
    }

    private initQualif = async () => {
        try {
            const serviceType = this.props.client!.service!.serviceType ? this.props.client!.service!.serviceType : "UNKNOWN";
            let currentSessionId: string | undefined = "";
            try {
                currentSessionId = queryString.parse(this.props.location.search.replace("?", "")).sessionId.toString();
            } catch (e) {
                currentSessionId = SessionService.getSession();
            }
            if (currentSessionId === undefined) {
                currentSessionId = ""
            }

            this.session = currentSessionId;

            this.props.setBlockingUIV2(true);
            const retrievedQualif: Array<CasesQualificationSettings> = await this.caseService.getQualifFromSessionId(currentSessionId, serviceType)
            this.initQualifLevelMap(retrievedQualif);
            this.setState({retrievedQualif})
            if (retrievedQualif?.length === 1) {
                const motif = this.props.currentCases[this.props.caseId].motif;
                const alreadySelected = motif  && motif.tags.filter(a => a===retrievedQualif[0].label);
                if(!alreadySelected){
                    await this.forceNextQualif(retrievedQualif.pop());
                }
            }
        } catch (e) {
            const error = await e;
            if (error.status) {
                NotificationManager.error(<FormattedMessage id="cases.create.scaling.get.root.themes"/>);
            } else {
                NotificationManager.error(<FormattedMessage id="cases.create.client.data.inconsistencies"/>);
            }
        } finally {
            this.props.setBlockingUIV2(false);
        }
    }

    public forceNextQualif = async (theme: CasesQualificationSettings | undefined) => {
        if (theme) {
            await this.getNextThemes(theme)
        }
    }

    public async componentDidUpdate(prevProps) {
        if (this.props.qualificationHierarchyFromSearch
            && prevProps.qualificationHierarchyFromSearch != this.props.qualificationHierarchyFromSearch) {
            this.initQualificationFromSearch(this.session, this.props.client!.service!.serviceType);
        }

        if (!prevProps.client && this.props.client ||
            prevProps.client && this.props.client && prevProps.client.serviceId !== this.props.client.serviceId) { // should trigger only once, when client is loaded
            await this.initQualif();
        }
    }

    public retrieveThemes = async (idQualif: string) => {
        try {
            this.props.setBlockingUIV2(true);
            const retrievedQualif: CasesQualificationSettings[] = await this.getChildrenQualifs(idQualif);
            this.props.setBlockingUIV2(false);

            this.initQualifLevelMap(retrievedQualif);
            this.setState({
                retrievedQualif
            });
            return retrievedQualif;
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

    private getChildrenQualifs = async (idQualif: string) => {
        let serviceType = this.props.client!.service!.serviceType ? this.props.client!.service!.serviceType : "UNKNOWN";
        this.props.setBlockingUIV2(true);
        const retrievedQualif: Array<CasesQualificationSettings> = await this.caseService.getQualifFromSessionIdAndAncestor(
            this.session,
            idQualif,
            serviceType);
        this.props.setBlockingUIV2(false);

        return retrievedQualif;
    }

    public renderThemesBoxes = (): JSX.Element[] => {
        let arr: JSX.Element[] = [];
        this.levelMap.forEach((eventEntry, level) =>
            arr.push(<QualificationBoxV2 elements={eventEntry} key={level} getNextThemes={this.getNextThemes}/>)
        );
        return arr;
    };


    private initQualificationFromSearch = async (currentSessionId: string, serviceType: string) => {
        const newlevelMap = new Map();
        newlevelMap.set(undefined, []);
        const newSelectedQualif: Array<CasesQualificationSettings> = [];
        const levels = Array.from(this.props.qualificationHierarchyFromSearch.keys()).sort();
        let lastSelectedMotif: CasesQualificationSettings;
        for (let level of levels) {
            const qualifId = this.props.qualificationHierarchyFromSearch.get(level)!;
            let retrievedQualif: Array<CasesQualificationSettings>;
            this.props.setBlockingUIV2(true);
            if (level === 1) {
                retrievedQualif = await this.caseService.getQualifFromSessionId(currentSessionId, serviceType)
            } else {
                retrievedQualif = await this.getChildrenQualifs(newSelectedQualif[level - 2].id);
            }
            this.props.setBlockingUIV2(false);
            const selectedQualif: CasesQualificationSettings = retrievedQualif.filter(qualif => qualif.id === qualifId)[0];
            newlevelMap.set(level, retrievedQualif);
            if (level !== levels.length) {
                selectedQualif.selected = true;
                newSelectedQualif.push(selectedQualif);
            } else {
                lastSelectedMotif = selectedQualif;
            }
        }

        this.levelMap = newlevelMap;
        this.setState((prevState) => ({
            selectedQualif: newSelectedQualif,
            level: levels.length - 1,
            isLeaf: false,
            retrievedQualif: this.levelMap.get(levels.length)
        }), async () => {
            await this.getNextThemes(lastSelectedMotif);
        });

    }

    public getNextThemes = async (event: CasesQualificationSettings) => {
        if (event === this.state.selectedQualif[this.state.selectedQualif.length - 1]) {
            return
        }
        const newSelectedQualif = [...this.state.selectedQualif];
        newSelectedQualif[event.level - 1] = event; // levels starts at 1 and selectedQualif index at 0
        newSelectedQualif.splice(event.level, newSelectedQualif.length);
        this.levelMap.get(event.level).forEach((qualif) => qualif.selected = false);
        event.selected = true;
        this.setState((prevState) => ({
            selectedQualif: newSelectedQualif,
            level: event.level,
            isLeaf: event.isLeaf
        }), async () => {
            if (!event.isLeaf) {
                this.props.setBlockingUIV2(true);
                try {
                    const retrievedQualif: CasesQualificationSettings[] = await this.retrieveThemes(event.id)
                    this.props.setQualificationIsNotSelected(this.props.caseId)
                    this.props.setQualificationLeaf(this.props.caseId, undefined)
                    // reset Additional Data
                    this.props.setAdditionalData(this.props.caseId, []);
                    if(retrievedQualif?.length === 1) {
                        console.log('getNextThemes 321 ')
                        await this.forceNextQualif(retrievedQualif.pop());
                    }
                } finally {
                    this.props.setBlockingUIV2(false);
                }
            } else {
                const additionnalDataMotif = event.data.map(caseDataProp => ({
                    ...caseDataProp,
                    category: "MOTIF"
                }));
                if (this.props.cancelScalingButtonRef &&
                    this.props.cancelScalingButtonRef.current &&
                    this.props.cancelScalingButtonRef.current.props.onClick
                ) {
                    this.props.cancelScalingButtonRef.current.props.onClick(null);
                }
                this.clearLevelMapFromLevel(event.level);
                const qualif: CaseThemeQualification = {
                    code: event.code,
                    id: event.id,
                    caseType: event.type,
                    tags: this.QualifArrayToTagsArray(this.state.selectedQualif)
                }

                let listCasesMatchingQualification;
                if (this.props.isServiceInLists?.inDuplicateCaseWhitelist) {
                    listCasesMatchingQualification = [];
                } else {
                    listCasesMatchingQualification = this.props.casesList!.filter((recentCase: Case) => {
                        if (recentCase.caseId !== this.props.caseId && recentCase.status !== "CLOSED") {
                            let isDuplicate = false;
                            qualif.tags.forEach((qualifTag, index) => {
                                if (recentCase.qualification.tags[index] === qualifTag && index >= this.props.duplicateLevel - 1) {
                                    isDuplicate = true;
                                }
                            })
                            return isDuplicate
                        }
                        return false;
                    })
                }

                if (listCasesMatchingQualification.length > 0 && !this.state.caseAlreadyCreated) {
                    this.props.setMatchingCase(this.props.caseId, listCasesMatchingQualification[0])
                    this.props.setIsMatchingCaseModalDisplayed(this.props.caseId, true)
                } else {

                    // TODO mettre ca dans une action redux
                    this.props.setQualificationLeaf(this.props.caseId, event)

                    this.props.formsyRef().current?.setValue("qualification", qualif);

                    this.props.setQualificationIsSelected(this.props.caseId, qualif.code)
                    this.props.setCaseMotif(this.props.caseId, qualif)
                    this.props.setAdditionalData(this.props.caseId, additionnalDataMotif);
                    const scalingEligibility = await this.caseService.atLeastOneThemeContainRoutingRule(qualif.code,
                        this.props.client.service!.serviceType)
                    this.props.setCanCurrentCaseBeScaledV2(this.props.caseId, scalingEligibility);
                    if (!this.props.qualifWasGivenInThePayload) {
                        if (!this.state.caseAlreadyCreated) {
                            try {
                                this.props.setBlockingUIV2(true);
                                await this.createDefaultCase();
                            } catch (e) {
                                console.log("Catched Error couldn't createDefaultCase")
                                NotificationManager.error("Ce numéro de dossier a déjà été attribué, veuillez relancer la création")
                            } finally {
                                this.props.setBlockingUIV2(false);
                            }
                        } else { // else on rend éditable les sections , chemin R2
                            const excluded = ["ADG_RETENTION", "ADG_ANTICHURN", "ADDITIONAL_DATA", "SCALING_ADDITIONAL_DATA"]
                            const editableSections: any = [];
                            this.props.caseSections
                                .forEach((section, index) => {
                                    editableSections.push({...section})
                                    if (excluded.indexOf(section.code) === -1) {
                                        editableSections[index].editable = true;
                                    }
                                })
                            this.props.updateSectionsV2(this.props.caseId, editableSections)
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

    public createDefaultCase = async () => {
        setTimeout(async () => { // unsync to let the form update
            this.setState({caseAlreadyCreated: true})
            const diffFromPristine = this.props.getDiffFromPristine();
            const caseRequestCLO: CaseRequestCLO = this.formatCaseRequest(diffFromPristine)
            this.props.setBlockingUIV2(true);
            try {
                const createdCaseCLO: CaseCLO = await this.caseService.createOrUpdateCaseV2(caseRequestCLO);

                createdCaseCLO.sections.forEach((updatedSection, index) => {
                    let previousSection = this.props.caseSections.find((caseSection) => caseSection.code === updatedSection.code)
                    if (previousSection) {
                        previousSection = {
                            ...previousSection,
                            ...updatedSection
                        }
                    } else { // !_! indexes pas décalés
                        this.props.caseSections.splice(index, 0, updatedSection)
                    }
                });

                //this.props.updateSectionsV2(createdCaseCLO.currentCase.caseId, newSections)
                this.props.storeCase(createdCaseCLO.currentCase);
            } finally {
                this.props.setBlockingUIV2(false);
            }
        }, 1);

    }

    private formatCaseRequest = (diffFromPristine): CaseRequestCLO => {
        const baseCaseRequest: CaseRequestCLO = {
            caseId: this.props.caseId,
            clientId: this.props.payload?.idClient || this.props.client.clientData?.id,
            serviceId: this.props.payload?.idService ||this.props.client.serviceId,
            contact: {id: this.props.currentContactId},
        };

        return {
            ...baseCaseRequest,
            ...diffFromPristine,
            contact: {
                ...baseCaseRequest.contact,
            }
        };
    }

    public renderBreadcrumb() {
        let arr: JSX.Element[] = [];
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

    private renderBreadcrumbFromMotif(): JSX.Element {
        let arr: JSX.Element[] = [];
        if (this.currentCaseState()?.motif?.tags) {
            arr.push(
                <React.Fragment>
                    <Breadcrumb>
                        {this.currentCaseState().motif?.tags.filter(tag => tag !== "").map((event, index) => (
                            <BreadcrumbItem key={event}>
                                {event}
                            </BreadcrumbItem>
                        ))}
                    </Breadcrumb>
                </React.Fragment>
            );
        }
        this.props.displayOutput(arr);
        return <React.Fragment/>
    }

    public render(): JSX.Element {
        if (!this.props.isQualifExpanded || this.props.payload?.refCTT) {
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

const mapStateToProps = (state: AppState, ownProps: Props) => ({
    currentCases: state.store.cases.casesList,
    cancelScalingButtonRef: state.store.cases.casesList[ownProps.caseId]?.cancelScalingButtonRef,
    caseSections: state.store.cases.casesList[ownProps.caseId]?.sections,
    client:  state.store.client.currentClient,
    currentContactId: state.store.contact.currentContact?.contactId,
    casesList: state.store.recentCases.casesList,
    payload: state.payload.payload,
    duplicateLevel: state.store.applicationInitialState.duplicateCaseQualificationLevelSetting?.settingDetail,
    isServiceInLists: state.store.client.isServiceInLists
});

const mapDispatchToProps = dispatch => ({
    setHasCallTransfer: (caseId, value) => dispatch(setHasCallTransferV2(caseId, value)),
    setQualificationIsSelected: (caseId) => dispatch(setQualificationSelectedV2(caseId)),
    setQualificationLeaf: (caseId, qualificationLeaf) => dispatch(setQualificationLeafV2(caseId, qualificationLeaf)),
    setAdditionalData: (caseId, additionalData) => dispatch(setAdditionalDataV2(caseId, additionalData)),
    setCaseMotif: (caseId, motif) => dispatch(setCaseMotifV2(caseId, motif)),
    setMatchingCase: (caseId, caseFound: Case) => dispatch(setMatchingCaseV2(caseId, caseFound)),
    setQualificationIsNotSelected: (caseId) => dispatch(setQualificationIsNotSelectedV2(caseId)),
    setIsMatchingCaseModalDisplayed: (caseId, isDisplayed) => dispatch(setIsMatchingCaseModalDisplayedV2(caseId, isDisplayed)),
    updateSectionsV2: (caseId, sections) => dispatch(updateSectionsV2(caseId, sections)),
    setCanCurrentCaseBeScaledV2: (caseId, value) => dispatch(setCanCurrentCaseBeScaledV2(caseId, value)),
    fetchAndStoreIsServiceInLists: (clientId, serviceId) => dispatch(fetchAndStoreIsServiceInLists(clientId, serviceId)),
    storeCase: (caseToSave: Case) => dispatch(storeCaseV2(caseToSave)),
    setBlockingUIV2: (value: boolean) => dispatch(setBlockingUIV2(value)),
})
// tslint:disable-next-line:no-any
export default compose<any>(withRouter, withFormsy, connect(mapStateToProps, mapDispatchToProps))(QualificationStepV2)


