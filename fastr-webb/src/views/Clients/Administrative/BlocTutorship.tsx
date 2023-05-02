import React from "react";
import {Col, Row} from "reactstrap";
import {format} from "date-fns";
import {get} from "lodash";
import {useTypedSelector} from "../../../components/Store/useTypedSelector";
import DisplayField from "../../../components/DisplayField";
import AddressUtils from "../../../utils/AddressUtils";
import {translate} from "../../../components/Intl/IntlGlobalProvider";
import {ClientContextSliceState} from "../../../store/ClientContextSlice";

interface Props {
    clientContext?: ClientContextSliceState
}

const BlocTutorship = (props: Props) => {
    const {clientContext} = props;
    const client : ClientContextSliceState = clientContext ? clientContext : useTypedSelector(state => state.store.clientContext);
    const clientData = client.clientData;
    const {legalResponsible} = clientData || {};

    const displayContactPhone = () => {
        return legalResponsible?.contactMobilePhoneNumber ? legalResponsible.contactMobilePhoneNumber : legalResponsible?.contactPhoneNumber;
    };

    return (
        <Row>
            <Col>
                <DisplayField
                    isLoading={clientData}
                    fieldName={"contract.first.last.name"}
                    fieldValue={`${get(legalResponsible, 'responsible.civility', '')} ${get(legalResponsible, 'responsible.firstName', '??')} ${get(legalResponsible, 'responsible.lastName', '??')}`}
                    optional
                    bold icon={"icon icon-user"}/>

                <DisplayField
                    isLoading={clientData}
                    fieldName={"contract.birthdate"}
                    fieldValue={legalResponsible?.responsible?.birthDate ? format(new Date(legalResponsible.responsible.birthDate), 'dd/MM/yyyy') : '??'}
                    bold
                />
                <DisplayField
                    isLoading={clientData}
                    fieldName={"contract.address"}
                    fieldValue={AddressUtils.displaySimpleAddress(legalResponsible?.responsible?.address)}
                    bold icon={"icon icon-home"}
                />
                <DisplayField
                    isLoading={clientData}
                    fieldName={"contract.email"}
                    fieldValue={legalResponsible?.contactEmail} optional bold
                    icon={"icon icon-email"}
                />

                <DisplayField
                    isLoading={clientData}

                    fieldName={"contract.phone"}
                    fieldValue={displayContactPhone()} optional bold
                    icon={"icon icon-call"}
                />
            </Col>
            <Col>
                <DisplayField
                    isLoading={clientData}
                    fieldName={"contract.tutorshipType"}
                    fieldValue={clientData?.ownerPerson.tutorshipType ? translate.formatMessage({id: `tutorship.${clientData?.ownerPerson.tutorshipType}`}) : ""}
                    bold
                />
                {clientData?.ownerPerson.tutorshipEndDate &&
                <DisplayField
                    isLoading={clientData}
                    fieldName={"contract.tutorship.endDate"}
                    fieldValue={format(new Date(clientData?.ownerPerson.tutorshipEndDate), 'dd/MM/yyyy')}
                    bold
                />
                }
            </Col>
        </Row>)


};
export default BlocTutorship;
