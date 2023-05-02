import React, {Component} from 'react';
import {FormattedMessage} from "react-intl";
import {connect} from "react-redux";
import {Button} from "reactstrap";
import {AppState} from "../../../../store";
import {
    setForceAutoAssignFalse,
    setFormMaxellComplete,
    setIsWithAutoAssignTrue,
    setIsFromAutoAssignTrue,
    setScalingToFalse,
    setValidRoutingRule
} from "../../../../store/actions/CasePageAction";
import {CasesQualificationSettings} from "../../../../model/CasesQualificationSettings";
import {CaseRoutingRule} from "../../../../model/CaseRoutingRule";


interface Props {
    isAutoAssignEnabled: boolean
    isFormsyValid: boolean
    setIsWithAutoAssignTrue: () => void
    setIsFromAutoAssignTrue: () => void
    setScalingToFalse: () => void
    setValidRoutingRule: (validRoutingRule?: CaseRoutingRule) => void
    setFormMaxellComplete: () => void
    theme: CasesQualificationSettings
    authorizations
    forceAutoAssign
    setForceAutoAssignFalse
    isAutoAssignButtonDisabled
}


class CaseScalingButtons extends Component<Props> {

    public onCancelScaling = () => {
        this.props.setScalingToFalse();
        this.props.setFormMaxellComplete(); // reset maxwell form state checking
        this.props.setValidRoutingRule(undefined);
    };

    public render() {
        const isActiviteBeBCoFixe = this.props.authorizations.indexOf("isActiviteBeBCoFixe ") !== -1
        return (
            <React.Fragment>
                <Button id="caseNavbar.scalingMode.transfer.button.id" size="lg" className="mr-2 bg-white" color="secondary"
                        onClick={this.onCancelScaling}>
                    <FormattedMessage id="cases.create.transfer.scaling.cancel"/>
                </Button>
                {this.props.theme && !this.props.theme.incident && this.props.forceAutoAssign ?
                    <Button id="caseNavbar.scalingMode.submit.button.id" type="submit" size="lg" className="mr-2 bg-white"
                            color="secondary"
                            disabled={(!this.props.isFormsyValid || !this.props.isAutoAssignEnabled || this.props.isAutoAssignButtonDisabled) && !isActiviteBeBCoFixe}
                            onClick={this.setIsWithAutoAssignTrueAndDisableForceUpdate}>
                        <FormattedMessage id="cases.create.transfer.autoAssign"/>
                    </Button>
                    : <React.Fragment/>}
            </React.Fragment>
        )
    }

    public setIsWithAutoAssignTrueAndDisableForceUpdate = () => {
        this.props.setIsFromAutoAssignTrue()
        this.props.setIsWithAutoAssignTrue()
        this.props.setForceAutoAssignFalse()
    }

}

const mapStateToProps = (state: AppState) => ({
    isFormsyValid: state.casePage.isFormsyValid,
    isAutoAssignEnabled: state.casePage.isAutoAssignEnabled,
    theme: state.casePage.theme,
    authorizations: state.authorization.authorizations,
    isAutoAssignButtonDisabled: state.casePage.isAutoAssignButtonDisabled
})

const mapDispatchToProps = {
    setScalingToFalse,
    setIsWithAutoAssignTrue,
    setIsFromAutoAssignTrue,
    setValidRoutingRule,
    setFormMaxellComplete,
    setForceAutoAssignFalse
}

export default connect(mapStateToProps, mapDispatchToProps)(CaseScalingButtons)
