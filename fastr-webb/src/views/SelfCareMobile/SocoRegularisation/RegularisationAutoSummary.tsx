import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { Col, Row } from "reactstrap";
import { RegularisationFixeActDetail } from "src/model/service/RegularisatonFixeActDetail";
import { RegularisationAutoSummary } from "src/model/TimeLine";
import { formatDate } from "src/utils";
import { autoRegularisationSummaryMapper } from "../tools/time_regularisation_mapper";

interface Props {
    adgFixeDetails: RegularisationFixeActDetail;
}

const RegularisationAutoSummary = (props: Props) => {
    const { actDetails } = props.adgFixeDetails;
    const [summary, setSummary] = useState<RegularisationAutoSummary>();
    useEffect(() => {
        if (actDetails) {
            setSummary(autoRegularisationSummaryMapper(actDetails));
        }
    }, [props.adgFixeDetails]);

    return (
        <div>
            {summary ? (
                <>
                    <Row className={"pb-3"}>
                        {/* taux de regularisation */}
                        <Col md={6}>
                            <div className={"text-left font-weight-bold d-inline"}>
                                <FormattedMessage
                                    id={"solucitation.regul.auto.taux"}
                                />
                            </div>
                            {summary.taux ? `${summary.taux} %` : ''}
                        </Col>

                        {/* nombre de services impactées */}
                        <Col md={6}>
                            <div className={"text-left font-weight-bold d-inline"}>
                            <FormattedMessage
                                    id={"solucitation.regul.auto.nbrservices"}
                                />
                            </div>
                            {summary.nbrImpactedServices}
                        </Col>
                    </Row>
                    <Row className={"pb-3"}>
                        {/* taux de regularisation */}
                        <Col md={6}>
                            <div className={"text-left font-weight-bold d-inline"}>
                                <FormattedMessage
                                    id={"solucitation.regul.auto.duree"}
                                />
                            </div>
                            {summary.dureeRegul ? `${summary.dureeRegul} J` : ''}
                        </Col>
                    </Row>
                    <Row className={"pb-3"}>
                        {/* montant de régularisation */}
                        <Col md={6}>
                            <div className={"text-left font-weight-bold d-inline"}>
                                <FormattedMessage
                                    id={"solucitation.regul.auto.montant"}
                                />
                            </div>
                            {summary.montant ? `${summary.montant} € TTC` : ''}
                        </Col>
                        {/* date de facture */}
                        <Col md={6}>
                            <div className={"text-left font-weight-bold d-inline"}>
                                <FormattedMessage
                                    id={"solucitation.regul.auto.facturedate"}
                                />
                            </div>
                            {summary.dateFacture}
                        </Col>
                    </Row>
                    <Row className={"pb-3"}>
                        {/* id support technique */}
                        <Col md={6}>
                            <div className={"text-left font-weight-bold d-inline"}>
                                <FormattedMessage
                                    id={"solucitation.regul.auto.support.id"}
                                />
                            </div>
                            {summary.idTechSupport}
                        </Col>
                        {/* status suport technique */}
                        <Col md={6}>
                            <div className={"text-left font-weight-bold d-inline"}>
                                <FormattedMessage
                                    id={"solucitation.regul.auto.st.statut"}
                                />
                            </div>
                            {summary.stStatus}
                        </Col>
                    </Row>
                    <Row className={"pb-3"}>
                        {/* date de creation support technique */}
                        <Col md={6}>
                            <div className={"text-left font-weight-bold d-inline"}>
                                <FormattedMessage
                                    id={"solucitation.regul.auto.st.creationdate"}
                                />
                            </div>
                            {summary.stCreationDate}
                        </Col>
                        {/* dernière date de resolution support technique */}
                        <Col md={6}>
                            <div className={"text-left font-weight-bold d-inline"}>
                                <FormattedMessage
                                    id={"solucitation.regul.auto.st.last.resolutiondate"}
                                />
                            </div>
                            {summary.stLastResolutionDate ? formatDate(summary.stLastResolutionDate) : ""}
                        </Col>
                    </Row>
                </>
            ) : (
                <></>
            )}
        </div>
    );
};

export default RegularisationAutoSummary;
