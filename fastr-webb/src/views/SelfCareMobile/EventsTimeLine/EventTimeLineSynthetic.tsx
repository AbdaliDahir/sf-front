import * as moment from "moment";
import * as React from "react";
import { GesteCommercialBios } from "../../../model/TimeLine/GesteCommercialBios";
import { FormattedMessage } from "react-intl";
import { Email, SMS } from "../../../model/TimeLine/SOCO";
import { RegulFixeAdg } from "../../../model/acts/regulFixe/RegulFixeAdg";
import './EventTimeLines.scss'
import { OfferEnriched } from "../../../model/TimeLine/OfferEnriched";
import { Action } from "../../../model/actions/Action";
import { translate } from "../../../components/Intl/IntlGlobalProvider";
import { ActiviteRegul } from "src/model/service";
interface Props {
    // tslint:disable-next-line:no-any
    obj: GesteCommercialBios & Email & SMS & RegulFixeAdg & OfferEnriched & Action & ActiviteRegul
    key: number
    loadingFunction?
}

interface State {
    hidden: boolean
    loadedData
}

export default class EventTimeLineSynthetic extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hidden: true,
            loadedData: undefined
        }
    }

    public popupDisplay = () => {
        this.setState(prevState => ({
            hidden: !prevState.hidden,
        }))
    }

    private getMontant = () => {
        const montant = this.state.loadedData?.actDetails.find((detail) => detail.parametertype === "MONTANT_AJUSTE" && detail.parametername === "MONTANT")
        const montantTTC = this.state.loadedData?.actDetails.find((detail) => detail.parametertype === "GLOBAL" && detail.parametername === "MONTANT_TTC")
        const montantRegul = this.state.loadedData?.actDetails.find((detail) => detail.parametertype === "REGUL_AUTO_MAJ" && detail.parametername === "MONTANT_REGUL")
        return montant?.parametervalue || montantTTC?.parametervalue || montantRegul?.parametervalue || "";
    }

    private getMontantAction = () => {
        const data = this.props.obj.processCurrentState?.data;
        if (data) {
            const foundData = data.find((actionData) => actionData.code === "MONTANT_TTC");
            return foundData?.value;
        }
        return "";
    }

    // private getMontantGcoGcu = () => {
    //     return "TODO"
    // }


    private getPeriode = () => {
        const debutPeriode = this.state.loadedData?.actDetails.find((detail) => detail.parametertype === "GLOBAL" && detail.parametername === "DEBUT_PERIODE")
        const finPeriode = this.state.loadedData?.actDetails.find((detail) => detail.parametertype === "GLOBAL" && detail.parametername === "FIN_PERIODE")
        const delaiST = this.state.loadedData?.actDetails.find((detail) => detail.parametertype === "REGUL_AUTO_MAJ" && detail.parametername === "DELAI_ST")
        if (debutPeriode?.parametervalue && finPeriode?.parametervalue) {
            return "du " + debutPeriode.parametervalue + " au " + finPeriode.parametervalue;
        }
        if (delaiST?.parametervalue) {
            return delaiST.parametervalue + ' J';
        } else {
            return '-';
        }
    }

    private getPeriodeAction = () => {
        const debutPeriode = this.props.obj.processCurrentState?.data.find((data) => data.code === "DEBUT_PERIODE")
        const finPeriode = this.props.obj.processCurrentState?.data.find((data) => data.code === "FIN_PERIODE")
        if (debutPeriode && finPeriode) {
            return "du " + moment(debutPeriode?.value).format("DD/MM/YYYY") + " au " + moment(finPeriode?.value).format("DD/MM/YYYY");
        }
        return "";
    }

    public render(): JSX.Element {
        if (this.props.obj) {
            if (this.props.obj.libelle) {
                return (
                    <React.Fragment>
                        <li className="timeline-element timeline-element-synthetic">
                            <span className="d-flex timeline-badge-success badge-success-size-synthetic">
                                <span
                                    className="justify-content-center align-self-center icon-white icon-gift icon-gift-synthetic"
                                    onMouseEnter={this.popupDisplay} onMouseLeave={this.popupDisplay}
                                />
                            </span>
                            <div
                                className="timeline-panel timeline-panel-synthetic text-center timeline-panel-synthetic-param">
                                <span
                                    className="font-italic labelsSynthetic"> {moment(this.props.obj.dateDebut).format("DD/MM/YYYY")}</span><br />
                                <span
                                    className="font-weight-bold font-size-5 labelsSynthetic">  {this.props.obj.famille}</span>
                            </div>
                            <div
                                className="timeline-panel timeline-panel-synthetic popover popupTimeline labelsSynthetic text-center timeline-panel-synt-popup"
                                hidden={this.state.hidden}>
                                <text className="popover-body ">
                                    <span className="font-weight-bold"><FormattedMessage
                                        id={"status.two.points"} /></span>{this.props.obj.statut}<br />
                                    {this.props.obj.libelle}
                                </text>
                            </div>
                        </li>
                    </React.Fragment>
                )
            } else if (this.props.obj.recipientEmail) {
                return (
                    <React.Fragment>
                        <li className="timeline-element timeline-element-synthetic">
                            <span className="d-flex timeline-badge-dark badge-success-size-synthetic">
                                <span
                                    className="justify-content-center align-self-center icon-white icon-email icon-email-synthetic"
                                    onMouseEnter={this.popupDisplay} onMouseLeave={this.popupDisplay}
                                />
                            </span>
                            <div
                                className="timeline-panel text-center timeline-panel-synthetic timeline-panel-synthetic-param">
                                <span
                                    className="font-italic labelsSynthetic"> {moment(this.props.obj.sendDate).format("DD/MM/YYYY")}</span><br />
                                <span className="font-weight-bold font-size-5 labelsSynthetic">Email</span>
                            </div>
                            <div
                                className="timeline-panel timeline-panel-synthetic popover popupTimeline labelsSynthetic text-center timeline-panel-synt-popup"
                                hidden={this.state.hidden}>
                                <text className="popover-body ">
                                    <span className="font-weight-bold"><FormattedMessage
                                        id={"subject.two.points"} /></span>{this.props.obj.subject}<br />
                                </text>
                            </div>
                        </li>
                    </React.Fragment>
                )
            } else if (this.props.obj.type === 'sms') {
                return (
                    <React.Fragment>
                        <li className="timeline-element timeline-element-synthetic">
                            <span className="d-flex timeline-badge-dark badge-success-size-synthetic">
                                <span
                                    className="justify-content-center align-self-center icon-white icon-phone icon-phone-synthetic"
                                    onMouseEnter={this.popupDisplay} onMouseLeave={this.popupDisplay}
                                />
                            </span>
                            <div
                                className="timeline-panel text-center timeline-panel-synthetic timeline-panel-synthetic-param">
                                <span
                                    className="font-italic labelsSynthetic"> {moment(this.props.obj.sendDate).format("DD/MM/YYYY")}</span><br />
                                <span className="font-weight-bold font-size-5 labelsSynthetic">SMS</span>
                            </div>
                            <div
                                className="timeline-panel timeline-panel-synthetic popover labelsSynthetic timeline-panel-synt-popup"
                                hidden={this.state.hidden}>
                                <text className="popover-body pl-0">
                                    <span className="font-weight-bold"><FormattedMessage
                                        id={"sms.commercial.offer"} /></span>: {this.props.obj.offreCom}<br />
                                </text>
                                <text className="popover-body pl-0">
                                    <span className="font-weight-bold"><FormattedMessage
                                        id={"sms.object"} /></span>: {this.props.obj.object?.length > 302 ? this.props.obj.object.substring(0, 300) + "..." : this.props.obj.object}<br />
                                </text>
                            </div>
                        </li>
                    </React.Fragment>
                )
            } else if (this.props.obj.actid && !this.props.obj.regulActiv) {
                
                const date = this.props.obj.actdate && this.props.obj.actdate.split(' ')[0] as any;
                const splitDate = date.replaceAll('/', '-').split('-').reverse().join('-');
                if (this.props.loadingFunction && !this.state.loadedData && !this.state.hidden) {

                    this.props.loadingFunction(this.props.obj.acttransactionid).then((result) => {
                        this.setState({
                            loadedData: result
                        })
                    });

                }
                return (
                    <React.Fragment>
                        <li className="timeline-element timeline-element-synthetic">
                            <span className="d-flex timeline-badge-dark badge-success-size-synthetic">
                                <span
                                    className="justify-content-center align-self-center icon-white icon-phone icon-phone-synthetic"
                                    onMouseEnter={this.popupDisplay} onMouseLeave={this.popupDisplay}
                                />
                            </span>
                            <div
                                className="timeline-panel text-center timeline-panel-synthetic timeline-panel-synthetic-param">
                                <span
                                    className="font-italic labelsSynthetic"> {moment(splitDate).format("DD/MM/YYYY")}</span><br />
                                <span className="font-weight-bold font-size-5 labelsSynthetic">REGUL</span>
                            </div>
                            <div
                                className="timeline-panel timeline-panel-synthetic popover labelsSynthetic text-center timeline-panel-synt-popup"
                                hidden={this.state.hidden}>
                                <text className="popover-body eventtimelines__regul-popover">
                                    <span className="font-weight-bold">
                                        <FormattedMessage id={"regul.two.points"} />
                                    </span>

                                    <span>
                                        <span className="font-weight-bold">Date création:</span>{this.props.obj.actdate}
                                    </span>
                                    <span>
                                        <span
                                            className="font-weight-bold">Libellé:</span>{this.state.loadedData?.header.adgName}
                                    </span>
                                    <span>
                                        <span className="font-weight-bold">Statut:</span>{this.props.obj.actresult}
                                    </span>
                                    <span>
                                        <span className="font-weight-bold">Montant:</span>{this.getMontant() + ' €'}
                                    </span>
                                    <span>
                                        <span className="font-weight-bold">Période:</span>{this.getPeriode()}
                                    </span>
                                </text>
                            </div>
                        </li>
                    </React.Fragment>
                )
            } else if (this.props.obj.actionId) {
                return <React.Fragment>
                    <li className="timeline-element timeline-element-synthetic" >
                        <span className="d-flex timeline-badge-dark badge-success-size-synthetic" >
                            <span
                                className="justify-content-center align-self-center icon-white icon-phone icon-phone-synthetic"
                                onMouseEnter={this.popupDisplay} onMouseLeave={this.popupDisplay}
                            />
                        </span>
                        <div
                            className="timeline-panel text-center timeline-panel-synthetic timeline-panel-synthetic-param">
                            <span
                                className="font-italic labelsSynthetic"> {moment(this.props.obj.creationDate).format("DD/MM/YYYY")}</span><br />
                            <span className="font-weight-bold faont-size-5 labelsSynthetic">REGUL</span>
                        </div>
                        <div
                            className="timeline-panel timeline-panel-synthetic popover labelsSynthetic text-center timeline-panel-synt-popup"
                            hidden={this.state.hidden}>
                            <text className="popover-body eventtimelines__regul-popover">
                                <span className="font-weight-bold">{this.props.obj.actionLabel?.toUpperCase()}</span>
                                <span>
                                    <span className="font-weight-bold">Date de création:</span>
                                    {moment(this.props.obj.creationDate).format("DD/MM/YYYY")}
                                </span>
                                <span>
                                    <span className="font-weight-bold">Statut:</span>
                                    {this.props.obj.processCurrentState?.status ? translate.formatMessage({ id: this.props.obj.processCurrentState.status }) : ""}
                                </span>
                                <span>
                                    <span className="font-weight-bold">Montant:</span>
                                    {this.getMontantAction() + ' €'}
                                </span>
                                <span>
                                    <span className="font-weight-bold">Période:</span>
                                    {this.getPeriodeAction()}
                                </span>
                            </text>
                        </div>
                    </li>
                </React.Fragment>
            } else if (this.props.obj.regulActiv) {
                const date = this.props.obj.actDate && this.props.obj.actDate.split(' ')[0] as any;
                const splitDate = date?.replaceAll('/', '-').split('-').join('-');
                return <React.Fragment>
                    <li className="timeline-element timeline-element-synthetic" >
                        <span className="d-flex timeline-badge-dark badge-success-size-synthetic" >
                            <span
                                className="justify-content-center align-self-center icon-white icon-phone icon-phone-synthetic"
                                onMouseEnter={this.popupDisplay} onMouseLeave={this.popupDisplay}
                            />
                        </span>
                        <div
                            className="timeline-panel text-center timeline-panel-synthetic timeline-panel-synthetic-param">
                            <span
                                className="font-italic labelsSynthetic">  {moment(splitDate).format("DD/MM/YYYY")}</span><br />
                            <span className="font-weight-bold faont-size-5 labelsSynthetic">REGUL</span>
                        </div>
                        <div
                            className="timeline-panel timeline-panel-synthetic popover labelsSynthetic text-center timeline-panel-synt-popup"
                            hidden={this.state.hidden}>
                            <text className="popover-body eventtimelines__regul-popover">
                                <span className="font-weight-bold">
                                    <FormattedMessage id={"regul.two.points"} />
                                </span>
                                <span>
                                    <span className="font-weight-bold">Libellé:</span>
                                    {this.props.obj.actName}
                                </span>
                                <span>
                                    <span className="font-weight-bold">Date de création:</span>
                                    {moment(splitDate).format("DD/MM/YYYY")}
                                </span>
                                <span>
                                    <span className="font-weight-bold">Statut:</span>
                                    {this.props.obj.actResult ?? ''}
                                </span>
                                { this.props.obj.actAmount ? 
                                    <span>
                                        <span className="font-weight-bold">Montant:</span>
                                        {`${this.props.obj.actAmount} €`}
                                    </span> : null
                                }
                            </text>
                        </div>
                    </li>
                </React.Fragment>
            } else {
                return (
                    <React.Fragment>
                        <li className="timeline-element timeline-element-synthetic">
                            <span className="d-flex timeline-badge-dark badge-success-size-synthetic">
                                <span
                                    className="justify-content-center align-self-center icon-white icon-gift icon-gift-synthetic"
                                    onMouseEnter={this.popupDisplay} onMouseLeave={this.popupDisplay}
                                />
                            </span>
                            <div
                                className="timeline-panel text-center timeline-panel-synthetic timeline-panel-synthetic-param">
                                <span
                                    className="font-italic labelsSynthetic"> {moment(this.props.obj.creationOfferServiceDate).format("DD/MM/YYYY")}</span><br />
                                <span
                                    className="font-weight-bold font-size-5 labelsSynthetic">{this.props.obj.offerFamily}</span>
                            </div>
                            <div
                                className="timeline-panel timeline-panel-synthetic popover labelsSynthetic text-center timeline-panel-synt-popup"
                                hidden={this.state.hidden}>
                                <text className="popover-body eventtimelines__regul-popover">
                                    <span className="font-weight-bold">
                                        <FormattedMessage id={"gcogcu.two.points"} />
                                    </span>

                                    <span>
                                        <span className="font-weight-bold">Libellé:</span>{this.props.obj.offerName}
                                    </span>
                                    <span>
                                        <span
                                            className="font-weight-bold">Statut:</span>{this.props.obj.commercialStatus}
                                    </span>
                                    <span>
                                        <span
                                            className="font-weight-bold">Date debut:</span>{moment(this.props.obj.activationOfferServiceDate).format("DD/MM/YYYY")}
                                    </span>
                                    <span>
                                        <span
                                            className="font-weight-bold">Date fin:</span>{this.props.obj.terminationDate && moment(this.props.obj.terminationDate).format("DD/MM/YYYY")}
                                    </span>
                                    {/* <span>
                                        <span
                                            className="font-weight-bold">Montant:</span>{this.getMontantGcoGcu() + ' €'}
                                    </span> */}
                                </text>
                            </div>
                        </li>
                    </React.Fragment>
                )
            }
        }
        return (<span />)
    }
}
