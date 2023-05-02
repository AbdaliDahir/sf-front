import React, {useEffect, useState} from "react";
import {Button, Col, Container, Label, Modal, Row} from "reactstrap";
import {FormattedMessage} from "react-intl";
import FormTextInput from "../../../components/Form/FormTextInput";
import Forms from "formsy-react";
import {CommandeSearchForm} from "../../../model/commande/CommandeSearchForm";
import {useDispatch, useSelector} from "react-redux";
import {AppState} from "../../../store";
import {
    fetchCommandeByICCID,
    fetchCommandeByMsisdnOrNdi,
    fetchCommandeByOrderID, fetchCommandeByTitulaire, initSearchResult,
    saveCommandeSearchForm, setLoading
} from "../../../store/actions/CommandeSearchAction";
import {initialCommandeSearchForm} from "../../../store/reducers/CommandeReducer";
import ValidationUtils from "../../../utils/ValidationUtils";
import Loading from "../../../components/Loading";
import {formatPhoneNumber, regexMSISDN, regexNDI} from "../../../utils/PhoneNumberUtils";
import ResultCommand from "./ResultCommand";
import {Commande} from "../../../model/commande/Commande";
const SearchCommands = () => {
    const dispatch = useDispatch();
    const nLignePrefix = '893310'
    const loading  = useSelector((state: AppState) => state.commandes.loading)
    const initialSearchForm = useSelector((state: AppState) => state.commandes.form)
    const [searchForm, setSearchForm] = useState<CommandeSearchForm>(initialSearchForm)
    const [byTitulairePersonne, setByTitulairePersonne] = useState<boolean>(false)
    const [byTitulaireSiren, setByTitulaireSiren] = useState<boolean>(false)
    const [byTitulaireEmail, setByTitulaireEmail] = useState<boolean>(false)
    const [byNLigne, setByNLigne] = useState<boolean>(false)
    const [byCSim, setByCSim] = useState<boolean>(false)
    const [byNCommand, setByNCommand] = useState<boolean>(false)
    const [disableMobileSearch, setDisableMobileSearch]= useState<boolean>(false)
    const [disablePersonSearch, setDisablePersonSearch]= useState<boolean>(false)
    const [zipCodeValidator, setZipCodeValidator]= useState({})
    const commandes: Commande[]| undefined = useSelector((state: AppState) => state.commandes.commandes)

    const searchingByTitulairePersonne = (value: string) => {
        setByTitulairePersonne(true)
        if (value === '') {
            setByTitulairePersonne(false)
        }
    }
    useEffect(() => {
        if(byTitulairePersonne||byTitulaireSiren || byTitulaireEmail ){
            setDisableMobileSearch(true)
        }else {
            setDisableMobileSearch(false)
        }

    },[byTitulairePersonne,byTitulaireSiren,byTitulaireEmail])
    useEffect(() => {
        if(byCSim||byNLigne || byNCommand ){
            setDisablePersonSearch(true)
        }else {
            setDisablePersonSearch(false)
        }

    },[byCSim, byNLigne,byNCommand])

    const saveData = (e) => {
        const name = e.currentTarget.name;
        const value:string = e.currentTarget.value;
        switch (name){
            case 'lastname':
                setSearchForm({...searchForm,lastName:value})
                searchingByTitulairePersonne(value);
                break;
            case 'firstname':
                setSearchForm({...searchForm,firstName:value})
                searchingByTitulairePersonne(value);
                break;
            case 'siren':
                setSearchForm({...searchForm,siren:value})
                setByTitulaireSiren(true)
                if (value === '') {
                    setByTitulaireSiren(false)
                }
                break;
            case 'zipcode':
                setSearchForm({...searchForm,zipcode:value})
                searchingByTitulairePersonne(value);
                setZipCodeValidator({ isZipcode:ValidationUtils.isZipcode})
                if (value === '') {
                    setZipCodeValidator({})
                }
                break;
            case 'email':
                setSearchForm({...searchForm,email:value})
                setByTitulaireEmail(true)
                if (value === '') {
                    setByTitulaireEmail(false)
                }
                break;
            case 'nLigne':
                setSearchForm({...searchForm,nLigne:formatPhoneNumber(value)})
                setByNLigne(true)
                if (value === '') {
                    setByNLigne(false)
                }
                break;
            case 'cSim':
                setSearchForm({...searchForm,cSim:value})
                setByCSim(true)
                if (value === nLignePrefix || value === '') {
                    setByCSim(false)
                }
                break;
            case 'nCommand':
                setSearchForm({...searchForm,nCommand:value})
                setByNCommand(true)
                if (value === '') {
                    setByNCommand(false)
                }
                break;
            default:
                break;

        }
    }
    const onSearch = () => {
        dispatch(setLoading(true))
        dispatch(saveCommandeSearchForm(searchForm))
        if(searchForm.nLigne !== ""){
            const matchMSISDN = regexMSISDN.exec(searchForm.nLigne);
            if(matchMSISDN){
                dispatch(fetchCommandeByMsisdnOrNdi({msisdn:searchForm.nLigne}))
            }
            const matchNDI = regexNDI.exec(searchForm.nLigne);
            if(matchNDI){
                dispatch(fetchCommandeByMsisdnOrNdi({ndi:searchForm.nLigne}))
            }
        }
        if(searchForm.nCommand !== ""){
            dispatch(fetchCommandeByOrderID(searchForm.nCommand))
        }
        if(searchForm.cSim !== "" && searchForm.cSim !== nLignePrefix){
            dispatch(fetchCommandeByICCID(searchForm.cSim))
        }
        if(searchForm.email !== "" ){
            dispatch(fetchCommandeByTitulaire({email:searchForm.email}))
        }
         if(searchForm.siren !== "" ){
            dispatch(fetchCommandeByTitulaire({siren:searchForm.siren}))
         }
         if(searchForm.firstName !== ""&& searchForm.lastName!==""){
             if(searchForm.zipcode !== ""){
                 dispatch(fetchCommandeByTitulaire({lastName:searchForm.lastName,firstName: searchForm.firstName, zipCode:searchForm.zipcode}))
             } else {
                 dispatch(fetchCommandeByTitulaire({lastName:searchForm.lastName,firstName: searchForm.firstName}))
             }

         }


    }
    const onInitForm =() => {
        setSearchForm(initialCommandeSearchForm)
        dispatch(saveCommandeSearchForm(initialCommandeSearchForm))
        dispatch(initSearchResult())
        setByTitulairePersonne(false)
        setByTitulaireSiren(false)
        setByTitulaireEmail(false)
        setByNLigne(false)
        setByCSim(false)
        setByNCommand(false)
    }

    const renderResult = () => {
        if(commandes) {
            if(commandes.length === 0) {
                return (
                    <Col xs={12} className="mt-4 text-danger">
                        Aucun résultat
                    </Col>
                )
            }
            return (commandes!.map((e, i) => <ResultCommand key={"card_client_" + e.orderNumber + "_" + i} command={e}/>))
        }
        else {
            return (<></>)
        }
    }
    return (
        <Container className={"searchClientContainer mb-5"}>
            <Modal isOpen={loading} centered={true}>
                <Loading/>
            </Modal>
            <div className={"pt-3 pl-5"}>
                <Forms className={"media flex-inline"}>
                    <Col md={4}>
                        <Row>
                        <Label for="lastname" className={"SearchCommands-label"}>
                            <FormattedMessage id="search.command.lastName"/>
                        </Label>
                        <FormTextInput name="lastname" id="lastname" onChange={saveData}
                                       bsSize={"sm"}
                                       disabled={byTitulaireSiren || byTitulaireEmail || disablePersonSearch}
                                       value={searchForm.lastName}/>
                        </Row>
                        <Row>
                        <Label for="firstname" className={"SearchCommands-label"}>
                            <FormattedMessage id="search.command.firstName"/>
                        </Label>
                        <FormTextInput name="firstname" id="firstname" onChange={saveData}
                                       bsSize={"sm"}
                                       disabled={byTitulaireSiren || byTitulaireEmail || disablePersonSearch}
                                       value={searchForm.firstName}/>
                        </Row>
                        <Row>
                        <Label for="siren" className={"SearchCommands-label"}>
                            <FormattedMessage id="search.command.siren"/>
                        </Label>
                        <FormTextInput name="siren" id="siren"
                                       value={searchForm.siren} onChange={saveData}
                                       disabled={byTitulairePersonne || byTitulaireEmail || disablePersonSearch}
                                       bsSize={"sm"}/>
                        </Row>
                        <Row>
                            <Label for="zipcode" className={"SearchCommands-label"}>
                                <FormattedMessage id="search.command.zipcode"/>
                            </Label>
                            <FormTextInput name="zipcode" id="zipcode"
                                           value={searchForm.zipcode} onChange={saveData}
                                           validations={zipCodeValidator}
                                           disabled={byTitulaireSiren || byTitulaireEmail || disablePersonSearch}
                                           bsSize={"sm"}/>
                        </Row>

                        <Row>
                            <Label for="email" className={"SearchCommands-label"}>
                                <FormattedMessage id="search.command.email"/>
                            </Label>
                            <FormTextInput name="email" id="email"
                                           value={searchForm.email} onChange={saveData}
                                           disabled={byTitulairePersonne || byTitulaireSiren || disablePersonSearch}
                                           validations={searchForm.email!== "" ? {isValidMail: ValidationUtils.isValidMail}:{}}
                                           bsSize={"sm"}/>
                        </Row>
                    </Col>
                    <Col md={4}>
                        <Row>
                            <Label for="nLigne" className={"SearchCommands-label"}>
                                <FormattedMessage id="search.command.NLigne"/>
                            </Label>
                            <FormTextInput name="nLigne" id="nLigne" onChange={saveData}
                                           bsSize={"sm"}
                                           disabled={disableMobileSearch || byNCommand || byCSim}
                                           validations={searchForm.nLigne!== "" ? {isValidPhoneNumber: ValidationUtils.isValidPhoneNumber}:{}}
                                           value={searchForm.nLigne}/>
                        </Row>
                        <Row>
                            <Label for="cSim" className={"SearchCommands-label"}>
                                <FormattedMessage id="search.command.CSim"/>
                            </Label>
                            <FormTextInput name="cSim" id="cSim" onChange={saveData}
                                           bsSize={"sm"}
                                           disabled={disableMobileSearch || byNCommand || byNLigne}
                                           value={searchForm.cSim}/>
                        </Row>
                        <Row>
                            <Label for="nCommand" className={"SearchCommands-label"}>
                                <FormattedMessage id="search.command.NCommand"/>
                            </Label>
                            <FormTextInput name="nCommand" id="nCommand"
                                           value={searchForm.nCommand} onChange={saveData}
                                           disabled={disableMobileSearch || byCSim || byNLigne}
                                           bsSize={"sm"}/>
                        </Row>
                        <Row className={"ml-5"}>
                            <Button id="advancedSearchClients.onsearchpro.button.id" className="mt-3"
                                    color="secondary" size="sm"
                                    disabled={!(disableMobileSearch || disablePersonSearch)}
                                    onClick={onSearch}>
                                     <FormattedMessage id="search.command.button.search"/>
                            </Button>
                            <Button id="advancedSearchClients.onsearchpro.button.id" className="mt-3 ml-3"
                                    color="secondary" size="sm"
                                    disabled={!(!disableMobileSearch || !disablePersonSearch)}
                                    onClick={onInitForm}>
                                    <FormattedMessage id="search.command.button.init"/>
                            </Button>
                        </Row>
                    </Col>
                </Forms>
            </div>
            <Row className="mt-3">
                {renderResult()}
            </Row>
        </Container>
    )
}
export default SearchCommands