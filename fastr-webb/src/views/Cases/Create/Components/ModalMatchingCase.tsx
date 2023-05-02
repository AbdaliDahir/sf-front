import React, {Component} from 'react';
import {connect} from "react-redux";
import {RouteComponentProps, withRouter} from "react-router";
import Button from "reactstrap/lib/Button";
import Modal from "reactstrap/lib/Modal";
import ModalBody from "reactstrap/lib/ModalBody";
import ModalFooter from "reactstrap/lib/ModalFooter";
import ModalHeader from "reactstrap/lib/ModalHeader";
import {compose} from "redux";
import FastService from "../../../../service/FastService";
import {AppState} from "../../../../store";
import {setScalingToFalse} from "../../../../store/actions";
import {setIsMatchingCaseModalDisplayed, setMatchingCase} from "../../../../store/actions/RecentCasesActions";
import RecentCasesTable from "../../List/Elements/RecentCasesTable";
import {FormattedMessage} from "react-intl";
import {CaseListsSetting} from "../../../../model/CaseListsSetting";
import {setIsCurrentUserObligedToReQualifyImmediateCase} from "../../../../store/actions/CasePageAction";
import {fetchAndStoreIsServiceInLists} from "../../../../store/actions/v2/client/ClientActions";

interface Props extends RouteComponentProps {
    matchingCase
    setMatchingCase
    fastTabId?: string
    setScalingToFalse
    setIsMatchingCaseModalDisplayed
    authorizations
    fromDisrc: boolean
    isServiceInLists: CaseListsSetting
    setIsCurrentUserObligedToReQualifyImmediateCase,
    fetchAndStoreIsServiceInLists:(clientId: string,serviceId: string)=>{},
    payload
}

interface State {
    showModal
}

class ModalMatchingCase extends Component<Props, State> {

    constructor(props: Props) {
        super(props)
        this.state = {showModal: !!this.props.matchingCase}
        this.props.fetchAndStoreIsServiceInLists(this.props.payload.idClient, this.props.payload.idService)
    }


    public transferDataAndSendToUpdateCase = () => {
        this.props.setScalingToFalse()
        if (this.props.fromDisrc) {
            this.props.setMatchingCase(this.props.matchingCase);
            this.props.setIsMatchingCaseModalDisplayed(false)
        } else {
            this.props.setMatchingCase(undefined);
            const url = `/cases/${this.props.matchingCase.caseId}/view${this.props.location.search}`
            FastService.postRedirectMessage({
                urlUpdate: url,
                idCase: this.props.matchingCase.caseId,
                fastTabId: this.props.fastTabId
            });
            if (process.env.NODE_ENV === "development") {
                this.props.history.push(`/cases/${this.props.matchingCase.caseId}/view${this.props.location.search}`)
            }
        }
    }

    public closeModal = () => {
        if (!this.props.isServiceInLists.inDuplicateCaseWhitelist) {
            this.props.setIsCurrentUserObligedToReQualifyImmediateCase(true);
        }
        this.props.setMatchingCase(undefined)
        this.props.setIsMatchingCaseModalDisplayed(false)
        this.setState({showModal: false})
    }

    public componentWillReceiveProps(nextProps) {
        this.setState({showModal: !!nextProps.matchingCase})
    }

    public render() {
        return <Modal isOpen={this.state.showModal} size={"lg"} style={{maxWidth: "100%"}}>
            <ModalHeader>
                <FormattedMessage id="case.modal.matching.title"/>
            </ModalHeader>
            <ModalBody>
                <RecentCasesTable casesRecentList={[this.props.matchingCase]} fromModalMatchingCase={true}
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

const mapStateToProps = (state: AppState) => ({
    matchingCase: state.recentCases.matchingCaseFound,
    fromDisrc: state.payload.payload.fromdisrc,
    isServiceInLists: state.store.client.isServiceInLists,
    payload: state.payload.payload
});


// tslint:disable-next-line:no-any
export default compose<any>(withRouter, connect(mapStateToProps,
    {
        setMatchingCase,
        setScalingToFalse,
        setIsMatchingCaseModalDisplayed,
        setIsCurrentUserObligedToReQualifyImmediateCase,
        fetchAndStoreIsServiceInLists
    }))(ModalMatchingCase);
