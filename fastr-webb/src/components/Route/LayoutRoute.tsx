import {Route} from "react-router";
import * as React from "react";


// tslint:disable-next-line:no-any
const LayoutRoute = ({component: Component, layout: Layout, ...rest}: any) => {

    // tslint:disable-next-line:no-any
    const render = (props: any) => (
        <Layout>
            <Component {...props} />
        </Layout>
    );

    return (
        <Route {...rest} render={render}/>
    )
};

export default LayoutRoute;
