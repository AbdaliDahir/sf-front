import * as React from "react";
import {FormattedMessage} from "react-intl";
import {Button} from "reactstrap";
import ValidationUtils from "../../../../utils/ValidationUtils";
import {BillingAccountDetails} from "../../../../model/person/billing";
import FormButtonGroupRadio from "../../../../components/Form/FormButtonGroupRadio";

interface Props {
    billingAccountDetails: BillingAccountDetails
    handleNextPayerStatusStatus: (status: 'CORPORATION' | 'PERSON') => void
}

export default class NextPayerStatus extends React.Component<Props> {

    constructor(props: Props) {
        super(props);
    }

    public handleNextPayerStatusStatus = (status: 'CORPORATION' | 'PERSON') => {
        this.props.handleNextPayerStatusStatus(status)
    };

    public render() {
        return (
            <React.Fragment>
                <FormButtonGroupRadio name="nextPayerStatus"
                                      validations={{isRequired: ValidationUtils.notEmpty}}
                                      id="nextPayerStatus" value={this.props.billingAccountDetails.billingAccountDataFromPayer!.businessName ? "CORPORATION" : "PERSON"}
                                      onValueChange={this.handleNextPayerStatusStatus}
                >
                    <Button size="sm" color={"primary"} outline={this.props.billingAccountDetails.billingAccountDataFromPayer!.businessName !== "PERSON"} id="resolved" value="PERSON">
                        <FormattedMessage id={"PERSON"}/>
                    </Button>
                    <Button size="sm" color={"primary"} outline={this.props.billingAccountDetails.billingAccountDataFromPayer!.businessName !== "CORPORATION"} id="unresolved"
                            value="CORPORATION">
                        <FormattedMessage id={"CORPORATION"}/>
                    </Button>
                </FormButtonGroupRadio>
            </React.Fragment>
        )
    }
}