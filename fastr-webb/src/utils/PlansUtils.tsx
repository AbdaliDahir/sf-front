import * as React from "react";
import DisplayOptionPlanField from "../components/DisplayOptionPlanField";

import {MobileLineService, MobilePlan} from "../model/service";


export const getCurrentMobilePlan = (service?: MobileLineService) => {
    if (!service || !service?.plans) {
        return undefined
    } else {
        const {offerCode} = service;
        const {plans} = service;
        plans?.filter((plan: MobilePlan) => (plan.offerId === offerCode && plan.state === "ACTIF"));
        if (plans?.length) {
            return plans[0];
        } else {
            return undefined;
        }
    }
}

export const renderMobilePlans = (activeOptions: MobilePlan[]) => {

    return (
        activeOptions.map((plan: MobilePlan, index) => {
            return <DisplayOptionPlanField
                label={plan.offerName}
                icon="icon icon-settings"
                startDate={plan.startDate}
                key={index}
                endDate={plan.endDate}
                price={plan.offerPrice
                }
            />
        })
    )
}


