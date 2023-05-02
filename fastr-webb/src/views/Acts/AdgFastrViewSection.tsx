import React, {Component} from 'react';
import {connect} from "react-redux";

import {Case} from "../../model/Case";
import EditRetentionData from "./Retention/EditRetentionData";
import {AppState} from "../../store";
import {ACT_ID} from "../../model/actId";
import {retrieveLastResource} from "../../utils/CaseUtils";
import {ResourceType} from "../../model/ResourceType";
import GenericCardToggle from "../../components/Bootstrap/GenericCardToggle";
import AntiChurnData from "./AntiChurn/AntiChurnData";
import {CaseResource} from "../../model/CaseResource";

interface State {
    adgTitle: string
    resourceAdg: CaseResource | undefined

}

interface Props {
    currentCase: Case
    resourceType?: ResourceType,
    resourceDescription?: string
    opened?: boolean
}

class AdgFastrViewSection extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            adgTitle: "retention.section.title",
            resourceAdg: undefined
        }
    }

    public componentDidMount() {

        if (this.props.resourceType && this.props.resourceDescription) {
            const resourcesAdgFastr = retrieveLastResource(this.props.currentCase, this.props.resourceType, this.props.resourceDescription)
            this.setState({resourceAdg: resourcesAdgFastr})
            if (resourcesAdgFastr) {
                switch (resourcesAdgFastr.description) {
                    case(ACT_ID.ADG_RETENTION):
                        this.setState({adgTitle: "retention.section.title"})
                        break;
                    case(ACT_ID.ADG_ANTICHURN):
                        this.setState({adgTitle: "antichurn.section.title"})
                        break;
                }
            }
        }
    }

    public renderAdgFastr = () => {
        const {resourceAdg} = this.state;
        if (resourceAdg) {
            switch (resourceAdg.description) {
                case(ACT_ID.ADG_RETENTION):
                    return <EditRetentionData context="ViewCasePage" idAct={resourceAdg.id}/>
                case(ACT_ID.ADG_ANTICHURN):
                    return <AntiChurnData context="ViewCasePage" idAct={resourceAdg.id}/>
                default:
                    return (<React.Fragment/>)
            }
        } else {
            return (<React.Fragment/>)
        }
    }

    public render(): JSX.Element {

        return this.state.resourceAdg ? (
            <GenericCardToggle title={this.state.adgTitle} icon={"icon-contract"} isExpanded={this.props.opened}>
                {
                    this.renderAdgFastr()
                }
            </GenericCardToggle>
        ) : (<React.Fragment/>)
    }
}

function mapStateToProps(state: AppState) {
    return {
        currentCase: state.case.currentCase
    }
}

export default connect(mapStateToProps, null)(AdgFastrViewSection)
