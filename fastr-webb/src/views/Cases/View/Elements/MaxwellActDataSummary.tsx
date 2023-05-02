import React, {useEffect} from "react";
import MaxwellSectionV2 from "../../../v2/Acts/Maxwell/MaxwellSectionV2";
import {EMaxwellCallOrigin} from "../../../../model/maxwell/enums/EMaxwellCallOrigin";
import {useDispatch, useSelector} from "react-redux";
import {Card, CardBody, Col, Row} from "reactstrap";
import {FormattedMessage} from "react-intl";
import * as moment from "moment";
import {commentRender} from "../../../Commons/Acts/ActsUtils";
import {formattedStatus} from "../../../../utils/MaxwellUtilsV2";
import {CaseState} from "../../../../store/reducers/v2/case/CasesPageReducerV2";
import {AppState} from "../../../../store";
import {setMaxwellActIdToFinalize} from "../../../../store/actions/v2/case/CaseActions";

const MaxwellActDataSummary = ({caseId, act}) => {
    const dispatch = useDispatch();
    const DATETIME_FORMAT = process.env.REACT_APP_FASTR_DATETIME_FORMAT;
    const currentCase: CaseState = useSelector((state: AppState) => state.store.cases.casesList[caseId]);


    useEffect(() => {
        if (currentCase) {
            dispatch(setMaxwellActIdToFinalize(caseId, act?.actFunctionalId))
        }
    }, [])


    const incidentData = (incident) => {
        return <Card className="mt-1">
            <CardBody>
                <div className="my-2">
                    <div>
                        <Row className="w-100 pt-2 pb-2 border-bottom align-items-center incident-line">
                            <Col md={1} className="d-flex flex-column align-items-center justify-content-center">
                                {incident?.ticketId && <div className="pb-1">{incident.ticketId}</div>}
                            </Col>

                            <Col md={3}>
                                {incident?.creationDate && <div><FormattedMessage
                                    id="maxwellV2.incident.list.created.on"/> {moment(incident.creationDate).format(DATETIME_FORMAT)}
                                </div>}
                                {incident?.updateDate && <div><FormattedMessage
                                    id="maxwellV2.incident.list.updated.on"/> {moment(incident.updateDate).format(DATETIME_FORMAT)}
                                </div>}
                            </Col>

                            <Col md={2}>{incident?.status && formattedStatus(incident)}</Col>

                            {incident?.status === "WAITING" && !incident?.technicalResult ?
                                <Col md={4}>
                                    <FormattedMessage id="maxwellV2.incident.list.infos"/>
                                </Col> : <Col className="mb-2" md={5}>{commentRender(incident?.technicalResult)}</Col>
                            }
                        </Row>
                    </div>
                </div>
            </CardBody>
        </Card>
    }

    return <>
        {act !== undefined && incidentData(act?.maxwellAct?.incident)}
        {currentCase !== undefined && act !== undefined && <MaxwellSectionV2 name="MaxwellData"
                                                                             key="MaxwellDataSection"
                                                                             caseId={caseId}
                                                                             actId = {act.actFunctionalId}
                                                                             currentSelectedTheme={act?.maxwellAct?.paramIncident?.tags}
                                                                             themeQualificationCode={currentCase.currentCase?.qualification?.code}
                                                                             readOnly={true}
                                                                             maxwellCaseData={act?.maxwellAct?.data}
                                                                             attachments={act?.maxwellAct?.attachments}
                                                                             incident={act?.maxwellAct?.incident}
                                                                             callOrigin={EMaxwellCallOrigin.FROM_HISTORY}/>}
    </>
}

export default MaxwellActDataSummary