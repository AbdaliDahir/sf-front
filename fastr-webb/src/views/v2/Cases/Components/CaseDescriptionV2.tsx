import * as React from "react";
import {Col, FormGroup, Row} from "reactstrap";
import FormTextAreaInput from "../../../../components/Form/FormTextAreaInput";
import ValidationUtils from "../../../../utils/ValidationUtils";
import {AppState} from "../../../../store";
import {connect} from "react-redux";
import "./CaseDescriptionV2.scss"
import {CaseStatus} from "../../../../model/case/CaseStatus";
import {setCurrentDescriptionV2} from "../../../../store/actions/v2/case/CaseActions";
import {ClientRequestSetting} from "../../../../model/ClientRequestSetting";
import {translate} from "../../../../components/Intl/IntlGlobalProvider";

interface Props {
    idAct?: string
    caseId
    isEditable: boolean
    currentCases
    // tslint:disable-next-line:no-any Ici on met any car les données renvoyées dépendent du formulaire
    getValuesFromFields: () => any
    setCurrentDescriptionV2: (caseId: string, value: string) => void
    currentDescription
    userActivityCode?: string
    defaultClientRequestSettings?:ClientRequestSetting[]
    descriptionFromQuickAcess?: string
}

interface State {
    forceValue
}

class CaseDescriptionV2 extends React.Component<Props, State> {

    private refToInput?: React.RefObject<any> = React.createRef()

    constructor(props: Props) {
        super(props);
        this.state = {
            forceValue: ""
        }
    }

    public componentDidMount() {
        const existingClientRequest = this.getExistingClientRequest();
        const defaultClientRequestSettingText = this.props.defaultClientRequestSettings?.find((sd) => sd.activity === this.props.userActivityCode)?.text
        if (existingClientRequest) {
            this.refToInput?.current.setValue(existingClientRequest);
        } else if (this.props.currentDescription) {
            this.setState({forceValue: this.props.currentDescription})
        } else if (this.props.descriptionFromQuickAcess) {
            this.setState({forceValue: this.props.descriptionFromQuickAcess})
        } else if (defaultClientRequestSettingText) {
            this.setState({forceValue: defaultClientRequestSettingText})
        }
    }

    private getExistingClientRequest = (): string | undefined => {
        const caseState = this.props.currentCases[this.props.caseId];
        const currentCaseState = caseState?.currentCase;
        if (!currentCaseState) {
            return undefined
        }
        const createdCaseStatus = currentCaseState.status === CaseStatus.CREATED;
        return createdCaseStatus ? undefined : currentCaseState?.clientRequest;
    }

    private handleChange = (evt) => {
        this.props.setCurrentDescriptionV2(this.props.caseId, evt.currentTarget.value)
    }

    public render() {
        return (
            <Row>
                <Col md={12} className={"client-request-section"}>
                    <FormGroup>
                        <FormTextAreaInput
                            ref={this.refToInput}
                            validations={{
                                isRequired: ValidationUtils.notEmpty,
                                "inputMinLength": 20,
                                "inputMaxLength": 800
                            }}
                            onChange={this.handleChange}
                            forceValue={this.state.forceValue}
                            disabled={!this.props.isEditable}
                            name="clientRequest" id="clientRequest"
                            label={translate.formatMessage({id: "input.validations.clientRequest"})}
                            value=""/>
                    </FormGroup>
                </Col>
            </Row>
        )
    }
}

const mapStateToProps = (state: AppState, ownProps: Props) => ({
    currentCases: state.store.cases.casesList,
    currentDescription: state.store.cases.casesList[ownProps.caseId].currentDescription,
    userActivityCode: state.store.applicationInitialState.user?.activity.code,
    defaultClientRequestSettings: state.store.applicationInitialState.clientRequestSetting?.settingDetail
})

const mapDispatchToProps = {
    setCurrentDescriptionV2
}

export default connect(mapStateToProps, mapDispatchToProps)(CaseDescriptionV2)
