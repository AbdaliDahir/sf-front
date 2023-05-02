import React, {Component} from 'react';
import {FormattedMessage} from "react-intl";
import {connect} from "react-redux";
import {RouteComponentProps, withRouter} from "react-router";
import Button from "reactstrap/lib/Button";
import Col from "reactstrap/lib/Col";
import Label from "reactstrap/lib/Label";
import Row from "reactstrap/lib/Row";
import {compose} from "redux";
import "./GridForADGInsideCaseV2.scss"
import {Nav, NavItem, NavLink, TabContent, TabPane} from "reactstrap";
import classnames from 'classnames';
import {AsyncTypeahead} from "react-bootstrap-typeahead";
import CaseService from "../../../service/CaseService";
import {Client} from "../../../model/person";
import {translate} from "../../../components/Intl/IntlGlobalProvider";
import Loading from "../../../components/Loading";
import ClientErrorModal from "../../../components/Modals/component/ClientErrorModal";
import {AppState} from "../../../store";
import {ClientContextSliceState} from "../../../store/ClientContextSlice";
import {CasesQualificationSettings} from "../../../model/CasesQualificationSettings";
import {Case} from "../../../model/Case";
import {NotificationManager} from "react-notifications";
import FastService from "../../../service/FastService";
import {AramisActs} from "../../../model/enums/AramisActs";
import StringUtils from "../../../utils/StringUtils";
import {CaseState} from "../../../store/reducers/v2/case/CasesPageReducerV2";

interface Props extends RouteComponentProps<void> {
    authorizations
    client: ClientContextSliceState,
    setIdAct,
    setActLabel,
    setIsAction,
    currentCases,
    isCurrentCaseScaled,
    themeSelected,
    codeReceiverActivity,
    userActivity,
    caseId,
    getValuesFromFields: () => any,
    fastTabId,
    hideGridADG: (value: boolean) => void
}

interface State {
    buttonList,
    searchInput: string,
    selectedTab: string
    searchButtonList,
    loading: boolean,
    options,
    topActs: string[],
    currentThemeQualificationDetails?: CasesQualificationSettings
}

class GridForADGInsideCaseV2 extends Component<Props, State> {

    public compteur = 0;
    private _typeahead: any;
    private casesService: CaseService = new CaseService(true);

    constructor(props: Props) {
        super(props);
        this.state = {
            buttonList: [],
            searchInput: "",
            selectedTab: "",
            searchButtonList: [],
            loading: false,
            options: [],
            topActs: []
        }
    }

    public async componentDidMount() {
        await this.fetchAllowedActionsAndActsToDisplay()
        await this.fetchTopActs()
    }

    public fetchTopActs = async () => {
        this.setState({loading: true})
        try {
            const data: Client | undefined = this.props.client.clientData;
            const topActs = await this.casesService.getAdgStatsByActivities(this.props.client!.service!.category, data!.clientCategory);
            this.setState({
                loading: false,
                topActs: this.filterTopActNotAllowedActionsAndActs(topActs)
            })
        } catch (error) {
            console.error(error)
            this.setState({
                loading: false,
                topActs: []
            })
        }
        this.setState({selectedTab: this.state.topActs.length > 0 ? 'top' : 'admin'})
    }

    public filterTopActNotAllowedActionsAndActs = (topActs: Array<string>) => {
        const allowedTopActionsAndActs: Array<string> = []
        if(this.state.buttonList && this.state.buttonList.length > 0) {
            const actsCodes = this.state.buttonList.map(button => button.actCode)
            topActs.forEach(act => {
                if(actsCodes.includes(act)) {
                    allowedTopActionsAndActs.push(act)
                }
            })
        }
        return allowedTopActionsAndActs;
    }

    public renderButtonList(category: string) {
        let buttonListForRendering = category !== "top" ?
            this.deductAllowedActionsAndActs(category) :
            this.getTopActButtonsDetails();
        buttonListForRendering.sort((a, b) => {
            const textA = translate.formatMessage({id: a.actLabel})
            const textB = translate.formatMessage({id: b.actLabel})
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        })
        buttonListForRendering = buttonListForRendering.map((button, i) => {
            const buttonIcon = this.getButtonIcon(button)
            return (
                <Col key={i}>
                    <Button id={button.actAuthorization} color="primary" className="btn-lg"
                            onClick={Object.values(AramisActs).includes(button.actCode) ? this.openTabInFast : this.setIdAct}>
                        <span className={`icon-white ${buttonIcon}`}/>
                    </Button>
                    <br/>
                    <Label className="m-2 text-center font-weight-bold"> <FormattedMessage
                        id={button.actLabel}/></Label>
                </Col>
            )
        })


        if (!this.state.loading) {
            // tslint:disable-next-line:no-any
            const content: any = []
            let it = 0
            const j = buttonListForRendering.length;
            // tslint:disable-next-line:no-any
            let temparray: any = []
            const chunk = 5;
            while (it < j) {
                temparray = buttonListForRendering.slice(it, it + chunk);
                it += chunk
                content.push(temparray)
            }

            if (buttonListForRendering.length < 1) {
                return <p>Pas d'actions trouvées</p>;
            }

            while (content[content.length - 1].length < 5) {
                content[content.length - 1].push(<Col/>)
            }

            return content.map((row, i) => {
                return (
                    <Row key={i}>
                        {row.map(col => {
                            return (col)
                        })}
                    </Row>
                )
            })

        } else {
            return <Loading/>
        }
    }

    public deductAllowedActionsAndActs(category: string) {
        return this.state.buttonList.filter(button => button.actCategory?.includes(category) && this.checkSpecificEligibility(button));
    }

    public checkSpecificEligibility(button) {
       if(button.specificEligibility) {
            switch (button.actAuthorization) {
                case "ADG_MAXWELL":
                    return this.applyMaxwellSpecificEligibility();
            }
        }        
        return true;
    }
    /**
     * MAXWELL_02 Rule
     */
    public applyMaxwellSpecificEligibility = () => {
        return this.props.isCurrentCaseScaled &&
                this.props.themeSelected?.length > 0 && !!this.props.themeSelected[0].incident &&
                this.props.codeReceiverActivity === this.props.userActivity?.code;
    }

    public getTopActButtonsDetails = () => {
        return this.state.buttonList.filter(button => this.isAllowedTopAct(button.actCode) && this.checkSpecificEligibility(button));
    }

    public isAllowedTopAct(actAuthorization) {
        return this.state.topActs.includes(actAuthorization);
    }

    public setIdAct = (event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => {
        const id = event.currentTarget.id
        this.props.setIdAct(id)
        const buttonDetail = this.state.buttonList.find(button => button.actCode === id) ?
                this.state.buttonList.find(button => button.actCode === id) :
                this.state.buttonList.find(button => button.actAuthorization === id) ;

        if (buttonDetail?.actLabel) {
            this.props.setActLabel(buttonDetail.actLabel)
        }
        this.props.setIsAction(buttonDetail?.action)
    }

    public isValidDescription = (value: string, codeAct: string) => {
        if(codeAct === "MDA_ARAMIS" || codeAct ==="LITIGE_STIT"){
            if (!!value && value !== "" && value.length >= 20) {
                return true;
            } else {
                NotificationManager.error(translate.formatMessage({id: "validation.required.description.message"}));
                return false;
            }
        }else{
            return true;
        }
    };

    public openTabInFast = (event: React.MouseEvent<HTMLButtonElement>) => {
        let valuesFromFields = this.props.getValuesFromFields();
        let description = valuesFromFields ? valuesFromFields.description : "";
        const currentCase: Case | undefined = this.props.currentCases[this.props.caseId]?.currentCase

        let idCase = this.props.caseId;
        const button = this.findButtonByActAuthorization(event)
        const codeAct = button?.actCode
        if (currentCase !== undefined) {
            idCase = currentCase.caseId;
        }
        if (codeAct && this.isValidDescription(description, codeAct)) {
            FastService.postOpenDemaneMessage({
                idCase,
                fastTabId: this.props.fastTabId,
                serviceId: this.props.client.serviceId,
                codeAct: codeAct,
                comment: description
            });
        }
        this.props.hideGridADG(true)
    }

    private findButtonByActAuthorization(event: React.MouseEvent<HTMLButtonElement>) {
        return this.state.buttonList.find(b => b.actAuthorization === event.currentTarget.id);
    }

    public changeTab = (tabId: string) => () => {
        this.setState({selectedTab: tabId})
    };

    public onSearch = async query => {
        this.changeTab("search")
        this.setState({loading: true, searchInput: query, selectedTab: 'search'})
        if (query.length > 0) {
            const options = this.state.buttonList.filter(button => StringUtils.firstContainsSecondIgnoringCaseAndAccents(translate.formatMessage({id: button.actLabel}), query))
            this.setState({
                loading: false,
                options
            })
        } else {
            this.setState({loading: false})
            this.resetSearch()
        }

    }

    public returnSearchButtonList = option => {
        const buttonIcon = this.getButtonIcon(option)
        return <div key={option.actAuthorization} id={option.actAuthorization}
             onClick={Object.values(AramisActs).includes(option.actCode) ? this.openTabInFast : this.setIdAct}>
            <Button color="primary" className="btn-lg mr-3">
                <span className={`icon-white ${buttonIcon}`}/>
            </Button>
            {translate.formatMessage({id: option.actLabel})}
        </div>
    }


    public getButtonIcon = (option) => {
        return option.action ? "icon-document" : "";
    }

    public resetSearch = () => {
        const instance = this._typeahead.getInstance()
        this.setState({
            searchInput: '',
            selectedTab: this.state.topActs.length > 0 ? 'top' : 'admin',
            options: []
        })
        this.renderButtonList("admin")
        instance.clear()
    }

    public onInputChange = query => {
        if (query.length === 0) {
            this.setState({loading: false})
            this.resetSearch()
        }
    }

    public onBlur = query => {
        this.setState({loading: false})
        this.resetSearch()
    }

    public render() {
        const {selectedTab} = this.state;
        return (
            <div className={"text-center"}>
                {!!this.props?.client?.error && <ClientErrorModal/>}

                <div className="w-100 bg-light">
                    <Row className="pt-4 pb-4">
                        <Col md={{size: 10, offset: 1}}>
                            <AsyncTypeahead isLoading={this.state.loading}
                                            placeholder={"Rechercher un acte"}
                                            emptyLabel={"Pas d’acte trouvé"}
                                            onSearch={this.onSearch}
                                            minLength={3}
                                            caseSensitive={false}
                                            ignoreDiacritics={true}
                                            options={this.state.options}
                                            onBlur={this.onBlur}
                                            onInputChange={this.onInputChange}
                                            useCache={false}
                                            ref={(ref) => this._typeahead = ref}
                                            labelKey={(option) => translate.formatMessage({id: option.actLabel})}
                                            renderMenuItemChildren={this.returnSearchButtonList}/>
                        </Col>
                        <Button onClick={this.resetSearch}>X</Button>
                    </Row>

                    <Nav tabs className="border-0">
                        <NavItem>
                            <NavLink
                                className={classnames({'active': selectedTab === "top"}, "bg-light", "rounded-top", {'d-none': this.state.topActs.length === 0})}
                                onClick={
                                    this.changeTab("top")
                                }>
                                <FormattedMessage id={"boucle.adg.class.top"}/>
                            </NavLink>
                        </NavItem>

                        <NavItem>
                            <NavLink
                                className={classnames({'active': selectedTab === "admin"}, "bg-light", "rounded-top")}
                                onClick={
                                    this.changeTab("admin")
                                }>
                                <FormattedMessage id={"boucle.adg.class.admin"}/>
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({'active': selectedTab === "billing"}, "bg-light", "rounded-top")}
                                onClick={
                                    this.changeTab("billing")
                                }>
                                <FormattedMessage id={"boucle.adg.class.billing"}/>
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({'active': selectedTab === "equipment"}, "bg-light", "rounded-top")}
                                onClick={
                                    this.changeTab("equipment")
                                }>
                                <FormattedMessage id={"boucle.adg.class.equipment"}/>
                            </NavLink>
                        </NavItem>
                    </Nav>
                </div>

                <TabContent activeTab={selectedTab} className="pt-5 pb-5">
                    <TabPane tabId={"top"} className={classnames({'d-none': this.state.topActs.length === 0})}>
                        {this.renderButtonList('top')}
                    </TabPane>
                    <TabPane tabId={"admin"}>
                        {this.renderButtonList("admin")}
                    </TabPane>
                    <TabPane tabId={"billing"}>
                        {this.renderButtonList('billing')}
                    </TabPane>
                    <TabPane tabId={"equipment"}>
                        {this.renderButtonList('equipment')}
                    </TabPane>
                </TabContent>
            </div>
        );
    }

    public fetchAllowedActionsAndActsToDisplay = async () => {
        const request = this.buildActionsAndActsSettingRequest()
        try {
            this.setState({loading: true})
            const resp = await this.casesService.getAllowedActionsAndActsToDisplay(request)
            this.setState({buttonList: resp
                , loading: false
            })
        } catch (error) {
            this.setState({
                buttonList: [],
                loading: false
            })
            NotificationManager.error(translate.formatMessage({id: "get.actionsAndActsbuttons.failure"}))
        }
    }

    private buildActionsAndActsSettingRequest() {
        const currentCaseState: CaseState = this.props.currentCases[this.props.caseId]
        return {
            caseId: this.props.caseId,
            clientCategory: this.props.client?.clientData?.corporation ? "CORPORATION" : "PERSON",
            serviceType: currentCaseState.currentCase ? currentCaseState.currentCase.serviceType : ""
        };
    }
}

const mapStateToProps = (state: AppState, ownProps: Props) => ({
    client: state.store.client.currentClient,
    equipmentBox4g: state.store.client.currentClient?.equipment?.box4G,
    currentCases: state.store.cases.casesList,
    authorizations: state.store.applicationInitialState.authorizations,
    isCurrentCaseScaled: state.store.cases.casesList[ownProps.caseId]?.isCurrentCaseScaled,
    themeSelected: state.store.cases.casesList[ownProps.caseId]?.themeSelected,
    codeReceiverActivity: state.store.cases.casesList[ownProps.caseId].validRoutingRule?.receiverActivity.code,
    userActivity: state.store.applicationInitialState.user?.activity,
})

// tslint:disable-next-line:no-any
export default compose<any>(withRouter, connect(mapStateToProps))(GridForADGInsideCaseV2)
