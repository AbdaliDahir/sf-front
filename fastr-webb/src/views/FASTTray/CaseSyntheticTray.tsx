import * as React from 'react';
import {RouteComponentProps} from "react-router";
import FastrPage from "../../components/Pages/FastrPage";
import CaseTrayContainer from "./CaseTrayContainer";
import SessionService from "../../service/SessionService";


class CaseSyntheticTray extends FastrPage<RouteComponentProps<void>, object, void> {
    public render() {
        return (
            <div>
                <CaseTrayContainer sessionId={SessionService.getSession()}/>
            </div>
        );
    }
}

export default CaseSyntheticTray;
