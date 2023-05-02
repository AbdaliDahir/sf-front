import * as React from "react";
import * as moment from "moment";

import {Breadcrumb, Col} from "reactstrap";
import ActService from "../../../../service/ActService";
import {RetentionActResponseDTO} from "../../../../model/acts/retention/RetentionActResponseDTO";
import {FormattedMessage} from "react-intl";
import {CaseResource} from "../../../../model/CaseResource";
import Label from "reactstrap/lib/Label";
import {translate} from "../../../../components/Intl/IntlGlobalProvider";
import {AppState} from "../../../../store";
import {connect} from "react-redux";

interface Props {
    lastRetentionResource?: CaseResource
    retentionResponse?: RetentionActResponseDTO
    retentionCreationDate?: string
    retentionIneligibilitySetting?: Array<{ code: string, label: string, serviceTypes: string[] }>
}

interface State {
    retentionResponse?: RetentionActResponseDTO
}

class RetentionDataSummary extends React.Component<Props, State> {

    private actService: ActService = new ActService(true);
    private DATETIME_FORMAT = process.env.REACT_APP_FASTR_DATETIME_FORMAT;

    constructor(props: Props) {
        super(props);
        this.state = {}

    }

    public componentDidMount = async () => {
        if (this.props.retentionResponse) {
            this.setState({retentionResponse: this.props.retentionResponse})
        } else if (this.props.lastRetentionResource) {
            const retentionData = await this.actService.getActRetention(this.props.lastRetentionResource.id);
            this.setState({
                retentionResponse: retentionData,
            });
        }
    }

    private findRetentionCauseInegibilityLabel = (causeOfIneligibility: string) => {

        const foundSetting = this.props.retentionIneligibilitySetting?.find((setting) => setting.code === causeOfIneligibility);
        return foundSetting ? foundSetting.label : causeOfIneligibility;
    }


    public render(): JSX.Element {
        if (!this.state.retentionResponse) {
            return <React.Fragment/>
        }
        const retentionData = this.state.retentionResponse.retentionData;
        return (
            <React.Fragment>
                <strong>
                    <Label>
                        <FormattedMessage id="retention.summary.title"/>
                        {this.state.retentionResponse.actFunctionalId ? this.state.retentionResponse.actFunctionalId : ""} &nbsp;
                        <FormattedMessage id="retention.summary.creationDate"/>
                        {this.props.lastRetentionResource
                            ? moment(this.props.lastRetentionResource?.creationDate).format(this.DATETIME_FORMAT)
                            : moment(this.props.retentionCreationDate).format(this.DATETIME_FORMAT)}
                    </Label>
                </strong>
                <Breadcrumb>
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
                        {retentionData.causeOfIneligibility &&
                        <div className="mb-2">
                            <span className="font-weight-bold"><FormattedMessage
                                id="acts.retention.cause.ineligebility"/> :</span>
                            <br/>
                            {this.findRetentionCauseInegibilityLabel(retentionData.causeOfIneligibility)}
                        </div>
                        }
                        {retentionData.proposal &&
                        <div>
                            <span className="font-weight-bold"><FormattedMessage id="acts.retention.proposal"/> :</span>
                            <br/>
                            {translate.formatMessage({id: retentionData.proposal})}
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
                </Breadcrumb>
            </React.Fragment>
        )

    }
}

const mapStateToProps = (state: AppState) => ({
    retentionIneligibilitySetting: state.store.applicationInitialState.retentionSettings?.retentionIneligibilitySetting.settingDetail.ineligibilityCauses
})

export default connect(mapStateToProps)(RetentionDataSummary)