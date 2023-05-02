import React, { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';
import { ImSpinner6 } from 'react-icons/im';
import { FormattedHTMLMessage } from 'react-intl';
import { GdprComment } from 'src/model';
import './GdprGlobal.css';
import { CommentLimits, COMMENTS_LIMITS_DICTIONARY } from './GdprLocalSettings';
interface GdprCommentEditionProps {
    selectedComment: GdprComment;
    commentsSize: number
    selectCommentByIndex: (number) => void;
    changeComment: (value: string) => void;
    isAllowedToSave: boolean;
    save: () => void;
}
const GdprCommentEdition = (props: GdprCommentEditionProps) => {
    const { selectCommentByIndex, selectedComment, changeComment, commentsSize, save } = props;
    const [commentValue, setCommentValue] = useState((''));
    const [commentChanged, setCommentChanged] = useState(false);
    const [commentLengthValidation, setCommentLengthValidation] = useState<CommentLimits>(COMMENTS_LIMITS_DICTIONARY.DEFAULT);
    const [isNextValid, setisNextValid] = useState(true);

    useEffect(() => {
        setCommentValue(selectedComment.comment.value);

        setCommentChanged(false);
        if (COMMENTS_LIMITS_DICTIONARY[selectedComment.objectType]) {
            setCommentLengthValidation(COMMENTS_LIMITS_DICTIONARY[selectedComment.objectType]);
        } else {
            setCommentLengthValidation(COMMENTS_LIMITS_DICTIONARY.DEFAULT);
        }
        setisNextValid(false);
        setTimeout(() => {
            setisNextValid(true);
        }, 1000);
    }, [selectedComment.comment]);

    const updateComment = (value: string) => {
        setCommentValue(value);
        setCommentChanged(true);
    }

    const isCommentValidLength = () => {
        return commentValue.length < commentLengthValidation?.max && commentValue.length > commentLengthValidation?.min;
    }
    return (
        <div className="w-100">
            <div className="w-100 d-flex justify-content-center mb-2">
                <div className="w-50 d-flex justify-content-center">
                    <button
                        className="btn btn-primary btn-sm mr-4"
                        disabled={selectedComment.index === 1}
                        onClick={() => selectCommentByIndex(selectedComment.index - 1)}
                    ><FaChevronLeft /> <FormattedHTMLMessage id={"wizardform.previous"} /></button>
                    <button
                        className="btn btn-primary btn-sm"
                        disabled={selectedComment.index === commentsSize || !isNextValid}
                        onClick={() => selectCommentByIndex(selectedComment.index + 1)}
                    ><FormattedHTMLMessage id={"wizardform.next"} /> {!isNextValid ? <ImSpinner6 /> : <FaChevronRight />}  </button>
                </div>
            </div>
            {/* *  */}
            <div className={'w-100 border border-1 rounded-2 pr-2 pl-2 pt-3 pb-2 ' + (isCommentValidLength() ? 'border-secondary' : 'border-primary')}>
                <div className="w-100 d-flex justify-content-between">
                    <div className='w-100' onMouseLeave={() => commentChanged && changeComment(commentValue)}>
                        <textarea className="textAreaEditionBlock"
                            value={commentValue}
                            onChange={(e) => updateComment(e.target.value)}
                            onBlur={() => commentChanged && changeComment(commentValue)}
                            maxLength={commentLengthValidation.max}
                        ></textarea>
                        {/* <div className="divtext" contentEditable onInput={e => updateComment(e.currentTarget.textContent ?? '')}
                        >{startValue}</div> */}
                        <small className='font-weight-bold text-primary ml-2' hidden={isCommentValidLength()}>Veuillez Respecter la limit du text à saisir</small>
                        <div className='d-flex justify-content-end pr-3'>
                            <label className='font-weight-bold'>{commentValue.length}/{commentLengthValidation.max}</label>
                        </div>
                    </div>
                    <FaTimes className="cursor-pointer" onClick={() => updateComment('')} />
                </div>
                <div className='d-flex justify-content-start mt-2'>
                    <button className='btn btn-primary btn-sm'
                        disabled={selectedComment.comment.status !== 'UPDATED' || !isCommentValidLength()}
                        onClick={save}><FormattedHTMLMessage id={"cases.gdrp.comment.valide.modification"} /></button>
                </div>
            </div>

        </div>
    )
}

export default GdprCommentEdition