import * as React from "react";
import ActService from "../../../service/ActService";
import {RetentionActResponseDTO} from "../../../model/acts/retention/RetentionActResponseDTO";
import {Col, PopoverBody, Row, UncontrolledPopover} from "reactstrap";
import {FormattedMessage} from "react-intl";
import {translate} from "../../../components/Intl/IntlGlobalProvider";
import "./LastRetentionPopover.scss"
import { RetentionIneligibilityCausesSetting } from "src/model/acts/retention/RetentionIneligibilityCausesSetting";
import { connect } from "react-redux";
import { AppState } from "src/store";

interface State {
    retentionData: RetentionActResponseDTO | undefined
}

interface Props {
    retentionIneligibilityCausesSetting?: RetentionIneligibilityCausesSetting,
    resourceId: string,
    target: string
}

class LastRetentionPopover extends React.Component<Props, State> {

    private actService: ActService = new ActService(true);

    constructor(props: Props) {
        super(props);
        this.state = {
            retentionData: undefined
        }
    }

    public componentDidMount = async () => {
        const retentionData = await this.actService.getActRetention(this.props.resourceId);
        this.setState({retentionData});
    };

    public getRetentionCauseInegibilityArr = (): {}[] => {
        const retentionCause: {}[] = [];
        this.props.retentionIneligibilityCausesSetting?.ineligibilityCauses
            .sort((a, b) => a.label.localeCompare(b.label))
            .forEach((retentCause) => {
                retentionCause.push({
                    code: retentCause.code,
                    label: retentCause.label
                });
            })
        return retentionCause;
    };

    public getRetentionCauseInegibilityLabel = () => {
        let retentionCauseLabel;
        const retentionCauseArr = this.getRetentionCauseInegibilityArr()
        if (retentionCauseArr) {
            // @ts-ignore
            retentionCauseLabel = retentionCauseArr.filter(el => el.code === this.state.retentionData?.retentionData.causeOfIneligibility)
        }
        return retentionCauseLabel[0] ? retentionCauseLabel[0].label : this.state.retentionData?.retentionData.causeOfIneligibility
    }

    public render(): JSX.Element {
        if (!this.state.retentionData) {
            return <React.Fragment/>
        }
        const {retentionData} = this.state.retentionData;
        return (
            <UncontrolledPopover placement="bottom" target={this.props.target} className={"last-retention-popover__popover"}>
                <PopoverBody>
                    <Row>
                        <Col>
                            <div className="mb-2">
                                <span className="font-weight-bold"><FormattedMessage
                                    id="acts.retention.intention"/> :</span>
                                <br/>
                                {retentionData.intentionByClient ? "Oui" : "Non"}
                            </div>
                            <div className="mb-2">
                                <span className="font-weight-bold"><FormattedMessage
                                    id="acts.retention.isOutPerimeter"/> :</span>
                                <br/>
                                {retentionData.outOfPerim ? "Oui" : "Non"}
                            </div>
                            {retentionData.motif &&
                                <div className="mb-2">
                                    <span className="font-weight-bold"><FormattedMessage
                                        id="retentionDataForm.motifAppel"/> :</span>
                                    <br/>
                                    {retentionData.motif.label}
                                </div>
                            }
                            {retentionData.sousMotif &&
                            <div className="mb-2">
                                <span className="font-weight-bold"><FormattedMessage
                                    id="retentionDataForm.sousMotifAppel"/> :</span>
                                <br/>
                                {retentionData.sousMotif.label}
                            </div>
                            }
                            <div className="mb-2">
                                <span className="font-weight-bold"><FormattedMessage
                                    id="acts.retention.eligibility"/> :</span>
                                <br/>
                                {retentionData.eliRetention ? "Oui" : "Non"}
                            </div>
                            {retentionData.proposal &&
                                <div className="mb-2">
                                    <span className="font-weight-bold"><FormattedMessage
                                        id="acts.retention.proposal"/> :</span>
                                    <br/>
                                    {translate.formatMessage({id: retentionData.proposal})}
                                </div>
                            }
                            {retentionData.causeOfIneligibility &&
                                <div>
                                    <span className="font-weight-bold"><FormattedMessage id="acts.retention.cause.ineligebility"/> :</span>
                                    <br/>
                                    {this.getRetentionCauseInegibilityLabel()}
                                </div>
                            }
                        </Col>
                        <Col>
                            {retentionData.proposalDetail &&
                                <div className="mb-2">
                                    <span className="font-weight-bold"><FormattedMessage
                                        id="acts.retention.proposal.detail"/> :</span>
                                    <br/>
                                    {translate.formatMessage({id: retentionData.proposalDetail})}
                                </div>
                            }
                            <div className="mb-2">
                                <span className="font-weight-bold"><FormattedMessage
                                    id="acts.retention.order.reference"/> :</span>
                                <br/>
                                {retentionData.refCommande}
                            </div>
                            {retentionData.clientAnswer &&
                                <div className="mb-2">
                                    <span className="font-weight-bold"><FormattedMessage
                                        id="acts.retention.clientAnswer"/> :</span>
                                    <br/>
                                    {translate.formatMessage({id: retentionData.clientAnswer})}
                                </div>
                            }
                            {retentionData.motifRefus &&
                                <div className="mb-2">
                                    <span className="font-weight-bold"><FormattedMessage
                                        id="retentionDataForm.motifRefus"/> :</span>
                                    <br/>
                                    {retentionData.motifRefus.label}
                                </div>
                            }
                            {retentionData.sousMotifRefus &&
                                <div className="mb-2">
                                    <span className="font-weight-bold"><FormattedMessage
                                        id="retentionDataForm.sousMotifRefus"/> :</span>
                                    <br/>
                                    {retentionData.sousMotifRefus.label}
                                </div>
                            }
                            {retentionData.proposalWithoutCommitment &&
                            <div className="mb-2">
                                    <span className="font-weight-bold"><FormattedMessage
                                        id="acts.retention.proposalWithoutCommitment"/> :</span>
                                <br/>
                                {retentionData.proposalWithoutCommitment.label}
                            </div>
                            }
                            <div>
                                <span className="font-weight-bold"><FormattedMessage
                                    id="acts.retention.isAdressResil"/> :</span>
                                <br/>
                                {retentionData.adressResil ? "Oui" : "Non"}
                            </div>
                        </Col>
                    </Row>
                </PopoverBody>
            </UncontrolledPopover>
        )
    }
}

const mapStateToProps = (state: AppState) => ({
    retentionIneligibilityCausesSetting: state.store.applicationInitialState.retentionSettings?.retentionIneligibilitySetting.settingDetail,
});

export default connect(mapStateToProps)(LastRetentionPopover)
