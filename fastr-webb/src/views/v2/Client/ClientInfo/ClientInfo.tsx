import { format } from 'date-fns'
import React, { useEffect, useState } from 'react'
import clientCalendar from 'src/img/ihmV2/client_calendar.svg'
import clientEmail from 'src/img/ihmV2/client_email.svg'
import clientLocation from 'src/img/ihmV2/client_location_pin.svg'
import clientPerson from 'src/img/ihmV2/client_person.svg'
import clientCard from 'src/img/ihmV2/client_person_card.svg'
import clientPhone from 'src/img/ihmV2/client_phone.svg'
import clientSiren from 'src/img/ihmV2/client_siren.svg'
import buildingIcon from 'src/img/societe-gradient.svg'
import { Address, Client, Person } from 'src/model/person'
import { getClientFormattedPhones } from '../tools/utils.functions'
import { BasicClientInfo, BasicClientInfoElement } from './ClientInfo.interfaces'




interface ClientInfoProps {
    clientData?: Client
}


const ClientInfo = (props: ClientInfoProps) => {
    const { clientData } = props;
    const [clientBasicInfo, setClientBasicInfo] = useState<BasicClientInfo>();
    useEffect(() => {
        if (clientData) {
            clientInfoFactory(clientData);
        }
    }, [clientData])

    const getClientFullName = (person: Person) => {
        return `${person.civility} ${person.firstName} ${person.lastName}`
    }

    const getBirthDate = (date: string, birthDepartment?: string) => {
        let birthDateMessage = `Né(e) le ${date ? (format(new Date(date), 'dd/MM/yyyy')) : ''}`;
        birthDateMessage = birthDepartment ? `${birthDateMessage} ( ${birthDepartment} )` : birthDateMessage;
        return birthDateMessage;

    }
    const getCreationDate = (date: string) => {
        return `${date != '1900-01-01' ? format(new Date(date!), 'dd/MM/yyyy') : ''}`
    }
    const getAddress = (address?: Address) => {
        return `${address?.address1}`
    }
    const getAdditionalAddress = (address?: Address)=>{
        return `${address?.zipcode} ${address?.city}`;
    }
    const displaySirenSiret = () => {
        const siren = clientData?.siren ? clientData?.siren : '??';
        const siret = clientData?.siret ? clientData?.siret : '??';
        return `${siren} / ${siret}`;
    };
    const clientInfoFactory = (client: Client) => {
        const result: BasicClientInfo = {
            fullName: {
                value: !client.corporation ? getClientFullName(client.ownerPerson) : `${client.ownerCorporation?.name}`,
                icon: !client.corporation ? clientPerson : buildingIcon,
                isBold: true,
                extraInfo: client.corporation ? `(${getClientFullName(client.legalResponsible.responsible)})` : undefined
            },
            phone: {
                value: getClientFormattedPhones(client),
                icon: clientPhone
            },
            adress: {
                value: getAddress(!client.corporation ? client.ownerPerson?.address : client.ownerCorporation?.address),
                icon: clientLocation,
                extraInfo: getAdditionalAddress(!client.corporation ? client.ownerPerson?.address : client.ownerCorporation?.address)
            },
            email: {
                value: client.contactEmail,
                icon: clientEmail
            },
            type: {
                value: !client.corporation ? `Particulier ${client.siren || client.siret ? ' ( Pro ) ' : ''}` : 'Societé', icon: clientCard
            },
            birthDate: {
                value: client.corporation ? getCreationDate(client.ownerCorporation?.legalCreationDate) : getBirthDate(client.ownerPerson.birthDate, client.ownerPerson.birthDepartment),
                icon: clientCalendar
            }
        }
        if (client.corporation && (client.siren || client.siret)) {
            result.siren = { value: displaySirenSiret(), icon: clientSiren }
        }
        setClientBasicInfo(result);
    }

    return (
        <div className='w-100 pl-2 pt-3 pb-2'>
            {clientBasicInfo && Object.keys(clientBasicInfo).map(key => {
                const item: BasicClientInfoElement = clientBasicInfo[key];
                return (
                    <div className='d-flex w-100 mb-2' style={{ gap: '15px' }}>
                        <div style={{ width: '7%' }} className="d-flex flex-column justify-content-center">
                            <img src={item.icon} />
                        </div>
                        <div className={'w-75 d-flex flex-column justify-content-center ' + (item.isBold ? 'font-weight-bold' : '')}>
                            <span>{item.value}</span> {item.extraInfo && <span>{item.extraInfo}</span>}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default ClientInfo