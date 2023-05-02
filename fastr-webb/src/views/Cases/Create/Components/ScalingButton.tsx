import React, {Component} from 'react';
import {FormattedMessage} from "react-intl";
import {connect} from "react-redux";
import {Button, UncontrolledTooltip} from "reactstrap";
import {AppState} from "../../../../store";
import {
    setScalingEligibilityFalse,
    setScalingEligibilityTrue,
    setScalingToTrue
} from "../../../../store/actions/CasePageAction";
import Loading from "../../../../components/Loading";
import CaseService from "../../../../service/CaseService";
import {CasesQualificationSettings} from "../../../../model/CasesQualificationSettings";
import {NotificationManager} from "react-notifications";

interface Props {
    setScalingToTrue: () => void
    isQualificationSelected: boolean
    scalingEligibility: boolean
    authorizations: Array<string>
    loading: boolean
    client
    qualificationLeaf
    sessionId:string
    isCreation:boolean
    fromQA?:boolean
}

interface State {
    enabledButton :boolean
}


class ScalingButton extends Component<Props,State> {

    private caseService: CaseService = new CaseService(true);
    public accessCount: Number;

    constructor(props) {
        super(props)
        this.accessCount =0;
        this.state = {
            enabledButton: this.props.isCreation
        }
    }

//TODO : contrainte de temps: peut mieux faire.
    public  componentDidUpdate  = async () =>{
        if(this.props.sessionId && this.props.qualificationLeaf &&
            this.props.qualificationLeaf.themes && this.props.qualificationLeaf.themes.length>0 && this.accessCount ==0) {
            try {
                this.accessCount =1;
                const retrievedTheme: Array<CasesQualificationSettings> =
                    await this.caseService.getRootThemes(
                        this.props.qualificationLeaf.code,this.props.sessionId,
                        this.props.client.service.serviceType);
                if (retrievedTheme && retrievedTheme.length>0) {
                        this.setState({enabledButton:true})
                    } else {
                        this.setState({enabledButton:false})
                    }
            } catch (e) {
                NotificationManager.error(<FormattedMessage id="cases.create.scaling.get.root.themes"/>);
                return false;
            }
        }
        return false;
    }

    private updateScalingStatus = ()=>{
        this.props.setScalingToTrue();
    }

    public render() {
        const isClientFixe = this.props.client.service && this.props.client.service.category === "FIXE"
        const {scalingEligibility, isQualificationSelected, authorizations, fromQA} = this.props
        if (this.props.loading) {
            return (<Loading/>)
        } else {
            return (
                <React.Fragment>
                    <UncontrolledTooltip placement="bottom" target="scalingButton">
                        <FormattedMessage id="cases.create.transfer.backOffice"/>
                    </UncontrolledTooltip>
                    <Button id="scalingButton" size="lg" type="button" color="secondary"
                            className="bg-white"
                            onClick={this.updateScalingStatus}
                            disabled={!scalingEligibility || !isQualificationSelected || (isClientFixe && authorizations.indexOf("isActiviteBeBCoFixe") === -1)
                            ||!this.state.enabledButton || fromQA}>
                        <FormattedMessage id="cases.create.scale"/>
                    </Button>
                </React.Fragment>
            )
        }
    }
}

const mapStateToProps = (state: AppState) => ({
    isQualificationSelected: state.casePage.isQualificationSelected,
    scalingEligibility: state.casePage.scalingEligibility,
    loading: state.casePage.isLoadingScalingEligibility,
    authorizations: state.authorization.authorizations,
    client: state.client,
    fromQA: state.payload.payload.fromQA
})

const mapDispatchToProps = {
    setScalingToTrue,
    setScalingEligibilityTrue,
    setScalingEligibilityFalse,
}

export default connect(mapStateToProps, mapDispatchToProps)(ScalingButton)
