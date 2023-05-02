export interface PointsDepotsRenvoiEtiquette {
    pointRelais?: PointRelais[]
    espaceSFRs?: EspaceSFR[]
    colissimo?: Colissimo
    pointProximite?: PointProximite
    reseauDistrib?: ReseauDistrib
}

export interface PointRelais {
    codeRes:string,
    codePdp:string,
    libPdp: string,
    coordX: string,
    coordY: string,
    distance: number,
    geoX: string,
    geoY: string,
    adr1: string,
    adr2: string,
    adr3: string,
    adr4: string,
    codePostale: string,
    ville: string,
    lunOuvAm: string,
    lunFerAm: string,
    lunOuvPm: string,
    lunFerPm: string,
    lunDisp: string,
    marOuvAm: string,
    marFerAm: string,
    marOuvPm: string,
    marFerPm: string,
    marDisp: string,
    merOuvAm: string,
    merFerAm: string,
    merOuvPm: string,
    merFerPm: string,
    merDisp: string,
    jeuOuvAm: string,
    jeuFerAm: string,
    jeuOuvPm: string,
    jeuFerPm: string,
    jeuDisp: string,
    venOuvAm: string,
    venFerAm: string,
    venOuvPm: string,
    venFerPm: string,
    venDisp: string,
    samOuvAm: string,
    samFerAm: string,
    samOuvPm: string,
    samFerPm: string,
    samDisp: string,
    dimOuvAm: string,
    dimFerAm: string,
    dimOuvPm: string,
    dimFerPm: string,
    dimDisp: string
}

export interface EspaceSFR {
    codePdv: string,
    libSFR: string,
    w2s2h: string,
    w2s48h: string,
    coordX: string,
    coordY: string,
    distance: number,
    geoX: string,
    geoY: string,
    picto: string,
    adr1: string,
    adr2: string,
    adr3: string,
    adr4: string,
    codePostale: string,
    ville: string,
    ouvFerm: string,
    mailPdv: string
}

export interface Colissimo {
    condExp: string
    libRes: string
    delaiLiv: string
    dateLivePrev: string
    montant: number
    jourLiv: string
    horLiv: string
    docs: string
    url: string
    codeTrans: string
}

export interface PointProximite {
    codeRes: string;
    condExp: string;
    libRes: string;
    delaiLiv: string;
    dateLivPrev: string;
    montant: number;
    docs: string;
    url: string;
    codePfac2C3: string;
    codePfac4: string;
    codePfac8: string;
    codePfaBios: string;
}

export interface ReseauDistrib {
    condExp: string;
    delaiLiv: string;
    dateLivPrev: string;
    montant: number;
    docs: string;
    codePfac2C3: string;
    codePfac4: string;
    codePfac8: string;
    codePfaBios: string;
    codeTrans: string;
}