import * as React from "react";
import {InputHTMLAttributes} from "react";

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value'> {
    color?: string;
    valueOn?: string;
    valueOff?: string;
    value?: boolean;
    thickness?: string
}

export default class Switch extends React.Component<SwitchProps, object> {

    constructor(props: SwitchProps) {
        super(props);
    }

    public render(): JSX.Element {
        const {color, valueOn, valueOff, id, onChange, value, thickness} = this.props;
        let thick = ""
        if (!thickness) {
            thick = "-md"
        } else {
            if (thickness === "xs") {
                thick = `-${thickness}`
            }
        }
        return (
            <div className={`switch switch-${color} switch${thick}`}>
                <input {...this.props} value={String(value)} onChange={onChange} type="checkbox"/>
                <label htmlFor={id} className={`label-${thickness}`}>
                    <span className="switch-label z-index-1"/>
                    <span className="switch-toggle z-index-1" data-on={valueOn} data-off={valueOff}>
                        <span className="switch-toggle-before"/>
                        <span className={`switch-arrow switch-arrow${thick}`}/>
                    </span>
                </label>
            </div>
        );
    }
}
