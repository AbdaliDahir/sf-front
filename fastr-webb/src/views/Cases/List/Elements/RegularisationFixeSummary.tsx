import * as React from "react";
import {FormattedMessage} from "react-intl";
import {RegularisationFixeActDetail} from "../../../../model/service/RegularisatonFixeActDetail";
import Col from "reactstrap/lib/Col";
import {Row} from "reactstrap";
import "./RegularisationFixeSummary.scss"
import LocaleUtils from "../../../../utils/LocaleUtils";

interface Props {
    adgFixeDetails: RegularisationFixeActDetail
}

interface State {
    formattedData: any
}

export class RegularisationFixeSummary extends React.Component<Props, State> {
    constructor(props : Props) {
        super(props);
        this.state = {
            formattedData: {}
        }
    }

    public componentDidMount() {
        this.formatRegulActDetailsData()
    }

    public formatRegulActDetailsData = () => {
        const {actDetails} = this.props.adgFixeDetails;

        const regulModesParams = {
            label: "MODE_REGUL",
            amount: "MONTANT_TTC"
        }

        const unpaidDetailsParams = {
            num_facture: "NUM_FACTURE" ,
            date_facture:"DATE_FACTURE" ,
            balance_facture : "BALANCE_FACTURE" ,
            montant_ajuste : "MONTANT_AJUSTE" ,
            statut_facture : "STATUT" ,
        }

        const formattedData = {
            requestAmount : this.getValueByName(actDetails, "MONTANT_TTC"),
            category : this.getValueByName(actDetails, "CATEGORIE"),
            motif : this.getValueByName(actDetails, "MOTIF"),
            itemsLabel : this.getValueByTypeStartingAndName(actDetails, "ITEM_", "LIBELLE"),
            itemsAmount : this.getValueByTypeStartingAndName(actDetails, "ITEM_", "MONTANT_TTC"),
            debutPeriod : this.getValueByName(actDetails, "DEBUT_PERIODE"),
            finPeriod : this.getValueByName(actDetails, "FIN_PERIODE"),
            calculMode : this.getValueByName(actDetails, "MODE_CALCUL"),
            regulModes: this.sortRegulModesByLabel(this.formatArrays(actDetails, "REGUL_", regulModesParams)),
            unpaidDetails: this.formatArrays(actDetails, "TRACE_AJUSTEMENT_", unpaidDetailsParams)
        }

        this.setState({formattedData: formattedData})
    }

    public getValueByName = (arr, value) => {
        const result  = arr.filter(obj => obj.parametername === value);
        return result ? result[0]?.parametervalue : null;
    }

    public getValueByTypeAndName = (arr, type, name) => {
        const result  = arr.filter(obj => obj.parametertype === type && obj.parametername === name);
        return result ? result[0]?.parametervalue : null;
    }

    public getValueByTypeStartingAndName = (arr, string, name) => {
        const result  = arr.filter(obj => obj.parametertype?.startsWith(string) && obj.parametername === name);
        return result ? result : null;
    }

    public sortRegulModesByLabel = (arr) => arr.sort((a, b) => a.label === "IMPAYE" || b.label === "IMPAYE" ? -1 : 1)

    public formatArrays = (arr, string, params) => {
        const itemStartingWithArr: any[] = []
        const result: any[] = []
        const temp: string[] = []
        let num = 1

        if(arr.length > 0) {
            arr.map(item => {
                if (item.parametertype?.startsWith(string)) {
                    itemStartingWithArr.push(item)
                }
            })

            if(itemStartingWithArr.length > 0) {
                itemStartingWithArr.forEach(startingWithItem => {
                    if(startingWithItem.parametertype?.startsWith(string + num) && !temp.includes((string + num))) {
                        temp.push((string + num))
                        const obj = {}
                        Object.entries(params).forEach(([key, value]) => {
                            Object.defineProperty(obj, key, {
                                value: this.getValueByTypeAndName(arr, (string + num), value),
                                writable: false
                            });
                        });
                        result.push(obj)
                        num++;
                    }
                })
            }
        }

        return result ? result : null;
    }

    public renderRegularisationActDetails = () => {
        const {actDetails} = this.props.adgFixeDetails;
        return actDetails?.map((actDetail, index) =>
            <React.Fragment>
                <tr key={index}>
                    <td>{actDetail?.parametertype}</td>
                    <td>{actDetail?.parametername}</td>
                    <td>{actDetail?.parametervalue}</td>
                </tr>
            </React.Fragment>
        )
    }

    public renderUnpaidTable = () =>  <Row className="border border-bottom-0 ml-0">
        <Col className="pl-0 ml-0">
            <Row className="mb-1 border-bottom ml-0">
                <Col md={3}>
                    <FormattedMessage id={"acts.history.adg.fixe.modal.act.num.facture"}/>
                </Col>
                <Col md={1} className={"pl-0 pr-0"}>
                    <FormattedMessage id={"acts.history.adg.fixe.modal.act.date.facture"}/>
                </Col>
                <Col md={2} className="d-flex justify-content-end pr-0">
                    <FormattedMessage id={"acts.history.adg.fixe.modal.act.balance.facture"}/>
                </Col>
                <Col md={3} className="d-flex justify-content-end montant">
                    <FormattedMessage id={"acts.history.adg.fixe.modal.act.montant.ajuste"}/>
                </Col>
                <Col md={3}>
                    <FormattedMessage id={"acts.history.adg.fixe.modal.act.statut.facture"}/>
                </Col>
            </Row>
            <Row className="ml-0">
                <Col>
                    {this.state.formattedData?.unpaidDetails && this.state.formattedData.unpaidDetails.map(unpaidDetail =>
                        <Row className={"border-bottom "}>
                            <Col md={3}>
                                {unpaidDetail.num_facture || ""}
                            </Col>
                            <Col md={1} className={"pl-0 pr-0"}>
                                {unpaidDetail.date_facture || ""}
                            </Col>
                            <Col md={2} className="d-flex justify-content-end pr-0">
                                {LocaleUtils.formatCurrency(unpaidDetail.balance_facture, true) || ""}
                            </Col>
                            <Col md={3} className="d-flex justify-content-end montant">
                                {LocaleUtils.formatCurrency(unpaidDetail.montant_ajuste, true) || ""}
                            </Col>
                            <Col md={3}>
                                {unpaidDetail.statut_facture || ""}
                            </Col>
                        </Row>
                    )}
                </Col>
            </Row>
        </Col>


    </Row>

    public render() {
        const {actDetails} = this.props.adgFixeDetails;
        return <div>
            {actDetails &&
                <div>
                    <Row className={"pb-3"}>
                        <Col md={6}>
                            <div className={"text-left font-weight-bold"}>
                                <FormattedMessage id={"acts.history.adg.fixe.modal.act.requestAmount"}/>
                            </div>
                            {LocaleUtils.formatCurrency(this.state.formattedData.requestAmount, true) || ""}
                        </Col>
                    </Row>

                    <div className="border-bottom mb-3"></div>

                    <Row className={"pb-3"}>
                        <Col md={3}>
                            <div className={"text-left font-weight-bold"}>
                                <FormattedMessage id={"acts.history.adg.fixe.modal.act.category"}/>
                            </div>
                            {this.state.formattedData.category || ""}
                        </Col>

                        <Col md={3}>
                            <div className={"text-left font-weight-bold"}>
                                <FormattedMessage id={"acts.history.adg.fixe.modal.act.motif"}/>
                            </div>
                            {this.state.formattedData.motif || ""}
                        </Col>

                        <Col md={3}>
                            <div className={"text-left font-weight-bold"}>
                                <FormattedMessage id={"acts.history.adg.fixe.modal.act.itemsLabel"}/>
                            </div>
                            {this.state.formattedData.itemsLabel?.map(item => <div>{item.parametervalue || ""}</div>)}
                        </Col>

                        <Col md={3}>
                            <div className={"text-left font-weight-bold"}>
                                <FormattedMessage id={"acts.history.adg.fixe.modal.act.amounts"}/>
                            </div>
                            {this.state.formattedData.itemsAmount?.map(item => <div>
                                    {LocaleUtils.formatCurrency(item.parametervalue, true) || ""}
                            </div>
                            )}
                        </Col>
                    </Row>

                    <Row className={"pb-3"}>
                        <Col md={3}>
                            <div className={"text-left font-weight-bold"}>
                                <FormattedMessage id={"acts.history.adg.fixe.modal.act.period"}/>
                            </div>
                            {"du " + (this.state.formattedData.debutPeriod || "") +
                            " au " + (this.state.formattedData.finPeriod || "")}
                        </Col>

                        <Col md={9}>
                            <div className={"text-left font-weight-bold"}>
                                <FormattedMessage id={"acts.history.adg.fixe.modal.act.calcul.mode"}/>
                            </div>
                            {this.state.formattedData.calculMode || ""}
                        </Col>
                    </Row>

                    <Row className={"mt-3 pb-1"}>
                        <Col md={3}>
                            <div className={"text-left font-weight-bold"}>
                                <FormattedMessage id={"acts.history.adg.fixe.modal.act.mode.regul"}/>
                            </div>
                        </Col>

                        <Col md={9}>
                            <div className={"text-left font-weight-bold"}>
                                <FormattedMessage id={"acts.history.adg.fixe.modal.act.amounts"}/>
                            </div>
                        </Col>
                    </Row>

                    {this.state.formattedData?.regulModes?.map(regulMode =><Row className={`pb-2 ${regulMode.label === "IMPAYE" ? "impaye" : ""}`}>
                        <Col>
                            <Row className={"pb-2"}>
                                <Col md={3}>
                                    {regulMode.label || ""}
                                </Col>

                                <Col md={9}>
                                    {LocaleUtils.formatCurrency(regulMode.amount, true) || ""}
                                    {regulMode.label === "REMBOURSEMENT" && <span className="ml-1"><FormattedMessage id={"acts.history.adg.fixe.modal.act.under.condition.label"}/></span>}
                                </Col>
                            </Row>
                            {regulMode.label === "IMPAYE" && this.renderUnpaidTable()}
                        </Col>
                    </Row>)}

                </div>
            }
        </div>
    }
}