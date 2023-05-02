import classnames from 'classnames';
import React, {useEffect, useState} from "react";
import {Card, CardBody, CardHeader, Nav, NavItem, NavLink, TabContent, TabPane} from "reactstrap";
import DisplayTitle from "../../../components/DisplayTitle";
import './Equipement.scss';
import {FormattedMessage} from "react-intl";
import PrincipalEquipments from "./PrincipalEquipments";
import {ClientContextSliceState} from "../../../store/ClientContextSlice";
import {useTypedSelector} from "../../../components/Store/useTypedSelector";
import {LandedLineService} from "../../../model/service/LandedLineService";
import {useDispatch} from "react-redux";
import {fetchLandedDevices} from "../../../store/LandedDeviceSlice";
import SecondaryEquipments from "./SecondaryEquipments";

const LANDED_DEVICE_TABS = ["landed.nav.equipment.nav.current", "landed.nav.equipment.old"];

interface Props {
    clientContext?: ClientContextSliceState,
    fastrView?: Boolean
}

const BlockLandedEquipements = (props: Props) => {

    const {clientContext} = props;
    const client: ClientContextSliceState = clientContext ? clientContext : useTypedSelector(state => state.store.clientContext);
    const landedService = client.service as LandedLineService;

    const dispatch = useDispatch();
    useEffect(() => {
        if (landedService) {
            const refSiebel = landedService?.siebelAccount;
            dispatch(fetchLandedDevices(refSiebel));
        }
    }, []);

    return (
        <React.Fragment>
            {BlockPrincipalEquipments()}
            {BlockSecondaryEquipments()}
        </React.Fragment>)
}

const BlockSecondaryEquipments = () => {
    const [activeTab, setActiveTab] = useState(0);
    const changeTab = (tabNumber: number) => () => {
        setActiveTab(tabNumber);
    };

    const devices = useTypedSelector(state => state.landedDevice.data);
    if (!devices || !devices.secondaryEquipments.length) {
        return <React.Fragment/>
    }

    return (
        <Card className="mt-3">
            <CardHeader className="d-flex justify-content-between">
                <DisplayTitle icon="icon-gradient icon-applications" fieldName="offer.equipements.secondary.title"
                            isLoading={true}/>
            </CardHeader>
            <CardBody id="tab-device-container" className="border-0 p-0">
                <Nav tabs>
                    {
                        LANDED_DEVICE_TABS.map((tabName, index) => (
                            <NavItem key={index}>
                                <NavLink
                                    className={classnames({'active-tab': activeTab === index})}
                                    onClick={
                                        changeTab(index)
                                    }>
                                    <FormattedMessage id={tabName}/>
                                </NavLink>
                            </NavItem>
                        ))
                    }
                </Nav>
                <TabContent activeTab={activeTab} className={"mt-3"}>
                    <TabPane tabId={0}>
                        <div className="timeline-container pl-2">
                            <SecondaryEquipments filter="current"/>
                        </div>
                    </TabPane>
                    <TabPane tabId={1}>
                        <div className="timeline-container pl-2">
                            <SecondaryEquipments filter="old"/>
                        </div>
                    </TabPane>
                </TabContent>
            </CardBody>
        </Card>
    )
}

const BlockPrincipalEquipments = () => {
    const [activeTab, setActiveTab] = useState(0);
    const changeTab = (tabNumber: number) => () => {
        setActiveTab(tabNumber);
    };
    return (
        <Card className="mt-3">
            <CardHeader className="d-flex justify-content-between">
                <DisplayTitle icon="icon-gradient icon-multi-devices" fieldName="offer.equipements.principal.title"
                            isLoading={true}/>
            </CardHeader>
            <CardBody id="tab-device-container" className="border-0 p-0">
                <Nav tabs>
                    {
                        LANDED_DEVICE_TABS.map((tabName, index) => (
                            <NavItem key={index}>
                                <NavLink
                                    className={classnames({'active-tab': activeTab === index})}
                                    onClick={
                                        changeTab(index)
                                    }>
                                    <FormattedMessage id={tabName}/>
                                </NavLink>
                            </NavItem>
                        ))
                    }
                </Nav>
                <TabContent activeTab={activeTab} className={"mt-3"}>
                    <TabPane tabId={0}>
                        <div className="timeline-container pl-2">
                            <PrincipalEquipments filter="current"/>
                        </div>
                    </TabPane>
                    <TabPane tabId={1}>
                        <div className="timeline-container pl-2">
                            <PrincipalEquipments filter="old"/>
                        </div>
                    </TabPane>
                </TabContent>
            </CardBody>
        </Card>
    )
}

export default BlockLandedEquipements
