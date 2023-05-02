import React, { useState } from "react";
import { useEffect } from "react";
import { connect } from "react-redux";
import { AppState } from "src/store";
import { ClientContextSliceState } from "src/store/ClientContextSlice";
import { NotificationManager } from "react-notifications";
import { DynamicDataResponse } from "src/model/aramis/DynamicDataResponse";
import { Button, Card, CardBody, CardHeader, Label } from "reactstrap";
import Loading from "src/components/Loading";
import { translate } from "src/components/Intl/IntlGlobalProvider";
import { FormattedMessage } from "react-intl";
import BootstrapTable from "react-bootstrap-table-next"
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory from 'react-bootstrap-table2-filter';
import { Address, Client } from "src/model/person";
import ActService from "src/service/ActService";
import { PointsDepotsRenvoiEtiquette } from "src/model/service/PointsDepotsRenvoiEtiquette";
import FormHiddenInput from "src/components/Form/FormHiddenInput";
import ValidationUtils from "src/utils/ValidationUtils";
import { User } from "@sentry/browser";
import { useTypedSelector } from "src/components/Store/useTypedSelector";
import SimpleAddressInput from "src/components/Form/Address/SimpleAddressInput";
import FormButtonGroupRadio from "src/components/Form/FormButtonGroupRadio";
import IconesPointsDepots from "../RenvoiEtiquette/IconesPointsDepots";
import { Map } from "@esri/react-arcgis";
import sfrIcon from "src/img/sfrIcon.svg";
import "./RenvoiEquipement.scss";

interface Props {
    clientData?: Client
    client: ClientContextSliceState
    closeAdgGrid: () => void
    authorizations: string[]
}

const RenvoiEquipement = (props: Props) => {
    const actService: ActService = new ActService(true);
    const accountId = props.client.service?.siebelAccount as string;
    const clientAddress: Address | undefined = props.clientData?.corporation ? props.clientData?.ownerCorporation.address : props.clientData?.ownerPerson.address;

    const [step, setStep] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [equipments, setEquipments] = useState<DynamicDataResponse[]>([]);
    const [selectedEquipments, setSelectedEquipments] = useState<DynamicDataResponse[]>([]);

    const [pointsLivraison, setPointsLivraison] = useState<PointsDepotsRenvoiEtiquette>();

    useEffect(() => {
        actService.getDynamicData(accountId).then((dynamicData: DynamicDataResponse[]) => {
            dynamicData.forEach((equipment, index) => equipment.id = index);
            setEquipments(dynamicData);
            if (dynamicData.length == 0) closeAdgGrid();
        }).catch(() => closeAdgGrid())
    }, [])

    const closeAdgGrid = () => {
        NotificationManager.error("configuration cliente erronée : aucun équipement trouvé en commande");
        props.closeAdgGrid();
    }

    const next = (selectedEquipments: DynamicDataResponse[]) => {
        setLoading(true);
        actService.getPointsLivraison(selectedEquipments, clientAddress?.zipcode!, clientAddress?.city).then((pointsLivraison: PointsDepotsRenvoiEtiquette) => {
            setPointsLivraison(pointsLivraison);
            setSelectedEquipments(selectedEquipments);
            setStep(2);
            setLoading(false);
        }).catch(() => setLoading(false));
    }

    return (
        equipments.length ?
            <React.Fragment>
                {step == 1 ?
                    <EquipmentTable equipments={equipments} next={next} loading={loading} authorizations={props.authorizations} /> :
                    <DeliveryPoints selectedEquipments={selectedEquipments} setStep={setStep} pointsLivraison={pointsLivraison} setPointsLivraison={setPointsLivraison} clientAddress={clientAddress} accountId={accountId} />
                }
            </React.Fragment> :
            <Loading />
    )
}

interface EquipmentTableProps {
    equipments: DynamicDataResponse[]
    next: (selectedEquipments: DynamicDataResponse[]) => void
    authorizations: string[]
    loading: boolean
}

const EquipmentTable = (props: EquipmentTableProps) => {
    const { equipments, authorizations, next, loading } = props;

    const [selected, setSelected] = useState<number[]>([]);
    const [nonSelectable, setNonSelectable] = useState<number[]>([]);

    useEffect(() => {
        const nonSelectable: number[] = [];
        equipments.forEach(equipment => {
            if (equipment.eligible !== 'OK' && !authorizations.includes("bypassEligibility_RENVOI_EQT")) nonSelectable.push(equipment.id);
        });
        setNonSelectable(nonSelectable);
    }, [])

    const eligibleFormatter = (cell, row) => {
        return cell == 'OK' ? cell : `${cell}: ${row.raison}`;
    };
    const columns = [
        { sort: true, dataField: 'eligible', text: 'Eligibilité au renvoi', formatter: eligibleFormatter },
        { sort: true, dataField: 'type', text: 'Type' },
        { sort: true, dataField: 'service', text: 'Equipement commandé' },
        { sort: true, dataField: 'codificationRenvoi', text: 'Equipement renvoyé' }
    ];
    const paginationOptions = {
        sizePerPageList: [{ text: '5', value: 5 }, { text: '20', value: 20 }, { text: '50', value: 50 }],
        firstPageText: translate.formatMessage({ id: "tray.table.pagination.firstPageText" }),
        prePageText: translate.formatMessage({ id: "tray.table.pagination.prePageText" }),
        nextPageText: translate.formatMessage({ id: "tray.table.pagination.nextPageText" }),
        lastPageText: translate.formatMessage({ id: "tray.table.pagination.lastPageText" }),
        hidePageListOnlyOnePage: true
    };

    const onSelect = (row: DynamicDataResponse, isSelect: boolean) => {
        isSelect ? setSelected([...selected, ...[row.id]]) : setSelected(selected.filter(x => x != row.id));
    };
    const onSelectAll = (isSelect: boolean, rows: DynamicDataResponse[]) => {
        const ids = rows.map(r => r.id);
        isSelect ? setSelected(ids) : setSelected([]);
    };
    const selectOptions = {
        mode: 'checkbox',
        clickToSelect: true,
        onSelect: onSelect,
        onSelectAll: onSelectAll,
        selected: selected,
        nonSelectable: nonSelectable
    };

    const onNextClick = () => {
        const selectedEquipments = equipments.filter(equipment => selected.includes(equipment.id));
        next(selectedEquipments);
    }

    return (
        <React.Fragment>
            <BootstrapTable
                hover
                condensed
                striped
                bordered={false}
                bootstrap4
                keyField='id'
                data={equipments}
                columns={columns}
                pagination={paginationFactory(paginationOptions)}
                filter={filterFactory()}
                selectRow={selectOptions}
                headerClasses="thead-dark"
                wrapperClasses="equipements-table"
                noDataIndication={<span className="font-italic"><FormattedMessage id="global.table.nothing" /></span>} />
            <Button color="secondary" size="sm" disabled={selected.length == 0 || loading} onClick={onNextClick} style={{ float: 'right' }}>
                {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" /> : "Suivant"}
            </Button>
        </React.Fragment>
    )
}

interface DeliveryPointsProps {
    pointsLivraison?: PointsDepotsRenvoiEtiquette
    setPointsLivraison: (pointsLivraison?: PointsDepotsRenvoiEtiquette) => void
    selectedEquipments: DynamicDataResponse[]
    clientAddress: Address | undefined
    setStep: (step: number) => void
    accountId: string
}

const DeliveryPoints = (props: DeliveryPointsProps) => {
    const { selectedEquipments, setStep, clientAddress, pointsLivraison, setPointsLivraison, accountId } = props;

    const currentUser: User = useTypedSelector((state: AppState) => state.store.applicationInitialState.user)!;
    const actService: ActService = new ActService(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [modeLivraison, setModeLivraison] = useState("POINT_RELAIS");
    const [displayAdress, setDisplayAddress] = useState(clientAddress);
    const [selectedPointLivraison, setSelectedPointLivraison] = useState<any>();

    const handleChangeAdress = (key, value?: Address) => {
        if (value?.zipcode) {
            setDisplayAddress(value);
            setLoading(true);
            actService.getPointsLivraison(selectedEquipments, clientAddress?.zipcode!, clientAddress?.city)
                .then(response => {
                    handlePointsLivraison(response)
                    setLoading(false);
                })
                .catch(e => {
                    handlePointsLivraison(undefined);
                    setLoading(false);
                });
        }
    }

    const handlePointsLivraison = (values?: PointsDepotsRenvoiEtiquette) => {
        setPointsLivraison(values);
        if (values?.pointRelais) {
            setSelectedPointLivraison(values?.pointRelais[0]);
        } else if (values?.espaceSFRs) {
            setSelectedPointLivraison(values?.espaceSFRs[0]);
        } else {
            setSelectedPointLivraison(undefined);
        }
    }

    const changeModeLivraison = (newVal) => {
        setModeLivraison(newVal)
    }

    const renderDropPlacesType = () => {
        return (
            <React.Fragment>
                <section className={"dropPlacesType mt-1 mb-2"}>
                    <FormButtonGroupRadio id={"modeLivraison"}
                        name={"modeLivraison"}
                        className={"mb-0"}
                        value={modeLivraison}
                        onValueChange={changeModeLivraison}
                        validations={{ isRequired: ValidationUtils.notEmpty }}>
                        <Button color={["POINT_RELAIS", "ESPACE_SFR"].includes(modeLivraison) ? "primary" : "light"} id="pointRelais"
                            value="POINT_RELAIS" className={"text-nowrap"} size={"sm"} block>
                            {pointsLivraison?.espaceSFRs?.length == 0 ? 'Point relais (gratuit)' : 'Point relais / Espace SFR (gratuit)'}
                        </Button>
                        <Button color={modeLivraison === "COLIS_PRIVE" ? "primary" : "light"} id="colisPrive"
                            value="COLIS_PRIVE" className={"text-nowrap"} size={"sm"} block>
                            Colis privé (gratuit)
                        </Button>
                    </FormButtonGroupRadio>
                </section>
            </React.Fragment>
        )
    }

    const renderDropPlacesForm = () => {
        return (
            <div className="mb-0">
                <Label className={"font-weight-bold"}>Suggestion de point de livraison à proximité</Label>
                <SimpleAddressInput value={displayAdress}
                    name={"none"}
                    className={"formAdress"}
                    saveData={handleChangeAdress}
                    withoutComplement />
                <section
                    className={"dropPlace sResults mt-1 " + (pointsLivraison?.pointRelais || pointsLivraison?.espaceSFRs ? "found" : "")}>
                    {loading ? (
                        <div id="results" className="d-flex flex-column">
                            <Loading />
                        </div>
                    ) : (
                        renderDropPointsAndMap()
                    )}
                </section>
            </div>
        )
    }

    const renderPointsLivraison = () => {
        if (loading) {
            return <Loading />
        }

        return (
            <React.Fragment>
                {pointsLivraison?.pointRelais?.map((p, index) => renderPointLivraisonCard(p, index + 1, false))}
                {pointsLivraison?.espaceSFRs?.map((p, index) => renderPointLivraisonCard(p, ((pointsLivraison?.pointRelais?.length || 0) + index + 1), true))}
            </React.Fragment>
        );
    }

    const renderPointLivraisonCard = (p, index, isSfrPoint) => {
        return (
            // tslint:disable-next-line:jsx-no-lambda
            <Card className={"result-card mb-1 cursor-pointer " + (p === selectedPointLivraison ? "selected" : "")}
                onClick={() => selectPointLivraison(p, isSfrPoint)}>
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
                    <img className="img-responsive mr-2" width={40} src={sfrIcon} />
                    :
                    <i className={"icon-gradient icon-fast-delivery font-size-xl"} />
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

    const selectPointLivraison = (p, isSfrPoint) => {
        setModeLivraison(isSfrPoint ? "ESPACE_SFR" : "POINT_RELAIS");
        setSelectedPointLivraison(p);
    }

    const renderDropPointsAndMap = () => {
        return (
            (pointsLivraison?.pointRelais || pointsLivraison?.espaceSFRs) ? (
                <React.Fragment>
                    <div id="results" className="d-flex flex-column m-0">
                        {renderPointsLivraison()}
                    </div>
                    <div>
                        <Map id="arcgis_map_canvas"
                            mapProperties={{
                                basemap: "streets",
                                zoom: 14,
                                autoResize: true
                            }}>
                            <IconesPointsDepots pointsDepots={pointsLivraison} selected={selectedPointLivraison} />
                        </Map>
                    </div>
                </React.Fragment>
            ) : (
                <Label className={"font-weight-bold text-danger"}>
                    Aucun point de livraison disponible à proximité de cette adresse postale, merci de saisir une autre adresse
                </Label>
            )
        )
    }

    const renderClientAdress = () => {
        return `${displayAdress?.address1}, ${displayAdress?.zipcode} ${displayAdress?.city}`
    }

    const renderPointLivraisonAdress = () => {
        return `${selectedPointLivraison?.adr1} ${selectedPointLivraison?.adr2 ? selectedPointLivraison?.adr2 + " " : ""}${selectedPointLivraison?.adr3 ? selectedPointLivraison?.adr3 + " " : ""}${selectedPointLivraison?.adr4 ? selectedPointLivraison?.adr4 + " " : ""}${selectedPointLivraison?.codePostale} ${selectedPointLivraison?.ville}`
    }

    return (
        <React.Fragment>
            <Label className="font-weight-bold text-uppercase mb-0">Équipements à renvoyer</Label><br />
            <Label>{selectedEquipments.map(equipment => equipment.codificationRenvoi).join(', ')}</Label><br />
            <Label className="font-weight-bold text-uppercase mt-2">Lieu de livraison des équipements</Label>
            <CardBody className={"adg-renvoi-equipement p-0"}>
                {renderDropPlacesType()}
                {modeLivraison === "POINT_RELAIS" ?
                    renderDropPlacesForm() :
                    <Label className={"font-weight-bold"}>
                        Livraison au domicile du client: {renderClientAdress()}
                    </Label>
                }

                <div className={"form-hidden-values"}>
                    <FormHiddenInput name={"login"} value={currentUser.login} />
                    <FormHiddenInput name={"positionCode"} value={currentUser.position?.code} />
                    <FormHiddenInput name={"positionLabel"} value={currentUser.position?.label} />
                    <FormHiddenInput name={"accountId"} value={accountId} />
                    <FormHiddenInput name={"transport"} validations={{ isRequired: ValidationUtils.notEmpty }} value={modeLivraison === "COLIS_PRIVE" ? pointsLivraison?.colissimo?.codeTrans : modeLivraison === "POINT_RELAIS" ? pointsLivraison?.pointProximite?.codeRes : pointsLivraison?.reseauDistrib?.codeTrans} />
                    <FormHiddenInput name={"pointProximiteId"} validations={{ isRequired: modeLivraison === "COLIS_PRIVE" ? ValidationUtils.canBeEmpty : ValidationUtils.notEmpty }} value={modeLivraison === "COLIS_PRIVE" ? "" : modeLivraison === "POINT_RELAIS" ? selectedPointLivraison?.codePdp : selectedPointLivraison?.codePdv} />
                    <FormHiddenInput name={"pointProximiteLib"} validations={{ isRequired: ValidationUtils.notEmpty }} value={modeLivraison === "COLIS_PRIVE" ? pointsLivraison?.colissimo?.libRes : modeLivraison === "POINT_RELAIS" ? selectedPointLivraison?.libPdp : selectedPointLivraison?.libSFR} />
                    <FormHiddenInput name={"pointProximiteAdr"} validations={{ isRequired: ValidationUtils.notEmpty }} value={modeLivraison === "COLIS_PRIVE" ? renderClientAdress() : renderPointLivraisonAdress()} />
                    <FormHiddenInput name={"conditionExpedition"} validations={{ isRequired: ValidationUtils.notEmpty }} value={modeLivraison === "COLIS_PRIVE" ? pointsLivraison?.colissimo?.condExp : modeLivraison === "POINT_RELAIS" ? pointsLivraison?.pointProximite?.condExp : pointsLivraison?.reseauDistrib?.condExp} />
                    <FormHiddenInput name={"returnedEquipments"} value={selectedEquipments} />
                </div>
            </CardBody>
            <Button color="secondary" size="sm" onClick={() => setStep(1)}>Précédent</Button>
        </React.Fragment>
    )
}

const mapStateToProps = (state: AppState) => ({
    client: state.store.client.currentClient,
    authorizations: state.authorization.authorizations
});

export default connect(mapStateToProps)(RenvoiEquipement);