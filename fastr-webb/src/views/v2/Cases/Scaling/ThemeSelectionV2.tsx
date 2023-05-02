import * as React from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { AppState } from "../../../../store";
import { Breadcrumb, Card, CardHeader, Collapse } from "reactstrap";
import RoutingInformationV2 from "./RoutingInformationV2";
import ThemeStepV2 from "./ThemeStepV2";
import { CaseRoutingRule } from "../../../../model/CaseRoutingRule";
import { CaseBooleans, CaseSection } from "../../../../model/CaseCLO";
import CaseDataSectionV2 from "../CaseData/CaseDataSectionV2";
import {
    notifyThemeSelectionActionV2,
    setAdditionalDataV2,
    setIsCurrentCaseCancelScalingV2,
    setIsCurrentCaseScaledV2,
    setIsThemeNotSelectedV2,
    storeCaseBooleansV2,
    storeCaseV2,
    setQualificationLeafV2,
    updateSectionsV2,
    cancelMaxwellIncident, setCaseHasNotInProgressIncident
} from "../../../../store/actions/v2/case/CaseActions";
import AdditionalScalingInfoV2 from "./AdditionalScalingInfoV2";
import BreadcrumbItem from "reactstrap/lib/BreadcrumbItem";
import "./ThemeSelectionV2.scss";
import { Case } from "../../../../model/Case";
import { setRevertScalingTrue } from "../../../../store/actions";
import { CaseCategory } from "../../../../model/CaseCategory";
import { renderTheRightPicto } from "../List/pictoHandler";
import { forceAutoAssignCaseToCurrentUser } from "../../../../store/actions/CaseActions";
import { CaseStatus } from "../../../../model/case/CaseStatus";
import { setBlockingUIV2 } from "src/store/actions/v2/ui/UIActions";
import {CasesQualificationSettings} from "../../../../model/CasesQualificationSettings";
import CaseService from "../../../../service/CaseService";
import {CaseThemeQualification} from "../../../../model/CaseThemeQualification";

interface Props {
    caseId: string,
    currentCase?: Case,
    isEditable: boolean,
    isExpandable: boolean,
    isExpanded: boolean,
    setRevertScalingTrue: () => void
    validRoutingRule?: CaseRoutingRule,
    themeAdditionalData
    motifAdditionalData
    themeSelected
    scalingAdditionalDataSection?: CaseSection
    setAdditionalDataV2
    setQualificationLeafV2
    isCurrentCaseScaled
    formsyRef
    userActivity?
    authorizations: any
    scalingEligibility
    sections
    notifyThemeSelectionActionV2
    setIsThemeNotSelectedV2
    storeCaseV2
    updateSectionsV2
    setIsCurrentCaseScaledV2
    storeCaseBooleansV2
    caseBooleans: CaseBooleans
    isThemeSelected
    isCurrentlyRequalifying?
    themeQualification?
    setIsCurrentCaseCancelScalingV2,
    isCurrentCaseCancelScaling,
    isCaseHasInProgressIncidentExceptWaiting,
    casePicto,
    forceAutoAssignCaseToCurrentUser,
    setBlockingUIV2,
    cancelMaxwellIncident,
    currentContactId,
    currentCaseIsClosed,
    payload,
    setCaseHasNotInProgressIncident
}

interface State {
    isThemeExpanded: boolean,
    themeHeaderValue: JSX.Element[],
    firstCall: boolean;
    tagsFromAlerte: string[]
}

const caseService: CaseService = new CaseService(true);

class ThemeSelectionV2 extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            isThemeExpanded: this.props.isExpanded,
            themeHeaderValue: [],
            firstCall: true,
            tagsFromAlerte: []
        }
    }

    public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any) {
        if (JSON.stringify(prevProps.themeSelected) !== JSON.stringify(this.props.themeSelected) || this.state.firstCall) {
            if (this.props.themeSelected && this.props.themeSelected.length > 0) { this.props.setBlockingUIV2(false); }
            if (this.props.themeSelected && this.props.themeSelected.length > 0 && this.props.payload?.refCTT) {
                this.buildFullMotif(this.props.themeSelected[0]).then(() => {
                    this.renderBreadcrumb()
                })
            } else {
                this.renderBreadcrumb();
            }
            this.setState({ firstCall: false });
        }
    }


    private async buildFullMotif(theme : CasesQualificationSettings) {
        const tags: string[] = [];
        let currentTheme = theme;
        tags.push(theme.label);
        while (currentTheme.codeAncestor) {
            const qualifAncestor = await caseService.getCaseQualifSettings(currentTheme.codeAncestor);
            tags.push(qualifAncestor.label);
            currentTheme = qualifAncestor;
        }
        const caseThemeQual : CaseThemeQualification = {
            caseType: theme.type,
            code: theme.code,
            tags: tags.reverse(),
            id: theme.id
        }
        this.props.setQualificationLeafV2(this.props.caseId, caseThemeQual)
        this.setState({tagsFromAlerte: tags})
    }

    public renderBreadcrumb() {
        const arr: JSX.Element[] = [];
        const themesFromCase = this.props.currentCase?.themeQualification?.tags
        let themesToDisplay = themesFromCase && themesFromCase.length > 0 ? themesFromCase : this.props.themeSelected;
        if (this.props.payload?.refCTT) {
            themesToDisplay = this.state.tagsFromAlerte;
        }
        arr.push(
            <Breadcrumb>
                {this.props.payload?.refCTT ?
                    this.state.tagsFromAlerte?.map((theme, index) => (
                        <BreadcrumbItem key={index}>
                            {theme}
                        </BreadcrumbItem>))
                    : themesToDisplay?.map((theme, index) => (
                    <BreadcrumbItem key={index}>
                        {themesFromCase && themesFromCase.length > 0 ? theme : theme.label}
                    </BreadcrumbItem>)
                )}
            </Breadcrumb>
        );
        this.setThemeHeaderValue(
            arr
        );
    }
    public notQualifiedGdprCase(){
        return this.props.currentCase?.status !== "QUALIFIED" || (this.props.currentCase?.status === "QUALIFIED" && this.props.validRoutingRule?.receiverActivity.code !== 'ACT998');
    }
    public render() {
        const isOwnerMatching = this.props.validRoutingRule?.receiverActivity.code === this.props.userActivity?.code;
        const isCreation = this.props.currentCase?.category === 'IMMEDIATE' || this.props.isCurrentCaseCancelScaling;
        const pictoToDisplay = renderTheRightPicto(this.props.casePicto);
        return this.props.isCurrentCaseScaled ? (
            <section>
                <Card className="my-2">
                    <CardHeader onClick={this.toggleTheme} className={"theme-selection-v2__card-header d-flex justify-content-between align-items-center"}>
                        <section className={"theme-selection-v2__card-header-breadcrumb"}>
                            <div className={"generic-card-toggle__picto"}>{pictoToDisplay}</div>
                            <FormattedMessage id={"cases.get.details.escaladae"} />
                            {this.state.themeHeaderValue.length > 0 && this.state.themeHeaderValue}
                        </section>

                        <section className="d-flex justify-content-between align-items-center">
                            {this.props.caseBooleans?.canDisplayPrendreEnChargeBtn &&
                                this.renderPrendreEnChargeButton()
                            }

                            {
                                this.props.scalingEligibility &&
                                (this.props.currentCase?.category !== CaseCategory.SCALED || this.props.validRoutingRule?.receiverActivity.code !== this.props.userActivity?.code) &&
                                this.props.currentCase?.status !== "ONGOING" &&
                                this.props.isCaseHasInProgressIncidentExceptWaiting === false && !this.props.currentCaseIsClosed &&
                                this.notQualifiedGdprCase() &&
                                this.renderCancelScalingButton()
                            }

                            {(this.props.isExpandable && !this.props.isThemeSelected) && <i className={`icon icon-white float-right  ${this.state.isThemeExpanded ? 'icon-up' : 'icon-down'}`} />}
                        </section>
                    </CardHeader>
                    <Collapse isOpen={this.state.isThemeExpanded}>
                        {this.props.isEditable &&
                            <ThemeStepV2 name="scaling.caseThemeQualification"
                                shouldDisplay={!this.props.isThemeSelected}
                                displayOutput={this.setThemeHeaderValue}
                                caseId={this.props.caseId}
                                toggleCard={this.toggleTheme} />
                        }
                    </Collapse>
                    <div>
                        <RoutingInformationV2
                            caseId={this.props.caseId}
                            routingRule={this.props.validRoutingRule} />
                        {
                            this.props.scalingAdditionalDataSection && !(this.props.themeSelected?.length > 0 && !!this.props.themeSelected[0].incident) &&
                            <CaseDataSectionV2 data={this.props.themeAdditionalData}
                                readOnly={!this.props.scalingAdditionalDataSection.editable}
                                onChange={this.handleChange}
                                sectionClass={"theme-additional-data"}
                                caseId={this.props.caseId}
                                propreType={"escale"} />
                        }
                        {
                            ((this.props.isThemeSelected && ((isOwnerMatching && isCreation) || (!isCreation)))
                            || this.props.payload?.refCTT) &&
                            <AdditionalScalingInfoV2
                                caseId={this.props.caseId}
                                formsyRef={this.props.formsyRef}
                                readOnly={!this.props.isEditable}
                            />
                        }
                    </div>
                </Card>
            </section>
        ) : <React.Fragment />
    }

    private toggleTheme = () => {
        this.setState({
            isThemeExpanded: !this.state.isThemeExpanded
        })
    }

    private setThemeHeaderValue = (elements: JSX.Element[]) => {
        this.setState({
            themeHeaderValue: elements
        })
    }

    private handleChange = (id: string, val: string) => {
        const additionalData = this.props.themeAdditionalData.slice();
        additionalData.forEach((d) => {
            if (d.id === id) {
                d.value = val;
            }
        });
        if (additionalData) {
            let tab: any[] = []
            if (this.props.motifAdditionalData) {
                tab = [...this.props.motifAdditionalData!];
            }
            tab = [...tab, ...additionalData];
            this.props.setAdditionalDataV2(this.props.caseId, tab)
        }
    };

    private cancelScaling = (e) => {
        e?.stopPropagation();
        this.props.setBlockingUIV2(false);
        this.props.cancelMaxwellIncident(this.props.caseId);
        this.props.setCaseHasNotInProgressIncident(this.props.caseId)
        let tab: any[] = []
        if (this.props.motifAdditionalData) {
            tab = [...this.props.motifAdditionalData!];
        }
        this.props.setAdditionalDataV2(this.props.caseId, tab) // reset theme additionalData

        if (this.props.currentCase?.category === CaseCategory.SCALED) {
            this.props.formsyRef().current?.setValue("scaling.removed", true);
            this.props.setIsCurrentCaseCancelScalingV2(this.props.caseId, true)
        }

        this.props.notifyThemeSelectionActionV2(this.props.caseId);
        this.props.setIsThemeNotSelectedV2(this.props.caseId);

        this.props.storeCaseV2({
            ...this.props.currentCase,
            doNotResolveBeforeDate: undefined,
            progressStatus: undefined
        })

        this.props.storeCaseBooleansV2(this.props.currentCase?.caseId, {
            ...this.props.caseBooleans,
            canCCReQualifyCurrentCase: true
        });

        this.props.sections.find((s) => s.code === "QUALIFICATION").editable = true;
        this.props.sections.find((s) => s.code === "SCALING").editable = true;
        this.props.sections.find((s) => s.code === "SCALING_ADDITIONAL_DATA").editable = true;
        this.props.sections.find((s) => s.code === "CONCLUSION").editable = true;

        this.props.updateSectionsV2(this.props.caseId, [...this.props.sections])
        this.props.setIsCurrentCaseScaledV2(this.props.caseId, false)
    }

    private handlePrendreEnCharge = (e) => {
        this.props.forceAutoAssignCaseToCurrentUser(this.props.caseId, this.props.currentContactId)
        this.props.storeCaseBooleansV2(this.props.currentCase?.caseId, {
            ...this.props.caseBooleans,
            canCCUpdateCurrentCase: true,
            canDisplayPrendreEnChargeBtn: false
        });
        this.props.sections.find((s) => s.code === "SCALING").editable = true;
        this.props.sections.find((s) => s.code === "SCALING_ADDITIONAL_DATA").editable = true;
        this.props.sections.find((s) => s.code === "CONCLUSION").editable = true;
        this.props.updateSectionsV2(this.props.caseId, [...this.props.sections])
    }

    private renderPrendreEnChargeButton = () => {
        return (
            <div className='theme-selection-v2__annuler-escalade_button d-flex justify-content-between align-items-center mr-2'>
                <section className="btn btn-dark btn-sm" onClick={this.handlePrendreEnCharge}>
                    <FormattedMessage id={"cases.create.prendre.en.charge"} />
                </section>
            </div>
        )
    }

    private renderCancelScalingButton = () => {
        return (
            <div className='theme-selection-v2__annuler-escalade_button mr-2'>
                <section className="btn btn-dark btn-sm" onClick={this.cancelScaling}>
                    <FormattedMessage id={"cases.create.transfer.cancel"} />
                </section>
            </div>
        )
    }
}

const mapStateToProps = (state: AppState, ownProps: Props) => ({
    currentCase: state.store.cases.casesList[ownProps.caseId]?.currentCase,
    isCurrentlyRequalifying: state.store.cases.casesList[ownProps.caseId]?.isCurrentlyRequalifying,
    isCurrentCaseCancelScaling: state.store.cases.casesList[ownProps.caseId]?.isCurrentCaseCancelScaling,
    caseBooleans: state.store.cases.casesList[ownProps.caseId]?.caseBooleans,
    validRoutingRule: state.store.cases.casesList[ownProps.caseId]?.validRoutingRule,
    isCurrentCaseScaled: state.store.cases.casesList[ownProps.caseId]?.isCurrentCaseScaled,
    isThemeSelected: state.store.cases.casesList[ownProps.caseId]?.isThemeSelected,
    themeSelected: state.store.cases.casesList[ownProps.caseId]?.themeSelected,
    userActivity: state.store.applicationInitialState.user?.activity,
    scalingEligibility: state.store.cases.casesList[ownProps.caseId]?.scalingEligibility,
    themeAdditionalData: state.store.cases.casesList[ownProps.caseId]?.additionalData.filter((dat) => dat.category === "THEME"),
    motifAdditionalData: state.store.cases.casesList[ownProps.caseId]?.additionalData.filter((dat) => dat.category === "MOTIF"),
    sections: state.store.cases.casesList[ownProps.caseId]?.sections,
    scalingAdditionalDataSection: state.store.cases.casesList[ownProps.caseId]?.sections
        .find((section) => section.code === "SCALING_ADDITIONAL_DATA"),
    isCaseHasInProgressIncidentExceptWaiting: state.store.cases.casesList[ownProps.caseId]?.hasInProgressIncidentExceptWaiting,
    currentContactId: state.store.contact.currentContact?.contactId,
    currentCaseIsClosed: state.store.cases.casesList[ownProps.caseId]?.currentCase?.status === CaseStatus.CLOSED,
    payload: state.payload.payload
});

const mapDispatchToProps = {
    setRevertScalingTrue,
    setAdditionalDataV2,
    notifyThemeSelectionActionV2,
    storeCaseV2,
    updateSectionsV2,
    setQualificationLeafV2,
    setIsCurrentCaseScaledV2,
    storeCaseBooleansV2,
    setIsThemeNotSelectedV2,
    setIsCurrentCaseCancelScalingV2,
    forceAutoAssignCaseToCurrentUser,
    setBlockingUIV2,
    cancelMaxwellIncident,
    setCaseHasNotInProgressIncident
}

export default connect(mapStateToProps, mapDispatchToProps)(ThemeSelectionV2)
