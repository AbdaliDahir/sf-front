import * as React from "react";
import Row from "reactstrap/lib/Row";
import {Nav, NavItem, NavLink, TabContent, TabPane} from "reactstrap";
import classnames from "classnames";
import {FormattedMessage} from "react-intl";
import Col from "reactstrap/lib/Col";
import {SavAct, SavStatus} from "../../../../model/acts/savOmnical/Sav"
import * as moment from "moment-timezone";

interface Props {
    listOfSav?: Array<SavAct>
    savStatus?: Array<SavStatus>
}

interface State {
    selectedTab : string
    listOfSav?: Array<SavAct>
}

export class SavHistoric extends React.Component<Props, State> {

    private MOMENT_DATE_FORMAT = process.env.REACT_APP_FASTR_MOMENT_DATE_FORMAT;

    constructor(props: Props) {
        super(props);
        this.state = {
            selectedTab: 'status',
            listOfSav: []
        }
    }

    public componentDidMount = () => {
        this.setState({
            listOfSav : this.props.listOfSav !== [] ? this.props.listOfSav : this.state.listOfSav
        })

    }

    public componentDidUpdate = (prevProps) => {
        if(this.props.listOfSav !== prevProps.listOfSav) {
            this.setState({
                listOfSav : this.props.listOfSav !== [] ? this.props.listOfSav : this.state.listOfSav
            })
        }
    }


    public changeTab = (tabId: string) => () => {
        this.setState({selectedTab: tabId})
    };

    public renderSteps () {
        const {savStatus} = this.props;
        return  <React.Fragment>
            <Row className="sav-omnicanal__HistoricHead">
                <Col md={2}><FormattedMessage id="adg.sav.omnicanal.historic.date"/></Col>
                <Col md={3}><FormattedMessage id="adg.sav.omnicanal.historic.status"/></Col>
                <Col md={7}><FormattedMessage id="adg.sav.omnicanal.historic.treated.by"/></Col>
            </Row>
            {savStatus && savStatus.map((status, index) =>{
                const statusDate = status && status.statusDate ? moment(status.statusDate).format(this.MOMENT_DATE_FORMAT) : '';
                const statusName = status && status.statusName ? status.statusName : '';
                const userName = status && status.userName ? status.userName : '';
                return (
                    <Row key={index}>
                        <Col className="pb-3 pt-3 border-bottom" md={2}>{statusDate}</Col>
                        <Col className="pb-3 pt-3 border-bottom" md={3}>{statusName}</Col>
                        <Col className="pb-3 pt-3 border-bottom" md={7}>{userName}</Col>
                    </Row>
                )}
            )}
        </React.Fragment>
    }

    public renderComments () {
        const listOfSav = this.props.listOfSav ? this.props.listOfSav : this.state.listOfSav;
        return  <React.Fragment>
            <Row className="sav-omnicanal__HistoricHead">
                <Col md={2}><FormattedMessage id="adg.sav.omnicanal.historic.date"/></Col>
                <Col md={2}><FormattedMessage id="adg.sav.omnicanal.historic.treated.by"/></Col>
                <Col md={8}><FormattedMessage id="adg.sav.omnicanal.historic.comment"/></Col>
            </Row>
            {listOfSav && listOfSav.map((savAct, index) => {
                const suiviSav = savAct && savAct.actDetail && savAct.actDetail.suiviSav ? savAct.actDetail.suiviSav : null;
                const creationDate = suiviSav && suiviSav.creationDate ?  moment(suiviSav.creationDate).format(this.MOMENT_DATE_FORMAT): '';
                const firstName = suiviSav && suiviSav.advisor?.firstName ? suiviSav.advisor.firstName : '';
                const lastName = suiviSav && suiviSav.advisor?.lastName ? suiviSav.advisor.lastName : '';
                const comment = suiviSav && suiviSav.comment ? suiviSav.comment : '';
                return (
                    <Row key={index} className="pr-4">
                        <Col className="pb-3 pt-3 border-bottom" md={2}>{creationDate}</Col>
                        <Col className="pb-3 pt-3 border-bottom" md={2}>{`${firstName} ${lastName}`}</Col>
                        <Col className="pb-3 pt-3 border-bottom pr-3" md={8}>{comment}</Col>
                    </Row>
                )}
            )}
        </React.Fragment>
    }

    public render() {
        const {selectedTab} = this.state;
        return (
            <div className="w-100">
                {/* <Row className="w-100 pl-3">
                    <div className="sav-omnicanal__title pl-4">
                        <FormattedMessage id="adg.sav.omnicanal.historic"/>
                    </div>
                </Row> */}
                <Row className="w-100 mt-2 pl-3 bg-light">
                    <Nav tabs className="w-100 border-0">
                        <NavItem>
                            <NavLink
                                className={classnames({'active': selectedTab === "status"}, "bg-light", "rounded-top")}
                                onClick={
                                    this.changeTab("status")
                                }>
                                <FormattedMessage id={"adg.sav.omnicanal.class.status"}/>
                            </NavLink>
                        </NavItem>
                            <NavItem>
                                <NavLink
                                    className={classnames({'active': selectedTab === "comments"}, "bg-light", "rounded-top")}
                                    onClick={
                                        this.changeTab("comments")
                                    }>
                                    <FormattedMessage id={"adg.sav.omnicanal.class.comments"}/>
                                </NavLink>
                            </NavItem>

                    </Nav>
                </Row>
                <Row className="w-100 pl-4">
                    <TabContent activeTab={selectedTab} className="w-100">
                        <TabPane tabId={"status"}>
                            {this.renderSteps()}
                        </TabPane>

                        <TabPane tabId={"comments"}>
                            {this.renderComments()}
                        </TabPane>
                    </TabContent>
                </Row>
            </div>
        );
    }
}
