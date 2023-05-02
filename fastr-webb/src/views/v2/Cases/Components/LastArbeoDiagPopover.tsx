import * as React from "react";
import {PopoverBody, UncontrolledPopover} from "reactstrap";
import "./LastArbeoDiagPopover.scss"
import {ArbeoActDetailData} from "../../../../model/ArbeoActDetailData";
import {isIE} from 'react-device-detect';
import {Modal, ModalBody} from "react-bootstrap";
import moment from "moment";
import {FormattedMessage} from "react-intl";


interface Props {
    actDetail: ArbeoActDetailData,
    actCreator,
    target: string
}

const LastArbeoDiagPopover = (props: Props) => {

    const DATETIME_FORMAT = process.env.REACT_APP_FASTR_DATETIME_WITH_SECOND_FORMAT;
    const {actDetail, actCreator, target} = props;
    const renderBody = () => {
        return (
            <section>
                <section className={"d-flex flex-column"}>
                    <span className={"font-weight-bold"}>{"N° " + actDetail.diagId}</span>
                    <span>{"Crée le " + moment(actDetail.startDate).format(DATETIME_FORMAT) + " par " + actCreator.login + "/" + actCreator.activity.label}</span>
                </section>
                <section>
                    <section className={"last-arbeo-diag-popover__card-grid"}>
                        {
                            actDetail.callReason &&
                            <section className={"last-arbeo-diag-popover__card-grid-list"}>
                                <label className={"last-arbeo-diag-popover__card-grid-cell-title"}><FormattedMessage
                                    id={"last.arbeo.diag.callReason"}/></label>
                                <ul>
                                    <li>{actDetail.callReason}</li>
                                </ul>
                            </section>
                        }
                        {
                            actDetail.finalAction &&
                            <section className={"last-arbeo-diag-popover__card-grid-list"}>
                                <label className={"last-arbeo-diag-popover__card-grid-cell-title"}><FormattedMessage
                                    id={"last.arbeo.diag.finalAction"}/></label>
                                <ul>
                                    <li>{actDetail.finalAction}</li>
                                </ul>
                            </section>
                        }
                        {
                            actDetail.guidelines &&
                            <section className={"last-arbeo-diag-popover__card-grid-list"}>
                                <label className={"last-arbeo-diag-popover__card-grid-cell-title"}>Consignes</label>
                                <ul>
                                    {
                                        actDetail.guidelines.map((data, index) =>
                                            <li key={index}>{data}</li>
                                        )
                                    }
                                </ul>

                            </section>
                        }
                        {
                            actDetail.qualifTags &&
                            <section className={"last-arbeo-diag-popover__card-grid-list"}>
                                <label className={"last-arbeo-diag-popover__card-grid-cell-title"}>Motifs</label>
                                <ul>
                                    {
                                        actDetail.qualifTags.map((data, index) =>
                                            <li key={index}>{data}</li>
                                        )
                                    }
                                </ul>
                            </section>
                        }

                        {
                            actDetail.act &&
                            <section className={"last-arbeo-diag-popover__card-grid-list"}>
                                <label className={"last-arbeo-diag-popover__card-grid-cell-title"}>Actions</label>
                                <label
                                    className={"last-arbeo-diag-popover__card-grid-act-label"}>{actDetail.act.label}</label>
                                <ul>
                                    {
                                        actDetail.act.parameters?.map((data, index) =>
                                            <li key={index}>{data.name}: {data.value}</li>
                                        )
                                    }
                                </ul>
                            </section>
                        }

                        {
                            actDetail.transfert &&
                            <section className={"last-arbeo-diag-popover__card-grid-list"}>
                                <label className={"last-arbeo-diag-popover__card-grid-cell-title"}>Transfert
                                    d'appel</label>
                                <label>{actDetail.transfert.activityLabel} ({actDetail.transfert.activityCode})</label>
                            </section>
                        }

                        {
                            actDetail.themeTags &&
                            <section className={"last-arbeo-diag-popover__card-grid-list"}>
                                <label className={"last-arbeo-diag-popover__card-grid-cell-title"}>Thèmes
                                    d'escalade</label>
                                <ul>
                                    {
                                        actDetail.themeTags.map((data, index) =>
                                            <li key={index}>{data}</li>
                                        )
                                    }
                                </ul>
                            </section>
                        }
                        {
                            actDetail.processing &&
                            <section className={"last-arbeo-diag-popover__card-grid-list"}>
                                <label
                                    className={"last-arbeo-diag-popover__card-grid-cell-title"}>Statut/Conclusion</label>
                                <label>{actDetail.processing ? "Résolu" : "Non résolu"} / {actDetail.processConclusion}</label>
                            </section>
                        }
                    </section>
                </section>
            </section>
        )
    }
    return (
        <section>
            {
                isIE ? <Modal>
                        <ModalBody>
                            {renderBody()}
                        </ModalBody>
                    </Modal> :
                    <UncontrolledPopover placement="top" target={target} className={"last-arbeo-diag-popover__popover"}>
                        <PopoverBody>
                            {renderBody()}
                        </PopoverBody>
                    </UncontrolledPopover>
            }
        </section>
    )
}

export default LastArbeoDiagPopover;