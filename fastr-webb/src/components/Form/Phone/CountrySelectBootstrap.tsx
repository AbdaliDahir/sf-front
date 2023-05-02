import React, {Component} from 'react'
import {CountrySelectComponentProps} from "react-phone-number-input";

export default class CountrySelectBootstrap extends Component<CountrySelectComponentProps> {

    public render(): JSX.Element {
        const
            {
                name,
                value,
                onFocus,
                onBlur,
                disabled,
            }
                = this.props

        return (
            <input className={"form-control"} type="select"
                   name={name}
                   value={value}
                   onFocus={onFocus}
                   onBlur={onBlur}
                   disabled={disabled}
                   aria-label={this.props['aria-label']}
            />
        )
    }
}