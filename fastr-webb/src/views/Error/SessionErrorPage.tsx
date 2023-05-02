import * as React from "react";
import {Redirect} from "react-router";
import {translate} from "../../components/Intl/IntlGlobalProvider";

export const ExpiredSessionErrorPage = () => {
    return <Redirect to={{
        pathname: "/error",
        state: {
            message: translate.formatMessage({id: "session.invalid.message"}),
            title: translate.formatMessage({id: "session.invalid.title"})
        }
    }}/>;
}