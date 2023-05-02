import React, {useEffect, useState} from "react";
import Row from "reactstrap/lib/Row";
import Col from "reactstrap/lib/Col";
import {FormattedMessage} from "react-intl";
import * as moment from "moment";
import classnames from 'classnames';
import {ActionsHistoryModal} from "../../View/Elements/ActionsHistoryModal";
import ActionService from "../../../../service/ActionService";
import {Action} from "../../../../model/actions/Action";
import {PopoverBody, UncontrolledPopover} from "reactstrap";

const ActionsHistory = (props) => {
    const actionsResources = props.actionsResources
    const actionService: ActionService = new ActionService(true);
    const DATETIME_FORMAT = process.env.REACT_APP_FASTR_DATETIME_FORMAT;
    const [eventsModalList, setEventsModalList] = useState(Array(props.actionsResources.length).fill(false));
    const [active, setActive] = useState(Array(props.actionsResources.length).fill(false));
    const [actions, setActions] = useState();

    useEffect(() => {
        getAllActionsByCaseId();
    }, [actionsResources])


    const getAllActionsByCaseId = async () => {
        try {
            if(actionsResources && actionsResources.length !== 0) {
                const actionsDetails: Array<Action> = await actionService.getAllActionsByCaseId(props.caseId);
                if(actionsDetails?.length >= 0) {
                        actionsDetails.sort((a, b) => {
                            const aa = new Date(a.updateDate).getTime();
                            const bb = new Date(b.updateDate).getTime()
                            return aa > bb ? -1 : aa < bb ? 1 : 0;
                        });
                    setActions(actionsDetails);
                    props.updateActionsDetails(props.caseId, actionsDetails);
                } else {
                    setActions([])
                }
            }
        } catch (e) {
            const error = await e;
            console.error(error)
        }
    }

    const toggleModal = (indexPopover: number) => () => {
        const popoverOpenListN: boolean[] = eventsModalList.slice();
        popoverOpenListN.fill(false);
        popoverOpenListN[indexPopover] = true;
        setEventsModalList(popoverOpenListN);
        toggleClassActive(indexPopover)
    };

    const toggleClassActive = (index) => {
        const tmp = [active.slice(0, index), !active[index], active.slice(index + 1)];
        const actives = [].concat.apply([], tmp);
        setActive(actives)
    };

    const initModals = () => {
        const popoverOpenListN = eventsModalList.slice();
        popoverOpenListN.fill(false);
        setEventsModalList(popoverOpenListN)
    };

    if (actions?.length > 0) {
            return (
                <div className="timeline-container">
                    <ul className="vertical-timeline w-100 mb-0">
                        <Row className={"mx-1"}>
                            <Col>
                                <label style={{fontWeight: "bold"}}><FormattedMessage id={"cases.history.actions.lastUpdate"}/></label>
                            </Col>
                            <Col>
                                <label style={{fontWeight: "bold"}}><FormattedMessage id={"cases.history.actions.activity"}/></label>
                            </Col>
                            <Col>
                                <label style={{fontWeight: "bold"}}><FormattedMessage id={"cases.history.actions.actionLabel"}/></label>
                            </Col>
                            <Col>
                                <label style={{fontWeight: "bold"}}><FormattedMessage id={"cases.history.actions.actionStatus"}/></label>
                            </Col>
                            <Col>
                                <label style={{fontWeight: "bold"}}><FormattedMessage id={"cases.history.actions.actionProgressStatus"}/></label>
                            </Col>
                            <Col>
                                <label style={{fontWeight: "bold"}}><FormattedMessage id={"cases.history.actions.actionConclusion"}/></label>
                            </Col>
                        </Row>
                        {
                            actions.map((action, index) => (
                                <li key={index}
                                    className={`${active[index] ? 'focusRow': ""} cursor-pointer text-left highLightRow`}
                                    id={"Modal" + index}
                                    onClick={toggleModal(index)}>
                                <span
                                    className={classnames('v-timeline-icon', 'v-not', {'v-last': index === (actionsResources.length - 1)}, {'v-first': index === 0})}/>
                                    <Row className={"mx-1"}>
                                        <Col>
                                            {moment(action.updateDate).format(DATETIME_FORMAT)}
                                        </Col>
                                        <UncontrolledPopover
                                            placement='auto'
                                            trigger="hover"
                                            target={'td-history-activity' + index.toString() + props.action?.actionId}>
                                            <PopoverBody>
                                                {
                                                    <div key={index}>
                                                    <span
                                                        style={{fontWeight: "bold"}}><FormattedMessage
                                                        id={"action.history.logical.site"}/> : </span>
                                                        <span>{action.updateAuthor?.site?.label}</span><br/>
                                                        <span
                                                            style={{fontWeight: "bold"}}><FormattedMessage
                                                            id={"action.history.physical.site"}/> : </span>
                                                        <span>{action.updateAuthor?.physicalSite?.label}</span><br/>
                                                        <span
                                                            style={{fontWeight: "bold"}}><FormattedMessage
                                                            id={"action.history.site.login"}/> : </span>
                                                        <span>{action.updateAuthor?.login}</span>
                                                    </div>
                                                }
                                            </PopoverBody>
                                        </UncontrolledPopover>
                                        <Col id={'td-history-activity' + index.toString() + props.action?.actionId}>
                                            {action?.updateAuthor?.activity?.label}
                                        </Col>
                                        <Col>
                                            {action.actionLabel}
                                        </Col>
                                        <Col>
                                            <FormattedMessage id={action?.processCurrentState?.status}/>
                                        </Col>
                                        <Col>
                                            {action.processCurrentState?.progressStatus?.label}
                                        </Col>
                                        <Col>
                                            {action.processCurrentState?.conclusion?.label}
                                        </Col>
                                    </Row>
                                    <ActionsHistoryModal actions={action.fieldChanges}
                                                        action={action}
                                                        index={index}
                                                        isOpen={eventsModalList[index]}
                                                        notifyParentOnChange={initModals}/>
                                </li>
                            ))}
                    </ul>
                </div>
            );
        } else {
            return (<React.Fragment/>)
        }
}
export default ActionsHistory