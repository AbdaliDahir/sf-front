import React, {useEffect, useState} from 'react';
import {NotificationManager} from "react-notifications";
import {FormattedMessage} from "react-intl";
import "./RenvoiEtiquette.scss";
import ActService from "../../../../service/ActService";
import Loading from "../../../../components/Loading";
import {EligibilityRenvoiEtiquette} from "../../../../model/service/EligibilityrenvoiEtiquette";
import {Button, Card, CardBody, CardHeader, Label, Modal, ModalBody, ModalHeader} from "reactstrap";
import ValidationUtils from "../../../../utils/ValidationUtils";
import FormButtonGroupRadio from "../../../../components/Form/FormButtonGroupRadio";
import AddressUtils from "../../../../utils/AddressUtils";
import SimpleAddressInput from "../../../../components/Form/Address/SimpleAddressInput";
import {Address, Client} from "../../../../model/person";
import {PointsDepotsRenvoiEtiquette} from "../../../../model/service/PointsDepotsRenvoiEtiquette";

import sfrIcon from "src/img/sfrIcon.svg";
import {useTypedSelector} from "../../../../components/Store/useTypedSelector";
import {AppState} from "../../../../store";
import {Map} from "@esri/react-arcgis";
import IconesPointsDepots from "./IconesPointsDepots";
import FormHiddenInput from "../../../../components/Form/FormHiddenInput";
import {User} from "../../../../model/User";
import {Service} from "../../../../model/service";

interface Props {
    clientService?: Service,
    clientData?: Client,
    closeFunction: () => void;
}

const RenvoiEtiquette = (props: Props) => {

    const actService: ActService = new ActService(true);

    const authorizations: string[] = useTypedSelector((state: AppState) => state.store.applicationInitialState.authorizations);
    const currentUser: User = useTypedSelector((state: AppState) => state.store.applicationInitialState.user)!;
    const {clientService, clientData} = props;
    const [clientEligibility, setClientEligibility] = useState<EligibilityRenvoiEtiquette>();
    const [modeEnvoi, setModeEnvoi] = useState("MAIL");
    const [depotEquipement, setDepotEquipement] = useState("POINT_RELAIS");
    const [openModalChangeContact, setOpenModalChangeContact] = useState(false);
    const [pointsDepots, setPointsDepots] = useState<PointsDepotsRenvoiEtiquette>()
    const [pointsLoading, setPointLoading] = useState(false);
    const clientAddress: Address | undefined = clientData?.corporation ? clientData?.ownerCorporation.address : clientData?.ownerPerson.address;
    const [displayAdress, setDisplayAddress] = useState(clientAddress);
    const [selectedPointDepot, setSelectedPointDepot] = useState()

    useEffect(() => {
        requestEligibility();
        handleChangeAdress(null, clientAddress);
    }, [])

    const requestEligibility = () => {
        actService.getEligibilityRenvoiEtiquette(clientService?.siebelAccount!)
            .then(eligibility => {
                if (eligibility?.eligible) {
                    setClientEligibility(eligibility)
                } else if (authorizations.includes("forceResendLabelADG")) {
                    NotificationManager.warning(renderIneligibleMessage(eligibility), undefined, 7000);
                    setClientEligibility(eligibility)
                } else {
                    NotificationManager.error(renderIneligibleMessage(eligibility), undefined, 7000);
                    setClientEligibility(undefined)
                    props.closeFunction();
                }
            })
            .catch(() => {
                NotificationManager.error("Erreur technique");
                props.closeFunction();
            })
        ;
    }

    const renderIneligibleMessage = (eligibility: EligibilityRenvoiEtiquette) => {
        return (
            <div className={"flex flex-column"}>
                <div>Contexte client inéligible au renvoi d'étiquette</div>
                {eligibility.retourEtiquetteEnCours && <div>- {eligibility.retourEtiquetteEnCours}</div>}
                {eligibility.rdvSTITenCours && <div>- {eligibility.rdvSTITenCours}</div>}
                {eligibility.equipementObso && <div>- {eligibility.equipementObso}</div>}
            </div>
        );
    }

    const changeModeEnvoi = (newVal) => {
        setModeEnvoi(newVal)
    }

    const changeDepotEquipement = (newVal) => {
        setDepotEquipement(newVal)
    }

    const toggleModalChangeContact = () => {
        setOpenModalChangeContact(!openModalChangeContact);
    }

    const handleChangeAdress = (key, value?: Address) => {
        if (value?.zipcode) {
            setDisplayAddress(value);
            setPointLoading(true);
            actService.getPointsDepot(value.zipcode, value.city)
                .then(response => {
                    handlePointsDepots(response)
                    setPointLoading(false);
                })
                .catch(e => {
                    handlePointsDepots(undefined);
                    setPointLoading(false);
                })
            ;
        }
    }

    /**
     * Store new values and select first one if exist
     * @param values
     */
    const handlePointsDepots = (values?: PointsDepotsRenvoiEtiquette) => {
        setPointsDepots(values);
        if (values?.pointRelais) {
            setSelectedPointDepot(values?.pointRelais[0]);
        } else if (values?.espaceSFRs) {
            setSelectedPointDepot(values?.espaceSFRs[0]);
        } else {
            setSelectedPointDepot(undefined);
        }
    }

    const renderDays = (p) => {
        return (
            <React.Fragment>
                {renderDay("Lundi", p.lunOuvAm, p.lunFerAm, p.lunOuvPm, p.lunFerPm)}
                {renderDay("Mardi", p.marOuvAm, p.marFerAm, p.marOuvPm, p.marFerPm)}
                {renderDay("Mercredi", p.merOuvAm, p.merFerAm, p.merOuvPm, p.merFerPm)}
                {renderDay("Jeudi", p.jeuOuvAm, p.jeuFerAm, p.jeuOuvPm, p.jeuFerPm)}
                {renderDay("Vendredi", p.venOuvAm, p.venFerAm, p.venOuvPm, p.venFerPm)}
                {renderDay("Samedi", p.samOuvAm, p.samFerAm, p.samOuvPm, p.samFerPm)}
                {renderDay("Dimanche", p.dimOuvAm, p.dimFerAm, p.dimOuvPm, p.dimFerPm)}
            </React.Fragment>
        )
    }

    const renderDay = (day, ouvAm, ferAm, ouvPm, ferPm) => {
        return (
            <div className={"day d-flex flex-row"}>
                <div className={"flex-1"}>{day}</div>
                <div className={"flex-1"}>{ouvAm && ferAm ? ouvAm + " - " + ferAm : "Fermé"}</div>
                <div
                    className={"flex-1"}>{ouvPm && ferPm ? ouvPm + " - " + ferPm : (ouvAm && ferAm ? "Fermé" : "")}</div>
            </div>
        )
    }

    const renderIcon = (isSfr: boolean) => {
        return (
            <div className={"picto flex-1 d-flex justify-content-center align-items-baseline"}>
                {isSfr ?
                    <img className="img-responsive mr-2" width={40} src={sfrIcon}/>
                    :
                    <i className={"icon-gradient icon-fast-delivery font-size-xl"}/>
                }
            </div>
        );
    }

    const renderAdress = (p) => {
        return (
            <div className={"adr flex-2 d-flex flex-column"}>
                <span>{p.adr1}</span>
                <span>{p.adr2}</span>
                <span>{p.adr3}</span>
                <span>{p.adr4}</span>
                <span>{p.codePostale} {p.ville}</span>
            </div>
        );
    }

    const selectPointDepot = (p) => {
        setSelectedPointDepot(p);
    }

    const renderPointsDepots = () => {
        if (pointsLoading) {
            return <Loading/>
        }

        return (
            <React.Fragment>
                {pointsDepots?.pointRelais?.map((p, index) => renderPointDepotCard(p, index + 1, false))}
                {pointsDepots?.espaceSFRs?.map((p, index) => renderPointDepotCard(p, ((pointsDepots?.pointRelais?.length || 0) + index + 1), true))}
            </React.Fragment>
        );
    }

    const renderPointDepotCard = (p, index, isSfrPoint) => {
        return (
            // tslint:disable-next-line:jsx-no-lambda
            <Card className={"result-card mr-1 mb-0 cursor-pointer " + (p === selectedPointDepot ? "selected" : "")}
                  onClick={() => selectPointDepot(p)}>
                <CardHeader className={"result-card-header d-flex justify-content-between"}>
                    <div className={"result-card-header-libelle"}>
                        {index} {isSfrPoint ? p.libSFR : p.libPdp}
                    </div>
                    <div className={"text-black-50"}>
                        {p.distance >= 1 ? (p.distance + "km") : ((p.distance * 1000) + "m")} - Gratuit
                    </div>
                </CardHeader>
                <CardBody className={"result-card-body d-flex justify-content-between pl-0"}>
                    {renderIcon(isSfrPoint)}
                    {renderAdress(p)}
                    <div className={"hours flex-3 d-flex flex-column"}>
                        {isSfrPoint ? p.ouvFerm : renderDays(p)}
                    </div>
                </CardBody>
            </Card>
        );
    }

    const renderModeContactForm = () => {
        return (
            <section className={"formModeContact mt-1"}>
                <Label className={"mr-2 font-weight-bold text-uppercase"}>
                    <FormattedMessage id="act.renvoi.etiquette.mode.envoi"/>
                </Label>
                <FormButtonGroupRadio id={"etiquetteType"}
                                      name={"etiquetteType"}
                                      value={modeEnvoi}
                                      onValueChange={changeModeEnvoi}
                                      validations={{manualValidation: (modeEnvoi === "PAPIER" && clientAddress) || (modeEnvoi === "MAIL" && clientData?.contactEmail)}}
                                      validationErrors={{manualValidation: "Une adresse mail doit être renseignée, modification de coordonnées nécessaire"}}
                >
                    <Button color={modeEnvoi === "MAIL" ? "primary" : "light"} id="email" value="MAIL" block size={"sm"}>
                        <FormattedMessage id="act.renvoi.etiquette.mode.envoi.email"/>
                    </Button>
                    <Button color={modeEnvoi === "PAPIER" ? "primary" : "light"} id="courrier" value="PAPIER"
                            className={"text-nowrap"} block size={"sm"}>
                        <FormattedMessage id="act.renvoi.etiquette.mode.envoi.courrier.postal"/>
                    </Button>
                </FormButtonGroupRadio>
            </section>
        )
    }

    const renderContactInfos = () => {
        const isEmail = modeEnvoi === "MAIL";
        const displayValue = isEmail ? clientData?.contactEmail : AddressUtils.displaySimpleAddress(clientAddress);
        return (
            <React.Fragment>
                <Modal isOpen={openModalChangeContact}
                       toggle={toggleModalChangeContact}
                       size={"lg"}
                >
                    <ModalHeader><FormattedMessage id="act.renvoi.etiquette.abandon.act.header"/></ModalHeader>
                    <ModalBody>
                        <div>
                            <FormattedMessage id="act.renvoi.etiquette.abandon.act.body"/>
                        </div>
                        <div className={"d-flex flex-row justify-content-end"}>
                            <Button color={"link"} size={"sm"} onClick={toggleModalChangeContact}><FormattedMessage
                                id="act.renvoi.etiquette.abandon.annuler"/></Button>
                            <Button onClick={toggleModalChangeContact && props.closeFunction}
                                    color={"primary"} size={"sm"} ><FormattedMessage
                                id="act.renvoi.etiquette.abandon.valider"/></Button>
                        </div>
                    </ModalBody>
                </Modal>
                <Label className={"font-weight-bold"}><FormattedMessage
                    id={`act.renvoi.etiquette.contact.address${isEmail ? ".mail" : ""}`}/></Label>
                <section className={"contactInfo my-1"}>
                    <span className={"mr-2"}>{displayValue ? displayValue : <FormattedMessage
                        id={`act.renvoi.etiquette.contact.no.address${isEmail ? ".mail" : ""}`}/>}</span>
                    <Button color={"link"} size={"sm"} 
                            onClick={toggleModalChangeContact}>{isEmail ? "Modifier l'email du titulaire" : "Modifier l'adresse du titulaire"}</Button>
                </section>
            </React.Fragment>
        )
    }

    const renderDropPlacesType = () => {
        return (
            <React.Fragment>
                <Label className={"font-weight-bold text-uppercase"}><FormattedMessage
                    id="act.renvoi.etiquette.depot.label"/></Label>
                <section className={"dropPlacesType mt-1 mb-0"}>
                    <FormButtonGroupRadio id={"depotEquipement"}
                                          name={"depotEquipement"}
                                          className={"mb-0"}
                                          value={depotEquipement}
                                          onValueChange={changeDepotEquipement}
                                          validations={{isRequired: ValidationUtils.notEmpty}}>
                        <Button color={depotEquipement === "POINT_RELAIS" ? "primary" : "light"} id="pointRelais"
                                value="POINT_RELAIS" className={"text-nowrap"} size={"sm"} block>
                            <FormattedMessage id="act.renvoi.etiquette.depot.point.relais"/>
                        </Button>
                        <Button color={depotEquipement === "POSTE" ? "primary" : "light"} id="poste"
                                value="POSTE" className={"text-nowrap"} size={"sm"} block>
                            <FormattedMessage id="act.renvoi.etiquette.depot.poste"/>
                        </Button>
                    </FormButtonGroupRadio>
                </section>
            </React.Fragment>
        )
    }

    const renderDropPlacesForm = () => {
        return (
            <div className={"mt-2 mb-0"}>
                <Label className={"font-weight-bold"}><FormattedMessage
                    id="act.renvoi.etiquette.depot.suggestion"/></Label>
                <section className={"dropPlacesForm"}>
                    <SimpleAddressInput value={displayAdress}
                                        name={"none"}
                                        className={"formAdress"}
                                        saveData={handleChangeAdress}
                                        withoutComplement/>
                </section>
                <section
                    className={"dropPlace sResults mt-1 " + (pointsDepots?.pointRelais || pointsDepots?.espaceSFRs ? "found" : "")}>
                    {pointsLoading ? (
                        <div id="results" className={"d-flex flex-column"}>
                            <Loading/>
                        </div>
                    ) : (
                        renderDropPointsAndMap()
                    )}
                </section>
            </div>
        )
    }

    const renderDropPointsAndMap = () => {
        return (
            (pointsDepots?.pointRelais || pointsDepots?.espaceSFRs) ? (
                <React.Fragment>
                    <div id="results" className={"d-flex flex-column mr-0"}>
                        {renderPointsDepots()}
                    </div>
                    <div>
                        <Map id="arcgis_map_canvas"
                             mapProperties={{
                                 basemap: "streets",
                                 zoom: 14,
                                 autoResize: true
                             }}>
                            <IconesPointsDepots pointsDepots={pointsDepots} selected={selectedPointDepot}/>
                        </Map>
                    </div>
                </React.Fragment>
            ) : (
                <Label className={"font-weight-bold text-danger"}>
                    <FormattedMessage id="act.renvoi.etiquette.depot.none.found"/>
                </Label>
            )
        )
    }

    if (!clientEligibility) {
        return <Loading/>
    }

    return (
        <CardBody className={"adgRenvoiEtiquette p-0"}>
            {renderModeContactForm()}
            {renderContactInfos()}
            {renderDropPlacesType()}
            {depotEquipement === "POINT_RELAIS" && renderDropPlacesForm()}

            <div className={"form-hidden-values"}>
                <FormHiddenInput name={"login"} value={currentUser.login}/>
                <FormHiddenInput name={"positionLibelle"} value={currentUser.position?.label}/>
                <FormHiddenInput name={"positionCode"} value={currentUser.position?.code}/>
                <FormHiddenInput name={"refSiebel"} value={clientService?.siebelAccount!}/>
                {depotEquipement === "POINT_RELAIS" ?
                    <React.Fragment>
                        <FormHiddenInput name={"transportType"}
                                         value={selectedPointDepot ? (selectedPointDepot.libSFR ? "WEB2SHOP" : "CHRRELAIS") : ""}
                                         validations={{isRequired: ValidationUtils.notEmpty}}/>
                        <FormHiddenInput name={"coordLambertX"} value={selectedPointDepot?.coordX}
                                         validations={{isRequired: ValidationUtils.notEmpty}}/>
                        <FormHiddenInput name={"coordLambertY"} value={selectedPointDepot?.coordY}
                                         validations={{isRequired: ValidationUtils.notEmpty}}/>
                    </React.Fragment>
                    :
                    <FormHiddenInput name={"transportType"} value={"LA POSTE"}/>
                }
            </div>
        </CardBody>
    )
};

export default RenvoiEtiquette;
