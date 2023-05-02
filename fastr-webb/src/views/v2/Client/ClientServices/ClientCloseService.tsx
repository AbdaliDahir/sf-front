import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useTypedSelector } from 'src/components/Store/useTypedSelector';
import { CloseService } from 'src/model';
import { DataLoad } from 'src/store/actions/ClientContextActions';
import { fetchAndStoreClientV2 } from 'src/store/actions/v2/client/ClientActions';
import { phoneFormatter } from '../tools/utils.functions';

interface CloseServiceProps {
    clientId: string;
    serviceId: string;
}
const ClientCloseService = (props: CloseServiceProps) => {
    const closeServices: CloseService[] = useTypedSelector(state => state.store.client.loadedClients
        .filter(client => client.clientData?.id === props.clientId && client.serviceId === props.serviceId)[0].closeServices);
    const [showMore, setShowMore] = useState(false);
    const [valuesToDisplay, setValuesToDisplay] = useState<CloseService[]>([]);
    const dispatch = useDispatch();
    useEffect(() => {
        if (closeServices) {
            if (showMore) {
                setValuesToDisplay(closeServices);
            } else {
                setValuesToDisplay([closeServices[0]]);
            }
        }
    }, [showMore, closeServices])

    const loadCloseClient = (service: CloseService) => {
        dispatch(fetchAndStoreClientV2(service.personId, service.serviceId, DataLoad.ALL_SERVICES));

    }
    return (
        <div>
            {closeServices ? <div>
                {closeServices.length > 0 ?
                    <div className="small-font pr-1 text-marron">
                        {valuesToDisplay.map(item => {
                            return (
                                <div className={'pt-2 pb-2 border-2 border-bottom'}
                                    key={item.number}
                                    onClick={() => loadCloseClient(item)}>
                                    <div className='d-flex'>
                                        <span className='w-50'>{item.number && phoneFormatter(item.number, '+33')}</span>
                                        <span className="w-50 d-flex justify-content-end">
                                            {item.status === 'TERMINATED' ? 'RESILIE' : item.status}
                                        </span>
                                    </div>
                                    <div className='d-flex flex-column'>
                                        <span>{item?.offerName}</span>
                                    </div>
                                </div>
                            )
                        })}
                        <div className="d-flex justify-content-end pt-1 pb-1" onClick={() => setShowMore(!showMore)}>
                            {showMore ? <span>Voir moins</span> : <span>Voir plus</span>}
                        </div>
                    </div> :
                    <label>pas de service ...</label>}
            </div>
                : <></>}
        </div>
    )
}

export default ClientCloseService