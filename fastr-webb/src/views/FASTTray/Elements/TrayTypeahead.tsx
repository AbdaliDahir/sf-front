import * as React from 'react';
import {AsyncTypeahead} from "react-bootstrap-typeahead";
import CaseService from "../../../service/CaseService";


interface Props {
    id: string
    onChange?: (selected) => void
    placeholder: string
    activityCodeSelected: string
}

interface State {
    loading: boolean
    values: string[]
}

const caseService = new CaseService(true);

export default class TrayTypeahead extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            loading: false,
            values: []
        }
    }

    public onSearch = async query => {
        this.setState({loading: true})
        try {
            const options: string[] = await caseService.getLoginsWithPrefixAndActivity(query, this.props.activityCodeSelected)
            this.setState({
                loading: false,
                values: options
            })
        } catch (e) {
            console.error(e)
            this.setState({loading: false})
        }

    }


    public render(): JSX.Element {
        return (
            <AsyncTypeahead isLoading={this.state.loading}
                            onSearch={this.onSearch}
                            minLength={3}
                            options={this.state.values}
                            {...this.props}
            />
        );
    }

}