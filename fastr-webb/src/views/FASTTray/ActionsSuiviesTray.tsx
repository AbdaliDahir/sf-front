import * as React from 'react';
import {RouteComponentProps} from "react-router";
import FastrPage from "../../components/Pages/FastrPage";
import SessionService from "../../service/SessionService";
import {Activity} from "../../model/Activity";
import CaseService from "../../service/CaseService";
import ActionsSuiviesTrayContainer from "./ActionsSuiviesTrayContainer";
import {connect} from "react-redux";
import {AppState} from "../../store";

interface State {
    selectedActions: string[]
    selectedLogin: string
}

interface Props extends RouteComponentProps<void> {
    authorizations: Array<string>
}

const caseService = new CaseService(true);

class ActionsSuiviesTray extends FastrPage<Props, State, void> {
    constructor(props: Props) {
        super(props);
        this.state = {
            selectedActions: [],
            selectedLogin: "",
        }
    }

    public onSelectAction = (rows, isSelect) => {
        const rowIds = rows.map(row => row.actionId);
        if(rowIds[0] === undefined && !isSelect){
            return this.setState( {
                selectedActions: []
            })
        }
        if (isSelect) {
            this.setState(prevState => {
                return {
                    selectedActions: [...prevState.selectedActions, ...rowIds],
                }
            })
        } else {
            this.setState(prevState => {
                const newSelectedActions = prevState.selectedActions.filter(selectedAction => rowIds.indexOf(selectedAction) === -1);
                return {
                    selectedActions: newSelectedActions
                }
            })
        }
    }

    public onChangeTypeahead = (selected) => {
        this.setState({
            selectedLogin: selected[0]
        })
    }

    public assignActionsMonitoringByLogin = async (activitySelected: Activity) => {
        return await caseService.assignActionMonitoringByLogin(activitySelected, this.state.selectedActions, this.state.selectedLogin);
    }

    public render() {
        const accessBannetteActionsSuivies = this.props.authorizations.includes("ACCESS_BANNETTE_SUIVI_ACTIONS");
        return (
            <React.Fragment>
                {accessBannetteActionsSuivies ?
                    <ActionsSuiviesTrayContainer detailed
                                                 onSelectAction={this.onSelectAction}
                                                 onChangeTypeahead={this.onChangeTypeahead}
                                                 onAssignSupervisor={this.assignActionsMonitoringByLogin}
                                                 selectedActions={this.state.selectedActions}
                                                 selectedLogin={this.state.selectedLogin}
                                                 sessionId={SessionService.getSession()}/>
                    : <div className='d-flex justify-content-center align-items-center font-weight-bold mt-5'>Activité non habilitée</div>
                }
            </React.Fragment>

        );
    }
}

const mapStateToProps = (state: AppState) => ({
    authorizations: state.store.applicationInitialState.authorizations
})

export default connect(mapStateToProps, null)(ActionsSuiviesTray)

