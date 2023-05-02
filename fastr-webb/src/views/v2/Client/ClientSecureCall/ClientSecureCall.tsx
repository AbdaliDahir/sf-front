import {Address, Client} from "../../../../model/person";
import React, {useEffect, useState} from "react";
import {format} from "date-fns";
import {getClientFormattedPhones} from "../tools/utils.functions";
import cadenasLock from "../../../../img/ihmV2/cadenas-lock.svg";
import cadenasOpen from "../../../../img/ihmV2/cadenas_open.svg";
import checkIcon from "../../../../img/ihmV2/check.svg";
import {translate} from "../../../../components/Intl/IntlGlobalProvider";
import {ClientSecureCall, ClientSecureCallItem} from "./ClientSecureCall.interface";
import {Service} from "../../../../model";
import Switch from "../../../../components/Bootstrap/Switch";
import './ClientSecureCall.scss'
import {saveClientSecureCall} from "../../../../store/actions/ClientSecureCallActions";
import {useDispatch, useSelector} from "react-redux";
import {AppState} from "../../../../store";
interface ClientDataProps {
    clientData?: Client,
    currentService?: Service;
}

const ClientSecureCall = (props: ClientDataProps) => {
    const dispatch = useDispatch();
    const securedClients  = useSelector((state: AppState) => state.callsSecured.securedClients)
    const { clientData } = props;
    const { currentService } = props;
    const [clientInfo, setClientInfo] = useState<ClientSecureCall>();
    const [checkCaller, setCheckCaller] = useState<boolean>(false);
    const [secured, setSecured] = useState<boolean>(false);
    const changeCheckCaller =() => {
        setCheckCaller(!checkCaller)
    }
    useEffect(() => {
        const ClientSecuredFromStore = securedClients.filter(value => value.clientId === clientData?.id)
        if(ClientSecuredFromStore.length > 0){
            setSecured(true)
        }
    }, [securedClients])
    const changeSecured =() => {
        const clientsSecured= securedClients
        const id = clientData?.id??''
        clientsSecured.push({clientId: id, secured: true})
        dispatch(saveClientSecureCall(clientsSecured))
        setSecured(true)
    }
    useEffect(() => {
        if (clientData) {
            clientInfoFactory(clientData);
        }
    }, [clientData])

    const getFormatedDate= (date: string) => {
        return   date ? (format(new Date(date), 'dd/MM/yyyy')) : ''

    }
    const getAddress = (address?: Address) => {
        return `${address?.address1} ${address?.zipcode} ${address?.city}`
    }
    const getBankName=() => {
        return  currentService?.billingAccount?.sepaMethod?.bankName?? 'Autre méthode'

    }

    const clientInfoFactory = (client: Client) => {
        const result: ClientSecureCall = {
            birthDate: {
                value: client.corporation ? getFormatedDate(client.ownerCorporation?.legalCreationDate) : getFormatedDate(client.ownerPerson.birthDate),
                title: translate.formatMessage({id: "call.user.birthDate"}),
            },
            birthPlace: {
                value: client.ownerPerson.birthDepartment?? '',
                title: translate.formatMessage({id: "call.user.birthPlace"}),
            },
            address: {
                value: getAddress(!client.corporation ? client.ownerPerson?.address : client.ownerCorporation?.address),
                title: translate.formatMessage({id: "call.user.address"}),
            },
            email: {
                value: client.contactEmail,
                title: translate.formatMessage({id: "call.user.email"}),
            },
            contactNumber: {
                value: getClientFormattedPhones(client),
                title:translate.formatMessage({id: "call.user.contactNumber"}) ,
            },
            banqueName: {
                value: getBankName(),
                title: translate.formatMessage({id: "call.user.banqueName"}),
            },

        }
        setClientInfo(result);
    }
    return (
        <div className='pt-2'>
            <div className='pl-2 border-2'>
                <img src={secured ? cadenasLock: cadenasOpen} className='mr-3' />
                <label className='secure-call-title'>{translate.formatMessage({id: "call.user.title"})}</label>
                {!checkCaller && !secured && <div className="ml-5">
                    <Switch name={'secureCall'} id={'secureCall'}
                            color="primary"
                            thickness={"xs"}
                            onChange={changeCheckCaller}
                            checked={checkCaller}
                    />
                </div>}
            </div>

            {checkCaller && !secured &&  <div className='w-100 pl-2 pt-3 pb-2'>
                {clientInfo && Object.keys(clientInfo).map(key => {
                    const item: ClientSecureCallItem = clientInfo[key];
                    return (
                        <>
                            <div className='d-flex border-bottom '>
                                <div className="d-flex w-75  flex-column">
                                    <span className="d-flex flex-column justify-content-center font-weight-bold">
                                        {item.title}
                                    </span>
                                    <div className={'d-flex flex-column justify-content-center'}>
                                        {item.value}
                                    </div>
                                </div>
                                <input className="mt-2 ml-3 cursor-pointer" type="checkbox"/>
                            </div>
                        </>
                    )
                })}
                <div className='d-flex w-100 border-bottom cursor-pointer mt-2'
                    onClick={changeSecured}>
                    <img src={checkIcon} className='mr-2'/>
                    <span> Valider la sécurisation</span>
                </div>
            </div>}
        </div>
    )

}
export default ClientSecureCall