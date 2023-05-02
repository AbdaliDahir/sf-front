import {Commande} from "../../../model/commande/Commande";
import * as React from "react";
import {Badge, Card, CardBody, Col, ListGroupItem, Row} from "reactstrap";
import {FormattedMessage} from "react-intl";
import {CommandeStatut} from "../../../model/enums/CommandeStatut";
import {format} from "date-fns";
import {useTypedSelector} from "../../../components/Store/useTypedSelector";

interface Props {
    command :Commande
}
const ResultCommand: React.FunctionComponent<Props> = (props) => {
    const perID = useTypedSelector((state) => state.store.applicationInitialState?.user?.perId)
    const baseUrl = process.env.REACT_APP_FASTR_WEB_URL;
    const DATE_FORMAT = 'ddMMyyyy';
    const renderIfPresent = (element?: string) =>{
        if (element !== undefined && element !== null && element !== "") {
            return (<span>{element}<br/></span>)
        } else {
            return null
        }
    }
    const openCommand =() => {
        const password = format(new Date(props.command.dateAnniversaireTitulaire), DATE_FORMAT)
        const url = `${baseUrl}orders?orderNumber=${props.command.orderNumber}&password=${password}&perID=u${perID}`
        window.open(url, '_blank', 'noreferrer')
    }
    const renderBadge = (status: CommandeStatut) => {
        let badgeColor;
        switch (status) {
            case "TERMINÉE":
                badgeColor = "success";
                break;
            case "EN COURS":
                badgeColor = "info";
                break;
            case "ANNULÉE":
                badgeColor = "warning";
                break;
            case "EN ERREUR":
                badgeColor = "danger";
                break;



        }

        return (
            badgeColor ?
                <Badge color={badgeColor} pill className={"w-50"}>
                    <FormattedMessage id={props.command.statut}/>
                </Badge>
                :
                ""
        );
    }
    return (
        <>
            <Col xs={6} md={6} sm={6} lg={6} xl={3} className="mt-4">
                <Card outline>
                    <CardBody>
                        <Row className={"h4"}>
                            <>
                                <Col xs={2} lg={1}>
                                    <span className={"icon icon-user"}/>
                                </Col>
                                <Col xs={10}>
                                    <strong>{props.command.prenomTitulaire} </strong>{props.command.nomTitulaire}
                                </Col>
                            </>
                        </Row>
                        <Row className={"p-1"}>
                            <Col xs={2} lg={1}>
                                <span className="icon icon-home"/>
                            </Col>
                            <Col>
                                {renderIfPresent(props.command.address)}
                                {renderIfPresent(props.command.addressCompletion)}
                                {props.command.zipcode + " "} {props.command.city}
                            </Col>
                        </Row>
                        <Row className={"p-1"}>
                            <Col xs={2} lg={1}>
                                <span className="icon icon-email"/>
                            </Col>
                            <Col>
                                {props.command.email}
                            </Col>
                        </Row>
                        <Row className={"p-1 ml-1"}>
                            <ListGroupItem className="p-0 d-flex">
                                <div
                                    className="w-100 d-flex card-columns justify-content-between cursor-pointer px-2 py-1 hover-bg-secondary align-items-center rounded"
                                    onClick={openCommand}>
                                    <strong>{props.command.orderNumber.substr(0,14)}</strong>
                                    {renderBadge(props.command.statut)}
                                </div>
                            </ListGroupItem>
                        </Row>

                    </CardBody>
                </Card>
            </Col>
        </>
    )
}
export default ResultCommand