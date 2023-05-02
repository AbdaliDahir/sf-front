import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import clientPhone from 'src/img/ihmV2/client_phone.svg'
import { Client } from 'src/model/person'
import { Service } from 'src/model/service'
import { LandedLineService } from 'src/model/service/LandedLineService'
import { DataLoad } from 'src/store/actions/ClientContextActions'
import { fetchAndUpdateCurrentClientV2, selectClientV2 } from 'src/store/actions/v2/client/ClientActions'
import { ClientContextSliceState } from 'src/store/ClientContextSlice'
import { phoneFormatter } from '../tools/utils.functions'
import './ClientServices.scss'
interface ClientServicesProps {
    clientData?: Client;
    currentService?: Service;
    loadedClients: ClientContextSliceState[];
}

const ClientServices = (props: ClientServicesProps) => {
    const { clientData, currentService, loadedClients } = props;
    const [services, setServices] = useState<LandedLineService[]>([]);

    const dispatch = useDispatch();
    const getCurrentClientServices = () => {
        return clientData ? clientData.services
            .filter(item => item.status !== 'SUSPENDED')
            .sort((a, b) => a.status > b.status ? 1 : -1)
            .map(service => { return service as LandedLineService }) : []
    }

    const getLoadedClientServices = () => {
        if (clientData) {
            let selectedServicesIds: string[] = [];
            let selectedServices: LandedLineService[] = [];
            loadedClients.filter(client => client.clientData?.id === clientData.id).forEach(selectedClient => {
                selectedClient.clientData?.services.forEach((service: LandedLineService) => {
                    if (!selectedServicesIds.includes(service.id)) {
                        selectedServicesIds = [...selectedServicesIds, service.id];
                        selectedServices = [...selectedServices, service]
                    }
                })
            });
            return selectedServices
                .filter(item => item.status !== 'SUSPENDED')
                .sort((a, b) => a.status > b.status ? 1 : -1);
        } else { return [] }
    }
    useEffect(() => {
        if (clientData) {
            let currentServices = getCurrentClientServices();
            currentServices = currentServices.length > 1 ? currentServices : getLoadedClientServices();
            setServices(currentServices);
        }
    }, [loadedClients.length, clientData]);

    const selectService = (serviceId: string) => {
        if (clientData) {
            let clientExist = loadedClients.find(c => c.service?.id === serviceId && c.clientData?.id === clientData?.id);
            if (clientExist) {
                dispatch(selectClientV2(clientData?.id, serviceId))
            } else {
                dispatch(fetchAndUpdateCurrentClientV2(clientData?.id, serviceId, DataLoad.ALL_SERVICES));
            }
        }
    }
    return (
        <div className='pt-2'>
            <div className='pl-2 border-2 border-bottom'>
                <img src={clientPhone} className='mr-3' />
                <label className='service-card-title'>SERVICES DU TITULAIRES</label>
            </div>
            {services.length > 0 ?
                services
                    .map((service, index) => {
                        const isSelected = service.label === currentService?.label;
                        const isLastElement = services.length - 1 === index;
                        return (
                            <div className={'pt-2 pb-2 pl-2 service-list-item ' + (isSelected ? ' selected-item ' : '') + (!isLastElement ? ' border-2 border-bottom' : ' last-item-raduis')}
                                onClick={() => selectService(service.id)}
                                key={service.id}>
                                <div className='d-flex'>
                                    <span className='service-list-item-header w-50'>{service.label && phoneFormatter(service.label, '+33')}</span>
                                    <div className='w-50 d-flex justify-content-center'>
                                        <span className='service-list-item-header'>{service.status === 'TERMINATED' ? 'RESILIE' : service.status}</span>
                                    </div>
                                </div>
                                <div className='d-flex flex-column'>
                                    {isSelected &&
                                        <>
                                            <span className='service-list-item-secondary'>Ref Compte : {service.id}</span>
                                            <span className='service-list-item-secondary'>
                                                <span>Cpt. Facturation: {service.billingAccount.id}</span>
                                                <span>JJ {service.billingAccount.cutOffDay}</span>
                                            </span>
                                        </>}
                                    <span className={'service-list-item-footer ' + (!isSelected ? 'black-footer' : '')}>{service?.offerName ?? service?.landedPlan?.offerName}</span>
                                </div>

                            </div>
                        )
                    }) : <></>}


        </div>
    )
}

export default ClientServices