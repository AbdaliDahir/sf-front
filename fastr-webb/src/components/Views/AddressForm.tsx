import * as React from "react";
import {FormattedMessage} from "react-intl";
import {Col, Row} from "reactstrap";
// Components
import {FormData} from "../../views/Acts/EditOwner/Steps/NewOwner";
import AddressInput from "../Form/Address/AddressInput";
import {Address} from "../../model/person";

interface Props {
    enableDisclaimer?: boolean
    saveData?: <T extends string | Date | boolean | Address>(key: string, value: T) => void
    defaultValue?: FormData
    title?: string
    onSelectInputForm?: (key: string) => void
    isSimpleAddressValid?: (bool: boolean) => void
    isAdvancedAddressValid?: (bool: boolean) => void
}

export default class AddressForm extends React.Component<Props> {

    public saveData = (key: string, value: string | Date | boolean | Address) => {
        if (this.props.saveData) {
            this.props.saveData(key, value)
        }
    }

    public render(): JSX.Element {
        return (
            <div>
                <Row hidden={!this.props.enableDisclaimer}>
                    <Col md={12}>
                        <div className="align">
                            <FormattedMessage id="acts.addresses.disclaimer">
                                {(disclaimer) => (<span>{disclaimer}</span>)}
                            </FormattedMessage>
                        </div>
                    </Col>
                </Row>
                <AddressInput name="address"
                              saveData={this.saveData}
                              onSelectInputForm={this.props.onSelectInputForm}
                              isSimpleAddressValid={this.props.isSimpleAddressValid}
                              isAdvancedAddressValid={this.props.isAdvancedAddressValid}/>
            </div>
        )
    }
}
