import * as React from "react";
import {FormattedMessage} from "react-intl";
import {FormGroup} from "reactstrap";
import Label from "reactstrap/lib/Label";
import {translate} from "../../../../components/Intl/IntlGlobalProvider";
import FormSelectInput from "../../../Form/FormSelectInput";
import ValidationUtils from "../../../../utils/ValidationUtils";
import {AppState} from "../../../../store";
import {connect} from "react-redux";
import {Case} from "../../../../model/Case";

interface Props {
    showCaseResolutionReminderComponents: boolean,
    retrievedCase: Case,
    name?: string
}

interface State {
    addContactForNote: boolean
}

// Motifs de relance de résolution de dossier
export enum dunningTriggersForUnresolved {
    NEW_INFORMATION = "NEW_INFORMATION",
    DISAGREEMENT = "DISAGREEMENT",
}

export enum dunningTriggersForResolved {
    NEW_INFORMATION = "NEW_INFORMATION",
    DISAGREEMENT = "DISAGREEMENT"
}

// Relance de résolution de dossier
class ResolutionDunningTriggers extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            addContactForNote: true,
        }
    }

    public renderDunningTriggersOptionList = (): JSX.Element[] => {
        const triggers: Array<JSX.Element> = [];
        const isUnresolved = this.props.retrievedCase.status === "UNRESOLVED"
        const isResolved = this.props.retrievedCase.status === "RESOLVED"
        if (isUnresolved) {
            for (const dunningTrigger of Object.keys(dunningTriggersForUnresolved)) {
                triggers.push(
                    <option value={translate.formatMessage({id: "cases.resolution.dunning.trigger." + dunningTrigger})}
                            key={dunningTrigger}>{translate.formatMessage({id: "cases.resolution.dunning.trigger." + dunningTrigger})}</option>)
            }
        }
        if (isResolved) {
            for (const dunningTrigger of Object.keys(dunningTriggersForResolved)) {
                triggers.push(
                    <option value={translate.formatMessage({id: "cases.resolution.dunning.trigger." + dunningTrigger})}
                            key={dunningTrigger}>{translate.formatMessage({id: "cases.resolution.dunning.trigger." + dunningTrigger})}</option>)

            }
        }
        return triggers;
    }

    public render(): JSX.Element {
        const {showCaseResolutionReminderComponents} = this.props
        if (showCaseResolutionReminderComponents) {
            return (<FormGroup>

                    <Label for="dunningTrigger"><FormattedMessage
                        id="cases.resolution.dunning.trigger"/><span className="text-danger">*</span></Label>

                    <FormSelectInput name="dunningTrigger" id="dunningTrigger"
                                     validations={{isRequired: ValidationUtils.notEmpty}}>
                        <option/>
                        {this.renderDunningTriggersOptionList()}
                    </FormSelectInput>
                </FormGroup>
            )
        } else {
            return (<div/>)
        }
    }


}

const mapStateToProps = (state: AppState) => ({
    showCaseResolutionReminderComponents: state.modalManager.showCaseResolutionDunningComponents,
    retrievedCase: state.case.currentCase,
})

export default connect(mapStateToProps)(ResolutionDunningTriggers)

