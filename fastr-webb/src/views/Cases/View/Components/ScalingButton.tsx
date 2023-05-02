import React, {Component} from 'react';
import {connect} from "react-redux";
import {FormattedMessage} from "react-intl";
import {AppState} from "../../../../store";
import {
    setScalingToTrue
} from "../../../../store/actions";
import {Button, UncontrolledTooltip} from "reactstrap";
import {CasesQualificationSettings} from "../../../../model/CasesQualificationSettings";
import SessionService from "../../../../service/SessionService";

interface Props {
    setScalingToTrue: () => void,
    qualification: CasesQualificationSettings,
    authorizations: Array<string>,
    client
    location
    qualificationLeaf
    fromQA?:boolean
}

interface State {
    dropdownOpen: boolean
}

// tslint:disable-next-line:no-any
class ScalingButton extends Component<Props, State> {


    public accessCount: number;
    public sessionId: string;

    constructor(props){
        super(props)
        this.accessCount =0;
        this.sessionId = SessionService.getSession();
        this.state = {
            dropdownOpen: false,
        }
    }
    public toggle = () => {
        this.setState(prevState => ({dropdownOpen: !prevState.dropdownOpen}));
    }





    public render() {
        const {authorizations, fromQA} = this.props
        const isClientFixe = this.props.client.service && this.props.client.service.category === "FIXE";
        const isBebCoFixeEnabled =  (isClientFixe && authorizations.indexOf("isActiviteBeBCoFixe") === -1)
        const scalingEligibility = this.props.qualificationLeaf && this.props.qualificationLeaf.themes && this.props.qualificationLeaf.themes.length>0;
        const disabled = !scalingEligibility || isBebCoFixeEnabled || fromQA

        return (
            <React.Fragment>
                <UncontrolledTooltip placement="bottom" target="scalingButton">
                    <FormattedMessage id="cases.create.transfer.backOffice"/>
                </UncontrolledTooltip>
                <Button id="scalingButton" className="ml-2 bg-white" size="lg" type="button"
                        color="secondary"
                        onClick={this.props.setScalingToTrue}
                        disabled={disabled}>
                    <FormattedMessage id="cases.create.scale"/>
                </Button>
            </React.Fragment>
        )
    }
}

const mapDispatchToProps = {
    setScalingToTrue
}

const mapStateToProps = (state: AppState) => ({
    authorizations: state.authorization.authorizations,
    qualification: state.case.currentCaseQualification,
    qualificationLeaf: state.casePage.qualificationLeaf,
    client: state.client,
    fromQA: state.payload.payload.fromQA
})

export default connect(mapStateToProps, mapDispatchToProps)(ScalingButton)
