import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Col, Row } from 'reactstrap'
import { UnpaidBill } from './RegularisationUnpaidSummary'

const RegularisationUnpaidFactureTable = (props: { factures: UnpaidBill[] }) => {
    return (
        <Row className="border border-bottom-0 ml-0">
            <Col className="pl-0 ml-0">
                <Row className="mb-1 border-bottom ml-0">
                    <Col md={3}>
                        <FormattedMessage
                            id={"acts.history.adg.fixe.modal.act.num.facture"}
                        />
                    </Col>
                    <Col md={1} className={"pl-0 pr-0"}>
                        <FormattedMessage
                            id={"acts.history.adg.fixe.modal.act.date.facture"}
                        />
                    </Col>
                    <Col md={2} className="d-flex justify-content-end pr-0">
                        <FormattedMessage
                            id={"acts.history.adg.fixe.modal.act.balance.facture"}
                        />
                    </Col>
                    <Col md={3} className="d-flex justify-content-end montant">
                        <FormattedMessage
                            id={"acts.history.adg.fixe.modal.act.montant.ajuste"}
                        />
                    </Col>
                    <Col md={3}>
                        <FormattedMessage
                            id={"acts.history.adg.fixe.modal.act.statut.facture"}
                        />
                    </Col>
                </Row>
                <Row className="ml-0">
                    <Col></Col>
                </Row>
                {props.factures.map((facture) => (
                    <Row className={"border-bottom "} key={facture.id}>
                        <Col md={3}>{facture.id}</Col>
                        <Col md={1} className={"pl-0 pr-0"}>
                            {facture.echance}
                        </Col>
                        <Col md={2} className="d-flex justify-content-end pr-0">
                            {facture.montant ? facture.montant + " €" : ""}
                        </Col>
                        <Col md={3} className="d-flex justify-content-end montant">
                            {facture.adjustment ? facture.adjustment + " €" : ""}
                        </Col>
                        <Col md={3}>{facture.status}</Col>
                    </Row>
                ))}
            </Col>
        </Row>
    )
}

export default RegularisationUnpaidFactureTable