import React from "react";
import { FormattedMessage } from "react-intl";
import { Col, Row } from "reactstrap";
import { ActDetailHeader } from "src/model/service/ActDetailHeader";
import './SocoRegularisation.scss';

const ActFixRegulDetailHeader = (props: { header: ActDetailHeader }) => {
    const header = props.header;
    return (
        <>
            <Row className={"pb-3"}>
                <Col md={6}>
                    <div className={"text-left font-weight-bold"}>
                        <FormattedMessage id={"acts.history.adg.fixe.modal.act.number"} />
                    </div>
                    {header?.adgNumber}
                </Col>
                <Col md={6}>
                    <div className={"text-left font-weight-bold d-inline"}>
                        <FormattedMessage id={"acts.history.adg.fixe.modal.act.status"} />
                    </div>
                    <span
                        className={
                            "act-badge-text" +
                            (header?.status === "OK"
                                ? " success-background-color"
                                : header?.status === "KO"
                                    ? " error-background-color"
                                    : " neutre-background-color")
                        }
                    >
                        {header?.status}
                    </span>
                </Col>
            </Row>
            <Row className={"pb-3"}>
                <Col md={6}>
                    <div className={"text-left font-weight-bold"}>
                        <FormattedMessage
                            id={"acts.history.adg.fixe.modal.act.creation.date"}
                        />
                    </div>
                    {header?.creationDate}
                </Col>

                <Col md={6}>
                    <div className={"text-left font-weight-bold"}>
                        <FormattedMessage
                            id={"acts.history.adg.fixe.modal.act.execution.date"}
                        />
                    </div>
                    {header?.executionDate}
                </Col>
            </Row>
        </>
    );
};

export default ActFixRegulDetailHeader;
