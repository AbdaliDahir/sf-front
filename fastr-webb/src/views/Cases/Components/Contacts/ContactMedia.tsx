import * as React from "react";
import {FormattedMessage} from "react-intl";
import {connect} from "react-redux";
import {Button, FormGroup, UncontrolledTooltip} from "reactstrap";
import FormButtonGroupRadio from "../../../../components/Form/FormButtonGroupRadio";
import {MediaKind} from "../../../../model/MediaKind";
import {AppState} from "../../../../store";
import {setCallTransferStatusOK, setHasCallTransfer} from "../../../../store/actions";
import {setAddContactToFalse, setAddContactToTrue} from "../../../../store/actions/CasePageAction";
import ValidationUtils from "../../../../utils/ValidationUtils";
import './Media.scss'

interface Props {
    disabled: boolean;
    name: string;
    validation: boolean;
    contactCreatedByFast: boolean;
    value?: MediaKind;
    forceValue?: MediaKind
    setAddContactToTrue;
    setAddContactToFalse;
    setHasCallTransfer
    addContact: boolean;
    disableLast2Options: boolean;
    onChange?: (value) => void;
    activateFormChecking?: (value) => void;
    listOfMediaTypesToDisplay?: string[]
}

class ContactMedia extends React.Component<Props> {

    constructor(props) {
        super(props)
    }

    public handleSansContactClicked = (event: React.FormEvent<HTMLInputElement>) => {
        if (this.props.addContact) {// if form unlocked (in edit mode)
            this.props.setAddContactToFalse();// disable it
            this.props.setHasCallTransfer(false);
        } else { // if sans_contact already selected
            this.props.setAddContactToTrue();// reactivate form
        }
        this.props.activateFormChecking && this.props.activateFormChecking(true); // but still check inputs
    }

    private checkShouldHideButton = (mediaType: string): boolean => {
        if (this.props.listOfMediaTypesToDisplay) {
            return this.props.listOfMediaTypesToDisplay.indexOf(mediaType) === -1;
        } else {
            // if not present, bypass
            return false;
        }
    }

    public render(): JSX.Element {
        return (
            <FormGroup className='media__button-group-section'>
                {
                    !this.checkShouldHideButton("VOIX") &&
                    <UncontrolledTooltip placement="left" target="voix">
                        <FormattedMessage id="contact.media.voice"/>
                    </UncontrolledTooltip>
                }
                {
                    !this.checkShouldHideButton("COURRIER") &&
                    <UncontrolledTooltip placement="top" target="courrier">
                        <FormattedMessage id="contact.media.mail"/>
                    </UncontrolledTooltip>
                }
                {
                    !this.checkShouldHideButton("EMAIL") &&
                    <UncontrolledTooltip placement="top" target="email">
                        <FormattedMessage id="contact.media.email"/>
                    </UncontrolledTooltip>
                }
                {
                    !this.checkShouldHideButton("SMS") &&
                    <UncontrolledTooltip placement="top" target="sms">
                        <FormattedMessage id="contact.media.sms"/>
                    </UncontrolledTooltip>
                }
                {
                    !this.checkShouldHideButton("TCHAT") &&
                    <UncontrolledTooltip placement="top" target="tchat">
                        <FormattedMessage id="contact.media.tchat"/>
                    </UncontrolledTooltip>
                }
                {
                    !this.checkShouldHideButton("RESEAUX_SOCIAUX") &&
                    <UncontrolledTooltip placement="top" target="social-network">
                        <FormattedMessage id="contact.media.social-network"/>
                    </UncontrolledTooltip>
                }
                {
                    !this.checkShouldHideButton("SFR&MOI") &&
                    <UncontrolledTooltip placement="top" target="sfr-and-me">
                        <FormattedMessage id="contact.media.sfr-and-me"/>
                    </UncontrolledTooltip>
                }
                {
                    !this.checkShouldHideButton("BOUTIQUE") &&
                    <UncontrolledTooltip placement="top" target="store">
                        <FormattedMessage id="contact.media.store"/>
                    </UncontrolledTooltip>
                }
                {
                    !this.checkShouldHideButton("SANS_CONTACT") &&
                    <UncontrolledTooltip placement="right" target="sans_contact">
                        <FormattedMessage id="contact.media.nocontact"/>
                    </UncontrolledTooltip>
                }

                <FormButtonGroupRadio value={this.props.value}
                                      forceValue={this.props.forceValue ? this.props.forceValue : this.props.value}
                                      name={this.props.name}
                                      validations={this.props.validation ? {isRequired: ValidationUtils.notEmpty} : {}}
                                      onValueChange={this.props.onChange}
                                      disabled={this.props.disabled}
                                      id={this.props.name}
                                      dontShowActiveWhenDisabled={false}
                                      handleSansContactClicked={this.handleSansContactClicked}
                                      longButtons>
                    <Button size="sm" color="primary" id="voix" value="VOIX"
                            shouldHide={this.checkShouldHideButton("VOIX")}
                            block>
                        <span className="icon-white icon-customer-care"/>
                    </Button>
                    <Button size="sm" color="primary" id="courrier" value="COURRIER"
                            shouldHide={this.checkShouldHideButton("COURRIER")}
                            block>
                        <span className="icon-white icon-mail"/>
                    </Button>
                    <Button size="sm" color="primary" id="email" value="EMAIL"
                            shouldHide={this.checkShouldHideButton("EMAIL")}
                            block>
                        <span className="icon-white icon-email"/>
                    </Button>
                    <Button size="sm" color="primary" id="sms" value="SMS"
                            shouldHide={this.checkShouldHideButton("SMS")}
                            block>
                        <span className="icon-white icon-conversation"/>
                    </Button>
                    <Button size="sm" color="primary" id="tchat" value="TCHAT"
                            shouldHide={this.checkShouldHideButton("TCHAT")}
                            block>
                        <span className="icon-white icon-conversations"/>
                    </Button>
                    <Button size="sm" color="primary" id="social-network" value="RESEAUX_SOCIAUX"
                            shouldHide={this.checkShouldHideButton("RESEAUX_SOCIAUX")}
                            block>
                        <span className="icon-white icon-world"/>
                    </Button>
                    <Button size="sm" color="primary" id="sfr-and-me" value="SFR&MOI"
                            shouldHide={this.checkShouldHideButton("SFR&MOI")}
                            block>
                        <span className="icon-white icon-phone"/>
                    </Button>
                    <Button size="sm" color="primary" id="store" value="BOUTIQUE" block
                            shouldHide={this.checkShouldHideButton("BOUTIQUE")}
                            disabled={this.props.disableLast2Options || this.props.disabled}>
                    <span className=
                              "icon-white icon-shop"/>
                    </Button>
                    <Button size="sm" color="primary" id="sans_contact" value="SANS_CONTACT"
                            block
                            shouldHide={this.checkShouldHideButton("SANS_CONTACT")}
                            disabled={(this.props.disableLast2Options || this.props.disabled) && this.props.value !== "SANS_CONTACT"}>
                        <span className="icon-white icon-block"/>
                    </Button>
                </FormButtonGroupRadio>
            </FormGroup>
        )
    }
}

const mapStateToProps = (state: AppState) => ({
    addContact: state.casePage.addContact,
    hasCallTransfer: state.casePage.hasCallTransfer,
    qualificationLeaf: state.casePage.qualificationLeaf
});

const mapDispatchToProps = {
    setHasCallTransfer,
    setCallTransferStatusOK,
    setAddContactToTrue,
    setAddContactToFalse
}

export default connect(mapStateToProps, mapDispatchToProps)(ContactMedia)
