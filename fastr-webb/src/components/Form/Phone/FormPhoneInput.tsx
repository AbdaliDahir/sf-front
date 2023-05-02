import {withFormsy} from "formsy-react";
import * as React from "react";
import PhoneInput from 'react-phone-number-input'
import labels from 'react-phone-number-input/locale/fr.json'
import {FormGroup, InputProps} from "reactstrap";
import './style.css'
import {PassDownProps} from "formsy-react/dist/Wrapper";


type PropType = PassDownProps & InputProps ;

interface Props extends PropType {
    id: string;
    name: string;
    preferredCountries?: string[]
    defaultCountry?: string
    value?: string
    reset?: boolean
    saveData?: (key: string, value: string) => void
    onCountryChange?: (countryCode?: string) => void
    small?: boolean
}

/*interface State {
    countryCode: string | undefined
}*/

const errorStyle: object = {
    width: '100%',
    marginTop: '0.25rem',
    marginLeft: '2.3rem',
    fontSize: '80%',
    color: '#da3832'
}

class FormPhoneInput extends React.Component<Props, object> {

    private LANGUAGE = process.env.REACT_APP_FASTR_LANGUAGE_UPPERCASE;

    // Be careful, the PhoneInput component returns a value, not an event
    public changeValue = (value: string) => {
        const {setValue} = this.props;

        if (this.props.saveData) {
            this.props.saveData(this.props.name, value)
        }

        setValue(value);
    };

    public getErrorMessage(): JSX.Element {
        if (this.props.errorMessage === undefined) {
            return <span/>
        } else {
            return <span style={errorStyle}>{this.props.errorMessage}</span>
        }
    }

    public getValidState(): { valid: boolean, invalid: boolean } {
        if (this.props.isValid) {
            return {invalid: false, valid: true}
        } else {
            return {invalid: true, valid: false}
        }
    }

    public render(): JSX.Element {
        return (
            <FormGroup>
                <PhoneInput
                    inputClassName={"form-control" + (this.props.small ? " form-control-sm" : "") + (!this.props.isValid ? " is-invalid" : " is-valid")}
                    {...this.props}
                    labels={labels}
                    value={this.props.value || ''}
                    onChange={this.changeValue}
                    {...this.getValidState()}
                    country={this.LANGUAGE}
                    onCountryChange={this.props.onCountryChange}
                    displayInitialValueAsLocalNumber={true}
                    limitMaxLength={true}/>
                {this.getErrorMessage()}
            </FormGroup>
        )
    }
}

export default withFormsy<Props>(FormPhoneInput);