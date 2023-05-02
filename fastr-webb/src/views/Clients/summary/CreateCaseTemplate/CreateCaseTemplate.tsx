import Formsy from "formsy-react";
import React, { useState } from "react"; 
import { useDispatch } from "react-redux";
import { Nav, NavItem, NavLink, TabContent, TabPane, Button} from "reactstrap";
import { useTypedSelector } from "src/components/Store/useTypedSelector";
import { HistoRapideSetting } from "src/model/HistoRapideSetting";
import { TabCategory } from "src/model/utils/TabCategory";
import { setSelectedHistoRapide } from "src/store/actions/v2/case/CaseActions";
import { selectCaseV2 } from "src/store/actions/v2/case/RecentCasesActions";
import { ClientContextSliceState } from "src/store/ClientContextSlice";
import ValidationUtils from "src/utils/ValidationUtils";
import HistoRapideButtons from "src/views/v2/Cases/Components/HistoRapide/HistoRapideButtons";
import FormTextAreaInput from "src/components/Form/FormTextAreaInput";

import "./CreateCaseTemplate.scss";

enum  OngletCategory {
    NEW_CASE= "NEW_CASE",
    HISTORAPIDE= "HISTORAPIDE"
}
interface Props {
    clientContext?: ClientContextSliceState,
    toggleTab: (tab: TabCategory) => void 
}
const CreateCaseTemplate = (props: Props) => {
    const { clientContext, toggleTab } = props;
    const [activeTab, setActiveTab] = useState<OngletCategory>(OngletCategory.NEW_CASE);
    const [clientRequest, setClientRequest] = useState<string|null>(null);
    const [canCreateCase, setCanCreateCase] = useState<boolean>(false);
    const histoRapideSettings: HistoRapideSetting[] = useTypedSelector(
        (state) => state.store.applicationInitialState.histoRapideSettings
    );

    const dispatch = useDispatch();

    const toggle = (tabId: OngletCategory) : void => {
        setActiveTab(tabId);
    }

    const createCase = () => {
        if (clientContext?.clientData?.id && clientContext?.serviceId) {
            props.toggleTab(TabCategory.CASES);
            dispatch(selectCaseV2(`new|${clientRequest}`, clientContext?.clientData?.id, clientContext?.serviceId));
            setClientRequest('');
        }
    }

    const enableSubmitButton = () : void => {
        setCanCreateCase(true);
    }
    const disableSubmitButton = () : void => {
        setCanCreateCase(false);
    }
    const handleClick = async (codeClickEvent)=>{
        const histoRapideCode = codeClickEvent.currentTarget.value;
        const target = { currentTarget: { value: histoRapideCode }}
        dispatch(setSelectedHistoRapide(target));
        toggleTab(TabCategory.CASES);
    }
    return <div className="create-case-template container mb-3 p-0 h-100">
           <div className="navigation column-1">
                <Nav >
                        <NavItem key={'onglet1'} >
                            <NavLink className={`onglet ${activeTab === OngletCategory.NEW_CASE ? 'active' : ''} d-flex justify-content-center align-items-center`} 
                                     onClick={() => toggle(OngletCategory.NEW_CASE)}>
                                nouveau dossier
                            </NavLink>
                        </NavItem>
                        <NavItem key={'onglet2'} hidden={histoRapideSettings.length === 0}>
                            <NavLink className={`onglet ${activeTab === OngletCategory.HISTORAPIDE ? 'active' : ''} d-flex justify-content-center align-items-center`}
                                    onClick={() => toggle(OngletCategory.HISTORAPIDE)}>
                                Histo rapide
                            </NavLink>
                        </NavItem>
                </Nav>
           </div>
           <div className="form-case column-2 pt-4 pl-3 pr-3 overflow-auto scrollbarStyle">
           <TabContent activeTab={activeTab} className="">
                <TabPane tabId={OngletCategory.NEW_CASE} 
                         className="">
                            <Formsy onValidSubmit={createCase} 
                            onValid={enableSubmitButton}
                            onInvalid={disableSubmitButton}>
                                <div className="text-uppercase font-weight-bold "> Demande client </div>
                                <div className="form-container d-flex justify-content-around">
                                    <div className="textArea w-80">
                                        <FormTextAreaInput  name={'client.request'} id="summary.quick.case.create" 
                                                        bsSize={"sm"}
                                                        validations={{
                                                            isRequired: ValidationUtils.notEmpty,
                                                            minLength: 20
                                                        }}
                                                        value={clientRequest}
                                                        onChange={(event) => setClientRequest(event.target.value)} />   
                                    </div>
                                    <div className="new-case-btn w-20 ">
                                        <Button className={`${canCreateCase ? 'create-btn' : 'create-btn-disable'} text-capitalize`} size={"sm"} id="simple" color={"primary"}  
                                                onClick={() => { canCreateCase ? createCase() : null}} >
                                            Nouveau dossier
                                        </Button> 
                                    </div>
                                </div>
                                                
                            </Formsy>
                </TabPane>
                <TabPane tabId={OngletCategory.HISTORAPIDE} 
                         className="" hidden={histoRapideSettings.length === 0}>
                    <div >
                        <HistoRapideButtons histoRapideSettings={histoRapideSettings} handleClick={handleClick}/>
                    </div>
                </TabPane>
            </TabContent>
           </div>
        </div>
}

export default CreateCaseTemplate;