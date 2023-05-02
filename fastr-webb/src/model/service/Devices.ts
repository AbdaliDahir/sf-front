export interface Devices {
    principalEquipments: LandedDevice[]
    devicesToReturn: LandedDevice[]
    secondaryEquipments: SecondaryDevice[]
}

export interface SecondaryDevice {
    status?: string
    idCompte?: string
    libelle?: string
    numSerie?: string
    marque?: string
    modele?: string
    typeEqt?: string
    statutLogistique?: string
    montantPaye?: number
    numCommandeEcom?: string
    transporteur?: string
    prixNu?: number
    codeSap?: string
    numColisExpedition?: string
    numCommandeSap?: string
    flagEqtSubventionne: boolean
    flagFdp: boolean
    gestionnaireSav?: string
    numAppelSav?: string
    conditionSav?: string
    centreRetourRetract?: string
    facturationPrixNu?: string
    odrPrice?: string
    odrLabel?: string
    dateModif?: string
    dateModifStatut?: string
    dateFinGarantie?: string
    dateAchat?: string
    motifRetour?: string
    typeClient?: string
    histoStatut?: HistoStatut[]
    current: boolean
}

export interface HistoStatut {
    statutLogistique?: string
    dateStatut?: string
}
export interface LandedDevice {
    id?: string
    status?: string
    name?: string
    model?: string
    modelReference?: string
    brand?: string
    wifiMacAddress?: string
    serialNumber?: string
    addressMac?: string
    possession?: string

    transporter?: string
    transporterRef?: string
    transportStatus?: string

    sendDate?: string
    returnDeadline?: string
    returnDate: string

    penalties?: string
    penaltiesAmount?: number
    warrantyDeposit?: number

    // Transporter infos
    deliveryAtHome: boolean
    transporterName?: string
    transporterStatus?: string
    dateStatusTransporter?: string

    // Relais point infos
    pointRelaisName?: string
    firstAdress?: string
    secondAdress?: string
    postalCode?: string
    city?: string
    situation: string
    current: boolean
    transporterUrl: string
    returnRequest: string
    returned: string
    typeEqpt: string
}
