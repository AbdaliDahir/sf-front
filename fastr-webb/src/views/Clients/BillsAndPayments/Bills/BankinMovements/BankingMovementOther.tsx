import * as React from "react"
import {BankingMovement} from "../../../../../model/person/billing/BillingInformation";
import Col from "reactstrap/lib/Col";
import {FormattedDate, FormattedMessage} from "react-intl";
import LocaleUtils from "../../../../../utils/LocaleUtils";

interface Props {
    bankingMovement: BankingMovement
}

const BankingMovementOther = ({bankingMovement}: Props) => {
    return (
        <React.Fragment>
            <Col sm={4} className="px-1 text-left">
                <div className="font-weight-bold">{bankingMovement.name}</div>
            </Col>
            <Col sm={3} className="px-1 text-center">
                {bankingMovement.litigious ?
                    <React.Fragment>
                        <div className={"font-weight-bold text-primary"}><FormattedMessage
                            id={"insufficientFunds"}/></div>
                        <del><FormattedDate
                            value={bankingMovement.date}
                        /></del>
                    </React.Fragment> :
                    <FormattedDate
                        value={bankingMovement.date}
                    />
                }
            </Col>
            <Col sm={2} className="px-1">
                <span>{LocaleUtils.formatCurrency(bankingMovement.amount, false, true)}</span>
            </Col>
            <Col sm={1} className="px-1 text-nowrap"/>
            <Col sm={2}/>
        </React.Fragment>
    )
}

export default BankingMovementOther;