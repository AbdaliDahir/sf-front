import * as React from "react";
import {RouteComponentProps} from "react-router";


/**
 * Allow to define a page without session check
 *
 * @param P Props of the page
 * @param S State of the page
 * @param PARAM query parameters that the page will receive into the match property
 */
export default abstract class FastrPage<P extends RouteComponentProps<PARAM>, S, PARAM> extends React.Component<P, S> {


}