import * as React from "react";
import {connect} from "react-redux";
import {RouteComponentProps} from "react-router";
import FastrPage from "../../../../components/Pages/FastrPage";
import RecommandationService from "../../../../service/RecommandationService";
import {Recommandation} from "../../../../model/recommandations/Recommandation";
import {PopoverBody, PopoverHeader, UncontrolledPopover} from "reactstrap";
import {BlocksExternalAppsConfig} from "../../ExternalAppsConfig";
import './Recommandations.css'
import {renderLoadingMessage, renderHTML, renderErrorMsg, renderEzyExternalLink} from '../../../../utils/RecommandationsUtils';
import {AppState} from "../../../../store";
import {fetchAndStoreExternalApps} from "../../../../store/actions";
import {ClientContextSliceState} from "src/store/ClientContextSlice";

interface Param {
    idCsu: string
}

interface State {
    recommandations: Recommandation[]
    activeIndex: number | null
    isRecommandationsLoading: boolean
    fetchingRecomnandationsErrorMsg: string
}

interface Props extends RouteComponentProps<Param> {
    fetchAndStoreExternalApps: () => void
    userPassword: string,
    clientContext?: ClientContextSliceState
}

class SyntheticRecommandations extends FastrPage<Props, State, Param> {
    private recommandationService: RecommandationService = new RecommandationService();
    private externalAppsSettings = BlocksExternalAppsConfig.recommandations.syntheticRecommandations;
    constructor(props: Props) {
        super(props);
        this.state = {
            recommandations: [],
            activeIndex: null,
            isRecommandationsLoading: false,
            fetchingRecomnandationsErrorMsg : ''
        }
    }

    public getRecommandations = async () => {
        const idCsu = this.props.match?.params?.idCsu ? this.props.match.params.idCsu : this.props.clientContext?.serviceId;
        if(idCsu) {
            try {
                this.setState({isRecommandationsLoading: true});
                const recommandations = await this.recommandationService.getRecommandations(idCsu);
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
        if (!e.target.closest(".recommandations") && !e.target.closest(".recommandation-popover-line")) {
            this.setState({
                activeIndex: null
            });
        }
    }

    public renderRecommandations = () => {
        const { recommandations, isRecommandationsLoading, fetchingRecomnandationsErrorMsg } = this.state;
        const limit = 6;
        const columns = recommandations?.slice(0, limit).length > 3 ? "2 auto" : "";
        const showRecommandations = !isRecommandationsLoading && recommandations?.length > 0;
        const idParams = {
            password: this.props.userPassword
        }
        return (
            <div>
                {showRecommandations ?
                    <div className="p-2">
                        <div className='recommandations' style={{ columns: columns}}>
                            {recommandations.slice(0, limit).map((reco, index) =>
                                <React.Fragment>
                                    <UncontrolledPopover
                                        className="recommandation-popover-line"
                                        trigger="click"
                                        placement="bottom"
                                        target={`recommandations__line${index + 1}`}
                                        modifiers={{preventOverflow: {boundariesElement: 'window'}}}
                                        isOpen={this.state.activeIndex === index}>
                                        <PopoverHeader>
                                            <div className="recommandations__title">
                                                <div className="d-flex align-items-center">
                                                    <div className={`recommandations__img-bloc smaller-img-bloc font-weight-light mr-2 ${index + 1 === 1 ? 'red' : ''}`}>
                                                        <div className="recommandations__img">
                                                            {index + 1}
                                                        </div>
                                                    </div>
                                                    {reco?.libelleOffre}
                                                </div>
                                            </div>
                                        </PopoverHeader>
                                        <PopoverBody>
                                            {reco?.argumentaire ? renderHTML(reco.argumentaire) : ""}
                                        </PopoverBody>
                                    </UncontrolledPopover>

                                    <div className={`recommandations__line ${this.state.activeIndex === index ? 'active' : ''}`} id={`recommandations__line${index + 1}`} onClick={this.handleActiveIndex(index)}>
                                        <div className="recommandations__title">
                                            <div className={`recommandations__img-bloc smaller-img-bloc mr-2 ${index + 1 === 1 ? 'red' : ''}`}>
                                                <div className="recommandations__img">
                                                    {index + 1}
                                                </div>
                                            </div>
                                            <div className="recommandations__libelle-container">
                                                <div className="recommandations__libelle">{reco?.libelleOffre}</div>
                                                <div className="recommandations__libelle">{reco?.acteDeGestion}</div>
                                            </div>
                                        </div>
                                        <span className="icon icon-help" />
                                    </div>
                                </React.Fragment>
                            )}
                        </div>
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
                    : <div>
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

export default connect(mapStateToProps, mapDispatchToProps)(SyntheticRecommandations)