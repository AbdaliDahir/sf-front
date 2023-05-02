import * as React from "react";
import { useState } from "react";
import { Card, CardBody, CardHeader, Col, Collapse, Row } from "reactstrap";
import DashboardV2 from "src/poc/dashboard/DashboardV2";
import { useTypedSelector } from "../../../components/Store/useTypedSelector";
import { ApplicationInitialState } from "../../../model/ApplicationInitialState";
import CaseDetailedTray from "../../FASTTray/CaseDetailedTray";

const HomePage = () => {

    const appInitialState: ApplicationInitialState = useTypedSelector(state => state.store.applicationInitialState);
    const user = appInitialState?.user;
    const [openMesDossiers, setOpenMesDossiers] = useState(false);
    const [openDashboard, setOpenDashboard] = useState(true);


    /*const onSelectCase = async (row: Case, isSelect, rowIndex, e) => {
        setLoading(true);
        try {
            await dispatch(fetchAndStoreClientV2(row.clientId, row.serviceId, DataLoad.ALL_SERVICES));
            dispatch(selectClientV2(row.clientId, row.serviceId));
        } catch (e) {
            NotificationManager.error("Erreur lors du chargement du client");
        } finally {
            setLoading(false);
        }
    }*/

    const toggle = (cardName) => {
        switch (cardName.currentTarget.getAttribute("name")) {
            case "MES_DOSSIERS":
                setOpenMesDossiers(!openMesDossiers);
                break;
            case "DASHBOARD":
                setOpenDashboard(!openDashboard);
                break;
        }
    }

    return (
        <React.Fragment>
            <div className="row sticky-top bg-white p-4 shadow">
                <div className="col h3">
                    Bonjour {user?.firstName}
                </div>
            </div>
            <div className={"pt-5 container-fluid"}>
                <Card>
                    <CardHeader onClick={toggle} name={"DASHBOARD"}>
                        <Row>
                            <Col md={11}>
                                Mon Dashboard
                            </Col>
                            <Col md={1} className={"text-right"}>
                                <span
                                    className={"icon cursor-pointer m-0 p-0 " + (openDashboard ? "icon-up" : "icon-down")} />
                            </Col>
                        </Row>
                    </CardHeader>
                    <Collapse isOpen={openDashboard}>
                        <CardBody>
                            <DashboardV2 />
                        </CardBody>
                    </Collapse>
                </Card>

            </div>
            <div className={"pb-5 container-fluid"}>
                <Card>
                    <CardHeader onClick={toggle} name={"MES_DOSSIERS"}>
                        <Row>
                            <Col md={11}>
                                Mes Dossiers
                            </Col>
                            <Col md={1} className={"text-right"}>
                                <span
                                    className={"icon cursor-pointer m-0 p-0 " + (openMesDossiers ? "icon-up" : "icon-down")} />
                            </Col>
                        </Row>
                    </CardHeader>
                    <Collapse isOpen={openMesDossiers}>
                        <CardBody>
                            <CaseDetailedTray />
                        </CardBody>
                    </Collapse>
                </Card>
            </div>
        </React.Fragment>
    );
}

export default HomePage