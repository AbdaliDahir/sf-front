import * as React from 'react';
import CaseService from 'src/service/CaseService';
import {Activity} from "../../model/Activity"
import CaseTrayContainer from "./CaseTrayContainer";
import SessionService from "../../service/SessionService";
import {SessionStorageKeys} from "../../model/TableFilters/SessionStorageKeys";
import {CaseFilters} from "../../model/TableFilters/cases/CaseFilters";
import {Base64} from "js-base64";
import {AppState} from "../../store";
import {
 updateSite
} from "../../store/actions";
import {connect} from "react-redux";


interface State {
    selectedCases: string[]
    selectedLogin: string
}
interface CaseDetailedProps {
    updateSite,
    userActivity: Activity
}


const caseService = new CaseService(true);

 class CaseDetailedTray extends React.Component<CaseDetailedProps, State> {
    constructor(props: CaseDetailedProps) {
        super(props);
        this.state = {
            selectedCases: [],
            selectedLogin: "",
        }
    }

    public componentDidMount() {
        if(this.props.userActivity && this.props.userActivity!.code){
            const encodedSessionStorageFilters = sessionStorage.getItem(this.props.userActivity!.code+SessionStorageKeys.DOSSIERS)
            if(encodedSessionStorageFilters !== null) {
                const sessionStorageFilters: CaseFilters = JSON.parse(Base64.decode(encodedSessionStorageFilters))
                if(sessionStorageFilters.site){
                    this.props.updateSite(sessionStorageFilters.site)
                }
            }
        }
    }

    public onSelectCase = (rows, isSelect) => {
        const rowIds = rows.map(row => row.caseId);
        if(rowIds[0] === undefined && !isSelect){
            return this.setState( {
                selectedCases: []
            })
        }
        if (isSelect) {
            this.setState(prevState => {
                return {
                    selectedCases: [...prevState.selectedCases, ...rowIds],
                }
            })
        } else {
                this.setState(prevState => {
                    const newSelectedCases = prevState.selectedCases.filter(selectedCase => rowIds.indexOf(selectedCase) === -1);
                    return {
                        selectedCases: newSelectedCases
                    }
                })
        }
    }

    public onChangeTypeahead = (selected) => {
        this.setState({
            selectedLogin: selected[0]
        })
    }

    public assignCasesByLogin = async (activitySelected: Activity) => {
        return await caseService.assignCasesByLogin(activitySelected, this.state.selectedCases, this.state.selectedLogin);
    }

    public render() {
        return (
            <CaseTrayContainer detailed
                           onSelectCase={this.onSelectCase}
                           onChangeTypeahead={this.onChangeTypeahead}
                           onAssignSupervisor={this.assignCasesByLogin}
                           selectedCases={this.state.selectedCases}
                           selectedLogin={this.state.selectedLogin}
                           sessionId={SessionService.getSession()}
            />
        );
    }

}
const mapStateToProps = (state: AppState) => ({
    userActivity: state.store.applicationInitialState.user?.activity,

})
const mapDispatchToProps = dispatch => (
    {
        updateSite: (site) => dispatch(updateSite(site)),
    }
)
export default connect(mapStateToProps, mapDispatchToProps)(CaseDetailedTray)
