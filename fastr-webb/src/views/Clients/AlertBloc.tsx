import React from "react";
import {Button, Card, Col, Row} from "reactstrap";
import {useTypedSelector} from "../../components/Store/useTypedSelector";
import {shallowEqual} from "react-redux";
import {Alert} from "../../model/alert/Alert";
import {ClientContextSliceState} from "../../store/ClientContextSlice";
import {TabCategory} from "../../model/utils/TabCategory";

interface Props {
    pwd: string,
    clientContext?: ClientContextSliceState
}

const AlertBloc = (props: Props) => {
    const {clientContext, pwd} = props;
    const alerts: Alert[] = clientContext?.clientData ? (
        useTypedSelector(state => state.store.client.loadedClients.find(c => c.clientData?.id === clientContext?.clientData?.id && c.serviceId === clientContext?.service?.id)?.alerts, shallowEqual)
    ) : (
        useTypedSelector(state => state.alert.alertsByPersonId)
    );
    const activeTab = useTypedSelector(state => state.uiContext.activeTab.find(value => value.clientId ===clientContext?.clientData?.id)?.activeTab ?? TabCategory.CASES);

    const alertDisplayClassName = () => {
        function checkTabCategoryMatch(arr, value) {
            const result = arr.filter(o => {
                const formatedCategory = o.category.replace(/\s/g, "").toLowerCase();
                let formatedValue = value.replace(/\s/g, "").toLowerCase();
                if (formatedValue === "offre&conso") {
                    formatedValue = "offreetconso"
                }
                return formatedCategory === formatedValue;
            });
            return result ? result[0] : null;
        }

        return checkTabCategoryMatch(alerts, activeTab.toLowerCase()) !== undefined || pwd.toLowerCase() === "all" ? '' : 'd-none'
    }

    const generateAlertList = () => {
        if (!alerts) {
            return;
        }
        return alerts.map((alert, index) => {

            let tabName = pwd;
            if (tabName === "OFFRE & CONSO") {
                tabName = "OffreEtConso";
            }

            if (alert.category.toLowerCase() === tabName.toLowerCase() || tabName.toLowerCase() === "all") {
                return (
                    <Row className={"alert-block d-flex align-items-center pt-1 pb-1"}
                         key={alert.name + "blockAlerte" + index}>
                        <div className="d-flex justify-content-start flex-grow-1">
                            <div className={"text-primary font-weight-bold overflow-wrap-normal pr-4"}>
                                {alert.name}
                            </div>
                            <div>
                                {alert.description}
                            </div>
                        </div>

                        {alert.actions && alert.actions[0] &&
                        <Button className={"btn btn-sm btn-dark space-top float-right"}>{alert.actions}</Button>
                        }
                    </Row>
                )
            }
            return <span key={alert.name + "blockAlerte" + index}/>
        });
    }

    if (!alerts || alerts.length <= 0) {
        return <React.Fragment/>
    } else {
        return (
            <Card body outline color="primary" className={'card-alert ' + alertDisplayClassName()}>
                <Row className="alert-block m-0 d-flex">
                    <div className={"pr-4 d-flex"}>
                        <span className="icon-gradient icon-ring big-picture"/>
                    </div>
                    <Col>
                        {generateAlertList()}
                    </Col>
                </Row>
            </Card>
        );
    }
}

export default AlertBloc