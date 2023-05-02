import * as React from "react";
import {Container} from "reactstrap";
import BillingMethodFormStep from "../../EditBillingMethods/Steps/BillingMethodForm";
import {translate} from "../../../../components/Intl/IntlGlobalProvider";

export default class NewBillingMethod extends React.Component {

    public render(): JSX.Element {
        return (
            <Container>
                <BillingMethodFormStep title={translate.formatMessage({id: "acts.billing.methods"})}/>
            </Container>
        )
    }
}