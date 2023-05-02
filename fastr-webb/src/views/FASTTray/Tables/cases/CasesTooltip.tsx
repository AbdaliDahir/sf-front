import * as React from "react";
import {useEffect, useState} from "react";
import ActionService from "../../../../service/ActionService";
import {Action} from "../../../../model/actions/Action";
import {CaseActionsTooltip} from "../../../../model/case/CaseActionsTooltip";
import {translate} from "../../../../components/Intl/IntlGlobalProvider";
import {format} from "date-fns";

const CasesTooltip: React.FunctionComponent<{
    caseId: string,
}> =({caseId}) => {
    const [caseActionsTooltips,setCaseActionsTooltips]= useState<CaseActionsTooltip[]>([])
    const actionService: ActionService = new ActionService(true);
    function normalizeData(data: Array<Action>):CaseActionsTooltip[]  {
        return data.map(action => {
            return ({
                actionId: action.actionId,
                actionLabel: action.actionLabel,
                status:action.processCurrentState?.status,
                updateDate: format (new Date(action.updateDate),"dd/MM/yyyy HH:mm")
            })
        })
    }
    useEffect(   () => {
        async function getData   (id: string)  {
            const actionsDetails: Array<Action> = await actionService.getAllActionsByCaseId(id);
            const formattedData = normalizeData(actionsDetails)
            setCaseActionsTooltips(formattedData)

        }
        if (caseId) {
            getData(caseId).catch(console.error)
        }

    }, [caseId])
    return (
        <>
        {caseActionsTooltips.length > 0 ?(
            <div className="case-action-tooltips">
                {caseActionsTooltips.map((action) => (
                        <div className="case-action-tooltips-child">
                            <span className="case-action-tooltips-child-title">{`${translate.formatMessage({id: 'action.tooltip.id.suffix'})} ${action.actionId}`}</span>
                            <span> {action.actionLabel}</span>
                            <span>{translate.formatMessage({id: `STATUS.${action.status}`})}</span>
                            <span>{action.updateDate}</span>
                        </div>
                    ))
                }
            </div>
            ):(
                <></>
            )
        }
        </>
    )
}
export default CasesTooltip