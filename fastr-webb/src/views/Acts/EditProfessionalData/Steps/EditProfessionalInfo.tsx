import * as React from 'react';
import {FormattedMessage} from "react-intl";
import {Col, Container, FormGroup, Label, Row, UncontrolledTooltip} from "reactstrap";
import FormSwitchInput from "../../../../components/Form/FormSwitchInput";
import FormTextInput from "../../../../components/Form/FormTextInput";
import {translate} from "../../../../components/Intl/IntlGlobalProvider";
import {Client} from "../../../../model/person";
import {LegalCategorySettings} from "../legalCategory";
import LegalCategory from "./LegalCategory";
import Loading from "../../../../components/Loading";
import ValidationUtils from "../../../../utils/ValidationUtils";

/*http://localhost:3000/acts/client/pro?sessionId=dummy&payload=eyJpZFNlcnZpY2UiOiIwOS1CTTFURzMiLCJpZENsaWVudCI6IjQwOTQ4NjY3OCJ9*/

interface State {
    showChorusData: boolean,
    showCTCategoryRelatedInfo: boolean,
    legalCategoryNameFromDB: string
}

interface Props {
    title: string
    defaultValue?: Client

}

export default class EditProfessionalInfo extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            showChorusData: false,
            showCTCategoryRelatedInfo: false,
            legalCategoryNameFromDB: ""
        }
    }

    public componentDidMount(): void {
        const {ownerCorporation: {legalCategoryName, chorusFlag}} = this.props.defaultValue!;
        if (legalCategoryName !== null && legalCategoryName !== undefined) {
            this.setState({legalCategoryNameFromDB: legalCategoryName});
            if (legalCategoryName === translate.formatMessage({id: "acts.editProfessionaldata.category.CT"})
                || legalCategoryName === translate.formatMessage({id: "acts.editProfessionaldata.category.CP"})) {
                this.setState({
                    showCTCategoryRelatedInfo: true, showChorusData: chorusFlag
                })
            }
        }
    }


    public setShowChorusDataBoolean = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({showChorusData: event.currentTarget.checked})
    };

    public setShowCTCategoryRelatedInfo = (selectedLegalCategory: LegalCategorySettings) => {
        if (selectedLegalCategory.name === translate.formatMessage({id: "acts.editProfessionaldata.category.CT"})
            || selectedLegalCategory.name === translate.formatMessage({id: "acts.editProfessionaldata.category.CP"})) {
            this.setState({showCTCategoryRelatedInfo: true, showChorusData: true})
        } else {
            this.setState({showCTCategoryRelatedInfo: false, showChorusData: false})
        }
    };

    public showRelatedChorusData() {

        const {ownerCorporation: {chorusServiceCode, chorusLegalEngagement}} = this.props.defaultValue!;
        const {showChorusData} = this.state;

        if (showChorusData) {
            return (<>
                <Col md={6}>
                    <FormGroup>
                        <Label for="ownerCorporation.chorusServiceCode"><FormattedMessage
                            id="acts.editProfessionaldata.serviceCode"/></Label>
                        <FormTextInput id="ownerCorporation.chorusServiceCode" bsSize={"sm"}
                                       name="ownerCorporation.chorusServiceCode" value={chorusServiceCode}
                                       validations={{"inputMaxLength": 20, "inputFieldType": "alphanumeric"}}
                        />
                    </FormGroup>
                </Col>
                <Col md={6}>
                    <FormGroup>
                        <Label for="ownerCorporation.chorusLegalEngagement"><FormattedMessage
                            id="acts.editProfessionaldata.legalEngagement"/></Label>
                        <FormTextInput id="ownerCorporation.chorusLegalEngagement" bsSize={"sm"}
                                       name="ownerCorporation.chorusLegalEngagement" value={chorusLegalEngagement}
                                       validations={{"inputMaxLength": 20, "inputFieldType": "alphanumeric"}}
                        />
                    </FormGroup>
                </Col>
            </>)
        } else {
            return (<React.Fragment/>)
        }


    }

    public render() {
        if (!this.props.defaultValue || !this.props.defaultValue.ownerCorporation) {
            return (<Loading/>)
        } else {
            const {siret, ownerCorporation: {name, legalCategoryName, legalCategoryCode, treasurer}} = this.props.defaultValue!;
            const valueFromContext = {
                "name": !legalCategoryName ? "" : legalCategoryName,
                "code": !legalCategoryCode ? "" : legalCategoryCode
            }
            return (
                <Container>
                    <Row>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="ownerCorporation.name"><FormattedMessage
                                    id="acts.editProfessionaldata.businessName"/></Label>
                                <FormTextInput id="ownerCorporation.name" name="ownerCorporation.name" value={name} bsSize={"sm"}
                                               validations={{"inputMaxLength": 25}}
                                />
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="ownerCorporation.treasurer"><FormattedMessage
                                    id="acts.editProfessionaldata.treasurer"/></Label>
                                <FormTextInput id="ownerCorporation.treasurer" name="ownerCorporation.treasurer" bsSize={"sm"}
                                               value={treasurer}/>
                            </FormGroup>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <FormGroup>
                                <UncontrolledTooltip placement="top" target="siretLabel">
                                    <FormattedMessage id="acts.editProfessionaldata.siret.explanation"/>
                                </UncontrolledTooltip>
                                <Label id="siretLabel" for="ownerCorporation.siret"><FormattedMessage
                                    id="acts.editProfessionaldata.siret"/>*</Label>
                                <FormTextInput id="siret" name="siret"
                                               value={siret}
                                               bsSize={"sm"}
                                               validations={{
                                                isRequired: ValidationUtils.notEmpty,
                                                respectPattern: ValidationUtils.siretNumberValidation
                                                }}
                                               forceDirty={true}
                                />
                            </FormGroup>
                        </Col>

                        {/*Forme juridique*/}
                        <Col md={6}>
                            <FormGroup>
                                <Label for="ownerCorporation.chorusFlag"><FormattedMessage
                                    id="acts.editProfessionaldata.chorus"/></Label>
                                <FormSwitchInput id="ownerCorporation.chorusFlag"
                                                 name="ownerCorporation.chorusFlag"
                                                 color="primary"
                                                 thickness={"sm"}
                                                 valueOn={translate.formatMessage({id: "global.dialog.yes"})}
                                                 valueOff={translate.formatMessage({id: "global.dialog.no"})}
                                                 value={this.state.showChorusData}
                                                 onChange={this.setShowChorusDataBoolean}
                                                 disabled={!this.state.showCTCategoryRelatedInfo}/>
                            </FormGroup>
                        </Col>
                    </Row>

                    <Row>
                        {/*Chorus*/}
                        <Col md={6}>
                            <FormGroup>
                                <Label for="ownerCorporation.legalCategory"><FormattedMessage
                                    id="acts.editProfessionaldata.formeJuridique"/></Label>
                                <LegalCategory id="ownerCorporation.legalCategory"
                                                bsSize={"sm"}
                                               name="ownerCorporation.legalCategory"
                                               onChange={this.setShowCTCategoryRelatedInfo}
                                               valueFromContext={valueFromContext}/>
                            </FormGroup>
                        </Col>
                    </Row>

                    <Row>
                        {this.showRelatedChorusData()}
                    </Row>
                </Container>
            )
        }
    }
}
