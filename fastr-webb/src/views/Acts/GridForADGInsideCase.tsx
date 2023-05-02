import React, {Component} from 'react';
import {FormattedMessage} from "react-intl";
import {connect} from "react-redux";
import {RouteComponentProps, withRouter} from "react-router";
import Button from "reactstrap/lib/Button";
import Col from "reactstrap/lib/Col";
import Label from "reactstrap/lib/Label";
import Row from "reactstrap/lib/Row";
import {compose} from "redux";
import {translate} from "../../components/Intl/IntlGlobalProvider";
import ClientErrorModal from "../../components/Modals/component/ClientErrorModal";
import {ACT_ID} from "../../model/actId";
import {AppState} from "../../store";
import {fetchAndStoreAuthorizations} from "../../store/actions";
import {ADGButtonConfig} from "./ADGButtonsConfigurationForBoucleADG";
import FastService from "../../service/FastService";
import {AramisActs} from "../../model/enums/AramisActs";
import "./GridForADGInsideCase.scss"
import {Nav, NavItem, NavLink, TabContent, TabPane} from "reactstrap";
import classnames from 'classnames';
import {AsyncTypeahead} from "react-bootstrap-typeahead";
import CaseService from "../../service/CaseService";
import {Client} from "../../model/person";
import Loading from "../../components/Loading";
import SessionService from "../../service/SessionService";
import {ClientContext} from "../../store/types/ClientContext";
import {Service} from "../../model/service";
import {NotificationManager} from "react-notifications";
import StringUtils from "../../utils/StringUtils";


interface Props extends RouteComponentProps<void> {
    authorizations
    payload
    setIdAct
    client: ClientContext<Service>
    clientError
    fetchAndStoreAuthorizations: (sessionId: string) => {}
    currentCase
    hideGridADG: (value: boolean) => void
    getValuesFromFields: () => any
}

interface State {
    buttonList,
    searchInput: string,
    selectedTab: string
    searchButtonList,
    loading: boolean,
    options,
    topActs: string[]
}

class GridForADGInsideCase extends Component<Props, State> {

    public compteur =0;
    private _typeahead: any;
    private casesService: CaseService = new CaseService(true);

    constructor(props: Props) {
        super(props);
        this.state = {
            buttonList: ADGButtonConfig,
            searchInput: "",
            selectedTab: "",
            searchButtonList: [],
            loading: false,
            options: [],
            topActs: []
        }
    }

    public async componentDidMount() {
        const sessionId = SessionService.getSession();
        await this.props.fetchAndStoreAuthorizations(sessionId);
        this.fetchTopActs()
    }

    public fetchTopActs =  async () => {
        this.setState({loading: true})
        try {
            const data: Client | undefined = this.props.client.data;
            const topActs =  await this.casesService.getAdgStatsByActivities(this.props.client.service!.category, data!.clientCategory);
            this.setState({
                loading: false,
                topActs
            })
        } catch (error) {
            console.error(error)
            this.setState({
                loading: false,
                topActs: []
            })
        }
        this.setState({selectedTab: this.state.topActs.length ? 'top' : 'admin'})
    }

    public checkArrayContainsEveryElementOfOtherArray = (arr, target) => target.every(v => arr.includes(v));

    public getUniqButtonsArr = array => array.filter((current, index, arr) => arr.findIndex(t => (t.label === current.label && t.target === current.target)) === index)

    public buttonsRules = () => {
        const {searchInput, buttonList} = this.state
        const uniqButtonsList = this.getUniqButtonsArr(buttonList)
        let buttonsToRender = this.state.selectedTab === "top" ? uniqButtonsList : buttonList;
        if (searchInput) {
            buttonsToRender = uniqButtonsList.filter(button => StringUtils.firstContainsSecondIgnoringCaseAndAccents(translate.formatMessage({id: button.label}), searchInput))
        }
        let mode = ""
        mode += this.props.client.service!.category === "MOBILE" || this.props.client.service!.category === "LOCATION" ? "M" : "F"
        mode += this.props.client.data!.ownerPerson ? "P" : "M"
        let buttonListForRendering = buttonsToRender.filter(button => {
            if (button.shouldDisplay.indexOf(mode) === -1) {
                return false
            }
            if (button.adgAuthorization && button.adgAuthorization.length > 0 && !this.checkArrayContainsEveryElementOfOtherArray(this.props.authorizations, button.adgAuthorization)) {
                return false

            }
            if (this.state.selectedTab === "top" && !this.checkArrayContainsEveryElementOfOtherArray(this.state.topActs, [button.target]) ) {
                return false;
            }
            if (this.state.selectedTab !== "top" && this.state.selectedTab !== "search" && button.adgClass !== this.state.selectedTab) {
                return false;
            }
            return true
        })
        return buttonListForRendering;
    }

    public renderButtonList() {
        let buttonListForRendering = this.buttonsRules()
        buttonListForRendering.sort((a, b) => {
            const textA = translate.formatMessage({id: a.label})
            const textB = translate.formatMessage({id: b.label})
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        })
        buttonListForRendering = buttonListForRendering.map((button, i) => {
            return (
                <Col key={i}>
                    <Button id={button.target} color="primary" className="btn-lg"
                            onClick={Object.values(AramisActs).includes(button.target) ? this.openTabInFast : this.setIdAct}>
                        <span className={`icon-white ${button.icon}`}/>
                    </Button>
                    <br/>
                    <Label className="m-2 text-center font-weight-bold"> <FormattedMessage
                        id={button.label}/></Label>
                </Col>
            )
        })



        if(!this.state.loading) {
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

            if(buttonListForRendering.length < 1 ) {
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
            return <Loading />
        }
    }

    public setIdAct = (event: React.MouseEvent<HTMLButtonElement>) => {
        this.props.setIdAct(ACT_ID[event.currentTarget.id])
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

        let idCase = this.props.payload.idCase;
        const codeAct = event.currentTarget.id
        if (this.props.currentCase !== undefined) {
            idCase = this.props.currentCase.caseId;
        }
        if (codeAct && this.isValidDescription(description, codeAct)) {
            FastService.postOpenDemaneMessage({
                idCase,
                fastTabId: this.props.payload.fastTabId,
                serviceId: this.props.client.serviceId,
                codeAct: codeAct,
                comment: description
            });
        }
        this.props.hideGridADG(true)
    }

    public changeTab = (tabId: string) => () => {
        this.setState({selectedTab: tabId})
    };

    public onSearch = async query => {
        this.changeTab("search")
        this.setState({loading: true, searchInput: query, selectedTab: 'search'})
        if (query.length > 0) {
            const options = this.buttonsRules().filter(button => StringUtils.firstContainsSecondIgnoringCaseAndAccents(translate.formatMessage({id: button.label}), query))
            this.setState({
                loading: false,
                options: options
            })
        } else {
            this.setState({loading: false})
            this.resetSearch()
        }

    }

    public returnSearchButtonList = option =>
        // @ts-ignore
        <div key={option.target} id={option.target} onClick={Object.values(AramisActs).includes(option.target) ? this.openTabInFast : this.setIdAct}>
                <Button color="primary" className="btn-lg mr-3" >
                    <span className={`icon-white ${option.icon}`}/>
                </Button>
                {translate.formatMessage({id: option.label})}
        </div>


    public resetSearch =  () => {
        const instance = this._typeahead.getInstance()
        this.setState({
            searchInput:'',
            selectedTab: this.state.topActs.length ? 'top' : 'admin',
            options: []
        })
        this.renderButtonList()
        instance.clear()
    }

    public onInputChange = query  => {
        if (query.length === 0) {
            this.setState({loading: false})
            this.resetSearch()
        }
    }

    public onBlur = query  => {
        this.setState({loading: false})
        this.resetSearch()
    }

    public render() {
        const {selectedTab} = this.state;
        return (
            <div className={"text-center"}>
                {!!this.props.clientError && <ClientErrorModal/>}

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
                                            labelKey={(option) => translate.formatMessage({id: option.label})}
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
                            {this.renderButtonList()}
                        </TabPane>
                        <TabPane tabId={"admin"}>
                            {this.renderButtonList()}
                        </TabPane>
                        <TabPane tabId={"billing"}>
                            {this.renderButtonList()}
                        </TabPane>
                        <TabPane tabId={"equipment"}>
                            {this.renderButtonList()}
                        </TabPane>
                    </TabContent>
            </div>
        );
    }
}


const mapDispatchToProps = dispatch => ({
    fetchAndStoreAuthorizations: (sessionId: string) => dispatch(fetchAndStoreAuthorizations(sessionId)),
})

const mapStateToProps = (state: AppState) => ({
    authorizations: state.authorization.authorizations,
    client: state.client,
    clientError: state.client.error,
    currentCase: state.case.currentCase
})

// tslint:disable-next-line:no-any
export default compose<any>(withRouter, connect(mapStateToProps, mapDispatchToProps))(GridForADGInsideCase)
