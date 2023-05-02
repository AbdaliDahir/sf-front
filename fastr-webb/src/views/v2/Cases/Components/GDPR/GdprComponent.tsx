import React, { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { translate } from "src/components/Intl/IntlGlobalProvider";
import { dtoToCommentMapper, GdprComment, mappLocalCommentToDTO } from "src/model";
import CaseService from "src/service/CaseService";
import { AppState } from "src/store";
import { setCaseHasInVerifiedGdprComments, setCaseHasNotInVerifiedGdprComments } from "src/store/actions/v2/case/CaseActions";
import GenericCardToggleV2 from "../Sections/GenericCardToggleV2";
import GdprCommentEdition from "./GdprCommentEdition";
import './GdprGlobal.css';
import GdprTableComponent from "./GdprTableComponent";

const GdprComponent = (props) => {
    const { icon, cardHeaderClass, cardClass, cardBodyClass, isExpanded, isExpandable } = props;
    const serviceId = useSelector((state: AppState) => state.store.client.currentClient?.service?.id);
    const siebelAccount = useSelector((state: AppState) => state.store.client.currentClient?.service?.siebelAccount);
    // u get the current caseId
    const { id } = useParams() as { id: string };
    const [gdprComments, setGdprComments] = useState<GdprComment[]>([]);
    const [selectedComment, setSelectedComment] = useState<GdprComment>();
    const [updatedCounter, setUpdatedCounter] = useState<number>(0);
    const caseService = new CaseService(true);
    const dispatch = useDispatch()
    // u make the  backend call to retireve the data.
    useEffect(() => {
        (async () => {
            try {
                const backComments = await caseService.getGdprComments(serviceId, siebelAccount);
                const localComments = dtoToCommentMapper(backComments);
                setGdprComments(localComments);
                if (backComments.length > 0) {
                    dispatch(setCaseHasInVerifiedGdprComments(id));
                }
            } catch (err) {
                NotificationManager.error(translate.formatMessage({ id: "get.gdprcomments.failure" }))
            }
        })()
        // sort by date;
    }, [serviceId, siebelAccount, id])
    // u manage the state and u change set the data back

    useEffect(() => {
        if (selectedComment) {
            let index = 0;
            let data: GdprComment[] = gdprComments.filter(comment => !comment.isPersisted)
                .map(item => {
                    if (item.index === selectedComment.index) {
                        index++;
                        return { ...selectedComment, index };
                    } else {
                        index++;
                        return { ...item, index }
                    }
                });
            setGdprComments([...data]);
        }

    }, [selectedComment]);

    useEffect(() => {
        let verifiedComments = gdprComments.filter(a => a.comment.status != undefined).length;
        if (verifiedComments === gdprComments.length && gdprComments.length > 0) {
            dispatch(setCaseHasNotInVerifiedGdprComments(id));
        }
        if (!selectedComment && gdprComments.length > 0) {
            selectCommentByIndex(1);
        }
    }, [gdprComments]);

    const selectCommentByIndex = (index: number) => {
        const newComment = gdprComments.filter(a => a.index === index)[0];
        const commentStatus = newComment.comment.status ?? 'WATCHED';
        setSelectedComment(prevComment => ({ ...newComment, comment: { ...newComment.comment, status: commentStatus } }));
    }
    const updateSelectedComment = (value: string) => {
        if (selectedComment) {
            setSelectedComment(prev => ({ ...selectedComment, comment: { ...selectedComment.comment, value, status: 'UPDATED' } }))
        }
    }

    const save = async () => {
        if (selectedComment) {
            try {
                const comment = mappLocalCommentToDTO(selectedComment);
                await caseService.updateGdprComment(comment);
                setUpdatedCounter(prevCount => prevCount + 1);
                NotificationManager.success(translate.formatMessage({ id: "update.gdprcomment.success" }))
            } catch (err) {
                NotificationManager.error(translate.formatMessage({ id: "update.gdprcomment.failure" }))
            }
        }
    }

    return (<React.Fragment>
        <GenericCardToggleV2
            cardHeaderClass={'selected-case-summary__card-header-closed-dark ' + cardHeaderClass}
            cardClass={cardClass}
            cardBodyClass={cardBodyClass}
            icon={icon}
            isExpandable={isExpandable}
            isExpanded={isExpanded}
            title="GDPR"
            whiteArrow={true}
        >
            {/* table */}
            <GdprTableComponent gdprComments={gdprComments} updatedCommentCounter={updatedCounter} selectCommentToEdit={selectCommentByIndex} selectedComment={selectedComment} />
            {/* edition block */}
            {selectedComment ?
                <GdprCommentEdition
                    selectedComment={selectedComment}
                    changeComment={updateSelectedComment}
                    commentsSize={gdprComments.length}
                    selectCommentByIndex={selectCommentByIndex}
                    isAllowedToSave={gdprComments.length === gdprComments.filter(a => a.comment.status).length}
                    save={save}
                />
                : null}
        </GenericCardToggleV2>
    </React.Fragment>)
}

export default GdprComponent