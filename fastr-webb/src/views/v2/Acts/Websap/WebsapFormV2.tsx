import * as React from "react";
import {connect} from "react-redux";
import {NotificationManager} from "react-notifications";
import "./WebsapForm.scss"
import {FormattedMessage} from "react-intl";
import {WebsapActResponseDTO} from "../../../../model/acts/websap/WebsapActResponseDTO";
import {WebsapSetting} from "../../../../model/acts/websap/WebsapSetting";
import ActService from "../../../../service/ActService";
import {translate} from "../../../../components/Intl/IntlGlobalProvider";
import CaseDataInput from "../../../Cases/Components/CaseData/Fields/CaseDataInput";
import CaseDataBoolean from "../../../Cases/Components/CaseData/Fields/CaseDataBoolean";
import {AppState} from "../../../../store";
import {fetchAndStoreWebsapSettings} from "../../../../store/actions";
import {fetchAndStoreWebsapAccess} from "../../../../store/actions/WebsapAction";
import {setDisableCancelADGV2} from "../../../../store/actions/v2/case/CaseActions";
import ExternalApplicationPageV2 from "../../Cases/Components/ExternalApplicationPageV2";
import {Button} from "reactstrap";

interface State {
    toggleStatus: boolean,
    actWebsapData?: WebsapActResponseDTO,
    elements?: JSX.Element[],
    elementsWhenSwitchOff?: JSX.Element[],
    linkVisited?: boolean
}

interface Props {
    idAct?: string,
    actionTitle: string,
    adgCode: string,
    toggleStatusChanged,
    userPassword,
    websapSetting: WebsapSetting,// contient une liste de WebsapADGSetting
    websapAccessData,
    errors,
    fetchAndStoreWebsapSettings: () => void,
    fetchAndStoreWebsapAccess: (sapPassword: string) => void,
    setDisableCancelADGV2: (caseId: string, val: boolean) => void,
    caseId: string
}

class WebsapFormV2 extends React.Component<Props, State> {
    private actService: ActService = new ActService(true);

    private elements: JSX.Element[];
    private elementsWhenSwitchOff: JSX.Element[];
    private linkVisited: boolean = false;
    private externalApp?: React.RefObject<any> = React.createRef();

    private communExternalApp?: React.RefObject<any> = React.createRef();

    constructor(props) {
        super(props);
        this.state = {toggleStatus: true};
    }

    public componentDidMount = async () => {
        if (!this.props.websapSetting) {
            await this.props.fetchAndStoreWebsapSettings();
        }

        if (typeof this.props.websapAccessData === "undefined") {
            await this.props.fetchAndStoreWebsapAccess(this.props.userPassword);
            try {
                if (this.externalApp) {
                    this.externalApp.current.connect();
                }
            } catch (err) {
                NotificationManager.error(translate.formatMessage({id: "act.external.websap.connection.error"}), null, 20000)
                console.error(err);
            }
        }

        this.loadFormElements();
        this.loadFormElementsWhenSwitchOff();
        if (this.props.idAct) {
            const actWebsapData = await this.actService.getActWebsap(this.props.idAct);
            this.setState({
                actWebsapData
            })
        }

    };

    private loadFormElements = () => {
        // sort websap settings to match given adgCode (and build form from that)
        this.elements = [];
        if (this.props.websapSetting?.websapADGSettings) {
            const selectedADGSetting = this.props.websapSetting.websapADGSettings
                .find((adgSetting) => adgSetting.adgCode === this.props.adgCode);
            if (selectedADGSetting) {
                selectedADGSetting.formElements.forEach((elem, index) => {
                    this.elements.push(
                        <CaseDataInput data={elem} index={index} disabled={!this.linkVisited}/>
                    );
                });
                this.setState({elements: this.elements})
            }
        }
    }

    private loadFormElementsWhenSwitchOff = () => {
        // sort websap settings to match given adgCode (and build form from that)
        this.elementsWhenSwitchOff = [];
        if (this.props.websapSetting?.websapADGFailedSettings) {
            const selectedADGSetting = this.props.websapSetting.websapADGFailedSettings;
            if (selectedADGSetting) {
                selectedADGSetting.formElements.forEach((elem, index) => {
                    this.elementsWhenSwitchOff.push(
                        <CaseDataInput data={elem} index={index}/>
                    );
                });
                this.setState({elementsWhenSwitchOff: this.elementsWhenSwitchOff})
            }
        }
    }

    private handleToggleStatusChanged = (id, value: string, checked) => {// callback signature of CaseDataBoolean

        this.setState({toggleStatus: checked});// "parse" string to boolean
    };

    private openApplication = () => {
        this.linkVisited = true;
        this.setState({linkVisited: this.linkVisited});
        this.props.setDisableCancelADGV2(this.props.caseId, true)
        this.loadFormElements();

        try {
            if (this.externalApp) {
                this.externalApp.current.open();
            }
        } catch (err) {
            NotificationManager.error(translate.formatMessage({id: "act.external.websap.open.error"}), null, 20000)
            console.error(err);
        }
    };

    private openCommonApplication = () => {
        try {
            if (this.communExternalApp) {
                this.communExternalApp.current.open();
            }
        } catch (err) {
            NotificationManager.error(translate.formatMessage({id: "act.external.websap.open.error"}), null, 20000)
            console.error(err);
        }
    };

    public renderNoAccess = () => {
        return <section className="generic-form__error-section">
            <h5>ERREUR: </h5>
            <FormattedMessage id={"act.authorization.error.label.ADG_WEBSAP"}/>
        </section>
    };

    private getValidations = () => {
        return this.linkVisited ? {} : {isTrue: false};
    }

    public renderAccessOk = (toggleStatus: boolean) => {
        let selectedADGSetting;
        if (this.props.websapSetting?.websapADGSettings) {
            selectedADGSetting = this.props.websapSetting.websapADGSettings
                .find((adgSetting) => adgSetting.adgCode === this.props.adgCode);
        }
        return <section>
            <section className="generic-form__top-section">
                <label className="generic-form__label">Actions dans WEBSAP</label>
                {selectedADGSetting &&
                <section className="d-flex w-100 justify-content-between">
                    <Button  onClick={this.openCommonApplication} size={"sm"} color={"dark"}>
                        Consulter les informations financières
                    </Button>
                    <ExternalApplicationPageV2 ref={this.communExternalApp}
                                               applicationCode={selectedADGSetting.applicationCode}
                                               actionCode={"ADG_WEBSAP_CONSULTATION_COMPTE"}
                                               caseId={this.props.caseId}/>
                    <Button  onClick={this.openApplication} size={"sm"} color={"dark"}>
                        {translate.formatMessage({id: this.props.actionTitle})}
                    </Button>
                    <ExternalApplicationPageV2 ref={this.externalApp}
                                               applicationCode={selectedADGSetting.applicationCode}
                                               actionCode={selectedADGSetting.applicationAction}
                                               caseId={this.props.caseId}/>
                </section>
                }
                <section className="generic-form__switch-section">
                    <label className="generic-form__label">Acte réalisé</label>
                    <CaseDataBoolean data={
                        {
                            code: "websap-action-result",
                            id: "websap-action-result",
                            qualificationCode: "",
                            label: "",
                            type: "STRING",// unused
                            pattern: "",
                            listValues: [],
                            value: JSON.stringify(toggleStatus),
                            category: "MOTIF"// unused
                        }}
                                     value={toggleStatus}
                                     color="primary"
                                     defaultChecked={true}
                                     name={"genericForm.toggleStatus"}
                                     otherValidations={this.getValidations()}
                                     disabled={!this.linkVisited}
                                     onChange={this.handleToggleStatusChanged}
                                     thickness={"sm"}
                    />
                </section>
            </section>
            <section className="generic-form__form-section">
                {toggleStatus && this.elements}
                {!toggleStatus && this.elementsWhenSwitchOff}
            </section>
        </section>
    };

    public render(): JSX.Element {
        const {toggleStatus} = this.state;
        return (
            <section>
                {this.props.websapAccessData && this.props.errors!.length === 0 && this.renderAccessOk(toggleStatus)}
                {!this.props.websapAccessData && this.props.errors!.length === 0 &&
                <span>en cours de Chargement... </span>}
                {!this.props.websapAccessData && this.props.errors!.length > 0 && this.renderNoAccess()}
            </section>
        )
    }

}

const mapStateToProps = (state: AppState) => ({
    websapSetting: state.websap.websapSetting,
    websapAccessData: state.websap.websapAccessData,
    errors: state.websap.errors,
    userPassword: state.store.applicationInitialState.userPassword

});
const mapDispatchToProps = {
    fetchAndStoreWebsapSettings,
    fetchAndStoreWebsapAccess,
    setDisableCancelADGV2
}

export default connect(mapStateToProps, mapDispatchToProps)(WebsapFormV2)

