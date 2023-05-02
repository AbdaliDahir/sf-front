import React, { useEffect, useState } from "react";
import { PopoverBody, PopoverHeader, UncontrolledPopover } from "reactstrap";
import { useTypedSelector } from "src/components/Store/useTypedSelector";
import { Recommandation } from "src/model/recommandations/Recommandation";
import RecommandationService from "src/service/RecommandationService";
import { renderEzyExternalLink } from "src/utils/RecommandationsUtils";
import "../../../../views/Clients/OfferAndUsage/Recommandations/Recommandations.css";
import group1 from "../../../../img/group_1.svg";
import group2 from "../../../../img/group_2.svg";
import group3 from "../../../../img/group_3.svg";
import { BlocksExternalAppsConfig } from "../../ExternalAppsConfig";
import agentCCIconRed from "../../../../img/agent_cc_2.svg";


interface Props {
    idCsu: string
} 
const recommandationService: RecommandationService = new RecommandationService();
const externalAppsSettings = BlocksExternalAppsConfig.recommandations.syntheticRecommandations;
const limit = 3;

const RecommandationsV2 = (props: Props) => {
    const { idCsu } = props;
    const [recommandations, setRecommandations] = useState<Recommandation[]>([]);
    const [activeIndex, setActiveIndex] = useState<number|null>(null);
    const columns = recommandations?.slice(0, limit).length > 3 ? "2 auto" : "";
    const userPassword = useTypedSelector((state) => state.store.applicationInitialState.userPassword);
    const idParams = {
        password: userPassword
    }; 

    useEffect(() => {
        const getReco = async (idCsu) =>  {
            const reco = await recommandationService.getRecommandations(idCsu);
            setRecommandations(reco);
        }

        if (idCsu) {
            getReco(idCsu);
        }
    }, [idCsu]);

    const renderHTML = (rawHTML: string)  => {
        return <div dangerouslySetInnerHTML={{__html: rawHTML}} />
    }
    const renderRecoPicro = (group) => {
        if (group === 0) {
            return group1;
        } else if (group === 1) {
            return group2;
        }

        return group3;
    }
    return <>
        {recommandations.length > 0 ?
                    <div>
                        
                        <div className="geste-commerciel d-flex">
                            <div className="icon d-flex justify-content-center align-items-center">
                                <img src={agentCCIconRed} />
                            </div>
                            <div className="gestes-en-cours d-flex flex-column justify-content-center p-1 pl-3">
                                <strong>Une recommandations commerciale</strong>
                            </div>
                        </div>
                        <div className="p-2">
                        <div className='recommandations' style={{ columns: columns, display: 'flex'}}>
                                {recommandations.slice(0, limit).map((reco, index) =>
                                    <React.Fragment>
                                        <UncontrolledPopover
                                            className="recommandation-popover-line"
                                            trigger="click"
                                            placement="top"
                                            hideArrow={false}
                                            target={`recommandations__line${index + 1}`}
                                            modifiers={{preventOverflow: {boundariesElement: 'window'}}}
                                            isOpen={activeIndex === index}>
                                            <PopoverHeader>
                                                <div className="recommandations__title justify-content-flex-initial">
                                                    <div className="d-flex align-items-center">
                                                        <div className={`recommandations__img-bloc smaller-img-bloc font-weight-light mr-2 ${index + 1 === 1 ? 'red' : ''}`}>
                                                            <div className="recommandations__img">
                                                                {index + 1}
                                                            </div>
                                                        </div>
                                                        {reco?.libelleOffre}
                                                    </div>
                                                </div>
                                            </PopoverHeader>
                                            <PopoverBody>
                                                {reco?.argumentaire ? renderHTML(reco.argumentaire) : ""}
                                            </PopoverBody>
                                        </UncontrolledPopover>

                                        <div className={`recommandations__line ${activeIndex === index ? 'active' : ''}`} id={`recommandations__line${index + 1}`} onClick={() => setActiveIndex(activeIndex === index ? null : index)}>
                                            <div className="recommandations__title">
                                                <div className={`recommandations__img-bloc smaller-img-bloc mr-2 rounded-5 ${index + 1 === 1 ? 'red' : ''}`}>
                                                    <div style={{color: '#fff'}}>
                                                        <img src={renderRecoPicro(index)}/>
                                                    </div>
                                                </div>
                                                <div>
                                                    {`${reco.libelleOffre?.slice(0, 4)} ${reco?.libelleOffre?.length && reco?.libelleOffre?.length  > 4 ? '...' : ''}`}
                                                </div>
                                            </div>
                                        </div>
                                    </React.Fragment>
                                )}
                            </div>
                            {renderEzyExternalLink(externalAppsSettings, recommandations, idParams)}
                        </div>
                    </div>
                
                    : <></>
                }
    </>
}

export default RecommandationsV2;