import * as React from 'react';
import {RouteComponentProps} from "react-router";
import FastrPage from "../../components/Pages/FastrPage";
import SessionService from "../../service/SessionService";
import ActionTrayContainer from "./ActionTrayContainer";
import {Activity} from "../../model/Activity";
import CaseService from "../../service/CaseService";
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

class ActionsTray extends FastrPage<Props, State, void> {
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

    public assignActionsByLogin = async (activitySelected: Activity) => {
        return await caseService.assignActionByLogin(activitySelected, this.state.selectedActions, this.state.selectedLogin);
    }
    public render() {
        const accessBannetteActions = this.props.authorizations.includes("ACCESS_BANNETTE_ACTIONS");
        return (
            <React.Fragment>
                {accessBannetteActions ?
                    <ActionTrayContainer detailed
                                       onSelectAction={this.onSelectAction}
                                       onChangeTypeahead={this.onChangeTypeahead}
                                       onAssignSupervisor={this.assignActionsByLogin}
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

export default connect(mapStateToProps, null)(ActionsTray)
