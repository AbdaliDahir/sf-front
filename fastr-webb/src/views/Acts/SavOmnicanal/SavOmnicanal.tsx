import React from "react";
import ActService from "../../../service/ActService";
import Collapse from "reactstrap/lib/Collapse";
import {Sav, SavSummary} from "../../../model/acts/savOmnical/Sav";
import CollapsableRowsTable from "../../../components/Table/CollapsableRowsTable";
import {NotificationManager} from "react-notifications";
import {FormattedMessage} from "react-intl";
import SelectedSavSummary from "./Elements/SelectedSavSummary"
import {AddSavComment} from "./Elements/AddSavComment"
import {translate} from "../../../components/Intl/IntlGlobalProvider";
import Loading from "../../../components/Loading";
import "./SavOmnicanal.scss"
import {RouteComponentProps, withRouter} from "react-router";
import FastrPage from "../../../components/Pages/FastrPage";

interface Param {
    technicalSupportId?: string,
}

interface Props extends RouteComponentProps<Param> {
    fromFastrCase?: boolean
    idClient?: string
    savSummary?: SavSummary
}

interface State {
    collapse: boolean;
    selectedSav: Sav;
    activeIndex;
    savOmnicanalList: Array<Sav>;
    savSummary: SavSummary;
    showSavCommentInput: boolean;
    isSavListLoading: boolean;
    isSavSummaryLoading: boolean;
    technicalSupportId: string | undefined;
}

class SavOmnicanal extends FastrPage<Props, State, Param> {
    private actService: ActService = new ActService(true);

    constructor(props: Props) {
        super(props);
        this.state = {
            collapse: false,
            selectedSav: {},
            activeIndex: null,
            savOmnicanalList: [],
            savSummary: {},
            showSavCommentInput: false,
            isSavListLoading: false,
            isSavSummaryLoading: false,
            technicalSupportId: this.props.match && this.props.match.params.technicalSupportId ? this.props.match.params.technicalSupportId : undefined,
        }
    }

    public async componentDidMount() {
        this.setState({
            isSavListLoading: true
        });
        const {fromFastrCase, idClient} = this.props;
        const {technicalSupportId} = this.state;
        let savOmnicanalList: Array<Sav> = [];
        const request = {
            referenceName: fromFastrCase ? 'clientId' : 'technicalSupportId',
            reference: fromFastrCase ? idClient : technicalSupportId,
        };
        try {
            savOmnicanalList = await this.actService.getSbeRecherche(request)
        } catch (error) {
            console.error(error);
            NotificationManager.error(translate.formatMessage({id: "adg.sav.omnicanal.get.sav.list.error"}));
        }
        if(savOmnicanalList) {
            this.setState({
                isSavListLoading: false,
                savOmnicanalList: savOmnicanalList,
                savSummary: {}
            })
        }
    }

    public getSavSummary =  async (selectedSavFromTable) => {
        try {
            const savSummary = await this.actService.getSbeConsultation(selectedSavFromTable.globalcareReference)
            if(savSummary) {
                this.setState({
                    isSavSummaryLoading: false,
                    savSummary: savSummary,
                })
            }
        } catch (e) {
            console.error(e)
            NotificationManager.error(e.message)
        }
    }

    public fillSelectedSav = (selectedSavFromTable, index: number) =>  () => {
       this.setState({
            activeIndex: this.state.activeIndex === index ? null : index,
            selectedSav: selectedSavFromTable,
           isSavSummaryLoading: true,
           showSavCommentInput: false
        })
        this.getSavSummary(selectedSavFromTable)
    };

    public handleCommentInput = (selectedSavFromTable, index) => (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation()
        this.setState({
            activeIndex: index ,
            selectedSav: selectedSavFromTable,
            isSavSummaryLoading: true,
            showSavCommentInput: true
        })
        this.getSavSummary(selectedSavFromTable)
    }

    public closeSavCommentInput = () => {
        this.setState({showSavCommentInput: false})
    }

    public updateSAV = async () => {
        try {
            const savSummary = await this.actService.getSbeConsultation(this.state.selectedSav?.globalcareReference)
            this.setState({
                savSummary: savSummary,
            })
        } catch (e) {
            console.error(e)
            NotificationManager.error(e.message)
        }
    }

    public renderHeader = () => {
        const title = this.props.fromFastrCase ?
            translate.formatMessage({id: "adg.sav.omnicanal.get.sav.list.title.beb"})
            : translate.formatMessage({id: "adg.sav.omnicanal.get.sav.list.title.technical.support"})
        return <div className={"sav-omnicanal__title"}>{title}</div>
    }

    public renderTableThead = () => {
        return (
            <tr className={"sav-omnicanal__thead"}>
                <th data-sortable="true"><FormattedMessage
                    id="adg.sav.omnicanal.table.head.equipment"/>
                </th>
                <th data-sortable="true"><FormattedMessage
                    id="adg.sav.omnicanal.table.head.demande.date"/>
                </th>
                <th data-sortable="true"><FormattedMessage
                    id="adg.sav.omnicanal.table.head.demande.ref"/>
                </th>
                <th data-sortable="true"><FormattedMessage
                    id="adg.sav.omnicanal.table.head.replace.product"/>
                </th>
                <th data-sortable="true"><FormattedMessage
                    id="adg.sav.omnicanal.table.head.equipment.loan"/>
                </th>
                <th data-sortable="true"><FormattedMessage
                    id="adg.sav.omnicanal.table.head.status"/>
                </th>
                <th data-sortable="true"></th>
                <th data-sortable="true"></th>
            </tr>
        )
    }

    public renderTableRows = (savOmnicanalList) => {
        const {fromFastrCase, idClient} = this.props;
        const {technicalSupportId} = this.state;
        const {savSummary, showSavCommentInput, isSavSummaryLoading} = this.state;
        const reference = fromFastrCase ? idClient : technicalSupportId;
        return savOmnicanalList.map(
            (sav, index) =>
                <React.Fragment>
                    <tr key={index}
                        className={"sav-omnicanal__row"}
                        style={this.state.selectedSav && this.state.selectedSav.globalcareReference === sav.globalcareReference ? {backgroundColor: "#e9ecef"} : {}}
                        onClick={this.fillSelectedSav(sav, index)}>
                        <td>
                           <div className="font-weight-bold">{sav.productName}</div>
                           <div>{sav && sav.productSerialNumber ? sav.productSerialNumber : ""}</div>
                        </td>
                        <td>{sav && sav.creationDate ? sav.creationDate : ""}</td>
                        <td>{sav && sav.globalcareReference ? sav.globalcareReference : ""}</td>
                        <td>{sav && sav.replacementProduct && <span className="icon-gradient icon-check"/>}</td>
                        <td>{sav && sav.loanEquipment && <span className="icon-gradient icon-check"/>}</td>
                        <td>
                            <div>{sav && sav.statusName ? sav.statusName : ""}</div>
                            {sav && sav.statusDate &&
                                <div>({sav.statusDate})</div>
                            }
                        </td>
                        <td>
                            <div className="sav-omnicanal__button" onClick={this.handleCommentInput(sav, index)}>
                                <section className="btn btn-primary btn-sm"><span>Annoter</span></section>
                            </div>
                        </td>
                        <td>
                            <span className={`icon ${this.state.activeIndex === index ? 'icon-up' : 'icon-down'}`}
                                  style={{width: "40px"}}/>
                        </td>
                    </tr>
                    <tr className={"selectedSavSummary"}>
                        <td className="p-0" colSpan={9}>
                            <Collapse isOpen={this.state.activeIndex === index} colSpan={6}>
                                <div>
                                    {showSavCommentInput ?
                                        <AddSavComment closeSavCommentInput={this.closeSavCommentInput}
                                                       fromFastrCase={fromFastrCase}
                                                       reference={reference ? reference : undefined}
                                                       globalcareReference={sav.globalcareReference}
                                                       updateSAV={this.updateSAV}
                                        /> :<React.Fragment/>}
                                    {savSummary ? <SelectedSavSummary
                                        sav={sav}
                                        isSavSummaryLoading={isSavSummaryLoading}
                                        savSummary={savSummary} /> :<React.Fragment/>}
                                </div>
                           </Collapse>
                        </td>
                    </tr>
                </React.Fragment>
        )
    }

    public render() {
        const {savOmnicanalList, isSavListLoading} = this.state;
        return (
            <React.Fragment>
            {isSavListLoading ?
                <Loading />
            : <div>
                {savOmnicanalList && savOmnicanalList.length > 0 ?
                        <div className={"sav-omnicanal"}>
                            <CollapsableRowsTable
                                rowsData={savOmnicanalList}
                                renderHeader={this.renderHeader}
                                renderTableThead={this.renderTableThead}
                                renderTableRows={this.renderTableRows(savOmnicanalList)}/>
                        </div>
                        : <div className={"sav-omnicanal__empty"}><FormattedMessage id="adg.sav.omnicanal.no.data.found"/></div>
                }
            </div>}
            </React.Fragment>
        )
    }
}


export default withRouter(SavOmnicanal);
