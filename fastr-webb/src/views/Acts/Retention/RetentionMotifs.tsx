import * as React from "react";
import {connect} from "react-redux";

import {AppState} from "../../../store";
import {Col, Label} from "reactstrap";
import {FormattedMessage} from "react-intl";
import FormSelectInput from "../../../components/Form/FormSelectInput";
import ValidationUtils from "../../../utils/ValidationUtils";
import {RetentionSetting} from "../../../model/acts/retention/RetentionSetting";
import {MotifID} from "../../../model/acts/retention/MotifID";
import {RetentionMotif} from "../../../model/acts/retention/RetentionMotif";
import {fetchAndStoreRetentionRefusSettings} from "../../../store/actions";
import Tooltip from "reactstrap/lib/Tooltip";
import FormTextInput from "../../../components/Form/FormTextInput";
import {MotifDTO} from "../../../model/acts/retention/MotifDTO";

interface Props {
    retentionSetting: RetentionSetting,
    retentionRefusSetting: RetentionSetting,
    retentionMotif?: MotifDTO,
    retentionSousMotif?: MotifDTO,
    resetFormRetention
    disabled: boolean
    client
    context: string,
    fetchAndStoreRetentionRefusSettings: () => void
}

interface State {
    sousMotifProposalOptions: JSX.Element[]
    isMotifChanged: boolean
    retentionSettingFiltered: RetentionSetting | undefined
    tooltipOpenMotif: boolean
    tooltipOpenSousMotif: boolean
}

class RetentionMotifs extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            sousMotifProposalOptions: [],
            isMotifChanged: false,
            retentionSettingFiltered: undefined,
            tooltipOpenMotif: false,
            tooltipOpenSousMotif: false,
        }
    }

    public componentDidMount = async () => {
        if (this.props.context === "Refus") {
            if (!this.props.retentionRefusSetting) {
                await this.props.fetchAndStoreRetentionRefusSettings();
                return;
            }
            this.setState({retentionSettingFiltered: this.filterRetentionSetting("Refus")});
            return;
        }

        if (this.props.context === "Appel") {
            this.setState({retentionSettingFiltered: this.filterRetentionSetting("Appel")});
        }
    }

    public componentDidUpdate(prevProps: Props, prevState: State) {
        const {context, retentionSetting, retentionRefusSetting} = this.props;
        if (context === "Appel" && !prevProps.retentionSetting && retentionSetting && retentionSetting.retentionMotifs.length > 0) {
            this.setState({retentionSettingFiltered: this.filterRetentionSetting("Appel")});
            return;
        }

        if (context === "Refus" && !prevProps.retentionRefusSetting && retentionRefusSetting && retentionRefusSetting.retentionMotifs.length > 0) {
            this.setState({retentionSettingFiltered: this.filterRetentionSetting("Refus")});
        }
    }

    public filterRetentionSetting = (context: string) => {
        if (!this.props.retentionSetting && context === "Appel") {
            return undefined;
        }

        const filteredRetentionMotifs: RetentionMotif[] = [];
        for (const retentionMotif of this.getCurrentSetting().retentionMotifs) {
            if (!retentionMotif.motif.serviceTypes) {
                filteredRetentionMotifs.push(retentionMotif)
                continue
            }

            if (retentionMotif.motif.serviceTypes.includes(this.props.client!.service!.serviceType)) {
                const filteredRetentionMotif: RetentionMotif = {
                    motif: retentionMotif.motif,
                    sousMotifs: []
                }
                /*const filteredSousMotif: MotifID[] = [];*/
                if (retentionMotif.sousMotifs) {
                    const filteredSousMotif: MotifID[] = retentionMotif.sousMotifs.filter(sousMotif =>
                        !sousMotif.serviceTypes || sousMotif.serviceTypes.includes(this.props.client.service!.serviceType))
                    filteredRetentionMotif.sousMotifs.push(...filteredSousMotif)
                }
                filteredRetentionMotifs.push(filteredRetentionMotif)
            }
        }
        const filteredRetentionSetting: RetentionSetting = {
            ...this.getCurrentSetting(),
            retentionMotifs: filteredRetentionMotifs
        }
        return filteredRetentionSetting
    }

    public getListOfOptions = (elements?: Array<MotifID>): JSX.Element[] => {
        let listOfOptions: JSX.Element[] = [];
        elements ? elements.forEach(element => {
            listOfOptions.push(<option key={element.code}
                                       value={element.code}>{element.label}</option>)
        }) : listOfOptions = []
        return listOfOptions;
    }

    public getListOfMotifProposal = (): JSX.Element[] => {
        const motifsProposalOptions: JSX.Element[] = [];
        if (this.state.retentionSettingFiltered) {
            this.state.retentionSettingFiltered.retentionMotifs.forEach((elemMotif) => {
                motifsProposalOptions.push(<option key={elemMotif.motif.code}
                                                   value={elemMotif.motif.code}>{elemMotif.motif.label}</option>);
            })
        }
        return motifsProposalOptions
    }
    //  TODO load motif retention settings in redis (for performance after pilote retention)
    public getListOfSousMotifProposal = (): JSX.Element[] => {
        const {resetFormRetention, retentionSousMotif, retentionSetting, context, retentionRefusSetting, retentionMotif} = this.props

        if (!retentionSetting && context === "Appel" || !retentionRefusSetting && context === "Refus") {
            return this.state.sousMotifProposalOptions
        }

        if (!resetFormRetention && retentionSousMotif?.code && !this.state.isMotifChanged) {
            const motifSelected = this.getCurrentSetting().retentionMotifs.find(element => element.motif.code === retentionMotif?.code)
            return this.getListOfOptions(motifSelected ? motifSelected.sousMotifs : undefined)
        }

        return this.state.sousMotifProposalOptions
    }

    public getCurrentSetting = (): RetentionSetting => {
        return this.props.context === "Appel" ? this.props.retentionSetting : this.props.retentionRefusSetting
    }

    //  TODO ADD METHOD TO CONSTRUCT unique options
    public handleMotifChange = (valueSelected) => {
        let sousMotifProposalOptions: JSX.Element[] = [];
        const {retentionSettingFiltered} = this.state
        if (retentionSettingFiltered) {
            const motifSelected = retentionSettingFiltered.retentionMotifs.find(element => element.motif.code === valueSelected.currentTarget.value)
            sousMotifProposalOptions = this.getListOfOptions(motifSelected ? motifSelected.sousMotifs : undefined)
            this.setState({
                sousMotifProposalOptions: sousMotifProposalOptions,
                isMotifChanged: true
            });
        }
    }

    public suggestSousMotif = () => {
        return this.state.isMotifChanged && this.state.sousMotifProposalOptions && this.state.sousMotifProposalOptions.length > 0;
    }

    public renderListOf = (type: string) => {
        return this.getCurrentSetting() ? (type === "motif" ? this.getListOfMotifProposal() : this.getListOfSousMotifProposal()) : <React.Fragment/>
    }

    public isSousMotifMandatory = () => {
        return this.props.retentionSousMotif?.code || this.suggestSousMotif()
    }

    public toggleTooltipMotif = () => this.setState(prevState => ({...prevState, tooltipOpenMotif: !prevState.tooltipOpenMotif}));
    public toggleTooltipSousMotif = () => this.setState(prevState => ({...prevState, tooltipOpenSousMotif: !prevState.tooltipOpenSousMotif}));

    public getTooltipMotifLabel = () => {
        const {retentionMotif} = this.props
        let tooltipMotifLabel;
        if (retentionMotif?.code && this.state.retentionSettingFiltered?.retentionMotifs) {
            tooltipMotifLabel = this.state.retentionSettingFiltered?.retentionMotifs.filter(element => {
                return element.motif.code === retentionMotif.code
            })
            return tooltipMotifLabel && tooltipMotifLabel[0] ? tooltipMotifLabel[0].motif.label : '';
        }
    }

    public getTooltipThemeLabel = () => {
        const {retentionSousMotif} = this.props
        let sousMotifsArr;
        let tooltipSousMotifArr;
        const allSousMotifsArr = this.state.retentionSettingFiltered?.retentionMotifs.map(element => element.sousMotifs)
        if (retentionSousMotif?.code && this.state.retentionSettingFiltered?.retentionMotifs) {
            sousMotifsArr = allSousMotifsArr?.filter(el => {
                return el.filter(sousMotif => sousMotif.code === retentionSousMotif.code).length
            })
            sousMotifsArr?.map(el => {
                tooltipSousMotifArr = el.filter(sousMotif => sousMotif.code === retentionSousMotif.code)
            })
            return tooltipSousMotifArr ? tooltipSousMotifArr[0].label : ''
        }
    }

    public  getTooltipFieldLabel = (type: string) => {
        return type === "motif" ? this.getTooltipMotifLabel() : this.getTooltipThemeLabel()
    }

    public renderMotif = () => {
        const {retentionMotif, resetFormRetention, disabled} = this.props
        return (
            <div id={this.props.context === "Appel" ? "retentionDataFormMotif" : "retentionDataFormMotifRefus"}
                 className={disabled ? 'retentionDataFormMotif disabled' : 'retentionDataFormMotif'}>
                {!disabled &&
                <FormSelectInput key={`retentionDataForm.motif${this.props.context}`}
                                 name={`retentionDataForm.motif${this.props.context}`}
                                 id={`retentionDataForm.motif${this.props.context}`}
                                 validations={{isRequired: ValidationUtils.notEmpty}}
                                 disabled={false}
                                 aria-sort="descending"
                                 onChange={this.handleMotifChange}>
                    <option selected disabled value=""/>
                    {this.renderListOf("motif")}
                </FormSelectInput>
                }
                {disabled &&
                <FormTextInput name={`retentionDataForm.motif${this.props.context}`}
                               id={`retentionDataForm.motif${this.props.context}`}
                               validations={{isRequired: ValidationUtils.notEmpty}}
                               disabled={true}
                               value={!resetFormRetention && retentionMotif ? retentionMotif.label : undefined}
                />
                }
            </div>
        )
    }

    public renderSousMotif = () => {
        const {retentionSousMotif, resetFormRetention, disabled} = this.props
        return (
            <div id={this.props.context === "Appel" ? "retentionDataFormSousMotif" : "retentionDataFormSousMotifRefus"}
                 className={this.props.disabled ? 'retentionDataFormSousMotif disabled' : 'retentionDataFormSousMotif' }>
                {!disabled &&
                <FormSelectInput key={`retentionDataForm.sousMotif${this.props.context}`}
                                 name={`retentionDataForm.sousMotif${this.props.context}`}
                                 id={`retentionDataForm.sousMotif${this.props.context}`}
                                 validations={this.isSousMotifMandatory() ? {isRequired: ValidationUtils.notEmpty} : {}}
                                 disabled={!this.suggestSousMotif()}
                                 aria-sort="descending"
                >
                    <option selected disabled value=""/>
                    {this.renderListOf("sousMotif")}
                </FormSelectInput>
                }
                {disabled &&
                <FormTextInput name={`retentionDataForm.sousMotif${this.props.context}`}
                               id={`retentionDataForm.sousMotif${this.props.context}`}
                               validations={this.isSousMotifMandatory() ? {isRequired: ValidationUtils.notEmpty} : {}}
                               disabled={true}
                               value={!resetFormRetention && retentionSousMotif ? retentionSousMotif.label : undefined}
                />
                }
            </div>
        )
    }

    public render() {
        return (
            <React.Fragment>

                <Col md={3}>
                        <Tooltip key={"retentionDataFormMotif"} placement="bottom" isOpen={this.state.tooltipOpenMotif} autohide={false}
                                 className="retentionTooltip"
                                 target={this.props.context === "Appel" ? "retentionDataFormMotif" : "retentionDataFormMotifRefus"}
                                 toggle={this.toggleTooltipMotif}>
                            {this.getTooltipFieldLabel("motif")}
                        </Tooltip>
                    <Label><FormattedMessage
                        id={`retentionDataForm.motif${this.props.context}`}/><span className="text-danger">*</span></Label>
                    { this.renderMotif() }
                </Col>

                <Col md={3}>
                    <Tooltip key={"retentionDataFormSousMotif"} placement="bottom" isOpen={this.state.tooltipOpenSousMotif} autohide={false}
                             className="retentionTooltip"
                             target={this.props.context === "Appel" ? "retentionDataFormSousMotif" : "retentionDataFormSousMotifRefus"}
                             toggle={this.toggleTooltipSousMotif}>
                        {this.getTooltipFieldLabel("sousMotif")}
                    </Tooltip>
                    <Label><FormattedMessage
                        id={`retentionDataForm.sousMotif${this.props.context}`}/>{this.isSousMotifMandatory() && <span className="text-danger">*</span>}</Label>
                    { this.renderSousMotif() }
                </Col>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state: AppState) => ({
    retentionSetting: state.retention.retentionSetting,
    retentionRefusSetting: state.retention.retentionRefusSetting,
    resetFormRetention: state.casePage.resetRetentionForm,
    client: state.client
});

const mapDispatchToProps = {
    fetchAndStoreRetentionRefusSettings
}

export default connect(mapStateToProps, mapDispatchToProps)(RetentionMotifs)