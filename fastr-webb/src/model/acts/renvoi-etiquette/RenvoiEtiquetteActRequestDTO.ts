import Act from "../Act";

export default interface RenvoiEtiquetteActRequestDTO extends Act {
    refSiebel: string,
    transportType: string,
    etiquetteType: string,
    coordLambertX: string,
    coordLambertY: string,
    positionLibelle: string,
    positionCode: string,
    login: string
}