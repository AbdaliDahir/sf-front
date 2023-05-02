import queryString, { ParsedUrlQuery } from 'querystring';
import React, { useEffect, useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { ApplicationMode } from 'src/model/ApplicationMode';
import SessionService from 'src/service/SessionService';
import { AppState } from 'src/store';
import { useTypedSelector } from '../Store/useTypedSelector';

const SessionGuard = (({ component: Component, ...rest }) => {
    const queryParams = rest?.location?.search;
    const [isAuth, setisAuth] = useState(true);
    const sessionIsFrom = useTypedSelector((state: AppState) => state.store.applicationInitialState.sessionIsFrom)
    const handleSession = async (queryParams: string) => {
        const query: ParsedUrlQuery = queryString.parse(queryParams.replace("?", ""));
        const session: string = SessionService.getSession();

        if (query?.sessionId && query?.sessionId !== session) {
            const newSession = query.sessionId.toString();
            return SessionService.checkSession(newSession)
                .then((r) => {
                    if (r.ok) {
                        SessionService.registerSession(newSession);
                        return newSession;
                    } else {
                        SessionService.clearSession();
                        return undefined;
                    }
                })
                .catch(() => {
                    SessionService.clearSession()
                    return undefined;
                })
        }

        if (session) {
            return SessionService.checkSession(session)
                .then((r) => {
                    if (r.ok) {
                        return session;
                    } else {
                        SessionService.clearSession()
                        return undefined;
                    }
                })
                .catch(() => {
                    SessionService.clearSession()
                    return undefined;
                })
        }

        return undefined;
    }
    useEffect(() => {
        handleSession(queryParams)
            .then((session) => {
                if (!session && sessionIsFrom !== ApplicationMode.DISRC) {
                    setisAuth(false);
                }
            })

    }, [])
    return (
        <Route {...rest} render={(props) => (
            isAuth
                ? <Component {...props} />
                : <Redirect to='/accesDenied' />
        )} />
    )
})

export default SessionGuard