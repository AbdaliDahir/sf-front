import * as React from "react";
import {RouteComponentProps} from "react-router";
import {Jumbotron} from "reactstrap";

interface Props extends RouteComponentProps<void> {
}

export default class ErrorPage extends React.Component<Props> {

    public render(): JSX.Element {
        const {location} = this.props;
        return (
            <Jumbotron>
                <h1>{location.state.title}</h1>
                <p>{location.state.message}</p>
            </Jumbotron>
        );
    }
}