import * as React from 'react';
import {FormattedMessage} from "react-intl";
import {Col, Container, FormGroup, Label, Row, UncontrolledTooltip} from "reactstrap";
import FormTextInput from "../../../../../components/Form/FormTextInput";
import {Client} from "../../../../../model/person";
import Loading from "../../../../../components/Loading";

/* http://localhost:3000/acts/client/pro/registration?sessionId=dummy&payload=eyJpZFNlcnZpY2UiOiIwOS1CTTFURzMiLCJpZENsaWVudCI6IjQwOTQ4NjY3OCJ9*/

interface Props {

    defaultValue?: Client
    title?: string
}

export default class EditCompanyRegistrationNumberStep extends React.Component<Props> {
    constructor(props: Props) {
        super(props)
    }

    public renderCompanyNameIfExists(): JSX.Element {
        const {corporation} = this.props.defaultValue!;


        if (corporation) {
            const {name} = this.props.defaultValue!.ownerCorporation;
            return (
                <Col md={6}>
                    <FormGroup>
                        <Label for="ownerCorporation.name"><FormattedMessage
                            id="acts.editProfessionaldata.businessName"/></Label>
                        <FormTextInput id="business.info.name" name="business.info.name" value={name}
                                       />
                    </FormGroup>
                </Col>
            )
        } else {
            return (<React.Fragment/>)
        }
    }

    public render() {
        const {siret} = this.props.defaultValue!;

        if (this.props.defaultValue === undefined) {
            return (<Loading />)
        } else {
            return (
                <Container>
                    <Row>
                        {this.renderCompanyNameIfExists()}
                        <Col md={6}>
                            <FormGroup>
                                <UncontrolledTooltip placement="top" target="siretLabel">
                                    <FormattedMessage id="acts.editProfessionaldata.siret.explanation"/>
                                </UncontrolledTooltip>
                                <Label id="siretLabel" for="ownerCorporation.siret"><FormattedMessage
                                    id="acts.editProfessionaldata.siret"/>*</Label>
                                <FormTextInput id="business.info.siret" name="business.info.siret" value={siret}
                                               validations={{"inputMaxLength": 14, "inputMinLength": 14}}
                                               />
                            </FormGroup>
                        </Col>
                    </Row>
                </Container>
            )
        }
    }
}
