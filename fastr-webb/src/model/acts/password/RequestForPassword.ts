export default interface RequestForPassword {
    newValues: {
        physicalPerson?: { password: string },
        moralPerson?: { password: string }
    }
}