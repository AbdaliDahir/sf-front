import {OwnerPerson} from "./OwnerPerson"

export default interface RequestForAdministrativeData {
    newValues: {physicalPerson: OwnerPerson}
}