import * as React from "react";
import {FormattedMessage} from "react-intl";
import {Col, FormGroup, Row} from "reactstrap";
import FormTextAreaInput from "../../../../components/Form/FormTextAreaInput";
import ValidationUtils from "../../../../utils/ValidationUtils";
import {translate} from "../../../../components/Intl/IntlGlobalProvider";
import GenericCardToggle from "../../../../components/Bootstrap/GenericCardToggle";
import {AppState} from "../../../../store";
import {connect} from "react-redux";
import {ApplicationInitialState} from "../../../../model/ApplicationInitialState";

interface Props {
    idAct?: string
    // tslint:disable-next-line:no-any Ici on met any car les données renvoyées dépendent du formulaire
    getValuesFromFields: () => any
    applicationInitialState: ApplicationInitialState
    userActivity: string
}

class CaseDescription extends React.Component<Props, object> {

    public fillTheClientRequestInput = () => {
        if (this.props.idAct) {
            return translate.formatMessage({id: "create.act.client.request"}).concat(translate.formatMessage({id: "act.title." + this.props.idAct}).toLowerCase())
        }
        const initialInput = this.props.applicationInitialState.clientRequestSetting?.settingDetail.find(setting => setting.activity === this.props.userActivity)?.text
        return initialInput ? initialInput : ""
    }
    public fillTheCommentInput = () => {
        if (this.props.idAct) {
            return translate.formatMessage({id: "create.act.note.description"}).concat(translate.formatMessage({id: "act.title." + this.props.idAct}).toLowerCase())
        } else {
            return ""
        }
    }

    public render() {
        return (
            <GenericCardToggle title={"cases.create.description"} icon={"icon-document"}>
                <Row>
                    <Col md={12}>
                        <h6><FormattedMessage id="cases.create.clientRequest"/><span className="text-danger">*</span>
                        </h6>
                        <FormGroup>
                            <FormTextAreaInput
                                validations={{
                                    isRequired: ValidationUtils.notEmpty,
                                    "inputMinLength": 20,
                                    "inputMaxLength": 800
                                }}
                                name="clientRequest" id="clientRequest" value={this.fillTheClientRequestInput()}/>
                        </FormGroup>
                    </Col>
                </Row>
            </GenericCardToggle>)
    }
}

const mapStateToProps = (state: AppState) => ({
    applicationInitialState: state.store.applicationInitialState,
    userActivity: state.casePage.userActivity
})

export default connect(mapStateToProps)(CaseDescription)
