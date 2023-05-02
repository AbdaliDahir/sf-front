import React from "react";
import { Modal } from "react-bootstrap";
import { RegularisationFixeAdgDetail } from "src/model/service/RegularisationFixAdgDetail";
import { RegularisationFixeSummary } from "src/views/Cases/List/Elements/RegularisationFixeSummary";
import ActFixRegulDetailHeader from "./ActFixRegulDetailHeader";
import RegularisationAutoSummary from "./RegularisationAutoSummary";
import RegularisationUnpaidSummary from "./RegularisationUnpaidSummary";

interface RegularisationDetailModalProps {
    openModal: boolean;
    shutModal: () => void;
    actDetail?: RegularisationFixeAdgDetail;
}
const RegularisationDetailModal = (props: RegularisationDetailModalProps) => {
    const toggle = () => {
        props.shutModal();
    };
    const renderActSpecificContent = () => {
        switch (props.actDetail?.act.actcode) {
            case "AJUSTEMENT":
                return (
                    <RegularisationUnpaidSummary adgFixeDetails={props.actDetail.detail} />
                );
            case "REGULARISATION":
                return (
                    <RegularisationFixeSummary adgFixeDetails={props.actDetail.detail} />
                );
            case 'REGUL_AUTO_ST':
                return (
                    <RegularisationAutoSummary adgFixeDetails={props.actDetail.detail} />
                );
            default:
                return <React.Fragment />;
        }
    };
    const header = props.actDetail?.detail.header;
    const actName = props.actDetail?.act.actname;
    return (
        <Modal
            show={props.openModal}
            onHide={toggle}
            dialogClassName="lg"
            className={"text-smaller"}
        >
            <Modal.Header
                closeButton
                className={"text-center font-weight-bold test-width bg-light"}
            >
                <div className={"text-center font-weight-bold"}>{actName}</div>
            </Modal.Header>
            <Modal.Body>
                {/* generique content*/}
                {header ? (
                    <ActFixRegulDetailHeader header={header} />
                ) : (
                    <React.Fragment />
                )}
                {/* Specific content per case */}
                <>{props.actDetail && renderActSpecificContent()}</>
            </Modal.Body>
        </Modal>
    );
};

export default RegularisationDetailModal;
