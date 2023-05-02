import * as React from "react";
import FormTextAreaInput from "../../../../components/Form/FormTextAreaInput";

interface Props {
    value?: string,
    name,
    id,
    disabled?: boolean,
    onChange?
}


export default class ActionNote extends React.Component<Props, object> {

    constructor(props: Props) {
        super(props);
    }

    public render(): JSX.Element {
        return (
            <div>
                <p className="blockquote mt-2">
                    <FormTextAreaInput validations={{"inputMinLength": 20, "inputMaxLength": 4000}}
                                       name={this.props.name}
                                       id={this.props.id}
                                       value={this.props.value}
                                       disabled={this.props.disabled}
                                       onChange={this.props.onChange}
                    />
                </p>
            </div>
        )
    }
}
