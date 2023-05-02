import * as moment from "moment-timezone";
import React, {Component} from 'react';
import {FormattedMessage} from "react-intl";
import {Case} from "../../../../model/Case";

interface Props {
    retrievedCase: Case
}

class CreationDate extends Component<Props> {
    constructor(props: Props){
        super(props)
    }

    public render() {
        const DATETIME_FORMAT = process.env.REACT_APP_FASTR_DATETIME_FORMAT;
        const {creationDate, contacts} = this.props.retrievedCase
        return (
            <p className="ml-4 mb-0" style={{fontSize: '8px'}}>
                <strong>
                    <span className="mr-1"> <FormattedMessage id="cases.get.details.created.date"/></span>
                    {moment.utc(creationDate).format(DATETIME_FORMAT)}
                    <span className="ml-1 mr-1"><FormattedMessage
                        id="cases.list.recent.single.case.contact.channel"/></span>
                    {contacts !== undefined && contacts !== null && contacts.length > 0 ?
                        <FormattedMessage id={"cases.create.channel." + contacts[0].channel}/> :
                        <FormattedMessage id="cases.create.channel.CUSTOMER_CARE"/>}
                </strong>
            </p>
        );
    }
}

export default CreationDate
