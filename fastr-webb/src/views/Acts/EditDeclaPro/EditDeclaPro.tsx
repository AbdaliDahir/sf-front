import {parse} from "date-fns";
import * as React from "react";
import {FormattedMessage} from "react-intl";
import {connect} from "react-redux";
import {Col, FormGroup, Label, Row} from "reactstrap";
import Container from "reactstrap/lib/Container";
import FormSwitchInput from "../../../components/Form/FormSwitchInput";
import FormTextInput from "../../../components/Form/FormTextInput";
import {translate} from "../../../components/Intl/IntlGlobalProvider";
import {Client} from "../../../model/person";
import {Service} from "../../../model/service";
import {AppState} from "../../../store";
import {toggleBlockingUI} from "../../../store/actions";
import ClientContextProps from "../../../store/types/ClientContext";
import Loading from "../../../components/Loading";
import FormHiddenInput from "../../../components/Form/FormHiddenInput";

interface State {
    dataForTheForm?: Client,
    disableSiret: boolean,
    siret?: string
    initialSiren?: string
    initialNic?: string
    siren?: string
    nic?: string
}

interface Props extends ClientContextProps<Service> {
    idClient: string,
    idService: string
}

class EditDeclaPro extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            dataForTheForm: undefined
            , disableSiret: false
            , siret: undefined
            , initialSiren: undefined
            , initialNic: undefined
            , siren: undefined
            , nic: undefined
        }
    }

    public componentDidMount = async () => {
        const dataForTheForm = this.props.client.data;
        this.setState({dataForTheForm, disableSiret: !!(dataForTheForm && dataForTheForm.siret)})
        if (!!dataForTheForm) {
            this.setState(prevState => ({
                initialSiren: this.decuctSiren(dataForTheForm.siret, dataForTheForm.siren)
                , initialNic: this.decuctNicFromSiret(dataForTheForm.siret)
                , siren: this.decuctSiren(dataForTheForm.siret, dataForTheForm.siren)
                , nic: this.decuctNicFromSiret(dataForTheForm.siret)
            }))
        }
    };

    public toggleSirent = () => {
        this.setState(prevState => ({disableSiret: !prevState.disableSiret}))
    };

    public decuctSiren = (siret: string, siren: string) => {
        if (!!siren && siren.length === 9) {
            return siren
        }

        if (!!siret && siret.length === 14) {
            return siret.substr(0, 9)
        }
        return undefined
    };

    public decuctNicFromSiret = (siret: string | undefined) => {
        if (!!siret && siret.length === 14) {
            return siret.substr(9, 14)
        }
        return undefined
    };

    public deductSiretFromSirenAndNic = (siren: string | undefined, nic: string | undefined) => {
        if (!!siren && !!nic) {
            return siren.concat(nic)
        }
        return undefined
    };

    private handleChangeNic = (event) => {
        event.preventDefault();
        const value = event.target.value;
        if (value !== this.state.initialNic) {
            this.setState(prevState => ({
                initialSiren: prevState.initialSiren?.concat(' ')
            }))
        } else {
            this.setState(prevState => ({
                initialSiren: prevState.initialSiren?.trim()
            }))
        }
        this.setState(prevState => ({
            nic: value
            , siret: this.deductSiretFromSirenAndNic(this.state.siren, value)
        }))
    }

    private handleChangeSiren = (event) => {
        event.preventDefault();
        const value = event.target.value;
        if (value !== this.state.initialSiren) {
            this.setState(prevState => ({
                initialNic: prevState.initialNic?.concat(' ')
            }))
        } else {
            this.setState(prevState => ({
                initialNic: prevState.initialNic?.trim()
            }))
        }

        this.setState(prevState => ({
            siren: value
            , siret: this.deductSiretFromSirenAndNic(value, this.state.nic)
        }))
    }

    public render(): JSX.Element {
        const {dataForTheForm} = this.state;
        if (!dataForTheForm) {
            return (<Loading/>)
        } else {
            const {ownerPerson: {civility, firstName, lastName, birthDate, birthDepartment}} = dataForTheForm;
            return (
                <Container>
                    <FormHiddenInput name="ownerPerson.civility" id="person.civility" value={civility}/>
                    <FormHiddenInput name="ownerPerson.firstName" id="ownerPerson.firstName" value={firstName}/>
                    <FormHiddenInput name="ownerPerson.lastName" id="ownerPerson.lastName" value={lastName}/>
                    <FormHiddenInput name="ownerPerson.birthDate" id="ownerPerson.birthDate"
                                     value={birthDate ? parse(birthDate, "yyyy-MM-dd", new Date()) : undefined}/>
                    <FormHiddenInput name="ownerPerson.birthCounty" id="ownerPerson.birthCounty"
                                     value={birthDepartment}/>
                    <Row className={"d-flex justify-content-around"}>
                        <Col>
                            <FormGroup>
                                <Label for="siret">
                                    <FormattedMessage id="act.editPersonalData.pro"/>
                                </Label>

                                <FormSwitchInput color="primary"
                                                 value={this.state.disableSiret}
                                                 valueOn={translate.formatMessage({id: "global.dialog.yes"})}
                                                 valueOff={translate.formatMessage({id: "global.dialog.no"})}
                                                 name="siret" defaultChecked={this.state.disableSiret}
                                                 onChange={this.toggleSirent}
                                                 validations={this.state.disableSiret ? {} : {"isNotEquals": !!(dataForTheForm && dataForTheForm.siret)}}
                                                 id="siret"/>
                            </FormGroup>
                        </Col>

                        {this.state.disableSiret ?
                            <Col>
                                <Row className={"d-flex justify-content-around"}>
                                    <Col>
                                        <Label style={{fontWeight: "bold"}} id="siretLabel" for="ownerPerson.siret">
                                            <FormattedMessage id="global.form.siren"/>/<FormattedMessage
                                            id="global.form.siret"/>
                                        </Label>
                                    </Col>
                                </Row>
                                <Row className={"d-flex justify-content-around"}>
                                    <Col>
                                        <FormGroup>
                                            <FormTextInput id="ownerPerson.siren" name="ownerPerson.siren"
                                                           onChange={this.handleChangeSiren}
                                                           value={this.state.siren}
                                                           validations={{
                                                               isNumeric: true,
                                                               "inputMaxLength": 9,
                                                               "inputMinLength": 9,
                                                               "isNotEquals": this.state.initialSiren
                                                           }}
                                                           validationErrors={{isNumeric: translate.formatMessage({id: "validation.numeric.message"})}}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col>
                                        <FormGroup>
                                            <FormTextInput id="nic" name="nic"
                                                           onChange={this.handleChangeNic}
                                                           value={this.state.nic}
                                                           validations={{
                                                               isNumeric: true,
                                                               "inputMaxLength": 5,
                                                               "inputMinLength": 5,
                                                               "isNotEquals": this.state.initialNic
                                                           }}
                                                           validationErrors={{isNumeric: translate.formatMessage({id: "validation.numeric.message"})}}
                                            />
                                            <FormHiddenInput name="ownerPerson.siret" id="ownerPerson.siret"
                                                             value={this.state.siret}/>
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </Col>
                            :
                            <FormGroup>
                                <FormHiddenInput name="ownerPerson.siren" id="ownerPerson.siren" value={""}/>
                                <FormHiddenInput name="ownerPerson.siret" id="ownerPerson.siret" value={""}/>
                            </FormGroup>
                        }
                    </Row>
                </Container>
            )
        }
    }
}

const mapStateToProps = (state: AppState) => ({
    client: {
        data: state.client.data,
        loading: state.client.loading,
        error: state.client.error,
    }
});

const mapDispatchToProps = {
    toggleBlockingUI
};

export default connect(mapStateToProps, mapDispatchToProps)(EditDeclaPro)
