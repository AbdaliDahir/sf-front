import React, {Component} from 'react';
import {connect} from "react-redux";
import {RouteComponentProps, withRouter} from "react-router";
import Button from "reactstrap/lib/Button";
import Modal from "reactstrap/lib/Modal";
import ModalBody from "reactstrap/lib/ModalBody";
import ModalFooter from "reactstrap/lib/ModalFooter";
import ModalHeader from "reactstrap/lib/ModalHeader";
import {compose} from "redux";
import {AppState} from "../../../../store";
import RecentCasesTableV2 from "../../../Cases/List/Elements/RecentCasesTableV2";
import {CaseState} from "../../../../store/reducers/v2/case/CasesPageReducerV2";
import {Case} from "../../../../model/Case";
import {setIsMatchingCaseModalDisplayedV2, setMatchingCaseV2} from "../../../../store/actions/v2/case/CaseActions";
import {CaseListsSetting} from "../../../../model/CaseListsSetting";
import {FormattedMessage} from 'react-intl';
import {setIsCurrentUserObligedToReQualifyImmediateCase} from "../../../../store/actions/CasePageAction";
import {fetchAndStoreIsServiceInLists} from "../../../../store/actions/v2/client/ClientActions";

interface Props extends RouteComponentProps {
    caseId
    currentCases
    setMatchingCaseV2
    setIsMatchingCaseModalDisplayedV2
    authorizations
    handleCaseSelected
    handleModalCanceled
    isServiceInLists?: CaseListsSetting
    setIsCurrentUserObligedToReQualifyImmediateCase,
    fetchAndStoreIsServiceInLists: (clientId: string, serviceId: string) => {},
    currentClient
}

class ModalMatchingCaseV2 extends Component<Props> {

    constructor(props: Props) {
        super(props)
    }

    public componentDidMount() {
        this.fetchListsSetting()
        const shouldDisplayPopup = this.props.authorizations.indexOf("showPopupDoublon") !== -1;
        if(!shouldDisplayPopup){
            this.transferDataAndSendToUpdateCase();
        }
    }

    public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<{}>, snapshot?: any) {
        if(prevProps.currentClient != this.props.currentClient){
            this.fetchListsSetting();
        }
    }

    public fetchListsSetting = ()=>{
        const clientId: string = this.props.currentClient!.clientData.id;
        const serviceId: string = this.props.currentClient!.serviceId;
        if(clientId && serviceId){
            this.props.fetchAndStoreIsServiceInLists(clientId, serviceId)
        }
    }

    private currentCaseState = (): CaseState => {
        return this.props.currentCases[this.props.caseId]
    }

    private matchingCase = (): Case | undefined => {
        return this.currentCaseState().matchingCaseFound;
    }

    public transferDataAndSendToUpdateCase = () => {
        this.props.handleCaseSelected(this.matchingCase()?.caseId);
        this.props.setMatchingCaseV2(this.props.caseId, this.matchingCase());
        this.props.setIsMatchingCaseModalDisplayedV2(this.props.caseId, false)
    }

    public closeModal = () => {
        if (!this.props.isServiceInLists?.inDuplicateCaseWhitelist) {
            this.props.setIsCurrentUserObligedToReQualifyImmediateCase(true);
        }
        this.props.setMatchingCaseV2(this.props.caseId, undefined)
        this.props.setIsMatchingCaseModalDisplayedV2(this.props.caseId, false)
        if (this.props.handleModalCanceled) {
            this.props.handleModalCanceled();
        }
    }

    public render() {
        const shouldDisplayPopup = this.props.authorizations.indexOf("showPopupDoublon") !== -1;
        return shouldDisplayPopup && <Modal isOpen={true} size={"lg"} style={{maxWidth: "100%"}}>
            <ModalHeader>
                <FormattedMessage id="case.modal.matching.title"/>
            </ModalHeader>
            <ModalBody>
                <RecentCasesTableV2 casesRecentList={[this.matchingCase()]} fromModalMatchingCase={true}
                                    authorizations={this.props.authorizations}/>
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={this.transferDataAndSendToUpdateCase}>
                    <FormattedMessage id="case.modal.matching.yes"/>
                </Button>
                <Button onClick={this.closeModal}>
                    <FormattedMessage id="case.modal.matching.no"/>
                </Button>
            </ModalFooter>

        </Modal>
    }
}

const mapStateToProps = (state: AppState, ownProps:Props) => ({
    currentCases: state.store.cases.casesList,
    currentClient: state.store.client.currentClient,
    isServiceInLists: state.store.client.isServiceInLists
});

const mapDispatchToProps = {
    setMatchingCaseV2,
    setIsMatchingCaseModalDisplayedV2,
    setIsCurrentUserObligedToReQualifyImmediateCase,
    fetchAndStoreIsServiceInLists
}


// tslint:disable-next-line:no-any
export default compose<any>(withRouter, connect(mapStateToProps, mapDispatchToProps))(ModalMatchingCaseV2);
