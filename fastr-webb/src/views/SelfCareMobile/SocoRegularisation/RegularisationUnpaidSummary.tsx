import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { Col, Row } from "reactstrap";
import { RegularisationFixeActDetail } from "src/model/service/RegularisatonFixeActDetail";
import { actDetailFilterByTypeAndName } from "../tools/time_regularisation_mapper";
import RegularisationUnpaidFactureTable from "./RegularisationUnpaidFactureTable";

interface Props {
    adgFixeDetails: RegularisationFixeActDetail;
}
export interface UnpaidBill {
    id: string;
    echance: string;
    montant: string;
    adjustment: string;
    status: string;
}
const RegularisationUnpaidSummary = (props: Props) => {
    const { actDetails } = props.adgFixeDetails;
    const [factures, setFactures] = useState<UnpaidBill[]>([]);
    useEffect(() => {
        facturesTableFactory();
    }, [props.adgFixeDetails])

    const facturesTableFactory = () => {
        let index = 1;
        let PARAM_TYPE = `TRACE_AJUSTEMENT_${index}`;
        let factureNumber = actDetails?.find((detail) =>
            actDetailFilterByTypeAndName(detail, PARAM_TYPE, "NUM_FACTURE")
        )?.parametervalue;
        let factures: UnpaidBill[] = [];
        while (factureNumber) {
            factures = [
                ...factures,
                {
                    id: factureNumber,
                    adjustment:
                        actDetails?.find((detail) =>
                            actDetailFilterByTypeAndName(
                                detail,
                                PARAM_TYPE,
                                "MONTANT_AJUSTE"
                            )
                        )?.parametervalue || "",
                    echance:
                        actDetails?.find((detail) =>
                            actDetailFilterByTypeAndName(detail, PARAM_TYPE, "DATE_FACTURE")
                        )?.parametervalue || "",
                    montant:
                        actDetails?.find((detail) =>
                            actDetailFilterByTypeAndName(detail, PARAM_TYPE, "MONTANT_AJUSTE")
                        )?.parametervalue || "",
                    status:
                        actDetails?.find((detail) =>
                            actDetailFilterByTypeAndName(detail, PARAM_TYPE, "STATUT")
                        )?.parametervalue || "",
                },
            ];
            index++;
            PARAM_TYPE = `TRACE_AJUSTEMENT_${index}`;
            factureNumber = actDetails?.find((detail) =>
                actDetailFilterByTypeAndName(detail, PARAM_TYPE, "NUM_FACTURE")
            )?.parametervalue;
        }
        setFactures(factures);
    };
    const montant = actDetails?.find((detail) =>
        actDetailFilterByTypeAndName(detail, "MONTANT_AJUSTE", "MONTANT")
    )?.parametervalue;
    const montantTotalAjuste = actDetails?.find((detail) =>
        actDetailFilterByTypeAndName(detail, "RESULTAT", "MONTANT_AJUSTE")
    )?.parametervalue;

    return (
        <>
            <Row className={"pb-3"}>
                <Col md={6}>
                    <div className={"text-left font-weight-bold"}>
                        <FormattedMessage id={"solucitation.regul.unpaid.montant.ajuste"} />
                    </div>
                    {montant ? montant + " €" : ""}
                </Col>
                <Col md={6}>
                    <div className={"text-left font-weight-bold"}>
                        <FormattedMessage
                            id={"solucitation.regul.unpaid.montant.total.ajuste"}
                        />
                    </div>
                    <span>{montantTotalAjuste ? montantTotalAjuste + " €" : ""}</span>
                </Col>
            </Row>
            <RegularisationUnpaidFactureTable factures={factures} />

        </>
    );
};

export default RegularisationUnpaidSummary;
