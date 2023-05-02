import * as React from "react";
import {connect} from "react-redux"
import {Col, FormGroup, Label} from "reactstrap";
import {FormattedMessage} from "react-intl";
import Row from "reactstrap/lib/Row";
import Container from "reactstrap/lib/Container";
import {ClientContextSliceState} from "../../../../store/ClientContextSlice";
import {AppState} from "../../../../store";
import FormSwitchInput from "../../../../components/Form/FormSwitchInput";
import ValidationUtils from "../../../../utils/ValidationUtils";
import FormTextInput from "../../../../components/Form/FormTextInput";

interface Props {
    client: ClientContextSliceState
}

interface State {
    isDeletePassword: boolean
}

class EditPasswordSCV2 extends React.Component<Props, State> {
    constructor(props) {
        super(props)
        this.state = {
            isDeletePassword: false
        }
    }


    public render(): JSX.Element {
        const value = !this.state.isDeletePassword ? this.props.client.clientData && this.props.client.clientData.password
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
                                               hasValueChanged: !this.state.isDeletePassword ? ValidationUtils.isEqual(this.props.client.clientData && this.props.client.clientData.password) : ValidationUtils.canBeEmpty,
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
    client: state.store.client.currentClient
});

export default connect(mapStateToProps)(EditPasswordSCV2)
