import * as React from "react";
import {connect} from "react-redux";
import {Col, PopoverBody, Row, UncontrolledPopover} from "reactstrap";
import {FormattedMessage} from "react-intl";
import ActService from "../../../../service/ActService";
import {translate} from "../../../../components/Intl/IntlGlobalProvider";
import {AppState} from "../../../../store";
import {AntiChurnClientProposal} from "../../../../model/acts/antichurn/AntiChurnClientProposal";

interface State {
    antiChurnAct // : AntiChurnActResponseDTO | undefined
    actType: string
    actDetail: string
}
interface Props {
    resourceId: string,
    target: string,
    antiChurnSettings?: AntiChurnClientProposal[],
}

export class LastAntiChurnPopoverV2 extends React.Component<Props, State> {

    private actService: ActService = new ActService(true);

    constructor(props: Props) {
        super(props);
        this.state = {
            antiChurnAct: undefined,
            actType: "",
            actDetail: ""
        }
    }

    public componentDidMount = async () => {
        if (this.props.resourceId) {
            const antiChurnAct = await this.actService.getActAntiChurn(this.props.resourceId);
            this.setState({antiChurnAct});
        }
        this.handleSettingChanged();
    }

    private handleSettingChanged = () => {
        const targetClientProposal = this.props.antiChurnSettings?.find((clientProposal) =>
            clientProposal.code === this.state.antiChurnAct?.antiChurnData?.clientProposal);
        if (targetClientProposal) {
            const targetActType = targetClientProposal.actType.find((at) => at.code === this.state.antiChurnAct?.antiChurnData?.actType);
            if (targetActType) {
                this.setState({
                    actType: targetActType.label
                });
                if (targetActType.detail) {
                    const targetDetail = targetActType.detail.find((d) => d.code === this.state.antiChurnAct?.antiChurnData?.actDetail);
                    if (targetDetail) {
                        this.setState({
                            actDetail: targetDetail.label
                        })
                    }
                }
            }
        }
    }


    public render(): JSX.Element {
        if (!this.state.antiChurnAct) {
            return <React.Fragment/>
        }
        const {antiChurnData} = this.state.antiChurnAct;
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
                                {antiChurnData.clientTerminationIntention?.code ? "Oui" : "Non"}
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
    antiChurnSettings: state.store.applicationInitialState.antichurnSetting?.settingDetail
});

export default connect(mapStateToProps)(LastAntiChurnPopoverV2)