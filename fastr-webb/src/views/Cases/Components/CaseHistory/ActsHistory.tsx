import * as React from "react";
// Components
import {FormattedMessage} from "react-intl";
import {CaseResource} from "../../../../model/CaseResource";
import * as moment from "moment";
import classnames from 'classnames';
import Row from "reactstrap/lib/Row";
import Col from "reactstrap/lib/Col";
import FastService from "../../../../service/FastService";
import {Client} from "../../../../model/person";
import {Service} from "../../../../model/service";
import {connect} from "react-redux";
import {AppState} from "../../../../store";
import {ActsHistoryFastrModal} from "../../View/Elements/ActsHistoryFastrModal";
import {ActsHistoryWebsapModal} from "../../View/Elements/ActsHistoryWebsapModal";
import {ActsHistoryModal} from "../../View/Elements/ActsHistoryModal";
import {ActsHistoryGingerModal} from "../../View/Elements/ActsHistoryGingerModal";
import ActsHistoryAdgFixeModal from "../../View/Elements/ActsHistoryAdgFixeModal";

interface Props {
    resources: CaseResource[]
    client: Client
    service: Service
    caseId?: string
    siebelAccount?: string
}

interface State {
    collapse: boolean;
    eventsModalList: boolean[]
    openModal: boolean,
    resource?: CaseResource
    active: boolean[]
}

class ActsHistory extends React.Component<Props, State> {

    private DATETIME_FORMAT = process.env.REACT_APP_FASTR_DATETIME_FORMAT;

    constructor(props: Props) {
        super(props);
        this.state = {
            collapse: !props.resources.length,
            eventsModalList: Array(this.props.resources.length).fill(false),
            openModal: false,
            resource: undefined,
            active: Array(this.props.resources.length).fill(false),
        }
    }


    public toggleModalDetailAct = (resourceFromTable: CaseResource, index: number) => () => {
        const isReturnEqpt = resourceFromTable.description === "CHG_STATUT_EQT" || resourceFromTable.description === "CHG_STATUT_EQT_FASTR";
        const isAllActFixeExceptReturnEqpt = resourceFromTable.resourceType === "ACT_ARAMIS" && !isReturnEqpt;
        if (isAllActFixeExceptReturnEqpt) {
            if (resourceFromTable.description === "MDA_ARAMIS") {
                FastService.postOpenADGOrDemandeRestitMessage({
                    resourceId: resourceFromTable.id,
                    serviceId: this.props.service.id
                }, "openFixeDemandeRestitBloc");
            } else {
                FastService.postOpenADGOrDemandeRestitMessage({
                    resourceId: resourceFromTable.id,
                    serviceId: this.props.service.id
                }, "openFixeADGRestitBloc");
            }

            return;
        }
        this.setState({openModal: true, resource: resourceFromTable})
        this.toggleClassActive(index)
    };

    public shutModal = (isOpen: boolean) => {
        this.setState({openModal: isOpen, active: Array(this.props.resources.length).fill(false)})
    };

    private renderCorrectModal(): JSX.Element {
        if (this.state.resource) {
            const {description, creationDate} = this.state.resource;
            const {siebelAccount} = this.props;
            const actDetailsModalHeader = {actLabel: description, actCreationDate: creationDate}
            if (this.state.resource.description.includes('WEBSAP')) {
                return <ActsHistoryWebsapModal
                    date={this.state.resource.creationDate}
                    actId={this.state.resource.id}
                    functionalActId={this.state.resource.description}
                    openModal={this.state.openModal}
                    shutModal={this.shutModal}/>
            }
            if (this.state.resource.resourceType === 'ACT_FASTR') {
                return <ActsHistoryFastrModal resource={this.state.resource} openModal={this.state.openModal}
                                              shutModal={this.shutModal} caseId={this.props.caseId}/>
            }
            switch (this.state.resource.resourceType) {
                // case 'ACT_FASTR': // I'm guessing 'ACT_FASTR isn't just for websap acts'
                //     return <ActsHistoryWebsapModal actId={this.state.resource.id} openModal={this.state.openModal}
                //                                    shutModal={this.shutModal}/>
                case 'ACT_GINGER':
                    return <ActsHistoryGingerModal resource={this.state.resource} openModal={this.state.openModal}
                                                   shutModal={this.shutModal}/>
                case 'ACT_ARAMIS':
                    return <ActsHistoryAdgFixeModal resource={this.state.resource}
                                                    siebelAccount={siebelAccount ? siebelAccount : ""}
                                                    openModal={this.state.openModal}
                                                    shutModal={this.shutModal}/>
                default:
                    return <ActsHistoryModal actId={this.state.resource.id}
                                             actDetailsModalHeader={actDetailsModalHeader}
                                             openModal={this.state.openModal}
                                             shutModal={this.shutModal}/>
            }
        }
        return <React.Fragment/>
    }

    public toggleClassActive(index) {
        const tmp = [this.state.active.slice(0, index), !this.state.active[index], this.state.active.slice(index + 1)];
        const active = [].concat.apply([], tmp);
        this.setState({active});
    };

    public render(): JSX.Element {
        const {resources} = this.props;
        const {active} = this.state;
        if (resources && resources.length !== 0) {
            return (
                <div className="timeline-container">
                    {this.renderCorrectModal()}
                    <ul className="vertical-timeline w-100 mb-0">
                        {
                            resources.map((act, index) => (
                                <li className={`${!act.valid ? "table-warning" : ""} ${active[index] ? 'focusRow' : ""} cursor-pointer highLightRow`}
                                    onClick={this.toggleModalDetailAct(act, index)} key={act.id}>
                                    <span
                                        className={classnames('v-timeline-icon', 'v-not', {'v-last': index === (resources.length - 1)}, {'v-first': index === 0})}/>
                                    <Row className={"mx-1 cursor-pointer"}>
                                        <Col sm={2}>
                                            {moment(act.creationDate).format(this.DATETIME_FORMAT)}
                                        </Col>
                                        <Col sm={6}>
                                            <FormattedMessage id={"act.history.label." + act.description}/>
                                        </Col>
                                        <Col sm={3}>
                                            {act.creator !== undefined && act.creator !== null ? act.creator.login : ""}
                                        </Col>
                                    </Row>
                                </li>
                            ))}
                    </ul>
                </div>
            )
        } else {
            return <div><FormattedMessage id={"cases.history.acts.none"}/></div>
        }
    }
}

const mapStateToProps = (state: AppState) => ({
    client: state.client.data,
    service: state.client.service
})

export default connect(mapStateToProps)(ActsHistory)
