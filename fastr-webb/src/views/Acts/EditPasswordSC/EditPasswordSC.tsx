import * as React from "react";
import {connect} from "react-redux"
import {Col, FormGroup, Label} from "reactstrap";
import {FormattedMessage} from "react-intl";
import FormSwitchInput from "../../../components/Form/FormSwitchInput"
import FormTextInput from "../../../components/Form/FormTextInput";
import Row from "reactstrap/lib/Row";
import Container from "reactstrap/lib/Container";
import {Client} from "../../../model/person"
import {AppState} from "../../../store"
import ValidationUtils from "../../../utils/ValidationUtils"

interface Props {
    clientData: Client
}

interface State {
    isDeletePassword: boolean
}

class EditPasswordSC extends React.Component<Props, State> {
    constructor(props) {
        super(props)
        this.state = {
            isDeletePassword: false
        }
    }


    public render(): JSX.Element {
        const value = !this.state.isDeletePassword ? this.props.clientData && this.props.clientData.password
            :
            ""
        return (
            <Container>
                <Row>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="password"><FormattedMessage
                                id="global.dialog.password"/>{!this.state.isDeletePassword ? <span className="text-danger">*</span> : <span/>}</Label>
                            <FormTextInput id="password" name="password" value={value} bsSize={"sm"}
                                           readOnly={this.state.isDeletePassword}
                                           validations={{
                                               hasValueChanged: !this.state.isDeletePassword ? ValidationUtils.isEqual(this.props.clientData && this.props.clientData.password) : ValidationUtils.canBeEmpty,
                                               isRequired: !this.state.isDeletePassword ? ValidationUtils.notEmpty : ValidationUtils.canBeEmpty
                                           }}
                                           validationErrors={{hasValueChanged: "Le mot de passe n'a pas changé"}}/>
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup>
                            <Label for="password">Effacer le code de sécurité </Label>
                            <FormSwitchInput color="primary" thickness={"sm"}
                                             id="deletePassword" name="deletePassword" onChange={this.toggleDelete}
                                             value={this.state.isDeletePassword}/>
                        </FormGroup>
                    </Col>
                </Row>
            </Container>
        )
    }

    private toggleDelete = () => this.setState(prevState => ({isDeletePassword: !prevState.isDeletePassword}))
}

const mapStateToProps = (state: AppState) => ({
    clientData: state.client.data
});

export default connect(mapStateToProps)(EditPasswordSC)
