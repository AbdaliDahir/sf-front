import * as moment from "moment-timezone";
import React, {Component} from 'react';
import {FormattedMessage} from "react-intl";
import {Case} from "../../../../model/Case";

interface Props {
    retrievedCase: Case
}

class UpdateDate extends Component<Props> {
    constructor(props: Props){
        super(props)
    }

    public render() {
        const DATETIME_FORMAT = process.env.REACT_APP_FASTR_DATETIME_FORMAT;
        const {updateDate} = this.props.retrievedCase;
        return (
            <p className="ml-4 mb-0" style={{fontSize: '8px'}}>
                <strong>
                    <span className="mr-1"> <FormattedMessage id="cases.get.details.update.date"/></span>
                    {moment.utc(updateDate).format(DATETIME_FORMAT)}
                </strong>
            </p>
        );
    }
}

export default UpdateDate;