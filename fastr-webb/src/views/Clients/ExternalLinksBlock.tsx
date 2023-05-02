import {Button, ButtonDropdown, ButtonGroup, DropdownItem, DropdownMenu, DropdownToggle} from "reactstrap";
import React, {useEffect, useRef, useState} from "react";
import {translate} from "../../components/Intl/IntlGlobalProvider";
import {NotificationManager} from "react-notifications";
import ExternalApplicationPage, {IdParams} from "./ExternalApplicationPage";
import {ExternalAppsSettings} from "../../model/disrcExternalApps/ExternalAppsSettings";
import './ExternalLinksBlock.scss';
import {useTypedSelector} from "../../components/Store/useTypedSelector";
import {useParams} from "react-router";
import ActService from "../../service/ActService";
import {FormattedMessage} from "react-intl";
import {ClientContextSliceState} from "../../store/ClientContextSlice";
import { ApplicationMode } from "src/model/ApplicationMode";

interface Props {
    isLoading: any,
    settings?: Array<ExternalAppsSettings>
    idParams?: IdParams
    indsideFastrCase?: boolean
    isQualificationLeaf?: boolean
    textLink?: JSX.Element | string
    clientContext?: ClientContextSliceState,
    children?: any
}

const ExternalLinksBlock = (props: Props) => {
    const {isLoading, settings, idParams, indsideFastrCase, isQualificationLeaf, textLink, clientContext, children} = props;
    const externalApps  = useTypedSelector(state => state.externalApps);
    const sessionIsFrom = useTypedSelector((state) => state.store.applicationInitialState.sessionIsFrom)
    const {serviceId, clientId} = useParams();
    const idClient = clientContext && clientContext.clientData ? clientContext.clientData.id : clientId;
    const idService = clientContext && clientContext.service ? clientContext.service.id : serviceId;
    const refSiebel = clientContext?.service ? clientContext?.service?.siebelAccount : "";
    const [dropdownOpen, setOpen] = useState();

    const inputRef:  React.MutableRefObject<any[]> = useRef([]);
    let filteredApps : Array<ExternalAppsSettings> = [];
    const actService = new ActService(true);
    const [params, setParams] = useState();

    const getNextActSequence = async () => {
        if(idParams) {
            try {
                const actId = await actService.getNextActSequence();
                idParams.actId = actId
                setParams({...params, ...idParams})
            } catch (e) {
                const error = await e;
                console.error(error)
                NotificationManager.error(<FormattedMessage id="external.links.arbeo.actId.error"/>);
            }
        }
    }

    useEffect(() => {
        if(!indsideFastrCase) {
            const  ids = {
                clientId : idClient,
                serviceId : idService,
                refSiebel
            }
            setParams(ids)
            if (idParams) {
                setParams({...ids, ...idParams})
            }
        } else {
            getNextActSequence()
        }
    }, []);

    useEffect(() => {
        if(indsideFastrCase){
            setParams({...params, ...idParams})
        }
    }, [idParams]);

    if(externalApps && externalApps.appsList && settings && settings.length > 0) {
        // filter settings to match allowed appCode (and build form from that)
        filteredApps = settings?.filter(el => externalApps.appsList?.includes(el.appCode))
    }

    const openApplication = (filteredApp, id) => (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation()
        let externalApplicationPage: any = inputRef.current[id];
        try{
            if(externalApplicationPage){
                externalApplicationPage.open();
                if(indsideFastrCase) {
                    // Si le CC click plusieurs fois sur le bouton arbeo, lancer une nouvelle fois le service pour
                    // obtenir un actId different
                    getNextActSequence()
                }
            }
        }  catch (err) {
            NotificationManager.error(translate.formatMessage({id: "act.external.disrc.external.apps.open.error"}), null, 20000)
            console.error(err);
        }
    }

    const loadDropdownItem = () => {
        let elements : any[] = [];
        if(filteredApps){
            filteredApps.forEach((elem,i) => {
                elements.push(
                    <DropdownItem onClick={openApplication(elem, i)}>{elem.label}</DropdownItem>
                );
            });
        }
        return elements
    }

    const renderExternalApplicationPages = () => {
        let ExternalApplicationPages: any[] = [];
        if(filteredApps){
            filteredApps.forEach((elem,i) => {
                ExternalApplicationPages.push(
                    <ExternalApplicationPage ref={el => inputRef.current[i] = el} appCode={elem.appCode} appPage={elem.appPage} idParams={params}/>
                );
            })
        }
        return ExternalApplicationPages
    }

    const toggle = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation()
        setOpen(!dropdownOpen)
    }

    if (sessionIsFrom != ApplicationMode.DISRC && filteredApps && filteredApps.length > 0 && isLoading) {
        const dropdownItems = loadDropdownItem();
        const ExternalApplicationPages = renderExternalApplicationPages();
        const disabled = indsideFastrCase && !isQualificationLeaf;
        const indsideFastrCaseStyle = indsideFastrCase ? 'indsideFastrCase' : ''
        if (dropdownItems.length > 1) {
            dropdownItems.shift()
        }
        const SingleLink = textLink ? <span className="external_link" onClick={openApplication(filteredApps[0], 0)}>{textLink} </span> : (filteredApps[0].label.trim() ? <Button color={"dark"} className={indsideFastrCaseStyle} onClick={openApplication(filteredApps[0], 0)} disabled={disabled}>{filteredApps[0].label}</Button> : null);
        return (
            <React.Fragment>
                {children ?
                    React.cloneElement(children, { onClick: openApplication(filteredApps[0], 0) }) :
                    filteredApps.length > 1 ?
                        <ButtonGroup className={'customButtonGroup'}>
                            <Button color={"dark"} onClick={openApplication(filteredApps[0], 0)}>{filteredApps[0].label}</Button>
                            <ButtonDropdown isOpen={dropdownOpen} toggle={toggle} direction="down">
                                <DropdownToggle caret>
                                </DropdownToggle>
                                <DropdownMenu className={'customDropdownMenu'}>
                                    {dropdownItems}
                                </DropdownMenu>
                            </ButtonDropdown>
                        </ButtonGroup>
                        : SingleLink}
                {ExternalApplicationPages}
            </React.Fragment>
        )
    } else {
        return (children ? children : <React.Fragment />)
    }
}

export default ExternalLinksBlock