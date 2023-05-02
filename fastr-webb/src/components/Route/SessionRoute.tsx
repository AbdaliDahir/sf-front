import * as React from "react";
import {ClassType} from "react";
import {Redirect, Route, RouteComponentProps} from "react-router";
import * as queryString from "querystring";
import {ParsedUrlQuery} from "querystring";

// Components
import SessionService from "../../service/SessionService";
import {BlockingContextInterface} from "../../views/App";
import {ExpiredSessionErrorPage} from "../../views/Error/SessionErrorPage";

interface Props {
    // tslint:disable-next-line:no-any
    component: ClassType<any, any, any>;
    path: string;
    exact: boolean,
    block?: BlockingContextInterface,
    shouldRedirectToLogin?: boolean,
    ready: boolean
}

interface State {
    error: boolean
}

// tslint:disable-next-line:no-any (Pas le choix, le composant peut prendre n'importe quoi en props)
export default class SessionRoute extends React.Component<Props & any, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            error: false
        }
    }

    public handleSession(queryParams: string): string | undefined {
        const query: ParsedUrlQuery = queryString.parse(queryParams.replace("?", ""));
        if (query === undefined || query.sessionId === undefined) {
            return SessionService.getSession() ? SessionService.getSession() : undefined;
        }
        SessionService.registerSession(query.sessionId.toString());
        return query.sessionId.toString()
    }

    public checkForSession(sessionId: string) {
        SessionService.checkSession(sessionId).then(e => {
            if (!e.ok) {
                SessionService.clearSession();
                this.setState({
                    error: true
                })
            }
        });
    }

    public renderPageWithSession = (props: RouteComponentProps) => {
        const sessionid: string | undefined = this.handleSession(props.location.search);
        if (!sessionid) {
            return (
                this.props.shouldRedirectToLogin ?
                <Redirect to={{
                    pathname: "/login"
                }}/>
                :
                ExpiredSessionErrorPage()
            )
        } else {
            this.checkForSession(sessionid);
            return React.createElement(this.props.component, {...props, ...this.props});
        }
    };

    public render(): JSX.Element {
        return this.props.ready ? <div>
            {this.state.error && ExpiredSessionErrorPage()}
            <Route exact={this.props.exact} path={this.props.path} render={this.renderPageWithSession}/>
        </div> : <React.Fragment/>
    }
}