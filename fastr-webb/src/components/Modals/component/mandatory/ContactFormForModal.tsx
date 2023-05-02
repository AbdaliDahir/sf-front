import * as React from "react";
import {FormattedMessage} from "react-intl";
import {FormGroup} from "reactstrap";
import Label from "reactstrap/lib/Label";
import Switch from "../../../../components/Bootstrap/Switch";
import {translate} from "../../../Intl/IntlGlobalProvider";
import {Payload} from "../../../../views/Cases/View/ViewCasePage";
import {AppState} from "../../../../store";
import {connect} from "react-redux";
import {setAddContactForModal} from "../../../../store/actions/ModalAction";
import {fetchAndStoreMediaSettings} from "../../../../store/actions";
import {MediaSetting} from "../../../../model/media/MediaSetting";
import Media from "../../../../views/Cases/Components/Contacts/Media";

interface Props {
    payload: Payload,
    name: string
    addContactForModal: boolean
    setAddContactForModal: (addContactForNote: boolean) => void
    fetchAndStoreMediaSettings: (activity: string | undefined) => void
    mediaSetting: MediaSetting
}

interface State {
    addContactForNote: boolean
}

class ContactFormForModal extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            addContactForNote: true,
        }
    }

    public async componentDidMount() {
        await this.props.fetchAndStoreMediaSettings(this.props.payload.idAct);
    }

    public handleAddContactPreferences = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({
            addContactForNote: event.currentTarget.checked,
        });

        this.props.setAddContactForModal(event.currentTarget.checked)
    };


    public render(): JSX.Element {
        const {contactCreatedByFast} = this.props.payload;
        // let {contactCreatedByFast, contactMediaType, contactMediaDirection} = this.props.payload;
        /* if(this.props.mediaSetting?.mediaType){
             contactMediaType = this.props.mediaSetting.mediaType;
         }
         if(this.props.mediaSetting?.mediaSens ){
             contactMediaDirection = this.props.mediaSetting.mediaSens;
         }
         const contactDisabled: boolean = !this.state.addContactForNote || this.props.payload.contactCreatedByFast;
         */
        return (
            <div>
                {/*Yes or no to add a contact*/}
                <FormGroup>
                    <Label for="done">
                        <FormattedMessage id="cases.get.details.add.contact"/>
                    </Label>
                    <Switch color="primary"
                            defaultChecked={contactCreatedByFast ? contactCreatedByFast : true}
                            checked={contactCreatedByFast ? contactCreatedByFast : undefined}
                            disabled={contactCreatedByFast}
                            valueOn={translate.formatMessage({id: "cases.create.yes"})}
                            valueOff={translate.formatMessage({id: "cases.create.no"})}
                            id="addContact"
                            onChange={this.handleAddContactPreferences}/>
                </FormGroup>

                {/* <Row className={"text-center"}>
                    <Col md={6}>
                        <ContactMedia value={contactMediaType} validation={!contactDisabled}
                                      disabled={contactDisabled}
                                      name={`${this.props.name}.media.type`}/>
                    </Col>
                    <Col md={6}>
                        <ContactDirection value={contactMediaDirection} validation={!contactDisabled}
                                          disabled={contactDisabled}
                                          name={`${this.props.name}.media.direction`}/>
                    </Col>
                </Row> */
                }
                <Media payload={this.props.payload}/>
            </div>
        )
    }
}

const mapDispatchToProps = {
    setAddContactForModal,
    fetchAndStoreMediaSettings
}
const mapStateToProps = (state: AppState) => ({
    showCaseResolutionReminderComponents: state.modalManager.showCaseResolutionDunningComponents,
    addContactForModal: state.modalManager.addContactForModal,
    retrievedCase: state.case.currentCase,
    mediaSetting: state.mediaSetting.mediaSetting

})

export default connect(mapStateToProps, mapDispatchToProps)(ContactFormForModal)

