import * as React from "react";
import {FormattedMessage} from "react-intl";
import {NotificationManager} from "react-notifications";
import {connect} from "react-redux";
import {Button, Col, Container, Row, UncontrolledAlert} from "reactstrap";
import {translate} from "../../../../components/Intl/IntlGlobalProvider";
import {EditOwnerEligibilityDto} from "../../../../model/acts/edit-owner/EditOwnerEligibilityDto";
import {Client} from "../../../../model/person";
import ActService from "../../../../service/ActService";
import {CTIActionsProps, setCTIToFinished, setCTIToOngoing} from "../../../../store/actions/CTIActions";
import {ClientContext} from "../../../../store/types/ClientContext";
import {Service} from "../../../../model/service";

interface Props extends CTIActionsProps {
    title?: string
    startAct: () => void,
    client: ClientContext<Service>,
    idService: string,
    notifyIneligibility: (reason: string) => void
    notifyServiceUnavailable: () => void
}

interface State {
    disabledButton: boolean
    eligible: boolean | undefined,
    ineligibilityReason: string | undefined,
    technicalProblem: boolean,
    additionalInfo: string | undefined
}

class OwnerEligibility extends React.Component<Props, State> {

    private actService: ActService = new ActService(true);

    constructor(props: Props) {
        super(props);
        this.state = {
            disabledButton: false,
            eligible: undefined,
            technicalProblem: false,
            ineligibilityReason: undefined,
            additionalInfo: undefined
        }
    }

    public componentDidMount = () => {
        this.props.setCTIToOngoing();
    }

    public launchEligibilityCheck = async () => {
        this.setState({
            disabledButton: true,
            technicalProblem: false,
            ineligibilityReason: undefined,
            eligible: undefined,
            additionalInfo: undefined
        });

        try {
            const data: Client | undefined = this.props.client.data;
            const eligibilityResponse: EditOwnerEligibilityDto = await this.actService.getEditOwnerEligibility(data!.id, this.props.idService, data!.corporation);

            if (!eligibilityResponse.eligibility) {
                this.setState({ineligibilityReason: eligibilityResponse.ineligibilityReason, eligible: false})
                this.props.notifyIneligibility(eligibilityResponse.ineligibilityReason);
                return;
            }

            // Eligible OK but existing easy terms (FASTDEV-6653 - BOX+TV)
            if ("OK_FDP" === eligibilityResponse.description) {
                const additionalInfo = translate.formatMessage({id: "Existing easy terms"})
                this.setState({eligible: true, additionalInfo: additionalInfo})
                return;
            }

            NotificationManager.success(translate.formatMessage({id: "Successful eligibility"}), null, 2000);
            this.setState({eligible: true});

        } catch (error) {
            this.setState({eligible: false, technicalProblem: true});
            this.props.notifyServiceUnavailable();
        }
    };

    public startAct = () => {
        this.props.startAct();
    }

    public renderButton(): JSX.Element {
        if (!this.state.eligible) {
            return (
                <Row className="mb-5">
                    <Button id="ownerEli.lanchEli.button.id" outline color="primary"
                            onClick={this.launchEligibilityCheck}
                            disabled={this.state.disabledButton}><FormattedMessage
                        id="Start eligibility check"/></Button>
                </Row>

            )
        } else {
            return (
                <Row className="mb-5">
                    <Button id="ownerEli.startAct.button.id" outline color="primary"
                            onClick={this.startAct}><FormattedMessage
                        id="global.pagination.next"/></Button>
                </Row>
            )
        }
    }

    public renderWarningOrError(): JSX.Element {
        if (undefined === this.state.eligible) {
            return <React.Fragment/>
        }

        if (this.state.eligible) {
            if (this.state.additionalInfo) {
                return (
                    <Row>
                        <Col md={12}>
                            <UncontrolledAlert color="warning"
                                               fade={false}><div className="text-justify font-weight-bold"><FormattedMessage
                                id="Eligibility OK with warning"/></div>{this.state.additionalInfo}</UncontrolledAlert>
                        </Col>
                    </Row>
                )
            }
            return <React.Fragment/>
        }

        return this.state.technicalProblem ?
            <Row>
                <Col md={12}>
                    <UncontrolledAlert color="danger" fade={false}><FormattedMessage
                        id="Eligibility KO"/></UncontrolledAlert>
                </Col>
            </Row> :

            <Row>
                <Col md={12}>
                    <UncontrolledAlert color="warning" fade={false}><FormattedMessage
                        id="Ineligibility warn"/>{this.state.ineligibilityReason}</UncontrolledAlert>
                </Col>
            </Row>

    }

    public render(): JSX.Element {
        return (
            <Container>
                <Row className="mt-5">
                    <p className="text-justify font-weight-bold"><FormattedMessage
                        id="Owner change could need two minutes to perform an eligibility check"/></p>
                    <p className="text-justify font-weight-bold"><FormattedMessage id="Do you wish to confirm ?"/></p>
                </Row>

                {this.renderWarningOrError()}

                {this.renderButton()}
            </Container>
        );
    }

}

const mapDispatchToProps = dispatch => (
    {
        setCTIToOngoing: () => dispatch(setCTIToOngoing()),
        setCTIToFinished: () => dispatch(setCTIToFinished())
    }
)

export default connect(null, mapDispatchToProps)(OwnerEligibility)
