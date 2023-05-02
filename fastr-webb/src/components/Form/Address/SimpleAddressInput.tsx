import {withFormsy} from "formsy-react";
import {PassDownProps} from "formsy-react/dist/Wrapper";
import * as React from "react";
import {ChangeEvent} from "react";
import {Highlighter} from "react-bootstrap-typeahead";
import {FormattedMessage} from "react-intl";
import {Col, Label, Row} from "reactstrap";
import {Address} from "../../../model/person";
import ClientService from "../../../service/ClientService";
import FormAsyncTypeahead from "../FormAsyncTypeahead";
import FormTextInput from "../FormTextInput";

type PropType = PassDownProps;

interface State {
    options: Address[]
    isLoading: boolean
    selectedValue?: Address[]
    isFieldEmpty: boolean
    valid: boolean
}

interface Props extends PropType {
    name: string,
    value?: Address,
    saveData?: <T extends string | Date | boolean | Address | undefined>(key: string, value: T) => void
    isSimpleAddressValid?: (bool: boolean) => void
    withoutComplement?: boolean
    className?: string
}

class SimpleAddressInput extends React.Component<Props, State> {

    private clientService: ClientService = new ClientService();

    constructor(props: Props) {
        super(props)
        this.state = {
            options: [],
            isFieldEmpty: !this.props.value,
            isLoading: false,
            selectedValue: this.props.value ? [this.props.value] : undefined,
            valid: false
        }
        this.saveData.bind(this)
    }

    public componentDidMount(): void {
        if (this.props.value) {
            this.setState({valid: true})
        }
    }

    public saveData = (key: string, value: string | Date | boolean | Address | undefined) => {
        if (this.props.saveData) {
            this.props.saveData(key, value)
        }
    }

    public renderMenuItemChildren = (option, props, index) =>
        <React.Fragment>
            <Highlighter search={props.text}>
                {option.address1}
            </Highlighter>
            <div>
                <small>
                    {option.zipcode} {option.city}
                </small>
            </div>
        </React.Fragment>

    public fetchAddress = async (query: string) => {
        this.setState({isLoading: true}, async () => {
            try {
                const addresses = await this.clientService.searchAddress(query)
                this.setState({
                    isLoading: false,
                    options: addresses
                })
            } catch (error) {
                console.error(error)
                this.setState({
                    isLoading: false,
                    options: []
                })
            }
        });
    }

    public getLabelKey = (option: Address) => {
        return option.address1 ? `${option.address1}, ${option.zipcode} ${option.city}` : '';
    }

    public onChange = (selected?: Address[]) => {
        if (selected && selected.length > 0) {
            this.props.setValue(selected[0]);
            const isValidAddress = !!selected[0].address1
            const isValidCity = !!selected[0].city
            const isValidZipcode = !!selected[0].zipcode
            this.setState({valid: (isValidAddress && isValidCity && isValidZipcode), selectedValue: selected});
            this.saveData(this.props.name, selected[0])
        } else {
            this.setState({valid: false})
            this.saveData(this.props.name, undefined)
        }
    }

    public saveDataOnChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedValue = this.state.selectedValue ? JSON.parse(JSON.stringify(this.state.selectedValue.slice())) : []
        const splittedTargetName = event.target.name.split(".");
        if (selectedValue.length > 0) {
            selectedValue[0][splittedTargetName[splittedTargetName.length - 1]] = event.target.value

        } else {
            const newAddress = {}
            newAddress[splittedTargetName[splittedTargetName.length - 1]] = event.target.value
            selectedValue.push(newAddress)
        }
        this.setState({selectedValue})
        this.props.setValue(selectedValue[0]);

        //TODO a virer
        if (this.props.saveData) {
            this.props.saveData(event.currentTarget.name, 'checkbox' !== event.currentTarget.type ? event.currentTarget.value : event.currentTarget.checked)
        }
    }

    public onBlur = (event) => {
        const isFieldEmpty = event.target && event.target.value === "";
        this.setState({isFieldEmpty})
    }

    public isAddressValid = () => {
        if (this.props.isSimpleAddressValid) {
            this.props.isSimpleAddressValid(this.state.valid && !this.state.isFieldEmpty)
        }
        return this.state.valid && !this.state.isFieldEmpty;
    }

    public render(): JSX.Element {

        return (
            <div>
                <Row>
                    <Col sm={12} lg={4}>
                        <Label className={"address-input-label"} for="address-input">
                            <FormattedMessage id="global.address"/><span className="text-danger">*</span>
                        </Label>
                    </Col>
                    <Col sm={12} lg={8}>
                        <FormAsyncTypeahead
                            //TODO: fichier de langue......
                            validationErrors={{manualValidation: "Adresse incorrecte, la valeur est à choisir parmi la liste présentée"}}
                            validations={{manualValidation: this.isAddressValid()}}
                            name="addressSimple"
                            selected={this.state.selectedValue}
                            isInvalid={!this.isAddressValid()}
                            id="address-input"
                            minLength={4}
                            labelKey={this.getLabelKey}
                            isLoading={this.state.isLoading}
                            onBlur={this.onBlur}
                            onSearch={this.fetchAddress}
                            onChange={this.onChange}
                            options={this.state.options}
                            renderMenuItemChildren={this.renderMenuItemChildren}
                            bsSize={"sm"}
                        />
                    </Col>
                </Row>
                {!this.props.withoutComplement &&
                    <Row>
                        <Col sm={12} lg={4}>
                            <Label for="address2">
                                <FormattedMessage id="global.address.addressComplement"/>
                            </Label>
                        </Col>
                        <Col sm={12} lg={8}>
                            <FormTextInput uppercase name={`${this.props.name}.address2`}
                                           validations={{maxLength: 38}}
                                           validationErrors={{
                                               maxLength: "38 caractères maximum autorisés",
                                           }}
                                           bsSize={"sm"}
                                           value={this.props.value ? this.props.value.address2 : ""}
                                           onChange={this.saveDataOnChange}/>
                        </Col>
                    </Row>
                }
                {!this.props.withoutComplement &&
                    <Row>
                        <Col sm={12} lg={4}>
                            <Label for="identityComplement">
                                <FormattedMessage id="global.address.identityComplement"/>
                            </Label>
                        </Col>
                        <Col sm={12} lg={8}>
                            <FormTextInput uppercase name={`${this.props.name}.identityComplement`}
                                           validations={{maxLength: 38}}
                                           validationErrors={{
                                               maxLength: "38 caractères maximum autorisés",
                                           }}
                                           bsSize={"sm"}
                                           value={this.props.value ? this.props.value.identityComplement : ""}
                                           onChange={this.saveDataOnChange}/>
                        </Col>
                    </Row>
                }
            </div>
        )
    }
}

// tslint:disable-next-line:no-any
export default withFormsy<Props>(SimpleAddressInput);
