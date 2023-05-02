import {Action, ActionProgressStatusObj} from "../../../../model/actions/Action";
import React, {useState} from "react";
import {FormattedMessage} from "react-intl";
import moment from "moment";
import BreadcrumbItem from "reactstrap/lib/BreadcrumbItem";
import {CaseDataProperty} from "../../../../model/CaseDataProperty";
import {formatDate, formatDateHour} from "../../../../utils/ActionUtils";
import {translate} from "../../../../components/Intl/IntlGlobalProvider";

import "./ActionHistory.scss"
import {Contact} from "../../../../model/Contact";
import {Media} from "../../../../model/Media";

interface Props {
    action : Action
}

const ActionDetail = (props : Props) => {
    const MOMENT_DATE_FORMAT = process.env.REACT_APP_FASTR_MOMENT_DATE_FORMAT;
    const [actionData] = useState<Action>(props.action)
    const processCurr : any = props.action.processCurrentState;
    const [progressStatus] = useState<ActionProgressStatusObj>(processCurr.progressStatus)


    const renderActionBreadcrumb = (tags: string[], lightTheme?: boolean) => {
        return <section
            className={lightTheme ? "selected-case-summary__breadcrumb-light" : "selected-case-summary__breadcrumb"}>
            {tags?.map((tag, index) => (
                <BreadcrumbItem key={index}>
                    {tag}
                </BreadcrumbItem>)
            )}
        </section>
    }
    const renderActionAdditionalData = (dataArray: CaseDataProperty[], isSpecificAction: boolean) => {
        return <section className={"selected-case-summary__additional-data-container"}>
            {
                dataArray.map((data) => {
                    const value = data.type === "DATE" && isSpecificAction ? formatDate(data.value) : data.value;
                    return data.value ? <section className={"selected-case-summary__additional-data"}>
                        <span className={"selected-case-summary__additional-data-label"}>{data.label} : </span>
                        <span>{translateActionDataValue(value)}</span></section> : <React.Fragment/>
                })
            }
        </section>
    }
    const translateActionDataValue = (value) => {
        if (value === "yes") {
            return translate.formatMessage({id: "global.dialog.yes"})
        } else if (value === "no") {
            return translate.formatMessage({id: "global.dialog.no"})
        }
        return value;
    }

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

    const renderActionBody = () => {
        return <section className='d-flex action-body'>
            <div className='action-body__left col-md-4 d-flex flex-column'>

                <div className='mb-8' style={{marginBottom:'2.5rem'}}>
                    <div className='font-weight-bold'>{actionData?.timeElapsedSinceUpdateDate ? actionData?.timeElapsedSinceUpdateDate : "Dernière mise à jour"}</div>
                    <div>Le {formatDateHour(actionData?.updateDate)}</div>
                    <div>Par {actionData?.processCurrentState?.updateAuthor?.activity?.label} ({actionData.updateAuthor.login})</div>
                    <div><span className='font-weight-bold'>Contact : </span>
                        {
                            renderContact(actionData?.processCurrentState?.contact)
                        }
                    </div>
                </div>

                <div className='mb-8'>
                    <div className='font-weight-bold'><FormattedMessage id={"cases.actions.consult.status"}/></div>
                    <div><FormattedMessage id={actionData?.processCurrentState?.status ? actionData?.processCurrentState?.status : ""}/> </div>
                </div>

                {actionData?.processCurrentState?.status === "ONGOING" &&
                    <div className='mb-8'>
                        <div className='font-weight-bold'><FormattedMessage id={"cases.actions.consult.progress"}/></div>
                        <div>{progressStatus.label}</div>
                    </div>}

                <div className='mb-8'>
                    <div className='font-weight-bold'><FormattedMessage id={"cases.actions.consult.receiver.activity"}/></div>
                    <div><FormattedMessage id={actionData?.processCurrentState?.assignee?.activity?.label ? actionData?.processCurrentState?.assignee?.activity?.label : ""}/></div>
                </div>

                {actionData?.processCurrentState?.status === "ONGOING" &&
                    <div className='mb-8'>
                        <div className='font-weight-bold'><FormattedMessage id={"cases.actions.consult.realAssignmentDate"}/></div>
                        <div>{moment(actionData?.processCurrentState?.realAssignmentDate).format(MOMENT_DATE_FORMAT)}</div>
                    </div>}

                {actionData?.processCurrentState?.status === "QUALIFIED" &&
                    <div className='mb-8'>
                        <div className='font-weight-bold'><FormattedMessage id={"cases.actions.consult.estimated.date"}/></div>
                        <div>{moment(actionData?.processCurrentState?.estimatedAssignmentDate).format(MOMENT_DATE_FORMAT)}</div>
                    </div>}

                {actionData?.processCurrentState?.status === "ONGOING" && actionData?.processCurrentState?.doNotResolveBeforeDate &&
                    <div className='mb-8'>
                        <div className='font-weight-bold'><FormattedMessage id={"cases.actions.consult.doNotResolveBeforeDate"}/></div>
                        <div>{moment(actionData?.processCurrentState?.doNotResolveBeforeDate).format(MOMENT_DATE_FORMAT)}</div>

                    </div>}

                {(actionData?.processCurrentState?.status === "RESOLVED" || actionData?.processCurrentState?.status === "UNRESOLVED") && actionData?.processCurrentState?.conclusion?.label &&
                    <div className='mb-8'>
                        <div className='font-weight-bold'><FormattedMessage id={"cases.actions.consult.conclusion"}/></div>
                        <div>{actionData?.processCurrentState?.conclusion?.label}</div>
                    </div>}

            </div>
            <div className='action-body__right col-md-8 d-flex flex-column'>
                <div className='mb-8 d-flex'>
                    <span className='font-weight-bold mr-1'><FormattedMessage id={"cases.actions.theme.header.title"}/> : </span>
                    <span>{renderActionBreadcrumb(actionData?.themeQualification?.tags)}</span>
                </div>
                <div className='mb-8 field-br'>
                    <span className='font-weight-bold mr-1'><FormattedMessage id={"cases.actions.consult.request"}/> : </span>
                    <span>{actionData?.initialRequest}</span>
                </div>
                { actionData?.processHistory?.length &&
                    <div className='mb-8 field-br'>
                        <span className='font-weight-bold mr-1'><FormattedMessage id={"cases.actions.consult.last.note"}/> : </span>
                        <span>{actionData?.processCurrentState?.comment}</span>
                    </div>
                }
                <div className='mb-8 field-br'>
                    <span className='font-weight-bold mr-1'><FormattedMessage id={"ADDITIONAL_DATA"}/> : </span>
                    {
                        actionData?.processCurrentState?.data && actionData?.processCurrentState?.data.length > 0 &&
                        renderActionAdditionalData(actionData?.processCurrentState?.data, actionData.specificAction)
                    }
                </div>
            </div>
        </section>
    }

    return (
        renderActionBody()
    );
}

export default ActionDetail;