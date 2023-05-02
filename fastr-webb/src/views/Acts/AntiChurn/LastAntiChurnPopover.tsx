import * as React from "react";
import ActService from "../../../service/ActService";
import {AntiChurnActResponseDTO} from "../../../model/acts/antichurn/AntiChurnActResponseDTO";
import {AppState} from "../../../store";
import {fetchAndStoreAntiChurnSettings} from "../../../store/actions/AntiChurnAction";
import {connect} from "react-redux";
import {Col, PopoverBody, Row, UncontrolledPopover} from "reactstrap";
import {FormattedMessage} from "react-intl";
import {translate} from "../../../components/Intl/IntlGlobalProvider";

interface State {
    antiChurnData: AntiChurnActResponseDTO | undefined
    actType: string
    actDetail: string
}

interface Props {
    resourceId: string,
    target: string,
    antiChurnSettings,
    fetchAndStoreAntiChurnSettings: () => void
}

export class LastAntiChurnPopover extends React.Component<Props, State> {

    private actService: ActService = new ActService(true);

    constructor(props: Props) {
        super(props);
        this.state = {
            antiChurnData: undefined,
            actType: "",
            actDetail: ""
        }
    }

    public componentDidMount = async () => {
        console.warn('check parent store', !this.props.antiChurnSettings)
        if (!this.props.antiChurnSettings) {
            await this.props.fetchAndStoreAntiChurnSettings()
        }
        if (this.props.resourceId) {
            const antiChurnData = await this.actService.getActAntiChurn(this.props.resourceId);
            this.setState({antiChurnData});
        }
        this.props.antiChurnSettings.settingMongo
            .filter((clientProposal) => clientProposal.code === this.state.antiChurnData?.antiChurnData?.clientProposal)
            .map((clientProposal) => clientProposal.actType)
            .flat()
            .forEach((actType) => {
                if (actType.code === this.state.antiChurnData?.antiChurnData?.actType) {
                    this.setState({actType: actType.label})
                    if (actType.detail) {
                        actType.detail.forEach((actDetail) => {
                            if (actDetail.code === this.state.antiChurnData?.antiChurnData?.actDetail) {
                                this.setState({actDetail: actDetail.label})
                            }
                        })
                    }
                }
            })
    }

    public render(): JSX.Element {
        if (!this.state.antiChurnData) {
            return <React.Fragment/>
        }
        const {antiChurnData} = this.state.antiChurnData;
        const actType = this.state.actType;
        const actDetail = this.state.actDetail;

        return (
            <UncontrolledPopover placement="bottom" target={this.props.target}
                                 className={"last-antichurn-popover__popover"}>
                <PopoverBody>
                    <Row>
                        <Col>
                            <div className="mb-2">
                                <span className="font-weight-bold">
                                    <FormattedMessage id="acts.antichurn.possibility"/> :</span>
                                <br/>
                                {antiChurnData.possibility ? translate.formatMessage({id: antiChurnData.possibility}) : ""}
                            </div>
                            {antiChurnData.clientProposal &&
                            <div className="mb-2">
                                <span className="font-weight-bold">
                                <FormattedMessage id="acts.antichurn.clientProposal"/> :</span>
                                <br/>
                                {translate.formatMessage({id: antiChurnData.clientProposal})}
                            </div>
                            }
                            <div className="mb-2">
                                <span className="font-weight-bold">
                                    <FormattedMessage id="acts.antichurn.clientTerminationIntention"/> :</span>
                                <br/>
                                {antiChurnData.clientTerminationIntention.code ? "Oui" : "Non"}
                            </div>
                            {antiChurnData.actType &&
                            <div className="mb-2">
                                <span className="font-weight-bold">
                                    <FormattedMessage id="acts.antichurn.actType"/> :</span>
                                <br/>
                                {actType}
                            </div>
                            }
                            {antiChurnData.actDetail &&
                            <div className="mb-2">
                                <span className="font-weight-bold">
                                    <FormattedMessage id="acts.antichurn.actDetail"/> :</span>
                                <br/>
                                {actDetail}
                            </div>
                            }
                            {antiChurnData.proposalDetail &&
                            <div className="mb-2">
                                <span className="font-weight-bold">
                                    <FormattedMessage id="acts.antichurn.proposalDetail"/> :</span>
                                <br/>
                                {antiChurnData.proposalDetail}
                            </div>
                            }
                            {antiChurnData.clientResponse &&
                            <div className="mb-2">
                                <span className="font-weight-bold"><FormattedMessage
                                    id="acts.antichurn.clientResponse"/> :</span>
                                <br/>
                                {translate.formatMessage({id: antiChurnData.clientResponse})}
                            </div>
                            }
                            {antiChurnData.proposalMode &&
                            <div className="mb-2">
                                <span className="font-weight-bold"><FormattedMessage
                                    id="acts.antichurn.proposalMode"/> :</span>
                                <br/>
                                {translate.formatMessage({id: antiChurnData.proposalMode})}
                            </div>
                            }
                            {antiChurnData.orderReference &&
                            <div className="mb-2">
                                <span className="font-weight-bold"><FormattedMessage
                                    id="acts.antichurn.orderReference"/> :</span>
                                <br/>
                                {antiChurnData.orderReference}
                            </div>
                            }
                            {antiChurnData.proposalWithoutCommitment &&
                            <div className="mb-2">
                                <span className="font-weight-bold"><FormattedMessage
                                    id="acts.antichurn.proposalWithoutCommitment"/> :</span>
                                <br/>
                                {antiChurnData.proposalWithoutCommitment.label}
                            </div>
                            }
                        </Col>
                    </Row>
                </PopoverBody>
            </UncontrolledPopover>
        )
    }
}

const mapStateToProps = (state: AppState) => ({
    antiChurnSettings: state.antiChurn.antiChurnSettings,
});

const mapDispatchToProps = {
    fetchAndStoreAntiChurnSettings
}

export default connect(mapStateToProps, mapDispatchToProps)(LastAntiChurnPopover)