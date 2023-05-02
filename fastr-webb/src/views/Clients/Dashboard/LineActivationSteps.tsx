import React, {useEffect, useState} from "react"
import CardBody from "reactstrap/lib/CardBody";
import Card from "reactstrap/lib/Card";
import CardHeader from "reactstrap/lib/CardHeader";
import ClientService from "../../../service/ClientService";

const LineActivationSteps = () => {
    const listStyle = {paddingTop: 50, paddingBottom: 150}
    const normalLineStyle = {width: 150}
    const firstNormalLineStyle = {width: 50}
    const greyLineStyle = {width: 150, background: "#e3e3e6"}
    const firstGreyLineStyle = {width: 50, background: "#e3e3e6"}

    const [stepsForLineActivation, setStepsForLineActivation] = useState()

    const clientService = new ClientService()

    useEffect(() => {
        async function initialize(){
            const orders = await clientService.getLineActivationStatus("CBL20200129161206747")
            setStepsForLineActivation(orders.steps)
        }
        initialize();
    }, [])


    const renderTimeline = () => {
        if (stepsForLineActivation) {
            return stepsForLineActivation.map((step, index) => {
                if (step.finish) {
                    return (
                        <li className="timeline-element" style={index === 0 ? firstNormalLineStyle : normalLineStyle}>
                          <span className="d-flex timeline-badge-primary">
                            <span className="justify-content-center align-self-center icon-white icon-check"/>
                          </span>
                            <div style={index === 0 ? {
                                top: 25,
                                left: 7,
                                position: "absolute",
                                width: 125,
                                wordBreak: "break-word",
                                whiteSpace: "normal",
                                textAlign: "center"
                            } : {
                                top: 25,
                                left: 107,
                                position: "absolute",
                                width: 125,
                                wordBreak: "break-word",
                                whiteSpace: "normal",
                                textAlign: "center"
                            }}>
                                <h6>{step.label}</h6>
                                <h6>{step.date}</h6>
                            </div>
                        </li>
                    )
                } else if (!step.finish && step.active) {
                    return (
                        <li className="timeline-element" style={index === 0 ? firstNormalLineStyle : normalLineStyle}>
                          <span className="d-flex timeline-badge-primary">
                            <span className="justify-content-center align-self-center icon-white icon-check"/>
                          </span>
                            <div style={index === 0 ? {
                                top: 25,
                                left: 7,
                                position: "absolute",
                                width: 125,
                                wordBreak: "break-word",
                                whiteSpace: "normal",
                                textAlign: "center"
                            } : {
                                top: 25,
                                left: 107,
                                position: "absolute",
                                width: 125,
                                wordBreak: "break-word",
                                whiteSpace: "normal",
                                textAlign: "center"
                            }}>
                                <h6>{step.label}</h6>
                                <h6>{step.date}</h6>
                            </div>
                        </li>
                    )
                } else {
                    return (
                        <li className="timeline-element" style={index === 0 ? firstGreyLineStyle : greyLineStyle}>
                          <span className="d-flex timeline-badge-circle-secondary">
                            <span className="justify-content-center align-self-center"/>
                          </span>
                            <div style={index === 0 ? {
                                top: 25,
                                left: 7,
                                position: "absolute",
                                width: 125,
                                wordBreak: "break-word",
                                whiteSpace: "normal",
                                textAlign: "center"
                            } : {
                                top: 25,
                                left: 107,
                                position: "absolute",
                                width: 125,
                                wordBreak: "break-word",
                                whiteSpace: "normal",
                                textAlign: "center"
                            }}>
                                <h6>{step.label}</h6>
                                <h6>{step.date}</h6>
                            </div>
                        </li>
                    )
                }
            })
        } else {
            return <React.Fragment/>
        }
    }

    return (
        <div>
            {/*<Card>*/}
            {/*    <CardHeader>*/}
            {/*        <h3>Suivi d'activation de ligne</h3>*/}
            {/*        <h6>Migration DSL > FTTB - Activation RDV Raccordement depuis le 10/12/20</h6>*/}
            {/*    </CardHeader>*/}
            {/*    <CardBody>*/}
            {/*        <div className="timeline timeline-primary" style={{overflowY: "unset"}}>*/}
            {/*            <ol style={listStyle} className={"h-100"}>*/}
            {/*                <li className="timeline-element" style={normalLineStyle}>*/}
            {/*              <span className="d-flex timeline-badge-primary">*/}
            {/*                <span className="justify-content-center align-self-center icon-white icon-check"/>*/}
            {/*              </span>*/}
            {/*                    <div style={textStyle}>*/}
            {/*                        <h6>Commande Validée</h6>*/}
            {/*                        <h6>12/12/19</h6>*/}
            {/*                    </div>*/}
            {/*                </li>*/}
            {/*                <li className="timeline-element" style={normalLineStyle}>*/}
            {/*              <span className="d-flex timeline-badge-primary">*/}
            {/*                <span className="justify-content-center align-self-center icon-white icon-check"/>*/}
            {/*              </span>*/}
            {/*                    <div style={textStyle}>*/}
            {/*                        <h6>Provisioning terminé</h6>*/}
            {/*                        <h6>16/12/19</h6>*/}
            {/*                    </div>*/}
            {/*                </li>*/}
            {/*                <li className="timeline-element" style={normalLineStyle}>*/}
            {/*              <span className="d-flex timeline-badge-circle-primary">*/}
            {/*                <span className="justify-content-center align-self-center icon-gradient icon-warning"/>*/}
            {/*              </span>*/}
            {/*                    <div style={textStyle}>*/}
            {/*                        <h6>Installation</h6>*/}
            {/*                        <h6 style={{color: "red"}}>En echec</h6>*/}
            {/*                    </div>*/}
            {/*                </li>*/}
            {/*                <li className="timeline-element" style={normalLineStyle}>*/}
            {/*              <span className="d-flex timeline-badge-circle-primary">*/}
            {/*                <span className="justify-content-center align-self-center icon-gradient icon-close"/>*/}
            {/*              </span>*/}
            {/*                    <div style={textStyle}>*/}
            {/*                        <h6>Equipement à livrer par le technicien</h6>*/}
            {/*                        <h6 style={{color: "red"}}>En echec</h6>*/}
            {/*                    </div>*/}
            {/*                </li>*/}
            {/*                <li className="timeline-element" style={greyLineStyle}>*/}
            {/*              <span className="d-flex timeline-badge-circle-secondary">*/}
            {/*                <span className="justify-content-center align-self-center"/>*/}
            {/*              </span>*/}
            {/*                    <div style={textStyle}>*/}
            {/*                        <h6>Facturation</h6>*/}
            {/*                    </div>*/}
            {/*                </li>*/}
            {/*                <li className="timeline-element" style={greyLineStyle}>*/}
            {/*              <span className="d-flex timeline-badge-circle-secondary">*/}
            {/*                <span className="justify-content-center align-self-center"/>*/}
            {/*              </span>*/}
            {/*                    <div style={textStyle}>*/}
            {/*                        <h6>Portabilité</h6>*/}
            {/*                    </div>*/}
            {/*                </li>*/}
            {/*                <li className="timeline-element" style={greyLineStyle}>*/}
            {/*              <span className="d-flex timeline-badge-circle-secondary">*/}
            {/*                <span className="justify-content-center align-self-center"/>*/}
            {/*              </span>*/}
            {/*                    <div style={textStyle}>*/}
            {/*                        <h6>Résiliation DSL</h6>*/}
            {/*                    </div>*/}
            {/*                </li>*/}
            {/*                <li className="timeline-element" style={{width: 10}}/>*/}
            {/*            </ol>*/}
            {/*        </div>*/}
            {/*    </CardBody>*/}
            {/*</Card>*/}
            <Card>
                <CardHeader>
                    <h3>Suivi d'activation de ligne</h3>
                    <h6>Migration DSL > FTTB - Activation RDV Raccordement depuis le 10/12/20</h6>
                </CardHeader>
                {stepsForLineActivation &&
                <CardBody>
                    <div className="timeline timeline-primary" style={{overflowY: "unset"}}>
                        <ol style={listStyle} className={"h-100"}>
                            {renderTimeline()}
                            <li className="timeline-element" style={{width: 10}}/>
                        </ol>
                    </div>
                </CardBody>
                }
            </Card>
        </div>
    )
}

export default LineActivationSteps