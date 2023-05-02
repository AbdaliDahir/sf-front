import * as queryString from "querystring";
import {ParsedUrlQuery} from "querystring";
import {ReactNode} from "react";
import {RouteComponentProps} from "react-router";
import FastrPage from "./FastrPage";
import payloadSlice from "../../store/PayloadSlice";
import {store} from "../../index";


/**
 * Allow to define a page with session check.
 * The page will take a encoded base64 payload into parameter, and decode it when it has been receive
 *
 * @param P Props of the page
 * @param S State of the page
 * @param PL Payload object sended by the caller
 */
export default abstract class FastrPayloadPage<P extends RouteComponentProps<PARAM>, S, PL, PARAM> extends FastrPage<P, S, PARAM> {
    public payload: Readonly<{ children?: ReactNode }> & Readonly<PL>;

    constructor(props: P) {
        if (props.location !== undefined) {
            const query: ParsedUrlQuery = queryString.parse(props.location.search.replace("?", ""));
            if (!query.payload) {
                throw new Error("The payload is absent from the query string. If your page does not require a Payload, use FastrPage instead.")
            }

            const urlPayload: PL = JSON.parse(decodeURIComponent(escape(atob(query.payload.toString().replace(" ", "+")))));
            super(props);
            if (!store.getState().payload.payload?.idClient) {
                store.dispatch(payloadSlice.actions.definePayload(urlPayload))
            }
            this.payload = urlPayload;

        } else {
            super(props)
        }
    }
}