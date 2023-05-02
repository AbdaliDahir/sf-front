import * as React from "react";
import {useState} from "react";
import {Action, ActionProcessHistory} from "../../../../model/actions/Action";
import * as moment from "moment";
import {FormattedMessage} from "react-intl";

import './ActionHistory.scss';
import {Col, PopoverBody, Row, UncontrolledPopover} from "reactstrap";
import {Media} from '../../../../model/Media';
import {Contact} from "../../../../model/Contact";
import classnames from 'classnames';
import {CaseDataProperty} from "../../../../model/CaseDataProperty";
import {MdNote} from "react-icons/md";

interface Props {
    action: Action | undefined
}

const ActionDetailHistory = (props: Props) => {
    const DATETIME_FORMAT = process.env.REACT_APP_FASTR_DATETIME_FORMAT;
    const [actionProcessHistory] = useState<ActionProcessHistory[] | undefined>(props.action!.processHistory);
    const show: boolean = true;

    const renderContact = (contact: Contact | undefined) => {
        const media: Media | undefined = contact?.media;
        if (media && media.type !== undefined && media.type !== null && media.type !== 'SANS_CONTACT') {
            return <>
                <FormattedMessage id={"contact.media." + media.type}/>
                <> </>
                <FormattedMessage id={"cases.create.mediaInOrOut." + media.direction}/>
            </>
        } else {
            return "Aucun contact"
        }
    }

    function renderDataValue(caseDataProp: CaseDataProperty) {
        if (caseDataProp?.type === "BOOLEAN") {
            return <span><FormattedMessage
                id={caseDataProp.value}/></span>
        }
        return <span>{caseDataProp.value}</span>;
    }

    if (actionProcessHistory === undefined || actionProcessHistory === null) {
        return <div>Pas d'historique dans cette action.</div>
    } else {
        return <div className="timeline-container">
            <ul className="vertical-timeline w-100 mb-0 text-center">
                <Row className={"font-weight-bold"}>
                    <Col><FormattedMessage id={"cases.history.actions.date"}/></Col>
                    <Col><FormattedMessage
                        id={"cases.history.event.creator.activity"}/></Col>
                    <Col><FormattedMessage
                        id={"cases.history.actions.actionStatus"}/></Col>
                    <Col><FormattedMessage
                        id={"cases.history.actions.actionProgressStatus"}/></Col>
                    <Col><FormattedMessage
                        id={"act.duplicate.billings.contactAddress"}/></Col>
                    <Col><FormattedMessage
                        id={"cases.history.actions.detail.da"}/></Col>
                    <Col><FormattedMessage
                        id={"adg.sav.omnicanal.class.comments"}/></Col>
                </Row>
                {
                    actionProcessHistory?.sort((a, b) => {
                        return new Date(b.updateDate).getTime() - new Date(a.updateDate).getTime()
                    })
                        .map((processHistory: ActionProcessHistory, idx: number) => {
                        return (
                                <li key={idx}
                                    className={`cursor-pointer text-center highLightRow`}
                                    id={"Modal" + idx}>
                                <span
                                    className={classnames('v-timeline-icon', 'v-not', {'v-last': idx === (actionProcessHistory.length - 1)}, {'v-first': idx === 0})}/>
                                    <Row className={"mx-1"}>
                                        <Col>
                                            {moment(processHistory?.updateDate).format(DATETIME_FORMAT)}
                                        </Col>
                                        <UncontrolledPopover
                                            placement='auto'
                                            trigger="hover"
                                            target={'td-activity' + idx.toString() + props.action?.actionId}>
                                            <PopoverBody>
                                                {
                                                    <div key={idx}>
                                                    <span
                                                        style={{fontWeight: "bold"}}><FormattedMessage
                                                        id={"action.history.logical.site"}/> : </span>
                                                        <span>{processHistory.updateAuthor?.site?.label}</span><br/>
                                                        <span
                                                            style={{fontWeight: "bold"}}><FormattedMessage
                                                            id={"action.history.physical.site"}/> : </span>
                                                        <span>{processHistory.updateAuthor?.physicalSite?.label}</span><br/>
                                                        <span
                                                            style={{fontWeight: "bold"}}><FormattedMessage
                                                            id={"action.history.site.login"}/> : </span>
                                                        <span>{processHistory.updateAuthor?.login}</span>
                                                    </div>
                                                }
                                            </PopoverBody>
                                        </UncontrolledPopover>
                                        <Col id={'td-activity' + idx.toString() + props.action?.actionId}>
                                            {processHistory?.updateAuthor.activity.label}
                                        </Col>

                                        <Col>
                                            <FormattedMessage id={"STATUS." + processHistory?.status.toString()}/>
                                        </Col>
                                        <Col>
                                            {processHistory?.progressStatus ? processHistory?.progressStatus.label :
                                                <FormattedMessage
                                                    id={"cases.history.actions.detail.progress.status.unavailable"}/>}
                                        </Col>
                                        <Col>
                                            {renderContact(processHistory?.contact)}
                                        </Col>
                                        {show ? <><UncontrolledPopover
                                            placement='auto'
                                            trigger="hover"
                                            target={'td-da' + idx.toString() + props.action?.actionId}>
                                            <PopoverBody>
                                                {processHistory?.data ?
                                                    processHistory?.data.map((caseDataProp, index) => {
                                                        return (
                                                            <div key={index}>
                                                                <span
                                                                    style={{fontWeight: "bold"}}>{caseDataProp.label}: </span>
                                                                {renderDataValue(caseDataProp)}
                                                            </div>
                                                        )
                                                    }) :
                                                    <><FormattedMessage
                                                        id={"cases.history.actions.detail.history.unavailable"}/></>
                                                }
                                            </PopoverBody>
                                        </UncontrolledPopover>
                                            <Col id={'td-da' + idx.toString() + props.action?.actionId}
                                                 className={""}><MdNote size={"2em"}
                                                                                  title={"Icone Données Additionelles"}/></Col>
                                        </> : <></>
                                        }
                                        <Col id={'td-comment' + idx.toString() + props.action?.actionId}
                                             className={"td-comment"}>{processHistory?.comment}</Col>
                                        <UncontrolledPopover
                                            placement='auto'
                                            trigger="hover"
                                            target={'td-comment' + idx.toString() + props.action?.actionId}>
                                            <PopoverBody>
                                                {processHistory?.comment}
                                            </PopoverBody>
                                        </UncontrolledPopover>
                                    </Row>
                                </li>
                            )
                        }
                    )}
            </ul>
        </div>
    }
}

export default ActionDetailHistory;