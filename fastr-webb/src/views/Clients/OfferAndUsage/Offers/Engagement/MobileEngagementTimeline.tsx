import React from "react";

import {ClientContextSliceState} from "../../../../../store/ClientContextSlice";
import {useTypedSelector} from "../../../../../components/Store/useTypedSelector";
import {MobileEngagement, MobileLineService} from "../../../../../model/service";
import Gantt from "../../../../../components/Bootstrap/Gantt/Gantt";
import ServiceUtils from "../../../../../utils/ServiceUtils";

interface Props {
    clientContext?: ClientContextSliceState
}

const MobileEngagementTimeline = (props: Props) => {
    const {clientContext} = props;
    const client: ClientContextSliceState = clientContext ? clientContext : useTypedSelector(state => state.store.clientContext);
    const service = client.service as MobileLineService;
    const now = new Date();

    if (service && service.engagements) {
        if (!service.engagements.length) {
            return ServiceUtils.renderEmptyDataMsg("offer.engagements.empty", false)
        } else {
            // filter prior 24 months & post 24 months
            const dayPrior = new Date()
            dayPrior.setFullYear(dayPrior.getFullYear() - 2);
            const dayPost = new Date()
            dayPost.setFullYear(dayPost.getFullYear() + 2);

            const engagementsFiltered: MobileEngagement[] = []
            service.engagements.map(elem => {
                const startValue = new Date(elem.startEngagement)
                const endValue = new Date(elem.endEngagement)
                if (startValue > dayPrior && startValue < dayPost && endValue > dayPrior && endValue < dayPost) {
                    engagementsFiltered.push(elem)
                    return
                }
                if (startValue < dayPrior && endValue > dayPrior && endValue < dayPost) {
                    engagementsFiltered.push({
                        startEngagement: dayPrior.toString(),
                        endEngagement: elem.endEngagement,
                        totalMonthsEngagement: elem.totalMonthsEngagement,
                        remainingMonthsEngagement: elem.remainingMonthsEngagement,
                        name: elem.name,
                        status: elem.status,
                        fees: elem.fees
                    })
                    return
                }
                if (startValue > dayPrior && startValue < dayPost && endValue > dayPost) {
                    engagementsFiltered.push({
                        startEngagement: elem.startEngagement,
                        endEngagement: dayPost.toString(),
                        totalMonthsEngagement: elem.totalMonthsEngagement,
                        remainingMonthsEngagement: elem.remainingMonthsEngagement,
                        name: elem.name,
                        status: elem.status,
                        fees: elem.fees
                    })
                    return
                }
            })
            const triedEngagementsFiltered = engagementsFiltered.sort(function(a,b){
                const preDate = new Date(b.endEngagement);
                const nextDate = new Date(a.endEngagement);
                return preDate.getTime() - nextDate.getTime();
            });
            
            const progress = triedEngagementsFiltered.map(e => {
                    return {
                        from: new Date(e.startEngagement).toLocaleDateString(),
                        to: new Date(e.endEngagement).toLocaleDateString()
                    }
                }
            )
            const startValues = triedEngagementsFiltered.map(e => new Date(e.startEngagement))
            const endValues = triedEngagementsFiltered.map(e => new Date(e.endEngagement))
            endValues.forEach((e) => startValues.push(e))
            startValues.push(now)
            let valuesString = startValues
                .sort((a, b) => {
                    return a > b ? 1 : -1;
                })
                .map(e => e.toLocaleDateString())
            const labels = triedEngagementsFiltered.map(e => buildEngagementLabel(e))

            const d = new Date();
            const year = d.getFullYear();
            const month = d.getMonth();
            const day = d.getDate();
            const c = new Date(year + 2, month, day);
            const f = new Date(year + 1, month, day);
            const e = new Date(year - 2, month, day);
            const g = new Date(year - 1, month, day);
            valuesString = [e.toLocaleDateString(), g.toLocaleDateString(), now.toLocaleDateString(), f.toLocaleDateString(), c.toLocaleDateString()]
            return (
                <div>
                    <Gantt labels={labels} now={now.toLocaleDateString()} values={valuesString} progresses={progress}/>
                </div>)
        }
    } else {
        return <React.Fragment/>
    }
}

const buildEngagementLabel = (engagement: MobileEngagement) => {
    return (engagement.name && engagement.status) ? engagement.name + " (" + engagement.status + ")" : !engagement.status ? engagement.name : ""
}

export default MobileEngagementTimeline
