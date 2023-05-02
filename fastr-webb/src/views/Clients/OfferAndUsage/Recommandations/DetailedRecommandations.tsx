import * as React from "react";
import {connect} from "react-redux";
import {RouteComponentProps} from "react-router";
import FastrPage from "../../../../components/Pages/FastrPage";
import RecommandationService from "../../../../service/RecommandationService";
import {Recommandation} from "../../../../model/recommandations/Recommandation";
import Table from "reactstrap/lib/Table";
import {PopoverBody, PopoverHeader, UncontrolledPopover} from "reactstrap";
import {BlocksExternalAppsConfig} from "../../ExternalAppsConfig";
import './Recommandations.css'
import {renderLoadingMessage, renderHTML, renderErrorMsg, renderEzyExternalLink} from '../../../../utils/RecommandationsUtils';
import {AppState} from "../../../../store";
import {fetchAndStoreExternalApps} from "../../../../store/actions";


interface Param {
    idCsu: string
}

interface State {
    idCsu: string
    recommandations: Recommandation[]
    activeIndex: number | null
    isRecommandationsLoading: boolean
    fetchingRecomnandationsErrorMsg: string
}

interface Props extends RouteComponentProps<Param> {
    fetchAndStoreExternalApps: () => void
    userPassword: string
}

class DetailedRecommandations extends FastrPage<Props, State, Param> {
    private recommandationService: RecommandationService = new RecommandationService();
    private externalAppsSettings = BlocksExternalAppsConfig.recommandations.detailedRecommandations;
    constructor(props: Props) {
        super(props);
        this.state = {
            idCsu: this.props.match.params.idCsu,
            recommandations: [],
            activeIndex: null,
            isRecommandationsLoading: false,
            fetchingRecomnandationsErrorMsg : ''
        }
    }

    public getRecommandations = async () => {
        if(this.props.match.params.idCsu) {
            try {
                this.setState({isRecommandationsLoading: true});
                const recommandations = await this.recommandationService.getRecommandations(this.state.idCsu);
                if(recommandations) {
                    this.setState({
                        isRecommandationsLoading: false,
                        recommandations: recommandations
                    });
                }
            } catch (e) {
                const error = await e
                this.setState({isRecommandationsLoading: false, fetchingRecomnandationsErrorMsg: error.message})
            }
        }
    }

    public async componentDidMount() {
        this.props.fetchAndStoreExternalApps();
        await this.getRecommandations()
        window.document.addEventListener("click", this.close);
    }

    public handleActiveIndex = (index: number) => () => {
        this.setState({
            activeIndex: this.state.activeIndex === index ? null : index,
        })
    };

    public close = (e) => {
        if (!e.target.closest(".recommandations__table") && !e.target.closest(".recommandation-popover-table")) {
            this.setState({
                activeIndex: null
            });
        }
    }

    public renderRecommandations = () => {
        const { recommandations, isRecommandationsLoading, fetchingRecomnandationsErrorMsg } = this.state;
        const idParams = {
            password: this.props.userPassword
        }
        return (
            <div>
                {!isRecommandationsLoading && recommandations && recommandations.length > 0 ?
                    <div>
                        <Table bordered responsive className="recommandations__table w-100 mt-1 table-hover table-sm mt-3">
                            <tr>
                                <th className='recommandations__column-img'/>
                                <th className="recommandations__column">Actes</th>
                                <th className="recommandations__column">Offres</th>
                            </tr>
                            <tbody>
                            {recommandations.map((reco, index) =>
                                <React.Fragment>
                                    <UncontrolledPopover
                                        className="recommandation-popover-table"
                                        trigger="focus"
                                        placement="left"
                                        target={`recommandations__line${index + 1}`}
                                        modifiers={{preventOverflow: {boundariesElement: 'window'}}}
                                        isOpen={this.state.activeIndex === index}>
                                        <PopoverHeader>
                                            <div className="recommandations__title font-weight-bold pb-3 border-bottom">
                                                Détails de l'offre
                                            </div>
                                        </PopoverHeader>
                                        <PopoverBody>
                                            <div className="recommandations__title mb-2">
                                                <div className="d-flex align-items-center">
                                                    <div className={`recommandations__img-bloc smaller-img-bloc mr-2 ${index + 1 === 1 ? 'red' : ''}`}>
                                                        <div className="recommandations__img">
                                                            {index + 1}
                                                        </div>
                                                    </div>
                                                    {reco?.libelleOffre}
                                                </div>
                                            </div>
                                            {reco?.argumentaire ? renderHTML(reco.argumentaire) : ""}
                                        </PopoverBody>
                                    </UncontrolledPopover>

                                    <tr id={`recommandations__line${index + 1}`}
                                        onClick={this.handleActiveIndex(index)}
                                        className={`${this.state.activeIndex === index ? 'active' : ''}`}>
                                        <td className="recommandations__column-img">
                                            <div className={`recommandations__img-bloc ${index + 1 === 1 ? 'red' : ''}`}>
                                                <div className="recommandations__img">
                                                    {index + 1}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="recommandations__column">{reco?.acteDeGestion}</td>
                                        <td className="recommandations__column">{reco?.libelleOffre}</td>
                                    </tr>
                                </React.Fragment>
                            )}
                            </tbody>
                        </Table>
                        {renderEzyExternalLink(this.externalAppsSettings, recommandations, idParams)}
                    </div>
                    : renderErrorMsg(fetchingRecomnandationsErrorMsg)
                }
            </div>
        )
    }

    public render(): JSX.Element {
        const { isRecommandationsLoading } = this.state;
        return (
            <React.Fragment>
                {isRecommandationsLoading ?
                    <div>
                        {renderLoadingMessage()}
                    </div>
                    :  <div>
                        {this.renderRecommandations()}
                    </div>
                }
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state: AppState) => ({
    appsList: state.externalApps.appsList,
    userPassword: state.store.applicationInitialState.userPassword
});

const mapDispatchToProps = dispatch =>({
    fetchAndStoreExternalApps: () => dispatch(fetchAndStoreExternalApps()),
})

export default connect(mapStateToProps, mapDispatchToProps)(DetailedRecommandations)