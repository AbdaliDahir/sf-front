import * as React from 'react';
import {ButtonDropdown, DropdownItem, DropdownMenu, DropdownToggle} from "reactstrap";
import {Activity} from "../../../model/Activity";


interface Props {
    onClick: (e) => void
    activitySelected: string
    activities: Activity[]
    btnClassName?: string
}

interface State {
    dropdownOpen: boolean,

}

export default class ActivityDropdown extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            dropdownOpen: false
        }
    }


    public toggle = () => {
        this.setState(prevstate => ({
            dropdownOpen: !prevstate.dropdownOpen
        }))
    };

    public renderActivityItems: () => JSX.Element[] = () => {
        const activityItems: JSX.Element[] = [];
        this.props.activities.forEach((activity) => {
            activityItems.push(<DropdownItem key={activity.code} value={activity.label}
                                             onClick={this.props.onClick}>{activity.label}</DropdownItem>)
        });
        return activityItems
    };


    public render() {
        return (

            <ButtonDropdown id="activityDropDown.toggle.button.id"  isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                <DropdownToggle color="primary"
                                outline caret
                                className={this.props.btnClassName}
                                size="sm">
                    {this.props.activitySelected ? this.props.activitySelected : "Activités"}
                </DropdownToggle>
                <DropdownMenu>
                    {this.renderActivityItems()}
                </DropdownMenu>
            </ButtonDropdown>
        );
    }
}
