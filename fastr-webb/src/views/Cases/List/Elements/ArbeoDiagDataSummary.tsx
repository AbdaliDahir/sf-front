import * as React from "react";
import "./../../../v2/Cases/Components/LastArbeoDiagPopover.scss"
import * as moment from "moment";
import {FormattedMessage} from "react-intl";


interface Props {
    actDetail,
    actCreator,
    actDescription
}

const ArbeoDiagDataSummary = (props: Props) => {
    const {actDetail: { actDetail }, actDescription} = props;
    const DATETIME_FORMAT = process.env.REACT_APP_FASTR_DATETIME_FORMAT;
    const startDate = actDetail?.startDate ? moment(actDetail.startDate).format(DATETIME_FORMAT) : ""
    const renderArbeoDiagSummary = () => {
        return (
            <section>
                <section className={"d-flex font-weight-bold"}>
                    <div>
                        <FormattedMessage id={"act.history.label." + actDescription}/>
                        <span>{" N°:" + actDetail.diagId}&nbsp;</span>
                    </div>
                    <div className="ml-2">
                        <FormattedMessage id="global.form.creationDate"/>:<span className="ml-1">{startDate}</span>
                    </div>
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
            {renderArbeoDiagSummary()}
        </section>
    )
}

export default ArbeoDiagDataSummary;