import * as React from "react";
import {Case} from "../../../../model/Case";
import {Badge, Button} from "reactstrap";
import {FormattedMessage} from "react-intl";
import SockJsClient from 'react-stomp';
import "./RecentCasesListV2.scss"
import CaseCard from "../Components/RecentCase/CaseCard";
import {connect} from "react-redux";
import {AppState} from "../../../../store";
import {ApplicationMode} from "../../../../model/ApplicationMode";

interface Props {
    casesRecentList: Array<Case|undefined>
    fromModalMatchingCase?: boolean
    idService?: string
    authorizations
    handleReprendre?: (caseId:string) => void
    handleToutHistoriqueClick?: () => void
    toggleHistoRapidePopup?: () => void
    isRecentCasesListDisplayed?: boolean
    isFrom?: string
    blockingUI?: boolean,
    inCreateCaseBlacklist?: boolean
    idParamFromUrl?: string
}

interface State {
    listCasesFromStomp: Array<Case>;
}

class RecentCasesListV2 extends React.Component<Props, State> {
    private recentCaseRef: React.RefObject<any> = React.createRef();

    constructor(props: Props) {
        super(props);
        this.state = {
            listCasesFromStomp: []
        }
    }

    public componentDidMount() {
        if (this.recentCaseRef.current) {
            this.recentCaseRef.current.click()
        }
    }

    public componentDidUpdate(prevProps: Props, prevState: State) {
        const {listCasesFromStomp} = this.state
        if (JSON.stringify(prevState.listCasesFromStomp) === JSON.stringify(listCasesFromStomp)) {
            return
        }
    }

    public renderAllHistoricOrQuickHistoPopup = () => {
        const {isFrom, handleToutHistoriqueClick, toggleHistoRapidePopup, isRecentCasesListDisplayed} = this.props
        if(isFrom === ApplicationMode.FAST) {
            return <button type="button"
                           className="btn histo btn-link"
                           id="listRecentCases.historic.id"
                           onClick={handleToutHistoriqueClick}>
                <FormattedMessage id="cases.list.recent.historic.button"/>
            </button>
        } else if (isRecentCasesListDisplayed && isFrom === ApplicationMode.DISRC) {
            return <Button type="button"
                           color="primary"
                           className="btn histo"
                           id="listRecentCases.histo.rapide"
                           onClick={toggleHistoRapidePopup}
                           disabled={this.props.blockingUI}
            >
                <FormattedMessage id="cases.list.recent.histo.rapide"/>
            </Button>
        } else return <React.Fragment />
    }

    public onMessage = (ListCasesFromStomp) => {
        const ListCasesFromStompSortedByDate = ListCasesFromStomp.sort((a, b) => {
            a = new Date(a.updateDate).getTime();
            b = new Date(b.updateDate).getTime();
            return a > b ? -1 : a < b ? 1 : 0;
        });
        this.setState({listCasesFromStomp: ListCasesFromStompSortedByDate})
    }

    public render(): JSX.Element {
        const {isFrom, casesRecentList, idService, inCreateCaseBlacklist, idParamFromUrl} = this.props;
        const {listCasesFromStomp} = this.state;
        const casesList = listCasesFromStomp !== undefined && listCasesFromStomp.length > 0 ? listCasesFromStomp : casesRecentList
        const isCase = item => item?.caseId === idParamFromUrl;
        const selectedCaseIndex = isCase ? casesRecentList.findIndex(isCase) : undefined
        return (
            <section>
                <div className="RecentCasesListV2">
                    <SockJsClient url={process.env.REACT_APP_FASTR_API_URL + "/fastr-cases/subscribe-service/"}
                                  topics={["/topic/subscribeService-" + idService]}
                                  onMessage={this.onMessage}/>
                    <div className="mb-3 d-flex flex-column">
                        <div className="mb-1 d-flex justify-content-between align-items-center ">
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="m-0">
                                    {isFrom === ApplicationMode.FAST ?
                                        <span className="mr-1"><FormattedMessage id="dossiers.actifs.v2.title"/></span>
                                        : <span className="mr-1"><FormattedMessage id="dossiers.recents.v2.title"/></span>
                                    }
                                </h5>
                                <Badge color={casesList.length === 0 ? "secondary" : "primary"}
                                       className={"m-1"}>{casesList.length}</Badge>
                            </div>
                            <div>
                                {this.renderAllHistoricOrQuickHistoPopup()}
                            </div>
                        </div>
                        {inCreateCaseBlacklist === false && <p className="m-0"><FormattedMessage id="dossiers.actifs.v2.sub.title"/></p>}
                    </div>
                        {casesList.map((recentCase, index) =>
                            <CaseCard recentCase={recentCase}
                                      recentCaseRef={this.recentCaseRef.current}
                                      index={index}
                                      key={recentCase?.caseId}
                                      handleReprendre={this.props.handleReprendre}
                                      title={"Dernière Modif"}
                                      idParamFromUrl={idParamFromUrl}
                                      selectedCaseIndex={selectedCaseIndex} fromSummary={false}/>)
                        }
                </div>
            </section>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    inCreateCaseBlacklist: state.store.client.isServiceInLists?.inCreateCaseBlacklist,
});

export default connect(mapStateToProps)(RecentCasesListV2)