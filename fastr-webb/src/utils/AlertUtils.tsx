import * as React from "react";

import {useTypedSelector} from "../components/Store/useTypedSelector";
import {shallowEqual} from "react-redux";

export const renderAlertNotification = (tabValue: string, clientId: string|undefined, serviceId: string|undefined) => {
    const alerts = clientId && serviceId ? (
        useTypedSelector(state => state.store.client.loadedClients.find(c => c.clientData?.id === clientId && c.serviceId === serviceId)?.alerts, shallowEqual)
    ) : (
        useTypedSelector(state => state.alert.alertsByPersonId)
    );
    if (!alerts || !alerts.length) {
        return <React.Fragment/>
    }

    if (tabValue === "OFFRE & CONSO") {
        tabValue = "OffreEtConso";
    }

    const alertByCategory = alerts.filter(alert => alert.category.toLowerCase() === tabValue.toLowerCase());

    if (alertByCategory && alertByCategory.length) {
        return <span className="tab-alert icon-gradient icon-ring top ml-1"/>
    } else {
        return <React.Fragment/>
    }

}


