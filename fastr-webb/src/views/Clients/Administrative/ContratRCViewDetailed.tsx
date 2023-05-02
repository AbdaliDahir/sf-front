import React, {useEffect} from 'react';
import {useParams} from "react-router";
import {fetchClient} from "../../../store/ClientContextSlice";
import {DataLoad} from "../../../context/ClientContext";
import {useDispatch} from "react-redux";
import Administrative from "./Administrative";

const ContratRCViewDetailed = (props) => {
    const dispatch = useDispatch();
    const {clientId, serviceId} = useParams();

    useEffect(() => {
        if (clientId && serviceId) {
            dispatch(fetchClient(clientId, serviceId, DataLoad.ONE_SERVICE, true));
        }
    }, [])

    return (
        <div>
            <Administrative/>
        </div>
    );
}

export default ContratRCViewDetailed
