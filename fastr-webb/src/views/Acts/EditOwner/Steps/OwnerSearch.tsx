import * as React from "react";
import {FormattedMessage} from "react-intl";
import {Button, Col, Container, FormGroup, Label, Row} from "reactstrap";
import FormHiddenInput from "../../../../components/Form/FormHiddenInput";
import FormSwitchInput from "../../../../components/Form/FormSwitchInput";
import {translate} from "../../../../components/Intl/IntlGlobalProvider";
import {Client} from "../../../../model/person";
import ExtendedSearchClients from "../../../Search/ExtendedSearchClients";
import {AppState} from "../../../../store";
import {ClientContext} from "../../../../store/types/ClientContext";
import {Service} from "../../../../model/service";
import {connect} from "react-redux";

interface Props {
    title?: string
    notifyFreeEntry: (value: boolean) => void,
    validate?: () => void,
    onSelectClient: (client: Client) => void
    client: ClientContext<Service>
}

interface State {
    searchResult: Client[],
    searchDisabled: boolean,
    clientId: string,
    freeEntry: boolean
}

class OwnerSearch extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            searchResult: [],
            searchDisabled: true,
            clientId: "",
            freeEntry: false
        };
    }

    public isEmpty = (s: string) => {
        return s.length === 0 || !s.trim();
    };

    public storeFreeEntry = (e: React.MouseEvent<HTMLInputElement>) => {
        const freeEntryChecked = e.currentTarget.checked;
        this.setState({freeEntry: freeEntryChecked}, () => this.props.notifyFreeEntry(freeEntryChecked));
    };

    public storeSelectedClientId = (id: string) => {
        this.setState({clientId: id});
    };

    public isStepValid = (values: string[], value: string) => {
        if (value && value !== "") {
            return true;
        } else {
            const key = "freeEntry"
            return values[key]
        }
    };

    public onSelectClient = (client: Client | undefined) => {
        if (client) {
            this.setState({clientId: client.id})
            this.props.onSelectClient(client)
        } else {
            this.setState({clientId: ""})
        }
    }

    public reset = () => {
        this.setState({clientId: ""})
    }

    public render(): JSX.Element {
        const excludedIds = [this.props.client.data!.id]
        return (
            <Container>

                <Row className="d-flex justify-content-center mb-3">
                    <h6>Recherche de repreneur
                    </h6>
                </Row>

                <ExtendedSearchClients onSelect={this.onSelectClient} reset={this.reset} excludedIds={excludedIds}/>

                <Row>
                    <Col>
                        <FormGroup className="mt-3 d-inline-flex float-right">
                            <Label for="freeEntry" className="mt-2"><FormattedMessage
                                id="acts.holder.search.freeEntry"/></Label>
                            <FormSwitchInput color="primary"
                                             valueOn={translate.formatMessage({id: "global.dialog.yes"})}
                                             valueOff={translate.formatMessage({id: "global.dialog.no"})}
                                             name="freeEntry"
                                             id="freeEntry" onClick={this.storeFreeEntry}/>
                        </FormGroup>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <div className="mb-2 d-inline-flex float-right">
                            <Button id="ownerSearch.validate.button.id" size="lg" color="secondary" onClick={this.props.validate}
                                    disabled={!this.state.clientId && !this.state.freeEntry} block>
                                <FormattedMessage id="wizardform.next"/>
                            </Button>
                        </div>
                    </Col>
                </Row>

                <FormHiddenInput name="clientId" id="clientId" value={this.state.clientId}
                                 validations={{isRequired: this.isStepValid}}/>

            </Container>
        )
    }
}

const mapStateToProps = (state: AppState) => ({
    client: state.client
});

export default connect(mapStateToProps)(OwnerSearch)
