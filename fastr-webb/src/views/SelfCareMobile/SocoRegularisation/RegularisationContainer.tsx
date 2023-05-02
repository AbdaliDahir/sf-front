import React, { useState } from "react";
import { connect } from "react-redux";
import { Action } from "src/model/actions/Action";
import { RegularisationFixeAdgDetail } from "src/model/service/RegularisationFixAdgDetail";
import { TimeLineRegularisationItem } from "src/model/TimeLine";
import { AppState } from "src/store";
import { ActionsHistoryModal } from "src/views/Cases/View/Elements/ActionsHistoryModal";
import { REGULARISATION_FAMILLE_TYPE } from "../tools/time_regularisation_mapper";
import RegularisationDetailModal from "./RegularisationDetailModal";
import RegularisationTable from "./RegularisationTable";
import { useSocoRegularisation } from "./useSocoRegularisation";
interface RegularisationContainerProps {
    authorizations: string[];
    refSiebel: string;
}
const RegularisationContainer = (props: RegularisationContainerProps) => {
    const [isActRegulModalOpen, setIsActRegulModalOpen] = useState<boolean>(false);
    const [selectedActDetail, setSelectedActDetail] = useState<RegularisationFixeAdgDetail>();
    const [selectedAction, setSelectedAction] = useState<Action>();
    const [isActionModalOpen, setIsActionModalOpen] = useState<boolean>(false);

    const [regularisations, actions, actDetailed] = useSocoRegularisation(props.refSiebel, props.authorizations);
    const closeModal = () => {
        setIsActRegulModalOpen(false);
    };
    const closeActionModal = () => {
        setIsActionModalOpen(false);
    };
    const openAdgModal = (transactionId: string) => {
        actDetailed.forEach((item) => {
            if (item.act.acttransactionid === transactionId) {
                setSelectedActDetail(item);
                setIsActRegulModalOpen(!isActRegulModalOpen);
            }
        });
    }
    const openActionModal = (actionId: string) => {
        actions.forEach((action) => {
            if (action.actionId === actionId) {
                setSelectedAction(action);
                setIsActionModalOpen(!isActionModalOpen);
            }
        });
    }
    const openModal = (id: string, famille: string) => {
        if (famille === REGULARISATION_FAMILLE_TYPE.ADG) {
            openAdgModal(id);
        } else if (famille === REGULARISATION_FAMILLE_TYPE.ACTION) {
            openActionModal(id);
        }
    };
    return (
        <div>
            <RegularisationTable
                regularisations={regularisations as TimeLineRegularisationItem[]}
                openDetail={openModal}
            />
            <RegularisationDetailModal
                openModal={isActRegulModalOpen}
                shutModal={closeModal}
                actDetail={selectedActDetail}
            />
            <ActionsHistoryModal
                isOpen={isActionModalOpen}
                actions={selectedAction ? [selectedAction] : []}
                action={selectedAction}
                index={0}
                notifyParentOnChange={closeActionModal}
            />
        </div>
    );
};

const mapStateToProps = (state: AppState) => ({
    authorizations: state.authorization.authorizations,
});
export default connect(mapStateToProps)(RegularisationContainer);
