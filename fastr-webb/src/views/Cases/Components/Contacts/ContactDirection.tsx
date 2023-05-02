import * as React from "react";
import {FormattedMessage} from "react-intl";
import {Button} from "reactstrap";
import FormButtonGroupRadio from "../../../../components/Form/FormButtonGroupRadio";
import ValidationUtils from "../../../../utils/ValidationUtils";
import './Media.scss';
import {MediaDirection} from "../../../../model/MediaDirection";
import {translate} from "../../../../components/Intl/IntlGlobalProvider";

// TODO: Traduire ça
interface Props {
    disabled: boolean;
    name: string;
    validation: boolean
    value?: MediaDirection;
    forceValue?: MediaDirection | string;
    addContact?: boolean
    sansContact: boolean
    onChange?: (value) => void;
}

export default class ContactDirection extends React.Component<Props> {

    public render(): JSX.Element {
        const entrantActive = (this.props.disabled || this.props.sansContact) && (this.props.value === "ENTRANT" || this.props.forceValue === "ENTRANT");
        const sortantActive = (this.props.disabled || this.props.sansContact) && (this.props.value === "SORTANT" || this.props.forceValue === "SORTANT");
        return (<div className={`d-flex justify-content-center' align-items-center`}>
            <FormButtonGroupRadio value={this.props.value}
                                  forceValue={this.props.forceValue !== undefined ? this.props.forceValue : this.props.value}
                                  label={translate.formatMessage({id: "input.validations.contact.media.direction"})}
                                  name={this.props.name}
                                  onValueChange={this.props.onChange}
                                  disabled={this.props.disabled || this.props.sansContact}
                                  dontShowActiveWhenDisabled={this.props.sansContact}
                                  validations={this.props.validation ? {isRequired: ValidationUtils.notEmpty} : {}}
                                  id={this.props.name}>
                <Button size={"sm"} color={"primary"} outline={!entrantActive} id="entrant" value="ENTRANT" block>
                    <FormattedMessage id="cases.create.mediaInOrOut.Entrant"/>
                </Button>
                <Button size={"sm"} color={"primary"} outline={!sortantActive} id="sortant" value="SORTANT" block>
                    <FormattedMessage id="cases.create.mediaInOrOut.Sortant"/>
                </Button>
            </FormButtonGroupRadio>
        </div>)
    }
}
