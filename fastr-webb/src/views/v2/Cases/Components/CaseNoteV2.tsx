import * as React from "react";
import FormTextAreaInput from "../../../../components/Form/FormTextAreaInput";
import {translate} from "../../../../components/Intl/IntlGlobalProvider";

interface Props {
    value?: string,
    name,
    id,
    disabled?: boolean,
    passRef?
    onChange?
    forceValue?: string
}


export default class CaseNoteV2 extends React.Component<Props, object> {

    constructor(props: Props) {
        super(props);
    }

    public render(): JSX.Element {
        return (
            <FormTextAreaInput validations={{"inputMinLength": 20, "inputMaxLength": 1400}}
                               ref={this.props.passRef}
                               name={this.props.name}
                               label={translate.formatMessage({id: "input.validations.description"})}
                               id={this.props.id}
                               value={this.props.value}
                               forceValue={this.props.forceValue}
                               disabled={this.props.disabled}
                               onChange={this.props.onChange}
                               placeholder={"Réponse au client"}

            />
        )
    }
}
