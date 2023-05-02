import * as React from "react";
import * as moment from "moment";
import 'moment/locale/fr';

interface Props {
    title: string
    active?: boolean
    finish?: boolean
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
    date?: string
}


export default class StepbarItem extends React.Component<Props, object> {

    public getStatusClass(): string {
        return this.props.active ? "active" : "";

    }

    public render(): JSX.Element {
        const {title, date} = this.props;
        let stepDate = "";
        let formatDate = "";
        if(date && title !== 'Félicitations'){ // Jira 4653
            stepDate = date.substring(5);
            formatDate = moment(stepDate, 'DD MMMM YYYY').format('DD/MM/YYYY');
        }
        return (
            <div onClick={this.props.onClick ? this.props.onClick : undefined} className={`cursor-pointer stepbar-item ${this.getStatusClass()}`}>
                <div  className="stepbar-title">{title}</div>
                <div  className="stepbar-title">{date ? formatDate : ""}</div>
            </div>
        );
    }
}
