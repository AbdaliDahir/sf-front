import * as moment from "moment-timezone";
import * as React from "react";
import {FormattedMessage} from "react-intl";
import {Badge, CardHeader, UncontrolledTooltip} from "reactstrap";
import Card from "reactstrap/lib/Card";
import CardBody from "reactstrap/lib/CardBody";
import Col from "reactstrap/lib/Col";
import Collapse from "reactstrap/lib/Collapse";
import Row from "reactstrap/lib/Row";
import Table from "reactstrap/lib/Table";
import {Case} from "../../../../model/Case";
import SelectedCaseSummary from "./SelectedCaseSummary";
import {CaseQualification} from "../../../../model/CaseQualification";
import {retrieveLastResource} from "../../../../utils/CaseUtils";
import {ACT_ID} from "../../../../model/actId";
import SockJsClient from 'react-stomp';
import classnames from 'classnames';
import "./RecentCasesTable.scss"

interface Props {
    casesRecentList: Array<Case>
    fromModalMatchingCase?: boolean
    idService?: string
    authorizations
}

interface State {
    collapse: boolean;
    selectedCase?: Case;
    activeIndex;
    listCasesFromStomp: Array<Case>;
}

export default class RecentCasesTable extends React.Component<Props, State> {

    private DATETIME_FORMAT = process.env.REACT_APP_FASTR_DATETIME_FORMAT;
    private DATE_FORMAT = process.env.REACT_APP_FASTR_MOMENT_DATE_FORMAT;

    constructor(props: Props) {
        super(props);
        this.state = {
            collapse: false,
            activeIndex: null,
            listCasesFromStomp: []
        }
    }

    public formatQualification(qualifToFormat: CaseQualification): string {
        return qualifToFormat.tags[0]
    }

    public retreiveLastRetention = (recentCase: Case) => {
        const retentionResource = retrieveLastResource(recentCase, "ACT_FASTR", ACT_ID.ADG_RETENTION)
        return retentionResource ? "Action rétention du " + moment(retentionResource.creationDate).format(this.DATETIME_FORMAT): ""
    }

    public renderCaseId = (recentCase: Case) => {
        return (
            <React.Fragment>
                <strong>{recentCase.caseId} - </strong><span>{recentCase.qualification.caseType ? recentCase.qualification.caseType : ""}</span>
            </React.Fragment>)
    }

    public buildLoginCaseOwner = (recentCase) => {
        let activityLogin;
        const lastUpdateAuthorLogin = recentCase && recentCase.events && recentCase.events.length > 0 && recentCase.events[0].author && recentCase.events[0].author.login ? recentCase.events[0].author.login : '';
        const lastUpdateAuthorActivity = recentCase && recentCase.events && recentCase.events.length > 0 && recentCase.events[0].author && recentCase.events[0].author.activity && recentCase.events[0].author.activity.label ? recentCase.events[0].author.activity.label : '';

        const caseOwnerLogin = recentCase && recentCase.caseOwner && recentCase.caseOwner.login ? recentCase.caseOwner.login : '';
        const caseOwnerActivity = recentCase && recentCase.caseOwner && recentCase.caseOwner.activity && recentCase.caseOwner.activity.label ? recentCase.caseOwner.activity.label : '';

        if(lastUpdateAuthorLogin !== '' && lastUpdateAuthorActivity !== '') {
            activityLogin = `${lastUpdateAuthorActivity} (${lastUpdateAuthorLogin})`
        } else if (lastUpdateAuthorLogin !== '' && lastUpdateAuthorActivity === '') {
            activityLogin = `(${lastUpdateAuthorLogin})`
        } else if (lastUpdateAuthorLogin === '' && lastUpdateAuthorActivity !== '') {
            activityLogin = `${lastUpdateAuthorActivity}`
        } else {
            activityLogin = `${caseOwnerActivity} (${caseOwnerLogin})`
        }

        return activityLogin
    }

    public buildLoginCaseOwnerIfScaledCase = (recentCase: Case) => {
        if(recentCase.category === "SCALED") {
            const caseOwnerLogin = recentCase && recentCase.caseOwner && recentCase.caseOwner.login ? recentCase.caseOwner.login : '';
            const caseOwnerActivityLabel = recentCase && recentCase.caseOwner && recentCase.caseOwner.activity && recentCase.caseOwner.activity.label ? recentCase.caseOwner.activity.label : '';
            return recentCase && recentCase.caseOwner && recentCase.caseOwner.login ?
                caseOwnerActivityLabel + " (" + caseOwnerLogin + ")"
                : caseOwnerActivityLabel + ""
        } else {
            return ""
        }
    }

    public renderRecentCasesList(casesRecentList, idService): JSX.Element[] {
        return casesRecentList.map(
            (recentCase, index) =>
                <React.Fragment>
                    <tr key={index}
                        className={"recent-cases-table__row"}
                        style={this.state.selectedCase && this.state.selectedCase.caseId === recentCase.caseId ? {backgroundColor: "#e9ecef"} : {}}
                        onClick={this.fillSelectedCase(recentCase, index)}>
                        <td>
                            {this.renderCaseId(recentCase)}<br/>
                        </td>
                        <td>
                            <div className="mb-2">{moment(recentCase.updateDate).format(this.DATETIME_FORMAT)}</div>
                            <div>{this.buildLoginCaseOwner(recentCase)}</div>
                        </td>
                        <td>
                            <div className="mb-2">{moment(recentCase.creationDate).format(this.DATE_FORMAT)}</div>
                        </td>
                        <td id={"qualification" + index}>{this.formatQualification(recentCase.qualification)}<br/>
                            <span className={"text-danger"}>{this.retreiveLastRetention(recentCase)}</span>
                            <UncontrolledTooltip target={"qualification" + index}>
                                {recentCase.qualification.tags.join(' / ')}
                            </UncontrolledTooltip>
                        </td>
                        <td><FormattedMessage id={recentCase.category}/></td>
                        <td><FormattedMessage id={recentCase.status}/></td>
                        <td>
                            <div>{this.buildLoginCaseOwnerIfScaledCase(recentCase)}</div>
                        </td>
                        <td id={"clientRequest" + index} className={"recent-cases-table__client-request-square"}>
                            <span>{recentCase.clientRequest}</span>
                            <UncontrolledTooltip popperClassName={"recent-cases-table__tooltip-popper"}
                                                 innerClassName={"recent-cases-table__tooltip-inner"}
                                                 target={"clientRequest" + index}>
                                {recentCase.clientRequest}
                            </UncontrolledTooltip>
                        </td>
                        <td onClick={this.fillSelectedCase(recentCase, index)} className="">
                            <span className={`icon ${this.state.activeIndex === index ? 'icon-up' : 'icon-down'}`}
                                  style={{width: "40px"}}/>
                        </td>
                    </tr>
                    <tr className={"selectedCaseSummary"}>
                        <td className="p-0" colSpan={9}>
                            <Collapse isOpen={this.state.activeIndex === index} colSpan={6}>
                                {recentCase ? <SelectedCaseSummary case={recentCase} fromModalMatchingCase={this.props.fromModalMatchingCase} shutOpened={this.shutOpened} idService={idService} authorizations={this.props.authorizations}/> :<React.Fragment/>}
                            </Collapse>
                        </td>
                    </tr>
                </React.Fragment>
        )
    }

    public fillSelectedCase = (selectedCaseFromTable: Case, index: number) => () => {
        this.setState({selectedCase: selectedCaseFromTable, activeIndex: this.state.activeIndex === index ? null : index})
    };

    public shutOpened = (activeCases) => {
        let caseIndex;
        if (activeCases && this.state.selectedCase?.caseId === activeCases[0].caseId && this.state.activeIndex !== null) {
            caseIndex = 0
        } else if (activeCases && this.state.selectedCase?.caseId !== activeCases[0].caseId) {
            caseIndex = activeCases.findIndex(x => x.caseId === this.state.selectedCase?.caseId);
        } else {
            caseIndex = null
        }
        this.setState({activeIndex: caseIndex})
    }

    public onMessage = (ListCasesFromStomp) => {
        const ListCasesFromStompSortedByDate = ListCasesFromStomp.sort((a, b) => {
            a = new Date(a.updateDate).getTime();
            b = new Date(b.updateDate).getTime();
            return a > b ? -1 : a < b ? 1 : 0;
        });
        this.setState({listCasesFromStomp: ListCasesFromStompSortedByDate})
        this.shutOpened(ListCasesFromStompSortedByDate)
    }

    public render(): JSX.Element {
        const {casesRecentList, idService} = this.props;
        const {collapse, listCasesFromStomp} = this.state;
        const casesList = listCasesFromStomp !== undefined && listCasesFromStomp.length > 0 ? listCasesFromStomp : casesRecentList
        casesList.sort((a, b) => {
            const aUpdateDate = new Date(a.updateDate).getTime();
            const bUpdateDate = new Date(b.updateDate).getTime();
            return aUpdateDate > bUpdateDate ? -1 : aUpdateDate < bUpdateDate ? 1 : 0;
        });
        return (
            <div style={{overflow: "auto"}}>
                <SockJsClient url={process.env.REACT_APP_FASTR_API_URL + "/fastr-cases/subscribe-service/"}
                              topics={["/topic/subscribeService-" + idService]}
                              onMessage={this.onMessage}/>
                <Card>
                    <CardHeader>
                        <Row>
                            <Col md={11}>
                                <Badge color={casesList.length === 0 ? "secondary" : "primary"}
                                       className={"m-1"}>{casesList.length}</Badge>
                                {casesList.length ?
                                    <FormattedMessage id="cases.list.recent.table.title.matchingCaseFound"/>
                                : <FormattedMessage id="cases.list.recent.table.title.nomatch"/>}
                            </Col>
                        </Row>
                    </CardHeader>
                    <div className={classnames({'d-none': casesList.length === 0})}>
                        <Collapse isOpen={!collapse} >
                            <CardBody>
                                    <Table bordered responsive data={casesList}
                                           className="w-100 mt-1 table-hover table-sm">
                                        <thead title="Liste des notes" className={"recent-cases-table__table-header"}>
                                        <tr>
                                            <th data-sortable="true"><FormattedMessage
                                                id="cases.list.recent.table.creation.number"/>
                                            </th>
                                            <th data-sortable="true"><FormattedMessage
                                                id="cases.list.recent.table.update"/>
                                            </th>
                                            <th data-sortable="true"><FormattedMessage
                                                id="cases.list.recent.table.creation"/>
                                            </th>
                                            <th data-sortable="true"><FormattedMessage
                                                id="cases.list.recent.table.qualification.motif"/>
                                            </th>
                                            <th data-sortable="true"><FormattedMessage
                                                id="cases.list.recent.table.category"/>
                                            </th>
                                            <th data-sortable="true"><FormattedMessage
                                                id="cases.get.details.status"/>
                                            </th>
                                            <th data-sortable="true"><FormattedMessage
                                                id="cases.list.recent.table.incharge"/>
                                            </th>
                                            <th data-sortable="true"><FormattedMessage
                                                id="cases.list.recent.table.client.request"/>
                                            </th>
                                            <th></th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {this.renderRecentCasesList(casesList, idService)}
                                        </tbody>
                                    </Table>
                            </CardBody>
                        </Collapse>
                    </div>
                </Card>
            </div>
        );
    }
}
