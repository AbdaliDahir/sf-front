import React, {RefObject, useEffect, useRef, useState} from "react";
import 'react-block-ui/style.css';
import 'react-notifications/lib/notifications.css';
import {Button, Nav, NavItem, PopoverBody, UncontrolledPopover, UncontrolledTooltip} from "reactstrap";
import {FormattedMessage} from "react-intl";
import ExternalLinksBlock from "../../../Clients/ExternalLinksBlock";
import {AppState} from "../../../../store";
import {BlocksExternalAppsConfig} from "../../../Clients/ExternalAppsConfig";
import {useDispatch, useSelector} from "react-redux";
import {IdParams} from "../../../Clients/ExternalApplicationPage";
import ExternalAppsUtils from "../../../../utils/ExternalAppsUtils";
import LastArbeoDiagPopover from "./LastArbeoDiagPopover";
import "./CaseActionsV2.scss"
import {useTypedSelector} from "../../../../components/Store/useTypedSelector";
import {
    setCancelScalingButtonRefV2,
    setIsCurrentCaseScaledV2, updateSectionsV2,
} from "../../../../store/actions/v2/case/CaseActions";
import {CaseStatus} from "../../../../model/case/CaseStatus";
import { setBlockingUIV2 } from "src/store/actions/v2/ui/UIActions";

interface Props {
    caseId
    clientId
    serviceId
    lastDiagDetails?
    actCreator?
    onSubmit?
    disabled?
    isValid?
    onCancel?
    formsyRef
    validationErrors?
}

// const LastDiagDetails property
const lastDiagAttributes = [ 'guidelines','qualifTags','act','transfert','themeTags','processing', 'callReason', 'finalAction'];
// MAXWELL_ISSUE.label
const MAXWELL_ISSUE_LABEL = "Incident unitaire fixe ou mobile";

/**
 * Component for the different buttons.
 */
const CaseActionsV2 = (props: Props) => {

    const dispatch = useDispatch();
    const {caseId, clientId, serviceId, lastDiagDetails, actCreator, validationErrors} = props;
    const currentContact = useSelector((state: AppState) => state.store.contact.currentContact)
    const isQualificationLeaf = useSelector((state: AppState) => state.store.cases.casesList[caseId]?.qualificationLeaf)
    const userPassword = useTypedSelector((state) => state.store.applicationInitialState.userPassword)
    const externalApps = useSelector((state: AppState) => state.externalApps);
    const externalAppsSettings = BlocksExternalAppsConfig.disrcCases.caseActionsV2;
    const [showExternalApps, setShowExternalApps] = useState(false)
    const currentCasePage = useTypedSelector((state) => state.store.cases.casesList[caseId]);
    const currentCaseIsClosed = useTypedSelector((state) => state.store.cases.casesList[caseId]?.currentCase?.status === CaseStatus.CLOSED);
    const isCurrentCaseScaled = useTypedSelector((state) => state.store.cases.casesList[caseId]?.isCurrentCaseScaled)
    const scalingEligibility = useTypedSelector((state: AppState) => state.store.cases.casesList[caseId]?.scalingEligibility)
    const currentMotif = useTypedSelector((state: AppState) => state.store.cases.casesList[caseId]?.qualificationLeaf)
    const hasCallTransferV2 = useTypedSelector(state => state.store.cases.casesList[caseId]?.hasCallTransfer)
    const sections = useTypedSelector(state => state.store.cases.casesList[caseId]?.sections)
    const currentUser = useTypedSelector((state: AppState) => state.store.applicationInitialState.user)
    const isCallTransferStatusOKV2 = useTypedSelector(state => state.store.cases.casesList[caseId]?.isCallTransferStatusOKV2)
    const localRef: RefObject<Button> = useRef(null)
    const idParams: IdParams = {
        caseId,
        clientId,
        serviceId,
        contactId: currentContact?.contactId,
        password: userPassword
    }

    useEffect(() => {
        if (currentCasePage) {
            dispatch(setCancelScalingButtonRefV2(caseId, localRef))
        }
    }, [currentCasePage]);

    useEffect(() => {
        setShowExternalApps(ExternalAppsUtils.isExternalAppAuthorized(externalApps?.appsList, externalAppsSettings));
    }, [externalApps.appsList])

    const toggleScalingStatus = () => {
        dispatch(setIsCurrentCaseScaledV2(caseId, true));
        dispatch(setBlockingUIV2(true));
        sections.find((s) => s.code === "QUALIFICATION").editable = false;
        dispatch(updateSectionsV2(caseId, [...sections]))
    }

    const renderLastDiagDetails = () => {
        return (
            <div className={"mt-1 case-actions-v2__last-diag-section"}>
                <i className={"icon-gradient icon-diag mr-1"}/>
                <span style={{textDecoration: "underline", cursor: "pointer"}} className="font-weight-normal"
                      id={"lastArbeoDiag"}>
                    {"Aide à l’histo"}
                </span>
                <LastArbeoDiagPopover actDetail={lastDiagDetails}
                                      actCreator={actCreator}
                                      target="lastArbeoDiag"/>
            </div>
        )
    }

    const isEmptyDiag = () => {
        return !lastDiagAttributes.some(adg => { 
            return lastDiagDetails.hasOwnProperty(adg) && lastDiagDetails[adg] && !(Object.keys(lastDiagDetails[adg]).length === 0);
        });
    };

    const isCCLogingMatchingDiagCreatorLogin = () => currentUser?.login === actCreator?.login;

    const renderScalingButton = () => {
        return (
            <React.Fragment>
                <UncontrolledTooltip placement="bottom" target="scalingButton">
                    <FormattedMessage id="cases.create.transfer.backOffice"/>
                </UncontrolledTooltip>
                <Button id="scalingButton" type="button" color="secondary"
                        className="bg-white"
                        onClick={toggleScalingStatus}
                        disabled={currentCaseIsClosed}
                >
                    <FormattedMessage id="cases.create.scale"/>
                </Button>
            </React.Fragment>
        )
    }

    return (
        <Nav className="ml-auto" navbar>
            <NavItem className={"case-actions-v2__buttons"}>
                <section>
                    {showExternalApps && !currentCaseIsClosed ?
                        <ExternalLinksBlock
                            settings={externalAppsSettings}
                            isLoading={true}
                            idParams={idParams}
                            indsideFastrCase={true}
                            isQualificationLeaf={isQualificationLeaf}
                        />
                        : <React.Fragment/>
                    }
                    {
                        lastDiagDetails && !currentCaseIsClosed && !isEmptyDiag() && isCCLogingMatchingDiagCreatorLogin() &&
                        <section>
                            {
                                renderLastDiagDetails()
                            }
                        </section>
                    }
                </section>

                <Button id="caseNavbar.cancel.button.id" className="ml-3 mr-2" color="light"
                        onClick={props.onCancel}>
                    <FormattedMessage id="cases.create.cancel"/>
                </Button>
                {
                    !isCurrentCaseScaled && scalingEligibility && currentMotif && !currentCaseIsClosed && currentMotif.label !== MAXWELL_ISSUE_LABEL &&
                    renderScalingButton()
                }
                {!currentCaseIsClosed &&
                    <React.Fragment>
                        {validationErrors && validationErrors.length > 0 &&
                            <UncontrolledPopover
                                placement="bottom"
                                trigger="hover"
                                target={"submitButton"}>
                                <PopoverBody>
                                    {validationErrors.map(validationErr => <div>
                                            <span className="font-weight-bold">{validationErr.label ? validationErr.label : ""} : </span>
                                            <span>{validationErr.error}</span>
                                        </div>
                                    )}
                                </PopoverBody>
                            </UncontrolledPopover>}

                        <section id={"submitButton"}>
                            <Button id={"caseNavbar.submit.button.id"} color="primary"
                                    onClick={props.onSubmit}
                                    disabled={props.disabled || !props.isValid}
                                    className="mx-2 submitButtonWrapper">
                                {hasCallTransferV2 && isCallTransferStatusOKV2 ?
                                    <FormattedMessage id="cases.button.transfer"/> :
                                    <FormattedMessage id="cases.create.create"/>
                                }
                            </Button>
                        </section>
                    </React.Fragment>


                }

            </NavItem>
        </Nav>
    )
}

export default CaseActionsV2
