import React from "react";
import {Col} from "reactstrap";
import format from "date-fns/format";
import {get} from "lodash";
import {useTypedSelector} from "../../../components/Store/useTypedSelector";
import DisplayField from "../../../components/DisplayField";
import AddressUtils from "../../../utils/AddressUtils";
import DateUtils from "../../../utils/DateUtils";
import {Service} from "../../../model/service";
import {ClientContextSliceState} from "../../../store/ClientContextSlice";

interface Props {
    clientContext?: ClientContextSliceState
}

const BlockHolder = (props: Props) => {

    const {clientContext} = props;
    const client = clientContext ? clientContext : useTypedSelector(state => state.store.clientContext);
    const clientData = client.clientData;
    const ownerPerson = clientData?.ownerPerson;
    const ownerCorporation = clientData?.ownerCorporation;

    const displayAPECode = (apeCode) => {
        if (apeCode) {
            return apeCode !== '0000Z' ? apeCode : `${apeCode} (Provisoire)`
        }
        return "??"
    };

    const displaySirenSiret = () => {
        const siren = clientData?.siren ? clientData?.siren : '??';
        const siret = clientData?.siret ? clientData?.siret : '??';
        return `${siren} / ${siret}`;
    };

    const ancienneteClient = (services :  Service[]) => {
        let oldestLineDate : Date = new Date();
        for ( const s of services ) {
            let serviceDate = new Date(s.activationDate)
            if ( oldestLineDate.getTime() > serviceDate.getTime() ) {
                oldestLineDate = serviceDate;
            }
        }

        let nbMonth = DateUtils.monthsBetween(oldestLineDate, new Date());
        let nbYear = Math.trunc(nbMonth / 12);
        let out = "";
        if (nbYear != 0) {
            if (nbYear == 1) {
                out += "1 an ";
            } else {
                out += nbYear + " ans ";
            }
        }
        nbMonth = nbMonth % 12;
        if (nbMonth != 0) {
            out += nbMonth + " mois";
        }

        return out;
    }

    const displayPhoneContacts = () => {

        const out = new Array<string>()

        if(clientData?.phoneNumber) {
            if(clientData?.indicatifPhoneNumber == "+33") {
                out.push(clientData?.phoneNumber.replace(/(\d)(?=(\d{2})+(?!\d))/g, '$1.'))
            } else {
                out.push("(" + clientData?.indicatifPhoneNumber + ") " + clientData?.phoneNumber)
            }
        }

        if(clientData?.faxNumber) {
            if(clientData?.indicatifFaxNumber == "+33") {
                out.push(clientData?.faxNumber.replace(/(\d)(?=(\d{2})+(?!\d))/g, '$1.'))
            } else {
                out.push("(" + clientData?.indicatifFaxNumber + ") " + clientData?.faxNumber)
            }
        }

        if(clientData?.mobilePhoneNumber) {
            if(clientData?.indicatifMobilePhoneNumber == "+33") {
                out.push(clientData?.mobilePhoneNumber.replace(/(\d)(?=(\d{2})+(?!\d))/g, '$1.'))
            } else {
                out.push("(" + clientData?.indicatifMobilePhoneNumber + ") " + clientData?.mobilePhoneNumber)
            }
        }

        if(clientData?.otherNumber) {
            if(clientData?.indicatifOtherNumber == "+33") {
                out.push(clientData?.otherNumber.replace(/(\d)(?=(\d{2})+(?!\d))/g, '$1.'))
            } else {
                out.push("(" + clientData?.indicatifOtherNumber + ") " + clientData?.otherNumber)
            }
        }

        return out.filter( onlyUnique ).join(", ")
    }

    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }

    return (
        <React.Fragment>
            <Col>
                {clientData?.corporation ?
                    <React.Fragment>
                        <DisplayField fieldName="contract.corporation.name"
                                      isLoading={clientData}
                                      fieldValue={clientData?.ownerCorporation?.name}
                                      bold/>
                        <DisplayField fieldName="contract.corporation.legalResponsible"
                                      isLoading={clientData}
                                      fieldValue={`${get(clientData?.legalResponsible, 'responsible.civility', '')} ${get(clientData?.legalResponsible, 'responsible.firstName', '??')} ${get(clientData?.legalResponsible, 'responsible.lastName', '??')}`}
                                      bold />
                        <DisplayField fieldName="contract.corporation.statutPro"
                                      isLoading={clientData}
                                      fieldValue={clientData?.ownerPerson?.qualificationLevelPro ? clientData?.ownerPerson?.qualificationLevelPro : clientData?.siren ? "PRO Certifié" : null}
                                      bold/>
                        <DisplayField fieldName="contract.corporation.cat.client"
                                      isLoading={clientData}
                                      fieldValue={clientData?.ownerCorporation?.legalCategoryName}
                                      bold/>
                        <DisplayField fieldName="contract.corporation.profession"
                                      isLoading={clientData}
                                      fieldValue={clientData?.codeProfession != null && clientData?.codeProfession != "0" ? clientData?.codeProfession : ""}
                                      bold/>
                        <DisplayField fieldName="contract.corporation.nb.ligne.service"
                                      isLoading={clientData}
                                      fieldValue={clientData?.services?.filter(s => s.status === 'ACTIVE').length}
                                      bold/>
                        <DisplayField fieldName="contract.corporation.anciennete.client"
                                      isLoading={clientData}
                                      fieldValue={ancienneteClient(clientData?.services)}
                                      bold/>
                    </React.Fragment>
                    :
                    <React.Fragment>
                        <DisplayField fieldName="contract.first.last.name"
                                      isLoading={clientData}
                                      fieldValue={ownerPerson ? `${ownerPerson?.civility} ${ownerPerson?.firstName} ${ownerPerson?.lastName}` : null}
                                      bold
                        />
                        <DisplayField fieldName="contract.birthdate"
                                      optional
                                      isLoading={clientData}
                                      fieldValue={ownerPerson?.birthDate ? format(new Date(ownerPerson?.birthDate), 'dd/MM/yyyy') : ''}
                                      bold
                        />
                        <DisplayField fieldName="contract.birthplace"
                                      isLoading={clientData}
                                      fieldValue={ownerPerson?.birthDepartment}
                                      optional bold
                        />
                    </React.Fragment>
                }
            </Col>
            <Col>
                <DisplayField fieldName="contract.address"
                              isLoading={clientData}
                              fieldValue={AddressUtils.displaySimpleAddress((clientData?.corporation ? ownerCorporation?.address : ownerPerson?.address))}
                              bold />

                <DisplayField fieldName="contract.email"
                              isLoading={clientData}
                              fieldValue={clientData?.contactEmail}
                              optional
                              bold
                              />

                <DisplayField fieldName="contract.phone"
                              isLoading={clientData}
                              fieldValue={displayPhoneContacts()} optional bold />

                {clientData?.corporation &&
                <React.Fragment>
                    <DisplayField fieldName="contract.creation.date"
                                  isLoading={clientData}
                                  fieldValue={ownerCorporation?.legalCreationDate != "1900-01-01" ? format(new Date(ownerCorporation?.legalCreationDate!), 'dd/MM/yyyy') : ""}
                                  bold/>


                    <DisplayField fieldName="contract.naf"
                                  isLoading={clientData}
                                  fieldValue={displayAPECode(ownerCorporation?.apeCode)} optional bold/>
                </React.Fragment>
                }

                {(clientData?.siren || clientData?.siret) &&
                <DisplayField
                    isLoading={clientData}
                    fieldName={"contract.siren"}
                    fieldValue={displaySirenSiret()} bold
                />
                }
            </Col>
        </React.Fragment>
    )
};

export default BlockHolder;