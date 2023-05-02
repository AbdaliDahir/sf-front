import * as React from "react";
import {Button, ButtonGroup, Col} from "reactstrap";
import {FormattedMessage} from "react-intl";
import SimpleAddressInput from "./SimpleAddressInput";
import AdvancedAddressInput from "./AdvancedAddressInput";
import {Address} from "../../../model/person";
import * as _ from "lodash";


type Method = "simple" | "advanced";

interface Props {
    name: string,
    value?:Address,
    saveData?: <T extends string | Date | boolean| Address>(key: string, value: T) => void
    onSelectInputForm?: (key: string) => void
    isSimpleAddressValid?: (bool: boolean) => void
    isAdvancedAddressValid?: (bool: boolean) => void
}

interface State {
    selected: Method
}

export default class AddressInput extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)
        this.state = {
            selected: "simple"
        }
    }

    public changeSelectedMethod = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (event.currentTarget.id === "simple") {
            if (this.props.onSelectInputForm) {
                this.props.onSelectInputForm("simple");
            }
            this.setState({
                selected: "simple"
            })
        } else if (event.currentTarget.id === "advanced") {
            if (this.props.onSelectInputForm) {
                this.props.onSelectInputForm("advanced");
            }
            this.setState({
                selected: "advanced"
            })
        }
    };

    public saveData = (key: string, value:   string | Date | boolean| Address) => {
        if (this.props.saveData) {
            this.props.saveData(key, value);
        }
        this.setState((prevState) => {
            _.set(prevState, key, value);
            return {...prevState};
        });

    }

    public renderAddressForm(): JSX.Element | null {
        if (this.state.selected === "simple") {
            return <SimpleAddressInput name={this.props.name} value={this.props.value} saveData={this.saveData} isSimpleAddressValid={this.props.isSimpleAddressValid}/>
        } else if (this.state.selected === "advanced") {
            return <AdvancedAddressInput name={this.props.name} value={this.props.value} saveData={this.saveData} isAdvancedAddressValid={this.props.isAdvancedAddressValid}/>
        } else {
            return null;
        }
    }

    public render(): JSX.Element {
        return (
            <React.Fragment>
                <Col md={12} className="text-center mb-3">
                    <ButtonGroup>
                        <Button size={"sm"} id="simple" color={"primary"} outline={this.state.selected !== "simple"} onClick={this.changeSelectedMethod} active={this.state.selected === "simple"}>
                            <FormattedMessage id="Simple"/>
                        </Button>
                        <Button size={"sm"} id="advanced" color={"primary"} outline={this.state.selected === "advanced"} onClick={this.changeSelectedMethod} active={this.state.selected === "advanced"}>
                            <FormattedMessage id="Advanced"/>
                        </Button>
                    </ButtonGroup>
                </Col>
                {this.renderAddressForm()}
            </React.Fragment>
        )

    }
}
