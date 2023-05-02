import * as React from "react";
import {FormattedMessage} from "react-intl";
import Row from "reactstrap/lib/Row";
import {Case} from "../../../../model/Case";
import {AppState} from "../../../../store";
import {connect} from "react-redux";
import {CaseCategory} from "../../../../model/CaseCategory";
import Col from "reactstrap/lib/Col";
import Label from "reactstrap/lib/Label";
import ValidationUtils from "../../../../utils/ValidationUtils";
import CaseProgressV2 from "./CaseProgressV2";
import FormDateInputV2 from "../../../../components/Form/Date/FormDateInputV2";
import "../../Actions/components/DatepickerNPTA.scss";

interface Props {
    caseId: string
    currentCase: Case,
    authorizations
    userActivity
    readOnly
    formsyRef
    isCurrentCaseScaled: boolean
    isThemeSelected
    payload: any
}

class AdditionalScalingInfoV2 extends React.Component<Props> {

    public render(): JSX.Element {
        const {currentCase, isThemeSelected} = this.props;
        const isCaseScaled = this.props.currentCase.category === CaseCategory.SCALED || this.props.isCurrentCaseScaled;

        if (isCaseScaled && isThemeSelected) {
            const date = currentCase.doNotResolveBeforeDate ? new Date(currentCase.doNotResolveBeforeDate) : null;

            return (
                <Row className="my-3 mx-0">
                    <CaseProgressV2 caseId={this.props.caseId}
                                    formsyRef={this.props.formsyRef}
                                    readOnly={this.props.readOnly}
                    />
                    { !this.props.payload?.refCTT ?
                        <Col xs={6} className="d-flex align-items-center pl-2 pr-1 justify-content-evenly">
                            <Label className={"font-weight-bold mb-0"}>
                                <FormattedMessage
                                    id="case.scaled.doNotResolveBeforeDate"/>
                            </Label>
                            <FormDateInputV2 peekNextMonth={true}
                                             minDate={new Date()}
                                             classNameFormGroup={"mb-0 mx-2"}
                                             small
                                             showMonthDropdown={true}
                                             showYearDropdown={true}
                                             disabled={this.props.readOnly}
                                             id="scaling.doNotResolveBeforeDate"
                                             name="scaling.doNotResolveBeforeDate"
                                             value={date}
                                             isClearable={!this.props.readOnly}
                                             validations={!this.props.readOnly ? {isFutureDateOrEmpty: ValidationUtils.isFutureDateOrEmpty} : {}}
                            />
                        </Col>
                        :
                        <></>
                    }
                </Row>
            )
        } else {
            return <React.Fragment/>
        }
    }
}

function mapStateToProps(state: AppState, ownProps: Props) {
    return {
        currentCase: state.store.cases.casesList[ownProps.caseId].currentCase,
        isThemeSelected: state.store.cases.casesList[ownProps.caseId].isThemeSelected,
        isCurrentCaseScaled: state.store.cases.casesList[ownProps.caseId].isCurrentCaseScaled,
        authorizations: state.store.applicationInitialState.authorizations,
        userActivity: state.store.applicationInitialState.user?.activity,
        payload: state.payload.payload,
    }
}

export default connect(mapStateToProps)(AdditionalScalingInfoV2)