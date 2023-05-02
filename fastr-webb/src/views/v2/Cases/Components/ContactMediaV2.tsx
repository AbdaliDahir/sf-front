import * as React from "react";
import {connect} from "react-redux";
import {FormGroup} from "reactstrap";
import {MediaKind} from "../../../../model/MediaKind";
import {AppState} from "../../../../store";
import ValidationUtils from "../../../../utils/ValidationUtils";
import './MediaV2.scss'
import {
    setAddContactV2,
    setCallTransferStatusOKV2,
    setHasCallTransferV2
} from "../../../../store/actions/v2/case/CaseActions";
import FormSelectInput from "../../../../components/Form/FormSelectInput";
import {translate} from "../../../../components/Intl/IntlGlobalProvider";

interface Props {
    caseId: string;
    disabled: boolean;
    name: string;
    validation: boolean;
    contactCreatedByFast: boolean;
    value?: MediaKind;
    forceValue?: MediaKind
    setAddContactV2;
    setHasCallTransferV2: (caseId: string, value: boolean) => void;
    addContact: boolean;
    disableLast2Options: boolean;
    onChange?: (value) => void;
    listOfMediaTypesToDisplay?: string[]
}

class ContactMediaV2 extends React.Component<Props> {

    constructor(props) {
        super(props)
    }

    public componentDidMount() {
        if (this.props.forceValue === "SANS_CONTACT") {
            this.handleSansContactClicked()
            if(this.props.onChange){
                this.props.onChange({currentTarget:{value:"SANS_CONTACT"}})
            }
        }
    }

    public handleSansContactClicked = () => {
        if (this.props.addContact) {// if form unlocked (in edit mode)
            this.props.setAddContactV2(this.props.caseId, false);// disable it
            this.props.setHasCallTransferV2(this.props.caseId, false);
        } else { // if sans_contact already selected
            this.props.setAddContactV2(this.props.caseId, true);// reactivate form
        }
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
            <FormGroup>
                <FormSelectInput value={this.props.value}
                                 forcedValue={this.props.forceValue}
                                 name={this.props.name}
                                 label={translate.formatMessage({id: "input.validations.contact.media.type"})}
                                 validations={this.props.validation ? {isRequired: ValidationUtils.notEmpty} : {}}
                                 disabled={this.props.disabled}
                                 id={this.props.name}
                                 onChange={this.props.onChange}
                                 handleSansContactClicked={this.handleSansContactClicked}
                                 className={"custom-select-sm"}
                                 forceDirty
                >
                    <option id={"selectDefault"} disabled selected value=""/>
                    {this.getFormSelectInput("VOIX", "voix", "contact.media.voice")}
                    {this.getFormSelectInput("COURRIER", "courrier", "contact.media.mail")}
                    {this.getFormSelectInput("EMAIL", "email", "contact.media.email")}
                    {this.getFormSelectInput("SMS", "sms", "contact.media.sms")}
                    {this.getFormSelectInput("TCHAT", "tchat", "contact.media.tchat")}
                    {this.getFormSelectInput("RESEAUX_SOCIAUX", "social-network", "contact.media.social-network")}
                    {this.getFormSelectInput("SFR&MOI", "sfr-and-me", "contact.media.sfr-and-me")}

                    {!this.checkShouldHideButton("BOUTIQUE") &&
                        <option id="store" value="BOUTIQUE"
                                disabled={this.props.disableLast2Options || this.props.disabled}>
                            {translate.formatMessage({id: "contact.media.store"})}
                        </option>
                    }
                    {!this.checkShouldHideButton("SANS_CONTACT") &&
                        <option id="sans_contact" value="SANS_CONTACT"
                                disabled={(this.props.disableLast2Options || this.props.disabled) && this.props.forceValue !== "SANS_CONTACT"}>
                            {translate.formatMessage({id: "contact.media.nocontact"})}
                        </option>
                    }
                </FormSelectInput>
            </FormGroup>
        )
    }

    private getFormSelectInput(mediaType, id, messageKey) {
        return !this.checkShouldHideButton(mediaType) ?
            (
                <option id={id} value={mediaType}>
                    {translate.formatMessage({id: messageKey})}
                </option>
            ) : <React.Fragment/>;
    }
}

const mapStateToProps = (state: AppState, ownProps: Props) => ({
    addContact: state.store.cases.casesList[ownProps.caseId].addContact,
    hasCallTransfer: state.store.cases.casesList[ownProps.caseId].hasCallTransfer,
    qualificationLeaf: state.store.cases.casesList[ownProps.caseId].qualificationLeaf
});

const mapDispatchToProps = {
    setHasCallTransferV2,
    setCallTransferStatusOKV2,
    setAddContactV2
}

export default connect(mapStateToProps, mapDispatchToProps)(ContactMediaV2)
