import React from "react"
import {Container, UncontrolledPopover} from "reactstrap"
import fastLogo from "../../../img/fastLogoShort.png"
import "./AppExtPopover.css"
import {ClientContextSliceState} from "../../../store/ClientContextSlice";
import {useTypedSelector} from "../../../components/Store/useTypedSelector";
import {NotificationManager} from "react-notifications";

export interface AppExtProps {
    target: string,
    clientContext?: ClientContextSliceState
}

const AppExtPopover = (props: AppExtProps) => {

    const fastUri = process.env.REACT_APP_FAST_URL
    const {clientContext} = props;
    const client: ClientContextSliceState = clientContext ? clientContext : useTypedSelector(state => state.store.clientContext);
    const {service} = client;

    const debranchFast = () => {
        if (service?.id && fastUri) {
            const form = document.createElement("form");
            form.setAttribute("method", "post");
            form.setAttribute("action", fastUri);

            form.setAttribute("target", "view");

            const hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", "idservice");
            hiddenField.setAttribute("value", service?.id);
            form.appendChild(hiddenField);
            document.body.appendChild(form);

            const openedFast = window.open(fastUri, 'view');
            window.addEventListener("beforeunload", () => {
                    openedFast?.close();
                }
            );

            form.submit();
        } else {
            NotificationManager.error("Aucune fiche client ouverte");
        }
    }

    return (
        <UncontrolledPopover target={props.target}
                             trigger="click"
                             placement="bottom">
            <Container className={"AppExtContainer"}>

                <button className="btn btn-secondary mr-1" onClick={debranchFast}><img
                    className={"appExtImg"} alt={"FAST"} src={fastLogo}/></button>

            </Container>
        </UncontrolledPopover>
    )
}

export default AppExtPopover
