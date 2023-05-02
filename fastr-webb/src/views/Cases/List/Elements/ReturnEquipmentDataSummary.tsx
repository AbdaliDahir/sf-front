import * as React from "react";
import {RetourEquipementActDetail} from "../../../../model/service/RetourEquipementActDetail";
import Table from "reactstrap/lib/Table";
import {FormattedMessage} from "react-intl";

interface Props {
    adgFixeDetails: RetourEquipementActDetail
}


export class ReturnEquipmentDataSummary extends React.Component<Props>{
    constructor(props : Props) {
        super(props);
        this.state = {}
    }

    public renderEquipmentActDetailList = () => {
        const {equipmentActDetailList} = this.props.adgFixeDetails;
        return equipmentActDetailList?.map((eqptDetail, index) =>
            <React.Fragment>
                <tr key={index}>
                    <td>{eqptDetail?.name + " (" + eqptDetail?.type + ")"}</td>
                    <td>{eqptDetail?.serialNumber}</td>
                    <td>{eqptDetail?.status}</td>
                    <td>{this.amountFormatter(eqptDetail?.penaltyAmount)}</td>
                    <td>{this.amountFormatter(eqptDetail?.securityDeposit) }</td>
                    <td>{eqptDetail?.feesStatus}</td>
                </tr>
            </React.Fragment>
        )
    }

    /**
     * Example : For 60.0€ will return 60.00
     * @param amount
     */
    public amountFormatter(amount: string | undefined): string {
        if(amount === undefined) {
            return "0.00"
        }
        return (Math.round(+amount.replace('€', '') * 100) / 100).toFixed(2);
    }

    public render() {
        const {equipmentActDetailList} = this.props.adgFixeDetails;
        return (
            <div>
                {equipmentActDetailList &&
                <Table bordered responsive className="w-100 mt-1 table-hover table-sm">
                    <thead className={"thead-dark font-weight-light"}>
                    <tr>
                        <th data-sortable="true"><FormattedMessage
                            id="acts.history.adg.fixe.modal.act.eqpt.nameAndType"/>
                        </th>
                        <th data-sortable="true"><FormattedMessage
                            id="acts.history.adg.fixe.modal.act.eqpt.serial.number"/>
                        </th>
                        <th data-sortable="true"><FormattedMessage
                            id="acts.history.adg.fixe.modal.act.eqpt.status"/>
                        </th>
                        <th data-sortable="true"><FormattedMessage
                            id="acts.history.adg.fixe.modal.act.eqpt.penalties.amount"/>
                        </th>
                        <th data-sortable="true"><FormattedMessage
                            id="acts.history.adg.fixe.modal.act.eqpt.warranty.deposit"/>
                        </th>
                        <th data-sortable="true"><FormattedMessage
                            id="acts.history.adg.fixe.modal.act.eqpt.fees.status"/>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.renderEquipmentActDetailList()}
                    </tbody>
                </Table>
                }
            </div>
        )
    }
}